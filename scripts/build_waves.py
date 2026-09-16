#!/usr/bin/env python3
"""
build_waves.py — Traveler Task Pipeline Wave 계획 생성기

`TASKS/TASK_MANIFEST.csv`(정본 Depends On 그래프)와 `TASKS/TASK-*.md`(Expected Files,
`## Depends On` 교차 확인용) `design-reference/SCREEN_ROUTE_CONTRACT.json`(Screen·Page Entry
정본)을 읽어 Task를 Wave로 배정한다. 읽기 전용 입력에서 아래 산출물만 새로 쓴다.

  - TASKS/TASK_DAG.md       — 의존성 그래프, 암묵적 의존성 보정 내역, Wave 배치 근거
  - TASKS/WAVE_PLAN.md      — Wave 정본(사람이 읽는 실행 계획, `/run-wave`가 참조)
  - TASKS/WAVE_STATE.json   — Wave 정본(기계가 읽는 상태 저장소)
  - TASKS/TASK_MANIFEST.csv — 기존 11개 열 + `wave_id` 열 추가

Task 상세 파일 위치: `TASKS/details/TASK-*.md`가 있으면 그것을 쓰고, 없으면(현재 실제 구조)
`TASKS/TASK-*.md`를 대신 읽는다.

## Wave 배정 규칙 요약

1. Depends On(명시 + 암묵적 보정)으로 그래프를 만들고 순환 의존성을 검사한다. 순환이 있으면
   산출물을 쓰지 않고 즉시 실패한다.
2. 어떤 Task도 자신의 의존 Task와 같은 Wave에 배치하지 않는다(항상 의존 Task가 더 이른
   Wave). `run-wave.md`가 한 Wave 안에서 Task ID 사전순으로 하나씩 실행하므로(규칙 6),
   같은 Wave 안에 의존 관계가 있으면 실행 순서가 뒤집힐 수 있어 이를 원천 차단한다.
3. Task는 먼저 10개 Wave 그룹(사용자 지정 순서) 중 하나로 분류되고, 그 그룹 번호는
   자신이 의존하는 Task의 최종 그룹보다 낮을 수 없도록 전파된다(그룹 힌트가 실제
   의존 관계와 충돌하면 의존 관계가 이긴다).
4. 그룹 안에서 Task를 (base_level, Task ID) 순으로 정렬한 뒤, 같은 Wave 안에 의존 관계가
   생기지 않는 한도까지 그리디로 묶어 Wave당 4~7개를 기본값으로 시도한다. 의존 구조상
   더 작게 쪼개야 하면(예: Page Owner는 그 그룹의 나머지 전부에 의존하므로 항상 자신만의
   마지막 Wave가 된다) 예외를 그대로 두고 `TASK_DAG.md`에 사유를 남긴다.
5. Expected Files가 같은 파일(특히 여러 Screen의 Page Entry)에 걸쳐 있는 Task는 암묵적
   의존성으로 보정해 실제로 다른 Wave에 떨어지도록 한다(현재 `SHARED-SEO-METADATA`가
   5개 Page Owner 전부에 암묵적으로 의존하도록 보정됨 — 상세는 TASK_DAG.md 참조).

## 주의

`scripts/audit_tasks.py`는 실행될 때마다 `TASKS/TASK_MANIFEST.csv`를 wave_id 없이
새로 쓴다. Task List/Depends On을 수정해 `audit_tasks.py`를 다시 돌렸다면, 그 다음에
반드시 `build_waves.py`를 다시 실행해 `wave_id` 열과 Wave 산출물을 재계산해야 한다.

이 스크립트는 Git Branch/PR/Merge를 생성하지 않으며, 표준 라이브러리만 사용한다.
"""

from __future__ import annotations

import csv
import json
import re
import sys
from collections import OrderedDict, defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "TASKS" / "TASK_MANIFEST.csv"
CONTRACT_PATH = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
DETAILS_DIR_CANDIDATES = [ROOT / "TASKS" / "details", ROOT / "TASKS"]
TASK_DAG_PATH = ROOT / "TASKS" / "TASK_DAG.md"
WAVE_PLAN_PATH = ROOT / "TASKS" / "WAVE_PLAN.md"
WAVE_STATE_PATH = ROOT / "TASKS" / "WAVE_STATE.json"

MAX_WAVE_SIZE = 7
TARGET_WAVE_SIZE = (4, 7)

