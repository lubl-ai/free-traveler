# CI-PIPELINE — CI 게이트(typecheck/lint/test)

- **Category:** CI
- **Implementation Status:** IMPLEMENT
- **Priority:** P2
- **Source:** `TASKS/00_TASK_LIST.md` Seq 57

## Context

이 Task는 병합 전 게이트를 구성하는 CI Task다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-NF-031

(요구사항 원문은 `docs/06_SRS_UIUX_REVISED.md`, 판정 근거는 `docs/PROJECT_SCOPE.md` 참조)

## Screen / Route / Page Entry

- **Screen:** 없음
- **Route:** 없음
- **Page Entry:** 없음

## Design Ref

- `design-reference/D-001/DESIGN.md` — Color/Typography/Spacing/Radius/Shadow 토큰, Section 계약, Empty State 규칙(LOCKED 정본).
- `design-reference/UI_CONTRACT.md` — 해당 Screen의 영역 순서·컴포넌트·상태·이동·금지 기능.
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen·Route·Page Entry 정본(schema `traveler-screen-route-v1`).

## Depends On

- `UNIT-TRAVEL-DATES`
- `UNIT-CONTACT-DETECTION`
- `UNIT-MATE-STATE`
- `TEST-RLS-BASIC`
- `E2E-PUBLIC-SMOKE`
- `E2E-TRAVEL-TOOLS`
- `E2E-MATE-AUTH`
- `GOV-CONTENT-COMPLETENESS`

## Expected Files

- `.github/workflows/ci.yml` 또는 Vercel 빌드 훅(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- TypeScript strict, ESLint, Unit/Integration/E2E 테스트, 콘텐츠 완전성 스크립트를 main 병합 전 게이트로 실행.

## Visual AC

없음

## Security/Privacy AC

없음.

## Test Cases

- [ ] TypeScript strict, ESLint, Unit/Integration/E2E 테스트, 콘텐츠 완전성 스크립트를 main 병합 전 게이트로 실행.
- [ ] (보안) 없음.

## Verify

CI 실행 결과(그린)

## Definition of Done

- [ ] Functional AC 전 항목 충족
- [ ] Visual AC 해당 없음
- [ ] Security/Privacy AC 전 항목 충족(해당하는 경우)
- [ ] Test Cases 전 항목 통과
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- 이 Task 범위에서 EXCLUDED 처리된 요구사항(`TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표)을 임의로 구현하지 않는다.
- 구현 코드를 실제로 커밋하거나 Git Branch를 생성하지 않는다(이 문서는 Task 정의 문서다).
- EC2·AWS 등 별도 인프라를 구성하지 않는다(Vercel/Supabase 전제 유지).
- 자동 Merge Runner를 구성하지 않는다.
- Expected Files 목록 밖의 파일을 수정하지 않는다.
