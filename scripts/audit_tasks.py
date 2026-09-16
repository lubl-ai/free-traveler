#!/usr/bin/env python3
"""
audit_tasks.py — Traveler Task Pipeline 최종 감사 스크립트

대상 구조(이번 파이프라인의 정본):
  TASKS/00_TASK_LIST.md   — Task List(58개 구현 Task 표) + NON_IMPLEMENTATION(EXCLUDED) 표
  TASKS/TASK-<ID>.md      — Task별 상세 파일(Task List의 구현 ID와 1:1)

입력(정본):
  - TASKS/00_TASK_LIST.md
  - TASKS/TASK-*.md
  - docs/PROJECT_SCOPE.md
  - design-reference/SCREEN_ROUTE_CONTRACT.json

검사 1~18을 모두 실행하고, 결과를 다음 두 파일로 출력한다(읽기 전용 스크립트지만 출력물은 생성/갱신함).
  - TASKS/TASK_MANIFEST.csv
  - TASKS/TASK_AUDIT_REPORT.md

Task List/상세 파일/입력 문서 자체는 수정하지 않는다. 표준 라이브러리만 사용한다.

종료 코드:
  0  전 검사 통과 (AUDIT_PASS 출력)
  1  하나 이상 실패
"""

from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TASKS_DIR = ROOT / "TASKS"
TASK_LIST_PATH = TASKS_DIR / "00_TASK_LIST.md"
PROJECT_SCOPE_PATH = ROOT / "docs" / "PROJECT_SCOPE.md"
SCREEN_ROUTE_CONTRACT_PATH = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
MANIFEST_PATH = TASKS_DIR / "TASK_MANIFEST.csv"
REPORT_PATH = TASKS_DIR / "TASK_AUDIT_REPORT.md"

TASK_LIST_COLS = [
    "Seq", "Task ID", "제목", "Category", "Implementation Status", "Requirement Ref",
    "Screen", "Route", "Page Entry", "Depends On", "Expected Files",
    "Functional AC", "Visual AC", "Security/Privacy AC", "Verify", "Priority",
]

EXPECTED_SCREEN_IDS = [f"SCR-{i:03d}" for i in range(1, 6)]
REQ_FUNC_EXPECTED = [f"REQ-FUNC-{i:03d}" for i in range(1, 81)]
REQ_NF_EXPECTED = [f"REQ-NF-{i:03d}" for i in range(1, 35)]

ALLOWED_DB_TABLES = {
    "USER_PROFILE", "MATE_POST", "MATE_APPLICATION", "USER_BLOCK", "REPORT", "APP_SETTING",
}
FORBIDDEN_DB_TABLES = {
    "DESTINATION", "DESTINATION_CONTENT", "COUNTRY_SAFETY", "COUNTRY", "REGION",
    "REPRESENTATIVE_PROFILE", "MEDIA_ASSET", "AUDIT_LOG",
}
FORBIDDEN_PHRASES = ["EC2", "AWS", "자동 머지", "auto-merge", "머지 러너", "Merge Runner"]
NEGATION_MARKERS = ["제외", "않는다", "않음", "아니다", "미사용", "금지", "구성하지", "두지 않"]
FORBIDDEN_TEST_BROWSERS = ["firefox", "webkit", "safari", "Firefox", "WebKit", "Safari"]
FORBIDDEN_TEST_SCOPE = ["부하 테스트", "load test", "성능 테스트", "Lighthouse"]

checks: list[tuple[str, str, bool, str]] = []  # (id, description, ok, detail)


def record(check_id: str, desc: str, ok: bool, detail: str = "") -> None:
    checks.append((check_id, desc, ok, detail))


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.exists() else ""


def parse_task_list_rows(text: str) -> list[dict]:
    rows = []
    for ln in text.splitlines():
        if not re.match(r"^\|\s*\d+\s*\|", ln):
            continue
        cells = [c.strip() for c in ln.strip().strip("|").split("|")]
        if len(cells) != len(TASK_LIST_COLS):
            continue
        rows.append(dict(zip(TASK_LIST_COLS, cells)))
    return rows


