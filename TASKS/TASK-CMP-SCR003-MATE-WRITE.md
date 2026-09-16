# CMP-SCR003-MATE-WRITE — 동행 작성 Form 또는 로그인 안내

- **Category:** COMPONENT
- **Implementation Status:** IMPLEMENT
- **Priority:** P1
- **Source:** `TASKS/00_TASK_LIST.md` Seq 18

## Context

이 Task는 SCR-003 화면 내부의 한 영역을 구현하는 Component Task로, 해당 Page Owner Task(PAGE-SCR-003)가 최종적으로 조립한다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-FUNC-027,028,029,031,032,080

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
- `API-MATE-POSTS`
- `API-AUTH-ADULT-VERIFY`

## Expected Files

- `src/components/scr003/MateWriteForm.tsx`(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- 비로그인/성인 미확인 시 로그인 안내 카드(`/account` 로그인 탭 링크)로 대체.
- 인증 회원은 제목·국가·지역·기간·인원·조건·스타일·설명·안전수칙 동의 Form.
- **지정 구현 방법: 연락처 탐지는 정규식 기반 클라이언트+서버 이중 검증**, 탐지 시 제출 차단+수정 안내.

## Visual AC

Info Card는 `info` 톤(코랄 아님).

## Security/Privacy AC

로그인+성인 확인 없이는 제출 불가(서버 재검증 필수).

## Test Cases

- [ ] 비로그인/성인 미확인 시 로그인 안내 카드(`/account` 로그인 탭 링크)로 대체.
- [ ] 인증 회원은 제목·국가·지역·기간·인원·조건·스타일·설명·안전수칙 동의 Form.
- [ ] **지정 구현 방법: 연락처 탐지는 정규식 기반 클라이언트+서버 이중 검증**, 탐지 시 제출 차단+수정 안내.
- [ ] (보안) 로그인+성인 확인 없이는 제출 불가(서버 재검증 필수).

## Verify

Unit(UNIT-CONTACT-DETECTION) + Playwright(E2E-MATE-AUTH)

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
