# DB-ACCESS — 서버 DB 접근 계층

- **Category:** DB
- **Implementation Status:** IMPLEMENT
- **Priority:** P0
- **Source:** `TASKS/00_TASK_LIST.md` Seq 34

## Context

이 Task는 Supabase 스키마/정책/접근 계층을 정의하는 DB Task로, 6개 테이블(USER_PROFILE/MATE_POST/MATE_APPLICATION/USER_BLOCK/REPORT/APP_SETTING) 범위 내에서만 동작한다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-FUNC-027; REQ-NF-014,015,016,017

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

- `src/lib/db/client.ts`(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- Supabase 서버 클라이언트 래퍼, 입력 검증·이스케이프 공통 처리, 환경변수로만 키 관리(클라이언트 번들 미포함).

## Visual AC

없음

## Security/Privacy AC

CSRF 방어(Server Actions 기본 Origin 검증), XSS 방지, 비밀키 서버 전용.

## Test Cases

- [ ] Supabase 서버 클라이언트 래퍼, 입력 검증·이스케이프 공통 처리, 환경변수로만 키 관리(클라이언트 번들 미포함).
- [ ] (보안) CSRF 방어(Server Actions 기본 Origin 검증), XSS 방지, 비밀키 서버 전용.

## Verify

코드 리뷰 + 빌드 산출물 키 검색

## Definition of Done

- [ ] Functional AC 전 항목 충족
- [ ] Visual AC 해당 없음
- [ ] Security/Privacy AC 전 항목 충족(해당하는 경우)
- [ ] Test Cases 전 항목 통과
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- 이 Task 범위에서 EXCLUDED 처리된 요구사항(`TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표)을 임의로 구현하지 않는다.
- 구현 코드를 실제로 커밋하거나 Git Branch를 생성하지 않는다(이 문서는 Task 정의 문서다).
- `USER_PROFILE`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`, `APP_SETTING` 6개 테이블 외 테이블을 생성하지 않는다.
- 여행지·안전정보·대표 프로필 등 정적 데이터 대상 테이블을 만들지 않는다.
- Expected Files 목록 밖의 파일을 수정하지 않는다.
