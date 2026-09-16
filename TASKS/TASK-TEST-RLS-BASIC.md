# TEST-RLS-BASIC — RLS 정책 기본 검증

- **Category:** INTEGRATION_TEST
- **Implementation Status:** IMPLEMENT
- **Priority:** P1
- **Source:** `TASKS/00_TASK_LIST.md` Seq 53

## Context

이 Task는 Supabase RLS 정책이 의도대로 동작하는지 검증하는 Integration Test Task다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-FUNC-044; REQ-NF-013

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

- `DB-RLS-BASE`
- `DB-SEED-BASE`

## Expected Files

- `supabase/tests/rls_basic.sql` 또는 `scripts/test_rls.py`(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- 권한별(Guest/Adult Member/Owner/Moderator/Admin) 부정 접근 테스트가 전부 403 또는 빈 결과인지 확인.

## Visual AC

없음

## Security/Privacy AC

RLS 우회 0건.

## Test Cases

- [ ] 권한별(Guest/Adult Member/Owner/Moderator/Admin) 부정 접근 테스트가 전부 403 또는 빈 결과인지 확인.
- [ ] (보안) RLS 우회 0건.

## Verify

DB 정책 테스트 실행

## Definition of Done

- [ ] Functional AC 전 항목 충족
- [ ] Visual AC 해당 없음
- [ ] Security/Privacy AC 전 항목 충족(해당하는 경우)
- [ ] Test Cases 전 항목 통과
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- 이 Task 범위에서 EXCLUDED 처리된 요구사항(`TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표)을 임의로 구현하지 않는다.
- 구현 코드를 실제로 커밋하거나 Git Branch를 생성하지 않는다(이 문서는 Task 정의 문서다).
- RLS 정책 자체를 이 Task에서 변경하지 않는다(DB-RLS-BASE의 산출물을 검증만 한다).
- Expected Files 목록 밖의 파일을 수정하지 않는다.
