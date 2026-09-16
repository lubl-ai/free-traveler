# E2E-PUBLIC-SMOKE — 공개 열람 Smoke(SCR-001/002/004)

- **Category:** E2E
- **Implementation Status:** IMPLEMENT
- **Priority:** P1
- **Source:** `TASKS/00_TASK_LIST.md` Seq 54

## Context

이 Task는 Playwright Chromium 기반으로 핵심 사용자 흐름을 검증하는 E2E Smoke Test Task다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-FUNC-001,004,006,046,057; REQ-NF-019

(요구사항 원문은 `docs/06_SRS_UIUX_REVISED.md`, 판정 근거는 `docs/PROJECT_SCOPE.md` 참조)

## Screen / Route / Page Entry

- **Screen:** SCR-001, SCR-002, SCR-004
- **Route:** `/`, `/about`, `/mates`
- **Page Entry:** 없음

## Design Ref

- `design-reference/D-001/DESIGN.md` — Color/Typography/Spacing/Radius/Shadow 토큰, Section 계약, Empty State 규칙(LOCKED 정본).
- `design-reference/UI_CONTRACT.md` — 해당 Screen의 영역 순서·컴포넌트·상태·이동·금지 기능.
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen·Route·Page Entry 정본(schema `traveler-screen-route-v1`).

## Depends On

- `PAGE-SCR001`
- `PAGE-SCR002`
- `PAGE-SCR004`

## Expected Files

- `tests/e2e/public-smoke.spec.ts`(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- **Chromium 단일 브라우저**로 5~7개 핵심 흐름 검증: 여행지 목록→상세 Drawer, 안전정보 Drawer, 대표 소개 열람, 동행 목록 열람, SCR-001 Mobile(390px) 반응형 확인.
- 다른 브라우저·성능·부하 테스트 범위는 포함하지 않음.

## Visual AC

없음

## Security/Privacy AC

없음(공개 화면).

## Test Cases

- [ ] **Chromium 단일 브라우저**로 5~7개 핵심 흐름 검증: 여행지 목록→상세 Drawer, 안전정보 Drawer, 대표 소개 열람, 동행 목록 열람, SCR-001 Mobile(390px) 반응형 확인.
- [ ] 다른 브라우저·성능·부하 테스트 범위는 포함하지 않음.
- [ ] (보안) 없음(공개 화면).

## Verify

`npx playwright test`(Chromium)

## Definition of Done

- [ ] Functional AC 전 항목 충족
- [ ] Visual AC 해당 없음
- [ ] Security/Privacy AC 전 항목 충족(해당하는 경우)
- [ ] Test Cases 전 항목 통과
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- 이 Task 범위에서 EXCLUDED 처리된 요구사항(`TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표)을 임의로 구현하지 않는다.
- 구현 코드를 실제로 커밋하거나 Git Branch를 생성하지 않는다(이 문서는 Task 정의 문서다).
- Chromium 외 브라우저(Firefox/WebKit/Safari)를 테스트 매트릭스에 추가하지 않는다.
- 성능·부하 테스트(Lighthouse, 동시 사용자 부하 등)로 범위를 확장하지 않는다.
- Expected Files 목록 밖의 파일을 수정하지 않는다.