def parse_non_implementation_rows(text: str) -> list[dict]:
    idx = text.find("## NON_IMPLEMENTATION")
    if idx == -1:
        return []
    section = text[idx:]
    rows = []
    for ln in section.splitlines():
        m = re.match(r"^\|\s*(REQ-(?:FUNC|NF)-\d{3})\s*\|(.*)\|(.*)\|\s*$", ln)
        if m:
            rows.append({"Requirement": m.group(1), "근거": m.group(2).strip(), "후속 방향": m.group(3).strip()})
    return rows


def split_ref_ids(ref: str) -> set[str]:
    ids = set()
    for m in re.finditer(r"REQ-(FUNC|NF)-((?:\d{3}(?:~\d{3})?,?)+)", ref):
        prefix, body = m.group(1), m.group(2)
        for chunk in body.split(","):
            chunk = chunk.strip(",")
            if not chunk:
                continue
            if "~" in chunk:
                a, b = chunk.split("~")
                for n in range(int(a), int(b) + 1):
                    ids.add(f"REQ-{prefix}-{n:03d}")
            else:
                ids.add(f"REQ-{prefix}-{int(chunk):03d}")
    return ids


def split_depends(dep: str) -> list[str]:
    if not dep or dep.strip() in {"—", "-", "없음", ""}:
        return []
    return [d.strip() for d in dep.split(",") if d.strip() and d.strip() not in {"—", "-"}]


def normalize_path_cell(cell: str) -> str:
    m = re.search(r"`([^`]+)`", cell)
    return m.group(1) if m else cell.strip()


