# DATA-DESTINATIONS — 여행지 정적 데이터

- **Category:** DATA
- **Implementation Status:** IMPLEMENT
- **Priority:** P0
- **Source:** `TASKS/00_TASK_LIST.md` Seq 29

## Context

이 Task는 DB가 아닌 TypeScript 정적 데이터 모듈을 작성하는 Data Task로, 여러 Screen의 Component/Page Owner Task가 이 데이터를 참조한다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-FUNC-001,002,004,005,007,008,009; REQ-NF-006,026

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

없음

## Expected Files

- `src/data/destinations.ts`(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- **지정 구현 방법: DB가 아닌 TypeScript 정적 데이터 모듈**.
- 국내 10개 이상, 해외 15개국 30개 도시 이상.
- 각 항목 필수 필드(소개 300자 이상, 명소 5개 이상, 1일/3일 일정, 예산, 교통, 음식 3개 이상, 에티켓 3개 이상, 출처·수정일)를 타입으로 강제.

## Visual AC

없음

## Security/Privacy AC

없음(공개 정적 콘텐츠).

## Test Cases

- [ ] **지정 구현 방법: DB가 아닌 TypeScript 정적 데이터 모듈**.
- [ ] 국내 10개 이상, 해외 15개국 30개 도시 이상.
- [ ] 각 항목 필수 필드(소개 300자 이상, 명소 5개 이상, 1일/3일 일정, 예산, 교통, 음식 3개 이상, 에티켓 3개 이상, 출처·수정일)를 타입으로 강제.
- [ ] (보안) 없음(공개 정적 콘텐츠).

## Verify

TypeScript 타입 체크 + 데이터 카운트 스크립트(GOV-CONTENT-COMPLETENESS)

## Definition of Done

- [ ] Functional AC 전 항목 충족
- [ ] Visual AC 해당 없음
- [ ] Security/Privacy AC 전 항목 충족(해당하는 경우)
- [ ] Test Cases 전 항목 통과
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- 이 Task 범위에서 EXCLUDED 처리된 요구사항(`TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표)을 임의로 구현하지 않는다.
- 구현 코드를 실제로 커밋하거나 Git Branch를 생성하지 않는다(이 문서는 Task 정의 문서다).
- DB 테이블을 생성하지 않는다(정적 데이터는 DB-SCHEMA-BASE의 6개 테이블에 포함되지 않는다).
- Expected Files 목록 밖의 파일을 수정하지 않는다.
