# DB-SEED-BASE — 로컬/개발 Seed 데이터

- **Category:** DB
- **Implementation Status:** IMPLEMENT
- **Priority:** P2
- **Source:** `TASKS/00_TASK_LIST.md` Seq 35

## Context

이 Task는 Supabase 스키마/정책/접근 계층을 정의하는 DB Task로, 6개 테이블(USER_PROFILE/MATE_POST/MATE_APPLICATION/USER_BLOCK/REPORT/APP_SETTING) 범위 내에서만 동작한다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

— (테스트 지원용, 직접 연결 REQ 없음)

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

- `DB-SCHEMA-BASE`

## Expected Files

- `supabase/seed.sql`(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- 개발·테스트용 최소 Seed(테스트 계정 2~3개, 동행글 3~5개, 신고 1~2건)로 E2E/RLS 테스트 지원.

## Visual AC

없음

## Security/Privacy AC

실제 개인정보 미포함(더미 데이터만).

## Test Cases

- [ ] 개발·테스트용 최소 Seed(테스트 계정 2~3개, 동행글 3~5개, 신고 1~2건)로 E2E/RLS 테스트 지원.
- [ ] (보안) 실제 개인정보 미포함(더미 데이터만).

## Verify

DB(TEST-RLS-BASIC), Playwright

## Definition of Done

- [ ] Functional AC 전 항목 충족
- [ ] Visual AC 해당 없음
- [ ] Security/Privacy AC 전 항목 충족(해당하는 경우)
- [ ] Test Cases 전 항목 통과
- [ ] Expected Files 목록 외 파일 변경 없음
- [ ] `DB-SCHEMA-BASE`가 완료된 상태(6개 테이블 생성 완료)에서 Seed 데이터 삽입 확인

## Forbidden

- 이 Task 범위에서 EXCLUDED 처리된 요구사항(`TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표)을 임의로 구현하지 않는다.
- 구현 코드를 실제로 커밋하거나 Git Branch를 생성하지 않는다(이 문서는 Task 정의 문서다).
- `USER_PROFILE`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`, `APP_SETTING` 6개 테이블 외 테이블을 생성하지 않는다.
- 여행지·안전정보·대표 프로필 등 정적 데이터 대상 테이블을 만들지 않는다.
- Expected Files 목록 밖의 파일을 수정하지 않는다.
