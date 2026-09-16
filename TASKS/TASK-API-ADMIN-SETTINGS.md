# API-ADMIN-SETTINGS — 외부 URL 설정 저장

- **Category:** API
- **Implementation Status:** IMPLEMENT
- **Priority:** P1
- **Source:** `TASKS/00_TASK_LIST.md` Seq 40

## Context

이 Task는 Server Action/Route Handler를 구현하는 API Task로, DB 계층 위에서 화면 Component Task가 호출할 서버 인터페이스를 제공한다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-FUNC-077

(요구사항 원문은 `docs/06_SRS_UIUX_REVISED.md`, 판정 근거는 `docs/PROJECT_SCOPE.md` 참조)

## Screen / Route / Page Entry

- **Screen:** 없음
- **Route:** `/api/admin/settings/outbound`
- **Page Entry:** 없음

## Design Ref

- `design-reference/D-001/DESIGN.md` — Color/Typography/Spacing/Radius/Shadow 토큰, Section 계약, Empty State 규칙(LOCKED 정본).
- `design-reference/UI_CONTRACT.md` — 해당 Screen의 영역 순서·컴포넌트·상태·이동·금지 기능.
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen·Route·Page Entry 정본(schema `traveler-screen-route-v1`).

## Depends On

- `DB-SCHEMA-BASE`
- `DB-ACCESS`

## Expected Files

- `src/app/api/admin/settings/outbound/route.ts`(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- HTTPS 허용목록 내 URL만 `APP_SETTING`에 저장, HTTP/`javascript:`/data URL 거부.

## Visual AC

없음

## Security/Privacy AC

Admin 역할만 호출 가능(서버 역할 검증).

## Test Cases

- [ ] HTTPS 허용목록 내 URL만 `APP_SETTING`에 저장, HTTP/`javascript:`/data URL 거부.
- [ ] (보안) Admin 역할만 호출 가능(서버 역할 검증).

## Verify

수동 확인

## Definition of Done

- [ ] Functional AC 전 항목 충족
- [ ] Visual AC 해당 없음
- [ ] Security/Privacy AC 전 항목 충족(해당하는 경우)
- [ ] Test Cases 전 항목 통과
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- 이 Task 범위에서 EXCLUDED 처리된 요구사항(`TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표)을 임의로 구현하지 않는다.
- 구현 코드를 실제로 커밋하거나 Git Branch를 생성하지 않는다(이 문서는 Task 정의 문서다).
- 정의된 6개 DB 테이블 범위를 벗어나는 스키마 변경을 하지 않는다.
- 항공·호텔 조건 입력값을 서버에 저장하는 엔드포인트를 만들지 않는다(해당 없음, 대상 API가 아니면 무시).
- Expected Files 목록 밖의 파일을 수정하지 않는다.