GROUP_TITLES = {
    1: "Scaffold, 문서, Harness 확인",
    2: "Airbnb 스타일 공통 UI, 정적 데이터, Layout",
    3: "Supabase Auth, 6개 Table, 기본 RLS + 서버 API 계층",
    4: "SCR-001 메인 Component와 Page Owner",
    5: "SCR-002 대표 소개 Component와 Page Owner",
    6: "SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner",
    7: "SCR-004 동행 목록·상세·신청 Component와 Page Owner",
    8: "SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner",
    9: "Unit·Playwright·접근성·CI",
    10: "Vercel Preview와 Release 확인",
}

# 그룹 2로 강제 배치하는 SHARED/DATA Task(정적 데이터·전역 공통 UI).
GROUP2_TASK_IDS = {
    "SHARED-DESIGN-TOKENS",
    "SHARED-HEADER-FOOTER",
    "SHARED-POLICY-CONTENT",
    "SHARED-TOAST-ALERT",
    "SHARED-ERROR-PAGES",
    "SHARED-SEO-METADATA",
}
SCREEN_TO_GROUP = {
    "SCR-001": 4,
    "SCR-002": 5,
    "SCR-003": 6,
    "SCR-004": 7,
    "SCR-005": 8,
}


def find_details_dir() -> Path:
    for cand in DETAILS_DIR_CANDIDATES:
        if cand.exists() and list(cand.glob("TASK-*.md")):
            return cand
    print(f"[FAIL] TASK 상세 파일을 찾을 수 없음: {DETAILS_DIR_CANDIDATES}")
    sys.exit(1)


def load_manifest() -> "OrderedDict[str, dict]":
    if not MANIFEST_PATH.exists():
        print(f"[FAIL] {MANIFEST_PATH.relative_to(ROOT)} 없음 — 먼저 scripts/audit_tasks.py를 실행한다.")
        sys.exit(1)
    with MANIFEST_PATH.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames or [])
        rows = list(reader)
    tasks: "OrderedDict[str, dict]" = OrderedDict()
    for row in rows:
        tid = row["TaskID"].strip()
        deps_raw = (row.get("DependsOn") or "").strip()
        deps = [] if deps_raw in ("", "—") else [d.strip() for d in deps_raw.split(",") if d.strip()]
        tasks[tid] = {
            "seq": row.get("Seq", ""),
            "category": row.get("Category", "").strip(),
            "screen": (row.get("Screen") or "").strip(),
            "depends_on": deps,
            "row": row,
        }
    return tasks, fieldnames


def read_expected_files_text(details_dir: Path, task_id: str) -> str:
    path = details_dir / f"TASK-{task_id}.md"
    if not path.exists():
        return ""
    text = path.read_text(encoding="utf-8")
    m = re.search(r"## Expected Files\n(.*?)\n##", text, re.S)
    return m.group(1).strip() if m else ""


def read_detail_depends_on(details_dir: Path, task_id: str) -> set[str]:
    path = details_dir / f"TASK-{task_id}.md"
    if not path.exists():
        return set()
    text = path.read_text(encoding="utf-8")
    m = re.search(r"## Depends On\n(.*?)\n##", text, re.S)
    if not m:
        return set()
    body = m.group(1)
    if "없음" in body:
        return set()
    return set(re.findall(r"`([A-Z0-9][A-Z0-9\-]+)`", body))


def load_contract() -> dict:
    if not CONTRACT_PATH.exists():
        print(f"[FAIL] {CONTRACT_PATH.relative_to(ROOT)} 없음")
        sys.exit(1)
    return json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))


