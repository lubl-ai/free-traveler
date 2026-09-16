#!/usr/bin/env python3
"""
validate_harness.py — Traveler Agent Harness(스캐폴딩) 검증 스크립트

`docs/PROJECT_SCOPE.md`/`docs/06_SRS_UIUX_REVISED.md` 등 프로젝트 문서 자체는 `scripts/validate_inputs.py`가,
`TASKS/00_TASK_LIST.md`/`TASKS/TASK-*.md`는 `scripts/audit_tasks.py`가 검증한다.
이 스크립트는 그 위에서 동작하는 **Harness 자체**(CLAUDE.md, Skill, Command 7개, Marker, 핵심 규칙 존재 여부)를
검증한다. 읽기 전용이며 어떤 파일도 수정하지 않는다. 표준 라이브러리만 사용한다.

검사 1~13:
  1. CLAUDE.md 존재
  2. Claude Code Skill 파일 존재
  3. 7개 Command 존재
  4. traveler-screen-route-v1 Marker 존재
  5. D-001 DESIGN 경로 일치
  6. Screen Contract 경로 일치
  7. Page Owner 5개 규칙 존재
  8. DB Table 6개 기본 범위 존재
  9. 외부 입력 비저장 규칙 존재
  10. Playwright Chromium Smoke 규칙 존재
  11. AUTO_MERGE=false
  12. AWS_ENABLED=false
  13. EXCLUDED 보호 규칙 존재

종료 코드:
  0  전 검사 통과 (VALIDATE_HARNESS_PASS 출력)
  1  하나 이상 실패 (누락 파일·규칙 출력)
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CLAUDE_MD = ROOT / "CLAUDE.md"
SKILL_MD = ROOT / ".claude" / "skills" / "traveler-project-pipeline" / "SKILL.md"
COMMANDS_DIR = ROOT / ".claude" / "commands"
DESIGN_MD = ROOT / "design-reference" / "D-001" / "DESIGN.md"
SCREEN_CONTRACT = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"

REQUIRED_COMMANDS = [
    "gen-tasklist.md",
    "gen-task-details.md",
    "audit-tasks.md",
    "prepare-task.md",
    "implement-task.md",
    "run-wave.md",
    "release-check.md",
]

missing_files: list[str] = []
missing_rules: list[str] = []
check_count = 0
pass_count = 0


def run_check(name: str, ok: bool, detail: str = "") -> bool:
    global check_count, pass_count
    check_count += 1
    if ok:
        pass_count += 1
        print(f"[PASS] {name}")
    else:
        print(f"[FAIL] {name}" + (f" — {detail}" if detail else ""))
    return ok


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.exists() else ""


def main() -> int:
    all_ok = True

    # 1. CLAUDE.md 존재
    claude_exists = CLAUDE_MD.exists()
    if not claude_exists:
        missing_files.append(str(CLAUDE_MD.relative_to(ROOT)))
    all_ok = run_check("1. CLAUDE.md 존재", claude_exists) and all_ok
    claude_text = read_text(CLAUDE_MD)

    # 2. Claude Code Skill 파일 존재
    skill_exists = SKILL_MD.exists()
    if not skill_exists:
        missing_files.append(str(SKILL_MD.relative_to(ROOT)))
    all_ok = run_check("2. Claude Code Skill 파일 존재", skill_exists,
                        "" if skill_exists else str(SKILL_MD.relative_to(ROOT))) and all_ok
    skill_text = read_text(SKILL_MD)

    # 3. 7개 Command 존재
    missing_commands = [c for c in REQUIRED_COMMANDS if not (COMMANDS_DIR / c).exists()]
    existing_commands = sorted(p.name for p in COMMANDS_DIR.glob("*.md")) if COMMANDS_DIR.exists() else []
    if missing_commands:
        missing_files.extend(f".claude/commands/{c}" for c in missing_commands)
    all_ok = run_check(
        "3. 7개 Command 존재",
        len(missing_commands) == 0 and len(REQUIRED_COMMANDS) == 7,
        f"누락: {missing_commands or '없음'} / 발견된 Command 파일: {existing_commands}",
    ) and all_ok

    # 결합 텍스트(4~13 규칙 검사는 CLAUDE.md + Skill 어느 쪽에 있어도 인정)
    combined_text = claude_text + "\n" + skill_text

    # 4. traveler-screen-route-v1 Marker 존재
    marker_ok = "traveler-screen-route-v1" in combined_text
    if not marker_ok:
        missing_rules.append("HARNESS_SCHEMA=traveler-screen-route-v1 Marker (CLAUDE.md/SKILL.md)")
    all_ok = run_check("4. traveler-screen-route-v1 Marker 존재", marker_ok) and all_ok

    # 5. D-001 DESIGN 경로 일치
    design_path_declared = "design-reference/D-001/DESIGN.md" in combined_text
    design_file_exists = DESIGN_MD.exists()
    design_ok = design_path_declared and design_file_exists
    if not design_path_declared:
        missing_rules.append("DESIGN_PATH=design-reference/D-001/DESIGN.md 선언 (CLAUDE.md/SKILL.md)")
    if not design_file_exists:
        missing_files.append(str(DESIGN_MD.relative_to(ROOT)))
    all_ok = run_check(
        "5. D-001 DESIGN 경로 일치",
        design_ok,
        f"선언됨={design_path_declared}, 실제 파일 존재={design_file_exists}",
    ) and all_ok

    # 6. Screen Contract 경로 일치
    screen_path_declared = "design-reference/SCREEN_ROUTE_CONTRACT.json" in combined_text
    screen_file_exists = SCREEN_CONTRACT.exists()
    screen_ok = screen_path_declared and screen_file_exists
    if not screen_path_declared:
        missing_rules.append("SCREEN_CONTRACT=design-reference/SCREEN_ROUTE_CONTRACT.json 선언 (CLAUDE.md/SKILL.md)")
    if not screen_file_exists:
        missing_files.append(str(SCREEN_CONTRACT.relative_to(ROOT)))
    all_ok = run_check(
        "6. Screen Contract 경로 일치",
        screen_ok,
        f"선언됨={screen_path_declared}, 실제 파일 존재={screen_file_exists}",
    ) and all_ok

    # 7. Page Owner 5개 규칙 존재
    page_owner_ok = bool(
        re.search(r"Page\s*Owner", combined_text)
        and re.search(r"(SCR-001~005|SCR-001\s*~\s*SCR-005|Screen\s*당\s*정확히\s*1개|각\s*1개)", combined_text)
    )
    if not page_owner_ok:
        missing_rules.append("Page Owner가 Screen당 정확히 1개라는 규칙(CLAUDE.md 규칙 9 / SKILL §5)")
    all_ok = run_check("7. Page Owner 5개 규칙 존재", page_owner_ok) and all_ok

    # 8. DB Table 6개 기본 범위 존재
    db_table_names = ["USER_PROFILE", "MATE_POST", "MATE_APPLICATION", "USER_BLOCK", "REPORT", "APP_SETTING"]
    db_names_found = all(name in combined_text for name in db_table_names)
    db_count_ok = bool(re.search(r"6개\s*(기본\s*)?(Table|테이블)", combined_text))
    db_ok = db_names_found and db_count_ok
    if not db_ok:
        missing_rules.append("DB 6개 테이블(USER_PROFILE/MATE_POST/MATE_APPLICATION/USER_BLOCK/REPORT/APP_SETTING) 범위 규칙")
    all_ok = run_check(
        "8. DB Table 6개 기본 범위 존재",
        db_ok,
        f"6개 테이블명 전부 언급={db_names_found}, '6개 테이블' 표현 존재={db_count_ok}",
    ) and all_ok

    # 9. 외부 입력 비저장 규칙 존재(항공·숙소)
    no_transmit_ok = bool(
        re.search(r"(항공|숙소)", combined_text)
        and re.search(r"(서버|DB|외부\s*URL|로그|분석).{0,20}(보내지\s*않|전달되지\s*않|저장하지\s*않)", combined_text)
    )
    if not no_transmit_ok:
        missing_rules.append("항공·숙소 입력값 서버·DB·URL·로그·분석 비저장 규칙(CLAUDE.md 규칙 12 / SKILL §7)")
    all_ok = run_check("9. 외부 입력 비저장 규칙 존재", no_transmit_ok) and all_ok

    # 10. Playwright Chromium Smoke 규칙 존재
    playwright_ok = bool(re.search(r"Playwright", combined_text) and re.search(r"Chromium", combined_text)
                          and re.search(r"Smoke", combined_text))
    if not playwright_ok:
        missing_rules.append("Playwright Chromium Smoke 범위 규칙(CLAUDE.md 규칙 18 / SKILL §9)")
    all_ok = run_check("10. Playwright Chromium Smoke 규칙 존재", playwright_ok) and all_ok

    # 11. AUTO_MERGE=false
    auto_merge_ok = "AUTO_MERGE=false" in claude_text
    if not auto_merge_ok:
        missing_rules.append("AUTO_MERGE=false Marker (CLAUDE.md)")
    all_ok = run_check("11. AUTO_MERGE=false", auto_merge_ok) and all_ok

    # 12. AWS_ENABLED=false
    aws_marker_ok = "AWS_ENABLED=false" in claude_text
    if not aws_marker_ok:
        missing_rules.append("AWS_ENABLED=false Marker (CLAUDE.md)")
    all_ok = run_check("12. AWS_ENABLED=false", aws_marker_ok) and all_ok

    # 13. EXCLUDED 보호 규칙 존재
    excluded_ok = bool(
        re.search(r"EXCLUDED", combined_text)
        and re.search(r"(임의로?\s*구현하지\s*않는다|임의로\s*복원|구현\s*Task를?\s*만들지\s*않는다)", combined_text)
    )
    if not excluded_ok:
        missing_rules.append("EXCLUDED 임의 구현/복원 금지 규칙(CLAUDE.md 규칙 19 / SKILL §11)")
    all_ok = run_check("13. EXCLUDED 보호 규칙 존재", excluded_ok) and all_ok

    print("-" * 70)
    if all_ok:
        print("VALIDATE_HARNESS_PASS")
        print(f"검사 통과 수: {pass_count}/{check_count}")
        return 0

    print("VALIDATE_HARNESS_FAIL")
    print(f"검사 통과 수: {pass_count}/{check_count}")
    if missing_files:
        print(f"누락 파일 ({len(missing_files)}건):")
        for f in missing_files:
            print(f"  - {f}")
    if missing_rules:
        print(f"누락 규칙 ({len(missing_rules)}건):")
        for r in missing_rules:
            print(f"  - {r}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
