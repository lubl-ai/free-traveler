# DATA-SAFETY — 국가 안전정보 정적 데이터

- **Category:** DATA
- **Implementation Status:** IMPLEMENT
- **Priority:** P0
- **Source:** `TASKS/00_TASK_LIST.md` Seq 30

## Context

이 Task는 DB가 아닌 TypeScript 정적 데이터 모듈을 작성하는 Data Task로, 여러 Screen의 Component/Page Owner Task가 이 데이터를 참조한다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-FUNC-046,047,048,049,051,052,053,054; REQ-NF-027,028

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

- `src/data/safety.ts`(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- 소개되는 모든 해외 국가에 안전정보 등록, 8개 카테고리·출처·최종확인일·경보 범위(`scopeType`/`scopeText`) 필드 포함.
- `verified_at`은 stale 계산을 위해 ISO 날짜로 저장.

## Visual AC

없음

## Security/Privacy AC

없음(공개 정적 콘텐츠).

## Test Cases

- [ ] 소개되는 모든 해외 국가에 안전정보 등록, 8개 카테고리·출처·최종확인일·경보 범위(`scopeType`/`scopeText`) 필드 포함.
- [ ] `verified_at`은 stale 계산을 위해 ISO 날짜로 저장.
- [ ] (보안) 없음(공개 정적 콘텐츠).

## Verify

데이터 카운트 스크립트(해외 국가 수 = 안전정보 수)

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
