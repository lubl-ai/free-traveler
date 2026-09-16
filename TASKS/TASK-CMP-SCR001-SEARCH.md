# CMP-SCR001-SEARCH — 검색·테마 필터

- **Category:** COMPONENT
- **Implementation Status:** IMPLEMENT
- **Priority:** P1
- **Source:** `TASKS/00_TASK_LIST.md` Seq 6

## Context

이 Task는 SCR-001 화면 내부의 한 영역을 구현하는 Component Task로, 해당 Page Owner Task(PAGE-SCR-001)가 최종적으로 조립한다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-FUNC-002,003

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

- `DATA-DESTINATIONS`

## Expected Files

- `src/components/scr001/SearchFilterBar.tsx`(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- 여행지명·국가명·테마 키워드 한글 부분 일치 검색.
- 국가·도시·계절·테마·기간 필터는 AND 조건, 정적 데이터(`DATA-DESTINATIONS`)에 대해 클라이언트 필터링.

## Visual AC

검색창은 pill 형태(`rounded.full`), 테마 Chip은 선택 시 코랄 배경.

## Security/Privacy AC

서버 요청 없음(클라이언트 필터).

## Test Cases

- [ ] 여행지명·국가명·테마 키워드 한글 부분 일치 검색.
- [ ] 국가·도시·계절·테마·기간 필터는 AND 조건, 정적 데이터(`DATA-DESTINATIONS`)에 대해 클라이언트 필터링.
- [ ] (보안) 서버 요청 없음(클라이언트 필터).

## Verify

수동 확인 + Playwright(E2E-PUBLIC-SMOKE)

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
