# UNIT-CONTACT-DETECTION — 연락처 탐지 Unit Test

- **Category:** UNIT_TEST
- **Implementation Status:** IMPLEMENT
- **Priority:** P1
- **Source:** `TASKS/00_TASK_LIST.md` Seq 51

## Context

이 Task는 특정 로직(날짜 검증/연락처 탐지/상태 전이)의 정확성을 보장하는 Unit Test Task다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-FUNC-032

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

- `CMP-SCR003-MATE-WRITE`

## Expected Files

- `src/lib/__tests__/contact-detection.test.ts`(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- 전화번호·이메일·메신저 ID 패턴 샘플셋 기준 탐지율 검증(목표 95% 이상, 오탐 5% 이하).

## Visual AC

없음

## Security/Privacy AC

없음.

## Test Cases

- [ ] 전화번호·이메일·메신저 ID 패턴 샘플셋 기준 탐지율 검증(목표 95% 이상, 오탐 5% 이하).
- [ ] (보안) 없음.

## Verify

`npm test`

## Definition of Done

- [ ] Functional AC 전 항목 충족
- [ ] Visual AC 해당 없음
- [ ] Security/Privacy AC 전 항목 충족(해당하는 경우)
- [ ] Test Cases 전 항목 통과
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- 이 Task 범위에서 EXCLUDED 처리된 요구사항(`TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표)을 임의로 구현하지 않는다.
- 구현 코드를 실제로 커밋하거나 Git Branch를 생성하지 않는다(이 문서는 Task 정의 문서다).
- 실제 화면/서버 구현 코드를 이 Task에서 변경하지 않는다(테스트 코드만 작성).
- Expected Files 목록 밖의 파일을 수정하지 않는다.
