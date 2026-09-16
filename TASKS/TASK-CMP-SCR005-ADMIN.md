# CMP-SCR005-ADMIN — 신고 상태 변경·외부 URL 설정

- **Category:** COMPONENT
- **Implementation Status:** IMPLEMENT(축소)
- **Priority:** P1
- **Source:** `TASKS/00_TASK_LIST.md` Seq 28

## Context

이 Task는 SCR-005 화면 내부의 한 영역을 구현하는 Component Task로, 해당 Page Owner Task(PAGE-SCR-005)가 최종적으로 조립한다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT(축소)** — 지정된 축소 범위 내에서만 구현(전체 기능이 아님).

## Requirement Ref

REQ-FUNC-041,042,077

(요구사항 원문은 `docs/06_SRS_UIUX_REVISED.md`, 판정 근거는 `docs/PROJECT_SCOPE.md` 참조)

## Screen / Route / Page Entry

- **Screen:** SCR-005
- **Route:** — (PAGE-SCR005 소유)
- **Page Entry:** — (PAGE-SCR005 소유)

## Design Ref

- `design-reference/D-001/DESIGN.md` — Color/Typography/Spacing/Radius/Shadow 토큰, Section 계약, Empty State 규칙(LOCKED 정본).
- `design-reference/UI_CONTRACT.md` — 해당 Screen의 영역 순서·컴포넌트·상태·이동·금지 기능.
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen·Route·Page Entry 정본(schema `traveler-screen-route-v1`).

## Depends On

- `API-REPORTS`
- `API-ADMIN-SETTINGS`

## Expected Files

- `src/components/scr005/AdminTab.tsx`(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- 신고 목록(OPEN/RESOLVED/DISMISSED 상태 필터·변경), 항공·숙소 외부 URL 설정 Form(HTTPS 허용목록 내에서만 저장, `javascript:`/HTTP 거부).
- Admin 권한 없는 사용자에게는 이 탭 자체를 렌더링하지 않음.

## Visual AC

Form 입력 56px, 저장 버튼 코랄.

## Security/Privacy AC

Admin 역할이 아닌 사용자의 접근은 서버에서도 차단(RLS/역할 검증).

## Test Cases

- [ ] 신고 목록(OPEN/RESOLVED/DISMISSED 상태 필터·변경), 항공·숙소 외부 URL 설정 Form(HTTPS 허용목록 내에서만 저장, `javascript:`/HTTP 거부).
- [ ] Admin 권한 없는 사용자에게는 이 탭 자체를 렌더링하지 않음.
- [ ] (보안) Admin 역할이 아닌 사용자의 접근은 서버에서도 차단(RLS/역할 검증).

## Verify

수동 확인(HTTP/`javascript:` 입력 시 저장 거부)

## Definition of Done

- [ ] Functional AC 전 항목 충족
- [ ] Visual AC 전 항목 충족(해당하는 경우)
- [ ] Security/Privacy AC 전 항목 충족(해당하는 경우)
- [ ] Test Cases 전 항목 통과
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- 이 Task 범위에서 EXCLUDED 처리된 요구사항(`TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표)을 임의로 구현하지 않는다.
- 구현 코드를 실제로 커밋하거나 Git Branch를 생성하지 않는다(이 문서는 Task 정의 문서다).
- 이 컴포넌트가 속하지 않은 다른 Screen의 Page Entry를 직접 수정하지 않는다.
- Expected Files 목록 밖의 파일을 수정하지 않는다.