def main() -> int:
    task_list_text = read_text(TASK_LIST_PATH)
    if not task_list_text:
        print("=" * 70)
        print("Traveler Task Pipeline — 최종 감사 결과")
        print("=" * 70)
        print(f"[FAIL] TASKS/00_TASK_LIST.md 가 없습니다: {TASK_LIST_PATH}")
        print("AUDIT_FAIL")
        return 1

    rows = parse_task_list_rows(task_list_text)
    noni_rows = parse_non_implementation_rows(task_list_text)

    task_ids = [r["Task ID"] for r in rows]
    by_id = {r["Task ID"]: r for r in rows}

    detail_files = sorted(TASKS_DIR.glob("TASK-*.md"))
    detail_ids = {p.stem[len("TASK-"):] for p in detail_files}
    detail_bodies = {p.stem[len("TASK-"):]: p.read_text(encoding="utf-8") for p in detail_files}

    # --- 1. Task List 구현 ID와 상세 Task 파일 1:1 ---
    missing_details = sorted(set(task_ids) - detail_ids)
    orphan_details = sorted(detail_ids - set(task_ids))
    record(
        "1", "Task List 구현 ID ↔ TASK-<ID>.md 1:1",
        not missing_details and not orphan_details,
        f"상세 파일 누락: {missing_details or '없음'} / 고아 상세 파일: {orphan_details or '없음'}",
    )

    # --- 2. 중복 Task ID 0 ---
    dupes = sorted({t for t in task_ids if task_ids.count(t) > 1})
    record("2", "중복 Task ID 0건", len(dupes) == 0, f"중복: {dupes or '없음'}")

    id_set = set(task_ids)

    # --- 3. Depends On 누락 0(존재하지 않는 ID 참조) ---
    unresolved_deps = []
    for r in rows:
        for d in split_depends(r["Depends On"]):
            if d not in id_set:
                unresolved_deps.append(f"{r['Task ID']} -> {d}")
    record("3", "Depends On 참조 누락 0건", len(unresolved_deps) == 0, f"미해결 참조: {unresolved_deps or '없음'}")

    # --- 4. Dependency Cycle 0 ---
    graph = {r["Task ID"]: split_depends(r["Depends On"]) for r in rows}
    visiting, visited = set(), set()
    cycle_found = []

    def dfs(node, path):
        if node in visiting:
            cycle_found.append(" -> ".join(path + [node]))
            return
        if node in visited or node not in graph:
            return
        visiting.add(node)
        for dep in graph.get(node, []):
            dfs(dep, path + [node])
        visiting.discard(node)
        visited.add(node)

    for tid in task_ids:
        if tid not in visited:
            dfs(tid, [])
    record("4", "Dependency Cycle 0건", len(cycle_found) == 0, f"발견된 사이클: {cycle_found or '없음'}")

    # --- 5. Screen 5개 모두 Page Owner 정확히 1개 ---
    page_rows = [r for r in rows if r["Category"] == "PAGE"]
    page_by_screen: dict[str, list[str]] = {}
    for r in page_rows:
        page_by_screen.setdefault(r["Screen"], []).append(r["Task ID"])
    screen_owner_issues = []
    for sid in EXPECTED_SCREEN_IDS:
        owners = page_by_screen.get(sid, [])
        if len(owners) != 1:
            screen_owner_issues.append(f"{sid}: {len(owners)}개({owners})")
    record("5", "SCR-001~005 각각 Page Owner 정확히 1개", len(screen_owner_issues) == 0,
           f"위반: {screen_owner_issues or '없음'}")

    # --- SCREEN_ROUTE_CONTRACT.json 로드(6/7에서 사용) ---
    try:
        contract = json.loads(read_text(SCREEN_ROUTE_CONTRACT_PATH) or "{}")
    except json.JSONDecodeError as e:
        contract = {}
        record("6", "SCREEN_ROUTE_CONTRACT.json 파싱", False, f"파싱 실패: {e}")
    contract_screens = {s["screen_id"]: s for s in contract.get("screens", [])} if contract else {}

    # --- 6. Route·Page Entry·Expected Files 일치 ---
    mismatches = []
    for r in page_rows:
        sid = r["Screen"]
        ref = contract_screens.get(sid)
        if not ref:
            mismatches.append(f"{r['Task ID']}: SCREEN_ROUTE_CONTRACT.json에 {sid} 없음")
            continue
        row_route = normalize_path_cell(r["Route"])
        row_entry = normalize_path_cell(r["Page Entry"])
        if row_route != ref.get("route"):
            mismatches.append(f"{r['Task ID']}: Route 불일치 (Task List={row_route}, 정본={ref.get('route')})")
        if row_entry != ref.get("page_entry"):
            mismatches.append(f"{r['Task ID']}: Page Entry 불일치 (Task List={row_entry}, 정본={ref.get('page_entry')})")
        expected_files = r["Expected Files"]
        if row_entry not in expected_files:
            mismatches.append(f"{r['Task ID']}: Expected Files에 Page Entry({row_entry}) 미포함")
    record("6", "Page Owner Route·Page Entry·Expected Files 정본 일치", len(mismatches) == 0,
           f"불일치: {mismatches or '없음'}")

    # --- 7. Component-only Screen 0 ---
    component_screens = {r["Screen"] for r in rows if r["Category"] == "COMPONENT" and r["Screen"] not in ("—", "")}
    orphan_component_screens = sorted(component_screens - set(page_by_screen.keys()))
    record("7", "Page Owner 없이 Component만 있는 Screen 0건", len(orphan_component_screens) == 0,
           f"위반: {orphan_component_screens or '없음'}")

    # --- 8/9/10: Page Owner 상세 AC 키워드 확인 ---
    scr001_body = detail_bodies.get("PAGE-SCR001", "")
    scr001_ok = bool(re.search(r"(스타터|Starter)", scr001_body, re.IGNORECASE))
    record("8", "SCR-001 Owner에 Starter Template 제거 AC 존재", scr001_ok,
           "" if scr001_ok else "TASK-PAGE-SCR001.md에서 '스타터/Starter' 문구를 찾지 못함")

    scr003_body = detail_bodies.get("PAGE-SCR003", "")
    scr003_ok = all(kw in scr003_body for kw in ["항공", "숙소", "동행"])
    record("9", "SCR-003 Owner에 항공·숙소·동행 3탭 조립 AC 존재", scr003_ok,
           "" if scr003_ok else "TASK-PAGE-SCR003.md에서 항공/숙소/동행 키워드 중 일부 누락")

    scr005_body = detail_bodies.get("PAGE-SCR005", "")
    scr005_ok = bool(
        re.search(r"(Guest|게스트)", scr005_body)
        and re.search(r"(Member|회원)", scr005_body)
        and re.search(r"(Admin|관리자)", scr005_body)
    )
    record("10", "SCR-005 Owner에 Guest·Member·Admin 역할별 조립 AC 존재", scr005_ok,
           "" if scr005_ok else "TASK-PAGE-SCR005.md에서 Guest/Member/Admin 키워드 중 일부 누락")

    # --- 11. DB Schema·RLS·Access·Seed Task 존재 ---
    required_db_tasks = ["DB-SCHEMA-BASE", "DB-RLS-BASE", "DB-ACCESS", "DB-SEED-BASE"]
    missing_db_tasks = [t for t in required_db_tasks if t not in id_set]
    record("11", "DB-SCHEMA-BASE·DB-RLS-BASE·DB-ACCESS·DB-SEED-BASE Task 존재",
           len(missing_db_tasks) == 0, f"누락: {missing_db_tasks or '없음'}")

    # --- 12. DB Table 범위가 6개 기본 테이블을 크게 넘지 않음 ---
    all_detail_text = "\n".join(detail_bodies.values())

    def token_present(name: str, text: str) -> bool:
        # 하이픈으로 연결된 Task ID(예: DATA-DESTINATIONS, CMP-SCR002-COUNTRY-CHIPS)나
        # 영문 복수형(Countries) 등에 우연히 포함되는 것을 배제하고, 독립된 식별자로 등장할 때만 매치.
        pattern = rf"(?<![A-Za-z0-9_-]){re.escape(name)}(?![A-Za-z0-9_-])"
        return re.search(pattern, text) is not None

    used_allowed = {t for t in ALLOWED_DB_TABLES if token_present(t, all_detail_text)}
    used_forbidden = {t for t in FORBIDDEN_DB_TABLES if token_present(t, all_detail_text)}
    db_table_ok = len(used_forbidden) == 0 and len(used_allowed) <= 6
    record("12", "DB 테이블 사용이 6개 기본 테이블을 넘지 않음",
           db_table_ok,
           f"허용 테이블 사용 {len(used_allowed)}개({sorted(used_allowed)}), 금지 테이블 발견: {sorted(used_forbidden) or '없음'}")

    # --- 13. 외부 입력 비저장 AC 존재(항공·숙소) ---
    flight_body = detail_bodies.get("CMP-SCR003-FLIGHT", "")
    hotel_body = detail_bodies.get("CMP-SCR003-HOTEL", "")
    no_transmit_pattern = re.compile(r"(서버|DB|외부\s*URL).{0,20}(전달|전송|저장|포함).{0,10}(않|없음|금지)")
    flight_ok = bool(no_transmit_pattern.search(flight_body)) or "클라이언트 상태 전용" in flight_body
    hotel_ok = bool(no_transmit_pattern.search(hotel_body)) or "클라이언트 상태 전용" in hotel_body
    record("13", "항공·숙소 입력값 서버 비저장 AC 존재(CMP-SCR003-FLIGHT/HOTEL)",
           flight_ok and hotel_ok,
           f"FLIGHT={'OK' if flight_ok else 'MISSING'}, HOTEL={'OK' if hotel_ok else 'MISSING'}")

    # --- 14. Auth·성인 확인·기본 RLS AC 존재 ---
    auth_body = detail_bodies.get("API-AUTH-ADULT-VERIFY", "") + detail_bodies.get("CMP-SCR005-PROFILE", "")
    adult_ok = bool(re.search(r"(성인\s*확인|adult_verified_at|is_adult)", auth_body))
    rls_body = detail_bodies.get("DB-RLS-BASE", "")
    rls_ok = bool(re.search(r"RLS", rls_body)) and "DB-RLS-BASE" in id_set
    record("14", "Auth·성인 확인·기본 RLS AC 존재", adult_ok and rls_ok,
           f"성인확인 AC={'OK' if adult_ok else 'MISSING'}, RLS Task/AC={'OK' if rls_ok else 'MISSING'}")

    # --- 15. Playwright Chromium Smoke Task 존재 ---
    e2e_rows = [r for r in rows if r["Category"] == "E2E"]
    e2e_bodies = {r["Task ID"]: detail_bodies.get(r["Task ID"], "") for r in e2e_rows}
    chromium_tasks = [tid for tid, body in e2e_bodies.items() if "Chromium" in body or "chromium" in body]
    bad_browser_tasks = []
    bad_scope_tasks = []
    for tid, body in e2e_bodies.items():
        for line in body.splitlines():
            if any(b in line for b in FORBIDDEN_TEST_BROWSERS) and not any(m in line for m in NEGATION_MARKERS):
                bad_browser_tasks.append(tid)
                break
        for line in body.splitlines():
            if any(s in line for s in FORBIDDEN_TEST_SCOPE) and not any(m in line for m in NEGATION_MARKERS):
                bad_scope_tasks.append(tid)
                break
    record(
        "15", "Playwright Chromium Smoke Task 존재(타 브라우저/성능 범위 없음)",
        len(e2e_rows) > 0 and len(chromium_tasks) == len(e2e_rows) and not bad_browser_tasks and not bad_scope_tasks,
        f"E2E Task {len(e2e_rows)}개 중 Chromium 명시 {len(chromium_tasks)}개, "
        f"타 브라우저 언급: {bad_browser_tasks or '없음'}, 성능/부하 범위 확장: {bad_scope_tasks or '없음'}",
    )

    # --- 16. AWS·EC2·자동 Merge 구현 Task 0 ---
    active_violations = []
    for tid, body in detail_bodies.items():
        for line in body.splitlines():
            for kw in FORBIDDEN_PHRASES:
                if kw in line and not any(m in line for m in NEGATION_MARKERS):
                    active_violations.append(f"{tid}: {line.strip()[:100]}")
    record("16", "AWS·EC2·자동 Merge를 실제 구현 대상으로 삼는 Task 0건", len(active_violations) == 0,
           f"위반: {active_violations or '없음'}")

    # --- 17. REQ-FUNC 80개·REQ-NF 34개가 Task 또는 EXCLUDED 표에 존재 ---
    task_covered_ids = set()
    for r in rows:
        task_covered_ids |= split_ref_ids(r["Requirement Ref"])
    noni_ids = {row["Requirement"] for row in noni_rows}
    all_expected = set(REQ_FUNC_EXPECTED) | set(REQ_NF_EXPECTED)
    covered = task_covered_ids | noni_ids
    missing_req = sorted(all_expected - covered, key=lambda x: (x.split("-")[1], int(x.split("-")[2])))
    overlap_req = sorted(task_covered_ids & noni_ids)
    record(
        "17", "REQ-FUNC 80개·REQ-NF 34개가 Task 또는 EXCLUDED 표에 전부 존재",
        len(missing_req) == 0 and len(overlap_req) == 0,
        f"누락: {missing_req or '없음'} / Task와 EXCLUDED 모두에 등장(모순): {overlap_req or '없음'} "
        f"(Task 연결 {len(task_covered_ids)}건 + EXCLUDED {len(noni_ids)}건)",
    )

    # --- 18. EXCLUDED 상세 구현 파일이 생성되지 않음 ---
    excluded_with_detail_file = sorted(noni_ids & detail_ids)
    excluded_referenced_in_details = []
    for tid, body in detail_bodies.items():
        refs_in_body = set(re.findall(r"REQ-(?:FUNC|NF)-\d{3}", body))
        hit = refs_in_body & noni_ids
        if hit:
            excluded_referenced_in_details.append(f"{tid}: {sorted(hit)}")
    record(
        "18", "EXCLUDED Requirement에 대한 상세 구현 파일 미생성",
        len(excluded_with_detail_file) == 0,
        f"EXCLUDED인데 상세 파일 존재: {excluded_with_detail_file or '없음'} "
        f"(참고: 본문에 EXCLUDED ID를 인용만 한 Task 존재 여부 별도 기재 {excluded_referenced_in_details or '없음'})",
    )

    # --- Requirement 근거 문서 교차 확인(PROJECT_SCOPE.md와 EXCLUDED 목록 정합) ---
    scope_text = read_text(PROJECT_SCOPE_PATH)
    scope_excluded_ids = set()
    for ln in scope_text.splitlines():
        m = re.match(r"^\|\s*(REQ-(?:FUNC|NF)-\d{3})", ln)
        if m and "EXCLUDED" in ln:
            scope_excluded_ids.add(m.group(1))
    scope_mismatch = sorted(noni_ids.symmetric_difference(scope_excluded_ids))
    # 참고용 부가 정보(별도 검사 번호 없이 리포트에만 기록)

    # ---------------- 출력물 생성 ----------------
    write_manifest(rows, detail_ids)
    write_report(checks, rows, noni_rows, scope_mismatch)

    fail_count = sum(1 for _, _, ok, _ in checks if not ok)
    total = len(checks)

    print("=" * 70)
    print("Traveler Task Pipeline — 최종 감사 결과")
    print("=" * 70)
    for cid, desc, ok, detail in checks:
        prefix = "PASS" if ok else "FAIL"
        print(f"[{prefix}][{cid}] {desc}" + (f" — {detail}" if detail and not ok else ""))
    print("-" * 70)
    print(f"검사 {total}건 중 {total - fail_count}건 통과, {fail_count}건 실패")
    print(f"산출물: {MANIFEST_PATH.relative_to(ROOT)}, {REPORT_PATH.relative_to(ROOT)}")
    print("=" * 70)

    if fail_count > 0:
        print("AUDIT_FAIL")
        return 1

    print("AUDIT_PASS")
    print(f"검사 통과 수: {total}/{total}")
    return 0


