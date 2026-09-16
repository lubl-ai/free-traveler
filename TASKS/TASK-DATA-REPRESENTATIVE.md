# DATA-REPRESENTATIVE — 대표(free_traveler) 정적 데이터

- **Category:** DATA
- **Implementation Status:** IMPLEMENT
- **Priority:** P0
- **Source:** `TASKS/00_TASK_LIST.md` Seq 31

## Context

이 Task는 DB가 아닌 TypeScript 정적 데이터 모듈을 작성하는 Data Task로, 여러 Screen의 Component/Page Owner Task가 이 데이터를 참조한다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-FUNC-057,058,059,060,061,062,063

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

- `src/data/representative.ts`(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- 대표명·`50+ Trips`·`30+ Countries`·소개문·철학·타임라인(6개 이상)·방문국가(30개 이상)·이미지(alt+출처)·SNS 링크·추천 여행지 4~6개를 단일 데이터 소스로 관리(전역에서 값 일관성 보장).

## Visual AC

없음

## Security/Privacy AC

없음(공개 정적 콘텐츠).

## Test Cases

- [ ] 대표명·`50+ Trips`·`30+ Countries`·소개문·철학·타임라인(6개 이상)·방문국가(30개 이상)·이미지(alt+출처)·SNS 링크·추천 여행지 4~6개를 단일 데이터 소스로 관리(전역에서 값 일관성 보장).
- [ ] (보안) 없음(공개 정적 콘텐츠).

## Verify

데이터 카운트 스크립트(타임라인≥6, 국가≥30)

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