def main() -> int:
    tasks, manifest_fieldnames = load_manifest()
    details_dir = find_details_dir()
    contract = load_contract()

    screen_page_entries = {s["screen_id"]: s["page_entry"] for s in contract["screens"]}
    screen_ids_sorted = sorted(screen_page_entries)

    # PAGE Owner Task 식별(Screen -> Task ID)
    page_owner_of_screen: dict[str, str] = {}
    for tid, info in tasks.items():
        if info["category"] == "PAGE" and info["screen"] in screen_page_entries:
            page_owner_of_screen[info["screen"]] = tid

    missing_owners = [s for s in screen_ids_sorted if s not in page_owner_of_screen]
    if missing_owners:
        print(f"[FAIL] Page Owner Task가 없는 Screen: {missing_owners}")
        sys.exit(1)

    # --- 1) Depends On 교차 확인(정보성 경고, 실패 사유 아님) ---
    consistency_warnings: list[str] = []
    for tid, info in tasks.items():
        detail_deps = read_detail_depends_on(details_dir, tid)
        manifest_deps = set(info["depends_on"])
        if detail_deps != manifest_deps:
            consistency_warnings.append(
                f"{tid}: manifest={sorted(manifest_deps)} vs detail={sorted(detail_deps)}"
            )

    # --- 2) 암묵적 의존성 보정: Expected Files가 여러 Screen의 Page Entry에 걸치는 Task ---
    implicit_edges: list[tuple[str, str]] = []  # (task, implicit dependency)
    page_entry_full_paths = set(screen_page_entries.values())
    for tid, info in tasks.items():
        if info["category"] == "PAGE":
            continue
        xf_text = read_expected_files_text(details_dir, tid)
        if not xf_text or "page.tsx" not in xf_text:
            continue
        specific_paths = set(re.findall(r"src/app/[\w/\[\]\-]*page\.tsx", xf_text))
        is_generic = bool(re.search(r"page\.tsx", xf_text)) and not specific_paths
        if is_generic:
            for screen_id, owner in page_owner_of_screen.items():
                if owner not in info["depends_on"]:
                    implicit_edges.append((tid, owner))
        else:
            for path in specific_paths:
                if path not in page_entry_full_paths:
                    continue
                screen_id = next(s for s, p in screen_page_entries.items() if p == path)
                owner = page_owner_of_screen[screen_id]
                if owner != tid and owner not in info["depends_on"]:
                    implicit_edges.append((tid, owner))

    all_deps: dict[str, set[str]] = {tid: set(info["depends_on"]) for tid, info in tasks.items()}
    for tid, dep in implicit_edges:
        all_deps[tid].add(dep)

    # --- 3) 순환 의존성 검사(DFS 3색) ---
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {tid: WHITE for tid in tasks}
    cycles: list[list[str]] = []
    stack: list[str] = []

    def visit(tid: str) -> None:
        color[tid] = GRAY
        stack.append(tid)
        for dep in sorted(all_deps.get(tid, ())):
            if dep not in tasks:
                continue  # 참조 무결성은 audit_tasks.py 검사 #3 담당
            if color[dep] == GRAY:
                idx = stack.index(dep)
                cycles.append(stack[idx:] + [dep])
            elif color[dep] == WHITE:
                visit(dep)
        stack.pop()
        color[tid] = BLACK

    for tid in tasks:
        if color[tid] == WHITE:
            visit(tid)

    if cycles:
        print(f"[FAIL] 순환 의존성 {len(cycles)}건 발견 — Wave 산출물을 생성하지 않는다.")
        for c in cycles:
            print("  - " + " -> ".join(c))
        return 1

    # --- 4) base_level(최장 경로 위상 레벨) 계산 ---
    level_memo: dict[str, int] = {}

    def level_of(tid: str) -> int:
        if tid in level_memo:
            return level_memo[tid]
        deps = [d for d in all_deps.get(tid, ()) if d in tasks]
        lv = 1 if not deps else 1 + max(level_of(d) for d in deps)
        level_memo[tid] = lv
        return lv

    for tid in tasks:
        level_of(tid)

    # --- 5) 그룹 힌트 ---
    def hint_group(tid: str, info: dict) -> int:
        cat = info["category"]
        screen = info["screen"]
        if tid in GROUP2_TASK_IDS or cat == "DATA":
            return 2
        if tid == "SHARED-A11Y-FOCUS":
            return 9
        if cat in ("DB", "API"):
            return 3
        if cat in ("UNIT_TEST", "INTEGRATION_TEST", "E2E", "GOV", "CI"):
            # Screen 열은 "무엇을 테스트하는가"를 나타낼 뿐 소속 그룹이 아니다
            # (예: E2E-TRAVEL-TOOLS의 Screen=SCR-003이지만 그룹은 9).
            return 9
        if cat == "DEPLOY":
            return 10
        if cat in ("PAGE", "COMPONENT") and screen in SCREEN_TO_GROUP:
            return SCREEN_TO_GROUP[screen]
        return 9  # 안전망: 매핑되지 않는 미래 Category는 마지막 검증 묶음으로

    hints = {tid: hint_group(tid, info) for tid, info in tasks.items()}

    # --- 6) 유효 그룹 전파: 의존 Task의 유효 그룹보다 낮을 수 없다 ---
    order_by_level = sorted(tasks, key=lambda t: (level_of(t), t))
    effective_group: dict[str, int] = {}
    for tid in order_by_level:
        deps = [d for d in all_deps.get(tid, ()) if d in tasks]
        dep_max = max((effective_group[d] for d in deps), default=0)
        effective_group[tid] = max(hints[tid], dep_max)

    bumped = {t: (hints[t], effective_group[t]) for t in tasks if hints[t] != effective_group[t]}

    # --- 7) 그룹별 Wave(청크) 분할: (level, id) 순 그리디, 같은 Wave 내 의존 금지 ---
    tasks_by_group: dict[int, list[str]] = defaultdict(list)
    for tid in tasks:
        tasks_by_group[effective_group[tid]].append(tid)

    waves: list[dict] = []  # {"wave_id":..., "group":int, "task_ids":[...]}
    for group in sorted(tasks_by_group):
        group_tasks = sorted(tasks_by_group[group], key=lambda t: (level_of(t), t))
        chunk: list[str] = []
        chunk_set: set[str] = set()
        for tid in group_tasks:
            deps_in_chunk = all_deps.get(tid, set()) & chunk_set
            if deps_in_chunk or len(chunk) >= MAX_WAVE_SIZE:
                if chunk:
                    waves.append({"group": group, "task_ids": chunk})
                chunk, chunk_set = [], set()
            chunk.append(tid)
            chunk_set.add(tid)
        if chunk:
            waves.append({"group": group, "task_ids": chunk})

    for i, w in enumerate(waves, start=1):
        w["wave_id"] = f"W{i:02d}"

    # --- 8) 검증: 어떤 Wave도 내부 의존성을 갖지 않는다 ---
    same_wave_violations = []
    for w in waves:
        wset = set(w["task_ids"])
        for tid in w["task_ids"]:
            if all_deps.get(tid, set()) & wset:
                same_wave_violations.append((w["wave_id"], tid))
    if same_wave_violations:
        print(f"[FAIL] 같은 Wave 안에 의존 관계가 남아있음: {same_wave_violations}")
        return 1

    # --- 9) 검증: 의존 Task가 항상 더 이른 Wave에 있다 ---
    wave_of: dict[str, str] = {}
    wave_index: dict[str, int] = {}
    for idx, w in enumerate(waves):
        for tid in w["task_ids"]:
            wave_of[tid] = w["wave_id"]
            wave_index[tid] = idx
    order_violations = []
    for tid, deps in all_deps.items():
        for dep in deps:
            if dep not in wave_index:
                continue
            if wave_index[dep] >= wave_index[tid]:
                order_violations.append((tid, dep))
    if order_violations:
        print(f"[FAIL] 선행 Task가 뒤 Wave(또는 같은/이른 Wave가 아님)에 배치됨: {order_violations}")
        return 1

    # --- 10) Page Owner 위치 검증: 화면 그룹 안에서 항상 자기 자신만의 마지막 Wave ---
    page_owner_positions = {}
    for screen, owner in page_owner_of_screen.items():
        # "해당 화면 그룹"은 effective_group 번호가 아니라 실제로 이 Screen 소속인
        # Task(그 Screen의 Component + Page Owner)만을 기준으로 판정한다 — 다른 그룹에서
        # 암묵적 의존성으로 같은 그룹 번호에 흘러든 교차 Task(예: SHARED-SEO-METADATA)는
        # 이 판정에서 제외한다.
        screen_native_tasks = [
            t
            for t, info in tasks.items()
            if info["screen"] == screen and info["category"] in ("PAGE", "COMPONENT")
        ]
        native_wave_indices = [wave_index[t] for t in screen_native_tasks]
        owner_wave_idx = wave_index[owner]
        is_last = owner_wave_idx == max(native_wave_indices)
        is_alone = waves[owner_wave_idx]["task_ids"] == [owner]
        page_owner_positions[screen] = {
            "owner": owner,
            "wave_id": wave_of[owner],
            "is_last_in_group": is_last,
            "is_alone_in_wave": is_alone,
        }
        if not is_last:
            print(f"[FAIL] {screen}의 Page Owner({owner})가 해당 화면 그룹의 마지막 Wave가 아님.")
            return 1

    # --- 11) "화면 Wave"(Preview Checkpoint) 판정: Category=PAGE 포함 Wave ---
    for w in waves:
        w["checkpoint_required"] = any(tasks[t]["category"] == "PAGE" for t in w["task_ids"])

    # ================= 산출물 작성 =================

    generated_at = datetime.now(timezone.utc).isoformat(timespec="seconds")

    # TASKS/WAVE_STATE.json
    wave_state = {
        "schema_version": "traveler-wave-state-v1",
        "generated_at": generated_at,
        "waves": [
            {
                "wave_id": w["wave_id"],
                "title": GROUP_TITLES[w["group"]],
                "task_ids": w["task_ids"],
                "status": "pending",
                "checkpoint_required": w["checkpoint_required"],
                "checkpoint_result": None,
            }
            for w in waves
        ],
    }
    WAVE_STATE_PATH.write_text(json.dumps(wave_state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # TASKS/WAVE_PLAN.md
    lines = [
        "# Free Traveler — Wave Plan",
        "",
        f"- **생성:** `scripts/build_waves.py` ({generated_at})",
        "- **정본 선언:** 이 문서와 `TASKS/WAVE_STATE.json`의 Wave ID가 이후 `/run-wave` 등 실행 단계의 정본이다.",
        "  Wave ID는 W01부터 실제로 필요한 만큼만 생성되며 W00~W10으로 미리 고정하지 않는다.",
        "- **재생성:** `scripts/audit_tasks.py`를 다시 실행해 `TASKS/TASK_MANIFEST.csv`가 갱신되면, "
        "`wave_id` 열이 사라지므로 `scripts/build_waves.py`를 다시 실행해야 한다.",
        "",
        "| Wave | 그룹 | Task 수 | Preview Checkpoint | 대표 그룹 |",
        "|---|---|---:|---|---|",
    ]
    for w in waves:
        lines.append(
            f"| `{w['wave_id']}` | {w['group']} | {len(w['task_ids'])} | "
            f"{'예(화면 Wave)' if w['checkpoint_required'] else '—'} | {GROUP_TITLES[w['group']]} |"
        )
    lines += ["", "---", ""]
    for w in waves:
        lines.append(f"## `{w['wave_id']}` — {GROUP_TITLES[w['group']]}")
        lines.append("")
        if w["checkpoint_required"]:
            lines.append(
                "**화면 Wave** — 이 Wave가 `DONE`이 되면 `/run-wave`는 다음 Wave로 자동 진행하지 않고 "
                "`WAITING_FOR_PREVIEW`로 종료한다(`CLAUDE.md` 규칙 22)."
            )
            lines.append("")
        off_group_notes = [
            t for t in w["task_ids"] if hints[t] != effective_group[t]
        ]
        if off_group_notes:
            for t in off_group_notes:
                lines.append(
                    f"> 참고: `{t}`는 원래 그룹 힌트 {hints[t]}({GROUP_TITLES[hints[t]]})였으나, "
                    f"의존 관계상 그룹 {effective_group[t]}로 재배치됨."
                )
            lines.append("")
        lines.append("| Task ID | Category | Depends On |")
        lines.append("|---|---|---|")
        for tid in w["task_ids"]:
            deps = ", ".join(sorted(tasks[tid]["depends_on"])) or "—"
            lines.append(f"| `{tid}` | {tasks[tid]['category']} | {deps} |")
        lines.append("")
    WAVE_PLAN_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")

    # TASKS/TASK_DAG.md
    dag_lines = [
        "# Free Traveler — Task Dependency DAG",
        "",
        f"- **생성:** `scripts/build_waves.py` ({generated_at})",
        f"- **Task 총 수:** {len(tasks)}",
        f"- **순환 의존성:** {len(cycles)}건",
        "",
        "## 암묵적 의존성 보정",
        "",
    ]
    if implicit_edges:
        dag_lines.append(
            "Expected Files가 특정 Screen 하나가 아니라 여러(또는 모든) Screen의 Page Entry에 "
            "걸쳐 있는 Task는, 명시된 Depends On에 빠져 있어도 해당 Screen들의 Page Owner Task에 "
            "암묵적으로 의존하는 것으로 보정해 Wave를 계산했다(원본 `TASKS/00_TASK_LIST.md`/"
            "`TASK-*.md`의 Depends On 열 자체는 수정하지 않음 — Wave 계산에만 반영):"
        )
        dag_lines.append("")
        for tid, dep in implicit_edges:
            dag_lines.append(f"- `{tid}` → (암묵적) `{dep}`")
    else:
        dag_lines.append("해당 없음(암묵적 의존성 보정 없이 명시된 Depends On만으로 계산됨).")
    dag_lines += ["", "## 그룹 힌트 재배치", ""]
    if bumped:
        dag_lines.append("의존 관계상 원래 그룹 힌트보다 뒤로 재배치된 Task:")
        dag_lines.append("")
        for tid, (h, e) in sorted(bumped.items()):
            dag_lines.append(f"- `{tid}`: 힌트 그룹 {h}({GROUP_TITLES[h]}) → 실제 그룹 {e}({GROUP_TITLES[e]})")
    else:
        dag_lines.append("해당 없음(모든 Task가 자신의 그룹 힌트 그대로 배치됨).")
    dag_lines += ["", "## Depends On 정합성(Manifest ↔ 상세 파일)", ""]
    if consistency_warnings:
        dag_lines.append(f"불일치 {len(consistency_warnings)}건(Wave 계산은 Manifest 기준, 상세 파일 갱신 필요 여부는 별도 확인 요망):")
        dag_lines.append("")
        for w in consistency_warnings:
            dag_lines.append(f"- {w}")
    else:
        dag_lines.append("불일치 없음 — Manifest와 상세 파일의 Depends On이 전부 일치.")
    dag_lines += ["", "## Task별 DAG 정보", "", "| Task ID | Category | base_level | 그룹 힌트 | 최종 그룹 | Wave | Depends On(명시+암묵) |", "|---|---|---:|---:|---:|---|---|"]
    for tid in sorted(tasks, key=lambda t: (level_of(t), t)):
        deps = ", ".join(sorted(all_deps.get(tid, ()))) or "—"
        dag_lines.append(
            f"| `{tid}` | {tasks[tid]['category']} | {level_of(tid)} | {hints[tid]} | "
            f"{effective_group[tid]} | `{wave_of[tid]}` | {deps} |"
        )
    dag_lines += ["", "## Page Owner 위치 검증", "", "| Screen | Page Owner | Wave | 그룹의 마지막 Wave | 해당 Wave에 단독 배치 |", "|---|---|---|---|---|"]
    for screen in screen_ids_sorted:
        p = page_owner_positions[screen]
        dag_lines.append(
            f"| {screen} | `{p['owner']}` | `{p['wave_id']}` | {'예' if p['is_last_in_group'] else '아니오'} | "
            f"{'예' if p['is_alone_in_wave'] else '아니오'} |"
        )
    TASK_DAG_PATH.write_text("\n".join(dag_lines) + "\n", encoding="utf-8")

    # TASKS/TASK_MANIFEST.csv + wave_id 열
    with MANIFEST_PATH.open(encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))
    out_fieldnames = manifest_fieldnames + (["wave_id"] if "wave_id" not in manifest_fieldnames else [])
    for row in rows:
        row["wave_id"] = wave_of.get(row["TaskID"].strip(), "")
    with MANIFEST_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=out_fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    # ================= 종료 출력 =================
    print("=" * 70)
    print("Traveler Wave Plan 생성 결과")
    print("=" * 70)
    print(f"순환 의존성: {len(cycles)}건")
    print(f"암묵적 의존성 보정: {len(implicit_edges)}건")
    print(f"그룹 힌트 재배치: {len(bumped)}건")
    print(f"Depends On 정합성 불일치(Manifest vs 상세 파일): {len(consistency_warnings)}건")
    print("-" * 70)
    print("Wave별 Task 수:")
    for w in waves:
        marker = " [화면 Wave/Preview Checkpoint]" if w["checkpoint_required"] else ""
        print(f"  {w['wave_id']} (그룹 {w['group']} — {GROUP_TITLES[w['group']]}): {len(w['task_ids'])}개{marker}")
    print("-" * 70)
    print("Page Owner 위치:")
    for screen in screen_ids_sorted:
        p = page_owner_positions[screen]
        print(f"  {screen}: {p['owner']} -> {p['wave_id']} (그룹 마지막 Wave={p['is_last_in_group']}, 단독 배치={p['is_alone_in_wave']})")
    print("-" * 70)
    print(f"총 Wave 수: {len(waves)}, 총 Task 수: {len(tasks)}")
    print("산출물: TASKS/TASK_DAG.md, TASKS/WAVE_PLAN.md, TASKS/WAVE_STATE.json, TASKS/TASK_MANIFEST.csv(wave_id 열 추가)")
    print("=" * 70)
    print("BUILD_WAVES_PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