def write_manifest(rows: list[dict], detail_ids: set[str]) -> None:
    TASKS_DIR.mkdir(parents=True, exist_ok=True)
    with MANIFEST_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "Seq", "TaskID", "Category", "ImplementationStatus", "Screen", "Route",
            "PageEntry", "DependsOn", "RequirementRef", "Priority", "DetailFileExists",
        ])
        for r in rows:
            writer.writerow([
                r["Seq"], r["Task ID"], r["Category"], r["Implementation Status"],
                r["Screen"], r["Route"], r["Page Entry"], r["Depends On"],
                r["Requirement Ref"], r["Priority"],
                "Y" if r["Task ID"] in detail_ids else "N",
            ])


def write_report(checks_, rows, noni_rows, scope_mismatch) -> None:
    total = len(checks_)
    fail_count = sum(1 for _, _, ok, _ in checks_ if not ok)
    lines = []
    lines.append("# Traveler Task Pipeline — Final Audit Report")
    lines.append("")
    lines.append(f"- **대상:** `TASKS/00_TASK_LIST.md`, `TASKS/TASK-*.md`({len(rows)}개)")
    lines.append(f"- **검사 항목:** 18개")
    lines.append(f"- **결과:** {total - fail_count}/{total} 통과")
    lines.append(f"- **최종 판정:** {'`AUDIT_PASS`' if fail_count == 0 else '`AUDIT_FAIL`'}")
    lines.append("")
    lines.append("## 검사 결과")
    lines.append("")
    lines.append("| # | 검사 항목 | 결과 | 상세 |")
    lines.append("|---|---|---|---|")
    for cid, desc, ok, detail in checks_:
        status = "PASS" if ok else "**FAIL**"
        detail_cell = (detail or "").replace("|", "\\|")
        lines.append(f"| {cid} | {desc} | {status} | {detail_cell} |")
    lines.append("")
    lines.append("## Requirement Coverage")
    lines.append("")
    lines.append(f"- Task List 구현 Task: {len(rows)}건")
    lines.append(f"- NON_IMPLEMENTATION(EXCLUDED): {len(noni_rows)}건")
    if scope_mismatch:
        lines.append(f"- ⚠️ `docs/PROJECT_SCOPE.md`의 EXCLUDED 목록과 `TASKS/00_TASK_LIST.md`의 NON_IMPLEMENTATION 목록이 다음 ID에서 불일치: {scope_mismatch}")
    else:
        lines.append("- `docs/PROJECT_SCOPE.md`의 EXCLUDED 목록과 `TASKS/00_TASK_LIST.md`의 NON_IMPLEMENTATION 목록 일치")
    lines.append("")
    REPORT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    sys.exit(main())
