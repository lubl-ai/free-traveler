#!/usr/bin/env python3
"""
validate_inputs.py — Traveler Task Pipeline 입력 검증 스크립트

`/gen-tasklist` 실행 전에 반드시 이 스크립트를 통과해야 한다(traveler-project-pipeline SKILL 참조).
아래 11개 항목을 순서대로 검사한다.

  1. package.json에 Next.js 의존성이 있다.
  2. src/app/page.tsx와 src/app/layout.tsx가 존재한다.
  3. PRD·SRS·Project Scope·UI 문서가 존재한다.
  4. D-001 DESIGN.md와 LOCKED Manifest가 존재한다.
  5. SCREEN_ROUTE_CONTRACT.json을 JSON으로 파싱할 수 있다.
  6. Screen 수가 정확히 5개다.
  7. SCR-001~005가 모두 존재한다.
  8. Route가 `/`, `/about`, `/travel-tools`, `/mates`, `/account`다.
  9. Page Entry가 실제 Next.js App Router 경로 형식이다.
  10. PROJECT_SCOPE에 REQ-FUNC 80개와 REQ-NF 34개가 모두 등장한다.
  11. AWS·EC2가 활성 기술로 정의되지 않았다.

읽기 전용이며 어떤 파일도 수정하지 않는다. 표준 라이브러리만 사용한다.

종료 코드:
  0  모든 검사 통과 (VALIDATE_INPUTS_PASS 출력)
  1  하나 이상의 검사 실패 (누락 파일·Screen·Requirement ID 출력)
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

PACKAGE_JSON = ROOT / "package.json"
PAGE_TSX = ROOT / "src" / "app" / "page.tsx"
LAYOUT_TSX = ROOT / "src" / "app" / "layout.tsx"

PRD_DOC = ROOT / "docs" / "01_PRD.md"
SRS_DOC = ROOT / "docs" / "02_SRS_BASELINE.md"
PROJECT_SCOPE_DOC = ROOT / "docs" / "PROJECT_SCOPE.md"
UI_DOCS = [
    ROOT / "docs" / "03_UI_COVERAGE_ANALYSIS.md",
    ROOT / "docs" / "04_UIUX_PLAN.md",
    ROOT / "design-reference" / "UI_CONTRACT.md",
]

DESIGN_MD = ROOT / "design-reference" / "D-001" / "DESIGN.md"
DESIGN_MANIFEST = ROOT / "design-reference" / "DESIGN_MANIFEST.md"

SCREEN_ROUTE_CONTRACT = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"

EXPECTED_SCREEN_IDS = [f"SCR-{i:03d}" for i in range(1, 6)]
EXPECTED_ROUTES = {"/", "/about", "/travel-tools", "/mates", "/account"}
PAGE_ENTRY_PATTERN = re.compile(r"^src/app/[A-Za-z0-9/_\[\]-]*page\.tsx$")

REQ_FUNC_EXPECTED = [f"REQ-FUNC-{i:03d}" for i in range(1, 81)]
REQ_NF_EXPECTED = [f"REQ-NF-{i:03d}" for i in range(1, 35)]

AWS_EC2_PATTERN = re.compile(r"\b(AWS|EC2)\b")
NEGATION_MARKERS = ["제외", "않는다", "않음", "아니다", "미사용", "금지", "두지 않"]
AWS_PACKAGE_PATTERN = re.compile(r"^(aws-sdk|@aws-sdk/.*)$")

missing_files: list[str] = []
missing_screens: list[str] = []
missing_requirements: list[str] = []
other_issues: list[str] = []
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


def read_text(path: Path) -> str | None:
    if not path.exists():
        return None
    return path.read_text(encoding="utf-8")


def main() -> int:
    all_ok = True

    # 1. package.json에 Next.js 의존성이 있다.
    pkg_text = read_text(PACKAGE_JSON)
    if pkg_text is None:
        missing_files.append(str(PACKAGE_JSON.relative_to(ROOT)))
        all_ok = run_check("1. package.json Next.js 의존성", False, "package.json 없음") and all_ok
    else:
        try:
            pkg = json.loads(pkg_text)
            deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
            has_next = "next" in deps
            if not has_next:
                other_issues.append("package.json에 'next' 의존성이 없음")
            all_ok = run_check("1. package.json Next.js 의존성", has_next,
                                "" if has_next else "'next' 의존성 없음") and all_ok

            # 11-보조: aws-sdk류 패키지가 의존성에 없는지(활성 기술 여부 판단 자료)
            aws_deps = [d for d in deps if AWS_PACKAGE_PATTERN.match(d)]
            if aws_deps:
                other_issues.append(f"package.json에 AWS SDK 의존성 존재: {aws_deps}")
        except json.JSONDecodeError as e:
            other_issues.append(f"package.json 파싱 실패: {e}")
            all_ok = run_check("1. package.json Next.js 의존성", False, "JSON 파싱 실패") and all_ok

    # 2. src/app/page.tsx와 src/app/layout.tsx가 존재한다.
    page_exists = PAGE_TSX.exists()
    layout_exists = LAYOUT_TSX.exists()
    if not page_exists:
        missing_files.append(str(PAGE_TSX.relative_to(ROOT)))
    if not layout_exists:
        missing_files.append(str(LAYOUT_TSX.relative_to(ROOT)))
    all_ok = run_check(
        "2. src/app/page.tsx, src/app/layout.tsx 존재",
        page_exists and layout_exists,
        "" if (page_exists and layout_exists) else "위 누락 파일 목록 참조",
    ) and all_ok

    # 3. PRD·SRS·Project Scope·UI 문서가 존재한다.
    doc_group = {
        "PRD": PRD_DOC,
        "SRS": SRS_DOC,
        "Project Scope": PROJECT_SCOPE_DOC,
    }
    doc_ok = True
    for label, path in doc_group.items():
        exists = path.exists()
        doc_ok = doc_ok and exists
        if not exists:
            missing_files.append(str(path.relative_to(ROOT)))
    ui_doc_found = any(p.exists() for p in UI_DOCS)
    if not ui_doc_found:
        missing_files.extend(str(p.relative_to(ROOT)) for p in UI_DOCS)
    doc_ok = doc_ok and ui_doc_found
    all_ok = run_check(
        "3. PRD·SRS·Project Scope·UI 문서 존재",
        doc_ok,
        "" if doc_ok else "위 누락 파일 목록 참조",
    ) and all_ok

    # 4. D-001 DESIGN.md와 LOCKED Manifest가 존재한다.
    design_md_exists = DESIGN_MD.exists()
    manifest_text = read_text(DESIGN_MANIFEST)
    manifest_exists = manifest_text is not None
    manifest_locked = bool(manifest_text) and "LOCKED" in manifest_text
    if not design_md_exists:
        missing_files.append(str(DESIGN_MD.relative_to(ROOT)))
    if not manifest_exists:
        missing_files.append(str(DESIGN_MANIFEST.relative_to(ROOT)))
    elif not manifest_locked:
        other_issues.append("DESIGN_MANIFEST.md 가 존재하지만 Status가 LOCKED 가 아님")
    all_ok = run_check(
        "4. D-001 DESIGN.md 및 LOCKED Manifest 존재",
        design_md_exists and manifest_exists and manifest_locked,
        "" if (design_md_exists and manifest_exists and manifest_locked) else "위 누락/이슈 목록 참조",
    ) and all_ok

    # 5. SCREEN_ROUTE_CONTRACT.json을 JSON으로 파싱할 수 있다.
    contract_text = read_text(SCREEN_ROUTE_CONTRACT)
    contract: dict = {}
    if contract_text is None:
        missing_files.append(str(SCREEN_ROUTE_CONTRACT.relative_to(ROOT)))
        all_ok = run_check("5. SCREEN_ROUTE_CONTRACT.json JSON 파싱", False, "파일 없음") and all_ok
    else:
        try:
            contract = json.loads(contract_text)
            all_ok = run_check("5. SCREEN_ROUTE_CONTRACT.json JSON 파싱", True) and all_ok
        except json.JSONDecodeError as e:
            other_issues.append(f"SCREEN_ROUTE_CONTRACT.json 파싱 실패: {e}")
            all_ok = run_check("5. SCREEN_ROUTE_CONTRACT.json JSON 파싱", False, str(e)) and all_ok

    screens = contract.get("screens", []) if isinstance(contract, dict) else []

    # 6. Screen 수가 정확히 5개다.
    screen_count_ok = len(screens) == 5
    if not screen_count_ok:
        other_issues.append(f"Screen 수 {len(screens)}개 (기대: 5개)")
    all_ok = run_check(
        "6. Screen 수 정확히 5개",
        screen_count_ok,
        "" if screen_count_ok else f"실제 {len(screens)}개",
    ) and all_ok

    # 7. SCR-001~005가 모두 존재한다.
    screen_ids_present = {s.get("screen_id") for s in screens if isinstance(s, dict)}
    missing_ids = [sid for sid in EXPECTED_SCREEN_IDS if sid not in screen_ids_present]
    missing_screens.extend(missing_ids)
    all_ok = run_check(
        "7. SCR-001~005 모두 존재",
        len(missing_ids) == 0,
        "" if not missing_ids else f"누락: {missing_ids}",
    ) and all_ok

    # 8. Route가 `/`, `/about`, `/travel-tools`, `/mates`, `/account`다.
    routes_present = {s.get("route") for s in screens if isinstance(s, dict)}
    routes_match = routes_present == EXPECTED_ROUTES
    if not routes_match:
        missing_routes = sorted(EXPECTED_ROUTES - routes_present)
        extra_routes = sorted(routes_present - EXPECTED_ROUTES)
        if missing_routes:
            other_issues.append(f"누락된 Route: {missing_routes}")
        if extra_routes:
            other_issues.append(f"예상 밖 Route: {extra_routes}")
    all_ok = run_check(
        "8. Route == {/, /about, /travel-tools, /mates, /account}",
        routes_match,
        "" if routes_match else f"실제: {sorted(routes_present)}",
    ) and all_ok

    # 9. Page Entry가 실제 Next.js App Router 경로 형식이다.
    page_entries = [s.get("page_entry", "") for s in screens if isinstance(s, dict)]
    bad_entries = [pe for pe in page_entries if not pe or not PAGE_ENTRY_PATTERN.match(pe)]
    if bad_entries:
        other_issues.append(f"App Router 경로 형식이 아닌 Page Entry: {bad_entries}")
    all_ok = run_check(
        "9. Page Entry가 Next.js App Router 경로 형식",
        len(bad_entries) == 0,
        "" if not bad_entries else f"위반: {bad_entries}",
    ) and all_ok

    # 10. PROJECT_SCOPE에 REQ-FUNC 80개와 REQ-NF 34개가 모두 등장한다.
    scope_text = read_text(PROJECT_SCOPE_DOC) or ""
    found_ids = set(re.findall(r"REQ-(?:FUNC|NF)-\d{3}", scope_text))
    missing_func = [r for r in REQ_FUNC_EXPECTED if r not in found_ids]
    missing_nf = [r for r in REQ_NF_EXPECTED if r not in found_ids]
    missing_requirements.extend(missing_func)
    missing_requirements.extend(missing_nf)
    req_ok = not missing_func and not missing_nf
    all_ok = run_check(
        "10. PROJECT_SCOPE에 REQ-FUNC 80개·REQ-NF 34개 전수 등장",
        req_ok,
        "" if req_ok else f"REQ-FUNC 누락 {len(missing_func)}건, REQ-NF 누락 {len(missing_nf)}건",
    ) and all_ok

    # 11. AWS·EC2가 활성 기술로 정의되지 않았다.
    scan_targets = {
        "docs/PROJECT_SCOPE.md": PROJECT_SCOPE_DOC,
        "design-reference/D-001/DESIGN.md": DESIGN_MD,
        "design-reference/UI_CONTRACT.md": ROOT / "design-reference" / "UI_CONTRACT.md",
        "design-reference/SCREEN_ROUTE_CONTRACT.json": SCREEN_ROUTE_CONTRACT,
    }
    active_aws_mentions: list[str] = []
    for label, path in scan_targets.items():
        text = read_text(path) or ""
        for line in text.splitlines():
            if AWS_EC2_PATTERN.search(line):
                if not any(marker in line for marker in NEGATION_MARKERS):
                    active_aws_mentions.append(f"{label}: {line.strip()[:120]}")

    aws_deps_found = [d for d in other_issues if d.startswith("package.json에 AWS SDK")]
    aws_clean = not active_aws_mentions and not aws_deps_found
    if active_aws_mentions:
        other_issues.append(f"AWS/EC2가 부정어 없이 언급됨: {active_aws_mentions}")
    all_ok = run_check(
        "11. AWS·EC2가 활성 기술로 정의되지 않음",
        aws_clean,
        "" if aws_clean else f"위반: {active_aws_mentions or aws_deps_found}",
    ) and all_ok

    print("-" * 70)
    if all_ok:
        print("VALIDATE_INPUTS_PASS")
        print(f"검사 통과 수: {pass_count}/{check_count}")
        return 0

    print("VALIDATE_INPUTS_FAIL")
    print(f"검사 통과 수: {pass_count}/{check_count}")
    if missing_files:
        print(f"누락 파일 ({len(missing_files)}건):")
        for f in missing_files:
            print(f"  - {f}")
    if missing_screens:
        print(f"누락 Screen ({len(missing_screens)}건):")
        for s in missing_screens:
            print(f"  - {s}")
    if missing_requirements:
        print(f"누락 Requirement ID ({len(missing_requirements)}건):")
        for r in missing_requirements:
            print(f"  - {r}")
    if other_issues:
        print(f"기타 이슈 ({len(other_issues)}건):")
        for i in other_issues:
            print(f"  - {i}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
