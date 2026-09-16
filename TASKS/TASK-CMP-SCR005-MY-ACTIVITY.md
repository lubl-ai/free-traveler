# CMP-SCR005-MY-ACTIVITY — 내 글·참가 요청·차단 목록

- **Category:** COMPONENT
- **Implementation Status:** IMPLEMENT
- **Priority:** P1
- **Source:** `TASKS/00_TASK_LIST.md` Seq 27

## Context

이 Task는 SCR-005 화면 내부의 한 영역을 구현하는 Component Task로, 해당 Page Owner Task(PAGE-SCR-005)가 최종적으로 조립한다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-FUNC-036,038,040,068

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

- `API-MATE-POSTS`
- `API-MATE-APPLICATIONS`
- `API-USER-BLOCKS`

## Expected Files

- `src/components/scr005/MyActivityTab.tsx`(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- 내 글(수정/마감/삭제, 데이터 없으면 완성형 Empty State+작성 CTA), 참가 요청(보낸/받은, 승인/거절 버튼), 차단 목록(완성형 Empty State: "차단한 사용자가 없어요"+설명), 즐겨찾기 목록(`localStorage` 연동).

## Visual AC

각 하위 목록 Card 동일한 시각 언어(`rounded.md`).

## Security/Privacy AC

비작성자의 승인/거절 시도는 403.

## Test Cases

- [ ] 내 글(수정/마감/삭제, 데이터 없으면 완성형 Empty State+작성 CTA), 참가 요청(보낸/받은, 승인/거절 버튼), 차단 목록(완성형 Empty State: "차단한 사용자가 없어요"+설명), 즐겨찾기 목록(`localStorage` 연동).
- [ ] (보안) 비작성자의 승인/거절 시도는 403.

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
