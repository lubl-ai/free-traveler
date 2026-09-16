# CMP-SCR001-DESTINATION-DRAWER — 여행지 상세 Drawer

- **Category:** COMPONENT
- **Implementation Status:** IMPLEMENT
- **Priority:** P1
- **Source:** `TASKS/00_TASK_LIST.md` Seq 8

## Context

이 Task는 SCR-001 화면 내부의 한 영역을 구현하는 Component Task로, 해당 Page Owner Task(PAGE-SCR-001)가 최종적으로 조립한다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-FUNC-004,006,007,009

(요구사항 원문은 `docs/06_SRS_UIUX_REVISED.md`, 판정 근거는 `docs/PROJECT_SCOPE.md` 참조)

## Screen / Route / Page Entry

- **Screen:** SCR-001
- **Route:** — (PAGE-SCR001 소유)
- **Page Entry:** — (PAGE-SCR001 소유)

## Design Ref

- `design-reference/D-001/DESIGN.md` — Color/Typography/Spacing/Radius/Shadow 토큰, Section 계약, Empty State 규칙(LOCKED 정본).
- `design-reference/UI_CONTRACT.md` — 해당 Screen의 영역 순서·컴포넌트·상태·이동·금지 기능.
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen·Route·Page Entry 정본(schema `traveler-screen-route-v1`).

## Depends On

- `CMP-SCR001-DESTINATION-GRID`
- `DATA-DESTINATIONS`
- `DATA-SAFETY`
- `SHARED-DESIGN-TOKENS`

## Expected Files

- `src/components/scr001/DestinationDrawer.tsx`(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- 소개 300자 이상, 명소 5개 이상, 1일/3일 일정, 예산, 교통, 음식 3개 이상, 에티켓 3개 이상, 출처·수정일 표시.
- 해외 여행지는 "국가 안전정보 보기" 링크로 같은 Drawer 스택에서 안전정보로 전환.

## Visual AC

Desktop 우측 슬라이드 480px, Mobile 하단 Sheet. `Esc`와 닫기 버튼으로 닫기 가능.

## Security/Privacy AC

없음.

## Test Cases

- [ ] 소개 300자 이상, 명소 5개 이상, 1일/3일 일정, 예산, 교통, 음식 3개 이상, 에티켓 3개 이상, 출처·수정일 표시.
- [ ] 해외 여행지는 "국가 안전정보 보기" 링크로 같은 Drawer 스택에서 안전정보로 전환.
- [ ] (보안) 없음.

## Verify

수동 확인 + Playwright

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
