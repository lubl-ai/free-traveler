#!/usr/bin/env python3
"""
check_screen_contract.py — Traveler 5개 Screen 계약 검사

`design-reference/SCREEN_ROUTE_CONTRACT.json`(Screen·Route·Page Entry 정본),
`TASKS/TASK_MANIFEST.csv`(Page Owner Task 정본), 그리고(필요한 모드에서만)
실제 `src/app` 파일 트리를 대조해 5개 Screen 계약이 지켜지는지 검사한다.
읽기 전용이며 어떤 파일도 수정하지 않는다. 표준 라이브러리만 사용한다.

## 실행 모드

  --mode=plan     (기본값) Page Owner Task와 Route 계획만 검사한다.
                  아직 구현되지 않은 화면이 있어도 실패하지 않는다
                  (Wave 초반, `src/app`에 실제 Page가 없는 단계에서 사용).
  --mode=ci       계획 검사 + 실제로 `src/app`에 구현된 Page 파일과
                  공개 경로(고정 5개 Route)를 검사한다.
  --mode=release  ci 검사 + `docs/preview-checks/SCR-001.md`~`SCR-005.md`
                  (사람이 남긴 Preview Checkpoint 확인 기록)의 존재 여부를 더한다.

## 검사

  1. 고정 화면 5개가 정확히 존재한다(Contract 선언 + ci/release에서는 실제 Page 파일도).
  2. 각 화면 Page Owner Task가 정확히 하나다(Task Manifest 기준).
  3. 기술 경로(`/auth/callback`, `/api/**`, `not-found`)를 사용자 화면으로 세지 않는다.
  4. 여행지 상세·안전정보를 별도 Page(새 Route)로 만들지 않았는지 검사한다
     (SCR-001 안의 Drawer 상태로만 존재해야 함).
  5. SCR-003 Task가 여행 입력(항공·숙소)과 동행 작성 양쪽 요구를 모두 포함한다.
  6. (release 모드만) `docs/preview-checks/SCR-001.md`~`SCR-005.md`가 존재하고 비어있지 않다.

오류는 파일·화면 ID·수정 힌트를 포함해 출력하고, 하나라도 실패하면 exit code 1로 끝낸다.
성공하면 `SCREEN_CONTRACT_PASS`와 통과한 모드를 출력하고 exit 0으로 끝낸다.
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTRACT_PATH = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
MANIFEST_PATH = ROOT / "TASKS" / "TASK_MANIFEST.csv"
APP_DIR = ROOT / "src" / "app"
PREVIEW_CHECKS_DIR = ROOT / "docs" / "preview-checks"

FIXED_SCREENS = [
    ("SCR-001", "/"),
    ("SCR-002", "/about"),
    ("SCR-003", "/travel-tools"),
    ("SCR-004", "/mates"),
    ("SCR-005", "/account"),
]
FIXED_ROUTE_OF = {sid: route for sid, route in FIXED_SCREENS}
FIXED_SCREEN_IDS = [sid for sid, _ in FIXED_SCREENS]

# 사용자 화면으로 세지 않는 허용된 기술 경로.
TECHNICAL_EXACT_ROUTES = {"/auth/callback", "not-found"}
TECHNICAL_PREFIXES = ("/api/", "/api")

# SCR-001 Drawer로만 존재해야 하는 화제(별도 Page로 승격 금지).
FORBIDDEN_STANDALONE_SEGMENTS = ("destination", "safety")

errors: list[dict] = []
checks_run: set[int] = set()
checks_failed: set[int] = set()


def report(check_no: int, message: str, file: str | None = None, screen: str | None = None, hint: str | None = None) -> None:
    checks_run.add(check_no)
    checks_failed.add(check_no)
    errors.append(
        {
            "check": check_no,
            "message": message,
            "file": file or "—",
            "screen": screen or "—",
            "hint": hint or "—",
        }
    )


def mark_ran(check_no: int) -> None:
    checks_run.add(check_no)


def load_contract() -> dict:
    if not CONTRACT_PATH.exists():
        print(f"[FAIL] {CONTRACT_PATH.relative_to(ROOT)} 없음 — 검사를 진행할 수 없다.")
        sys.exit(1)
    try:
        return json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"[FAIL] {CONTRACT_PATH.relative_to(ROOT)} JSON 파싱 실패: {e}")
        sys.exit(1)


def load_manifest() -> list[dict]:
    if not MANIFEST_PATH.exists():
        print(f"[FAIL] {MANIFEST_PATH.relative_to(ROOT)} 없음 — 검사를 진행할 수 없다.")
        sys.exit(1)
    with MANIFEST_PATH.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def normalize_cell(v: str) -> str:
    return (v or "").strip().strip("`")


def page_entry_to_route(rel_path: str) -> str:
    """src/app 기준 상대 page.tsx 경로 -> URL Route 문자열."""
    parts = rel_path.split("/")[:-1]  # drop 'page.tsx'
    parts = [p for p in parts if not (p.startswith("(") and p.endswith(")"))]
    return "/" + "/".join(parts) if parts else "/"


def is_technical_route(route: str) -> bool:
    if route in TECHNICAL_EXACT_ROUTES:
        return True
    return any(route == p.rstrip("/") or route.startswith(p) for p in TECHNICAL_PREFIXES)


def main() -> int:
    parser = argparse.ArgumentParser(description="Traveler 5개 Screen 계약 검사")
    parser.add_argument("--mode", choices=["plan", "ci", "release"], default="plan")
    args = parser.parse_args()
    mode = args.mode

    contract = load_contract()
    manifest = load_manifest()

    contract_screens = {s["screen_id"]: s for s in contract.get("screens", [])}
    manifest_page_rows = [r for r in manifest if normalize_cell(r.get("Category")) == "PAGE"]

    # ----------------------------------------------------------------
    # 검사 1 — 고정 화면 5개가 정확히 존재한다
    # ----------------------------------------------------------------
    mark_ran(1)
    if len(contract_screens) != 5:
        report(
            1,
            f"Contract의 Screen 수가 5개가 아님(실제 {len(contract_screens)}개)",
            file=str(CONTRACT_PATH.relative_to(ROOT)),
            hint="SCREEN_ROUTE_CONTRACT.json의 screens 배열을 정확히 5개(SCR-001~005)로 맞춘다.",
        )
    for screen_id, expected_route in FIXED_SCREENS:
        s = contract_screens.get(screen_id)
        if s is None:
            report(
                1,
                f"Contract에 {screen_id}가 없음",
                file=str(CONTRACT_PATH.relative_to(ROOT)),
                screen=screen_id,
                hint=f"screens 배열에 {screen_id}(route={expected_route}) 항목을 추가한다.",
            )
            continue
        if s.get("route") != expected_route:
            report(
                1,
                f"{screen_id}의 Contract route가 고정값과 다름(실제 {s.get('route')!r})",
                file=str(CONTRACT_PATH.relative_to(ROOT)),
                screen=screen_id,
                hint=f"route를 {expected_route!r}로 고정한다(임의 변경 금지).",
            )

    if mode in ("ci", "release"):
        for screen_id, expected_route in FIXED_SCREENS:
            s = contract_screens.get(screen_id)
            if s is None:
                continue
            page_entry_rel = s.get("page_entry", "").removeprefix("src/app/")
            page_path = APP_DIR / page_entry_rel
            if not page_path.exists():
                report(
                    1,
                    f"{screen_id}의 구현된 Page 파일이 없음(ci/release 모드에서는 실제 파일이 있어야 함)",
                    file=s.get("page_entry", "—"),
                    screen=screen_id,
                    hint=f"{s.get('page_entry')}를 Page Owner Task(PAGE-{screen_id.replace('SCR-', 'SCR')})로 구현한다.",
                )

    # ----------------------------------------------------------------
    # 검사 2 — 각 화면 Page Owner Task가 정확히 하나다
    # ----------------------------------------------------------------
    mark_ran(2)
    owners_by_screen: dict[str, list[str]] = {sid: [] for sid in FIXED_SCREEN_IDS}
    for r in manifest_page_rows:
        screen = normalize_cell(r.get("Screen"))
        if screen in owners_by_screen:
            owners_by_screen[screen].append(r["TaskID"])
    for screen_id in FIXED_SCREEN_IDS:
        owners = owners_by_screen[screen_id]
        if len(owners) == 0:
            report(
                2,
                f"{screen_id}의 Page Owner Task가 없음",
                file=str(MANIFEST_PATH.relative_to(ROOT)),
                screen=screen_id,
                hint=f"Category=PAGE, Screen={screen_id}인 Page Owner Task를 TASKS/00_TASK_LIST.md에 추가한다.",
            )
        elif len(owners) > 1:
            report(
                2,
                f"{screen_id}의 Page Owner Task가 {len(owners)}개(정확히 1개여야 함): {owners}",
                file=str(MANIFEST_PATH.relative_to(ROOT)),
                screen=screen_id,
                hint="중복된 Page Owner Task를 하나로 통합하거나 잘못 배정된 Screen 값을 수정한다.",
            )

    # ----------------------------------------------------------------
    # 검사 3 — 기술 경로를 사용자 화면으로 세지 않는다
    # ----------------------------------------------------------------
    mark_ran(3)
    # 3-a) Manifest에 5개 고정 Route 외의 Route를 가진 PAGE Task가 섞여 있지 않은지.
    for r in manifest_page_rows:
        route = normalize_cell(r.get("Route"))
        screen = normalize_cell(r.get("Screen"))
        if screen in FIXED_SCREEN_IDS:
            continue  # 5개 고정 화면 소속 PAGE Task는 이미 검사 1/2에서 다룸
        if route and not is_technical_route(route) and route not in FIXED_ROUTE_OF.values():
            report(
                3,
                f"고정 5개 화면·허용된 기술 경로가 아닌 Route를 가진 PAGE Task 발견: {r['TaskID']} (route={route})",
                file=str(MANIFEST_PATH.relative_to(ROOT)),
                screen=screen or "—",
                hint="새 화면을 추가하려면 먼저 SCREEN_ROUTE_CONTRACT.json/SRS/PROJECT_SCOPE.md를 갱신해 화면 5개 고정 규칙 예외를 명시해야 한다(CLAUDE.md 규칙 5).",
            )

    if mode in ("ci", "release"):
        found_pages = sorted(p.relative_to(APP_DIR).as_posix() for p in APP_DIR.rglob("page.tsx"))
        extra_routes = []
        for rel in found_pages:
            route = page_entry_to_route(rel)
            if route in FIXED_ROUTE_OF.values():
                continue
            if is_technical_route(route):
                continue
            extra_routes.append((rel, route))
        for rel, route in extra_routes:
            # 검사 4에서 별도로 더 구체적인 메시지를 내므로, destination/safety 관련은 여기서 중복 보고하지 않는다.
            if any(seg in rel.lower() for seg in FORBIDDEN_STANDALONE_SEGMENTS):
                continue
            report(
                3,
                f"고정 5개 화면·허용된 기술 경로에 속하지 않는 Page 파일 발견: {rel} (route={route})",
                file=f"src/app/{rel}",
                hint="이 Page가 실제로 필요하면 화면 계약(SCREEN_ROUTE_CONTRACT.json/SRS)부터 갱신한다. 필요 없다면 파일을 제거하거나 기존 5개 화면 안의 Component/Drawer로 흡수한다.",
            )

    # ----------------------------------------------------------------
    # 검사 4 — 여행지 상세·안전정보를 새 Page로 만들지 않았는지
    # ----------------------------------------------------------------
    mark_ran(4)
    drawer_task_ids = ["CMP-SCR001-DESTINATION-DRAWER", "CMP-SCR001-SAFETY-DRAWER"]
    manifest_by_id = {r["TaskID"]: r for r in manifest}
    for tid in drawer_task_ids:
        r = manifest_by_id.get(tid)
        if r is None:
            continue  # Task 존재 자체는 audit_tasks.py 검사 #1 담당
        route = normalize_cell(r.get("Route"))
        if route and route not in ("", "—") and not route.startswith("— ("):
            report(
                4,
                f"{tid}가 독립 Route({route})를 가짐 — 여행지 상세/안전정보는 SCR-001 안의 Drawer 상태여야 한다",
                file=str(MANIFEST_PATH.relative_to(ROOT)),
                screen="SCR-001",
                hint=f"{tid}의 Route/Page Entry 열을 '— (PAGE-SCR001 소유)'로 되돌리고 별도 page.tsx를 만들지 않는다.",
            )

    if mode in ("ci", "release"):
        for p in APP_DIR.rglob("page.tsx"):
            rel = p.relative_to(APP_DIR).as_posix()
            if rel == "page.tsx":
                continue  # SCR-001 자기 자신
            if any(seg in rel.lower() for seg in FORBIDDEN_STANDALONE_SEGMENTS):
                report(
                    4,
                    f"여행지 상세/안전정보로 보이는 독립 Page 파일 발견: src/app/{rel}",
                    file=f"src/app/{rel}",
                    screen="SCR-001",
                    hint="이 내용은 새 Route가 아니라 SCR-001(`src/app/page.tsx`) 안의 Drawer 컴포넌트로 구현해야 한다(design-reference/D-001/DESIGN.md, SCREEN_ROUTE_CONTRACT.json SCR-001 section_order 참조).",
                )

    # ----------------------------------------------------------------
    # 검사 5 — SCR-003 Task가 여행 입력(항공·숙소)과 동행 작성 양쪽 요구를 포함
    # ----------------------------------------------------------------
    mark_ran(5)
    scr003_task_ids = [r["TaskID"] for r in manifest if normalize_cell(r.get("Screen")) == "SCR-003"]
    has_flight = any("FLIGHT" in tid for tid in scr003_task_ids)
    has_hotel = any("HOTEL" in tid for tid in scr003_task_ids)
    has_mate_write = any("MATE-WRITE" in tid for tid in scr003_task_ids)
    if not has_flight:
        report(
            5,
            "SCR-003에 항공편 입력(FLIGHT) Task가 없음",
            file=str(MANIFEST_PATH.relative_to(ROOT)),
            screen="SCR-003",
            hint="CMP-SCR003-FLIGHT 같은 항공편 조건 입력 Task를 추가한다.",
        )
    if not has_hotel:
        report(
            5,
            "SCR-003에 숙소 입력(HOTEL) Task가 없음",
            file=str(MANIFEST_PATH.relative_to(ROOT)),
            screen="SCR-003",
            hint="CMP-SCR003-HOTEL 같은 숙소 조건 입력 Task를 추가한다.",
        )
    if not has_mate_write:
        report(
            5,
            "SCR-003에 동행 작성(MATE-WRITE) Task가 없음",
            file=str(MANIFEST_PATH.relative_to(ROOT)),
            screen="SCR-003",
            hint="CMP-SCR003-MATE-WRITE 같은 동행 작성 Form Task를 추가한다.",
        )

    # ----------------------------------------------------------------
    # 검사 6 — (release 모드만) Preview Checkpoint 문서 확인
    # ----------------------------------------------------------------
    if mode == "release":
        mark_ran(6)
        for screen_id in FIXED_SCREEN_IDS:
            path = PREVIEW_CHECKS_DIR / f"{screen_id}.md"
            if not path.exists():
                report(
                    6,
                    f"{screen_id} Preview Checkpoint 확인 문서가 없음",
                    file=str(path.relative_to(ROOT)),
                    screen=screen_id,
                    hint=f"사람이 실제 Preview를 확인한 뒤 {path.relative_to(ROOT)}에 확인 기록을 남긴다(release-check.md 참조).",
                )
            elif not path.read_text(encoding="utf-8").strip():
                report(
                    6,
                    f"{screen_id} Preview Checkpoint 문서가 비어 있음",
                    file=str(path.relative_to(ROOT)),
                    screen=screen_id,
                    hint="빈 파일만으로는 확인 근거로 인정하지 않는다 — 실제 확인 내용을 기록한다.",
                )

    # ================= 결과 출력 =================
    print("=" * 70)
    print(f"Traveler Screen Contract 검사 결과 (--mode={mode})")
    print("=" * 70)
    check_titles = {
        1: "고정 화면 5개 존재(Contract" + ("/실제 Page 파일" if mode != "plan" else "") + ")",
        2: "각 화면 Page Owner Task 정확히 1개",
        3: "기술 경로를 사용자 화면으로 세지 않음",
        4: "여행지 상세·안전정보 독립 Page 금지(SCR-001 Drawer 유지)",
        5: "SCR-003에 여행 입력(항공·숙소)+동행 작성 Task 모두 존재",
    }
    if mode == "release":
        check_titles[6] = "release 모드: docs/preview-checks/SCR-001~005.md 확인"

    for no in sorted(check_titles):
        if no not in checks_run:
            continue
        status = "FAIL" if no in checks_failed else "PASS"
        print(f"[{status}][{no}] {check_titles[no]}")

    if errors:
        print("-" * 70)
        print(f"오류 {len(errors)}건:")
        for e in errors:
            print(f"  - [검사 {e['check']}] {e['message']}")
            print(f"      파일: {e['file']}")
            print(f"      화면 ID: {e['screen']}")
            print(f"      수정 힌트: {e['hint']}")

    print("-" * 70)
    if errors:
        print("SCREEN_CONTRACT_FAIL")
        print(f"검사 실패: {len(checks_failed)}건 / 실행된 검사: {len(checks_run)}건 / 오류 {len(errors)}건")
        return 1

    print("SCREEN_CONTRACT_PASS")
    print(f"검사 통과: {len(checks_run)}건 (--mode={mode})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
