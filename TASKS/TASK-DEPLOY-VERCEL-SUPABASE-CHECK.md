# DEPLOY-VERCEL-SUPABASE-CHECK — Vercel/Supabase 배포 확인

- **Category:** DEPLOY
- **Implementation Status:** IMPLEMENT
- **Priority:** P2
- **Source:** `TASKS/00_TASK_LIST.md` Seq 58

## Context

이 Task는 Vercel/Supabase 배포 상태를 확인하는 Deploy Task다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-NF-012,016,034

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

- `CI-PIPELINE`

## Expected Files

- `vercel.json`(선택), 배포 체크리스트 문서(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- Vercel 배포 후 5개 Route 접근 가능 확인, 환경변수(Supabase URL/Key, 외부 URL)가 Vercel 프로젝트 설정에만 존재하고 클라이언트 번들에 노출되지 않는지 확인, TLS 적용 확인, 월 비용이 무료/저가 티어 범위인지 확인.
- **EC2·AWS 등 별도 인프라는 구성하지 않음.**

## Visual AC

없음

## Security/Privacy AC

비밀키 클라이언트 노출 0건.

## Test Cases

- [ ] Vercel 배포 후 5개 Route 접근 가능 확인, 환경변수(Supabase URL/Key, 외부 URL)가 Vercel 프로젝트 설정에만 존재하고 클라이언트 번들에 노출되지 않는지 확인, TLS 적용 확인, 월 비용이 무료/저가 티어 범위인지 확인.
- [ ] **EC2·AWS 등 별도 인프라는 구성하지 않음.**
- [ ] (보안) 비밀키 클라이언트 노출 0건.

## Verify

수동 확인(배포 후 브라우저 점검)

## Definition of Done

- [ ] Functional AC 전 항목 충족
- [ ] Visual AC 해당 없음
- [ ] Security/Privacy AC 전 항목 충족(해당하는 경우)
- [ ] Test Cases 전 항목 통과
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- 이 Task 범위에서 EXCLUDED 처리된 요구사항(`TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표)을 임의로 구현하지 않는다.
- 구현 코드를 실제로 커밋하거나 Git Branch를 생성하지 않는다(이 문서는 Task 정의 문서다).
- EC2·AWS 등 별도 인프라를 구성하지 않는다.
- 자동 Merge Runner를 구성하지 않는다.
- Expected Files 목록 밖의 파일을 수정하지 않는다.
