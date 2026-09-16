# CMP-SCR003-HOTEL — 숙소 조건 입력·요약·외부 이동

- **Category:** COMPONENT
- **Implementation Status:** IMPLEMENT
- **Priority:** P1
- **Source:** `TASKS/00_TASK_LIST.md` Seq 17

## Context

이 Task는 SCR-003 화면 내부의 한 영역을 구현하는 Component Task로, 해당 Page Owner Task(PAGE-SCR-003)가 최종적으로 조립한다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-FUNC-019,020,021,022,023,024,025,026

(요구사항 원문은 `docs/06_SRS_UIUX_REVISED.md`, 판정 근거는 `docs/PROJECT_SCOPE.md` 참조)

## Screen / Route / Page Entry

- **Screen:** SCR-003
- **Route:** — (PAGE-SCR003 소유)
- **Page Entry:** — (PAGE-SCR003 소유)

## Design Ref

- `design-reference/D-001/DESIGN.md` — Color/Typography/Spacing/Radius/Shadow 토큰, Section 계약, Empty State 규칙(LOCKED 정본).
- `design-reference/UI_CONTRACT.md` — 해당 Screen의 영역 순서·컴포넌트·상태·이동·금지 기능.
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen·Route·Page Entry 정본(schema `traveler-screen-route-v1`).

## Depends On

- `CMP-SCR003-TABS`

## Expected Files

- `src/components/scr003/HotelForm.tsx`(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- 국가·지역·체크인·체크아웃 필수 입력, 지역 옵션 재계산, 체크아웃≤체크인/과거 체크인 차단(클라이언트 검증), 요약+비전달 고지, "호텔 보러 가기" 새 탭 이동(쿼리 없음), URL 오류 시 재시도.

## Visual AC

56px 입력 필드, 요약 카드는 코랄 CTA 버튼.

## Security/Privacy AC

**입력값은 서버·DB·외부 URL 쿼리에 미전달**(클라이언트 상태 전용).

## Test Cases

- [ ] 국가·지역·체크인·체크아웃 필수 입력, 지역 옵션 재계산, 체크아웃≤체크인/과거 체크인 차단(클라이언트 검증), 요약+비전달 고지, "호텔 보러 가기" 새 탭 이동(쿼리 없음), URL 오류 시 재시도.
- [ ] (보안) **입력값은 서버·DB·외부 URL 쿼리에 미전달**(클라이언트 상태 전용).

## Verify

Unit(UNIT-TRAVEL-DATES) + Playwright(E2E-TRAVEL-TOOLS)

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
