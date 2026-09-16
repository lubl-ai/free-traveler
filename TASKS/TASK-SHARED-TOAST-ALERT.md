# SHARED-TOAST-ALERT — Toast·Alert 컴포넌트

- **Category:** SHARED
- **Implementation Status:** IMPLEMENT(축소)
- **Priority:** P2
- **Source:** `TASKS/00_TASK_LIST.md` Seq 44

## Context

이 Task는 5개 Screen이 공통으로 사용하는 전역 요소를 구현하는 Shared Task다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT(축소)** — 지정된 축소 범위 내에서만 구현(전체 기능이 아님).

## Requirement Ref

REQ-FUNC-043

(요구사항 원문은 `docs/06_SRS_UIUX_REVISED.md`, 판정 근거는 `docs/PROJECT_SCOPE.md` 참조)

## Screen / Route / Page Entry

- **Screen:** 전역
- **Route:** 전역(5개 Route 공통)
- **Page Entry:** `src/app/layout.tsx`(기존 파일 수정)

## Design Ref

- `design-reference/D-001/DESIGN.md` — Color/Typography/Spacing/Radius/Shadow 토큰, Section 계약, Empty State 규칙(LOCKED 정본).
- `design-reference/UI_CONTRACT.md` — 해당 Screen의 영역 순서·컴포넌트·상태·이동·금지 기능.
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen·Route·Page Entry 정본(schema `traveler-screen-route-v1`).

## Depends On

- `SHARED-DESIGN-TOKENS`

## Expected Files

- `src/components/shared/Toast.tsx`(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- 참가 요청 접수·승인·거절·신고 처리 결과를 인앱 Toast로 표시(실제 이메일 발송 없음).

## Visual AC

`ink` 배경+흰 텍스트, `shadow.floating`.

## Security/Privacy AC

없음.

## Test Cases

- [ ] 참가 요청 접수·승인·거절·신고 처리 결과를 인앱 Toast로 표시(실제 이메일 발송 없음).
- [ ] (보안) 없음.

## Verify

수동 확인

## Definition of Done

- [ ] Functional AC 전 항목 충족
- [ ] Visual AC 전 항목 충족(해당하는 경우)
- [ ] Security/Privacy AC 전 항목 충족(해당하는 경우)
- [ ] Test Cases 전 항목 통과
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- 이 Task 범위에서 EXCLUDED 처리된 요구사항(`TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표)을 임의로 구현하지 않는다.
- 구현 코드를 실제로 커밋하거나 Git Branch를 생성하지 않는다(이 문서는 Task 정의 문서다).
- Airbnb 상표 요소, 구매·예약·결제 UI를 추가하지 않는다.
- Proprietary 폰트 파일을 저장소에 포함하지 않는다.
- Expected Files 목록 밖의 파일을 수정하지 않는다.
