# PAGE-SCR004 — SCR-004 동행 조회 화면 조립

- **Category:** PAGE
- **Implementation Status:** IMPLEMENT
- **Priority:** P1
- **Source:** `TASKS/00_TASK_LIST.md` Seq 4

## Context

이 Task는 SCR-004 Route(`/mates`)의 Page Owner Task로, 하위 Component/Data/API/Shared Task가 만든 결과물을 `src/app/mates/page.tsx`(신규 생성) 안에서 실제 Route Page로 조립하는 책임만 진다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-FUNC-030,033,034,035,036,037,039,040,079,080

(요구사항 원문은 `docs/06_SRS_UIUX_REVISED.md`, 판정 근거는 `docs/PROJECT_SCOPE.md` 참조)

## Screen / Route / Page Entry

- **Screen:** SCR-004
- **Route:** `/mates`
- **Page Entry:** `src/app/mates/page.tsx`(신규 생성)

## Design Ref

- `design-reference/D-001/DESIGN.md` — Color/Typography/Spacing/Radius/Shadow 토큰, Section 계약, Empty State 규칙(LOCKED 정본).
- `design-reference/UI_CONTRACT.md` — 해당 Screen의 영역 순서·컴포넌트·상태·이동·금지 기능.
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen·Route·Page Entry 정본(schema `traveler-screen-route-v1`).

## Depends On

- `CMP-SCR004-FILTER`
- `CMP-SCR004-LIST`
- `CMP-SCR004-DETAIL`
- `CMP-SCR004-APPLICATION`
- `CMP-SCR004-REPORT`
- `CMP-SCR004-BLOCK`
- `SHARED-HEADER-FOOTER`

## Expected Files

- `src/app/mates/page.tsx`(신규 생성)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- Section 순서(고정): ① Intro(목적 설명)+작성 CTA(`/travel-tools` 동행 탭 이동) → ② 검색 Filter(CMP-SCR004-FILTER)+결과 요약 텍스트("총 N건") → ③ 동행글 목록 최대 8개 우선 노출(CMP-SCR004-LIST, 데이터 없으면 완성형 Empty State: 필터 초기화+작성 CTA+이용 방법) → ④ 목록+상세 분할(Desktop, CMP-SCR004-DETAIL)/목록→Drawer(Mobile) → ⑤ 참가 신청 방법 3단계(정적 텍스트+CMP-SCR004-APPLICATION 연동) → ⑥ 안전·신고(CMP-SCR004-REPORT)·차단(CMP-SCR004-BLOCK) 안내와 `/travel-tools` CTA.
- ②③ Filter·목록은 `API-MATE-POSTS` 조회 중 스켈레톤 Loading을 표시하고(레이아웃 점프 금지), 조회 실패 시 `danger` 텍스트+재시도 버튼을 표시한다(`design-reference/D-001/DESIGN.md` §Loading·Empty·Error).

## Visual AC

Desktop 콘텐츠 폭 1240px(목록 40%+상세 60% 분할), 여백 64~80px; Mobile 1열, 카드 탭 시 하단 Drawer.

## Security/Privacy AC

참가 요청·신고·차단은 로그인+성인 확인 필요, 비로그인 시 `/account` 로그인 탭 안내. 모집글 응답에 연락처(전화번호·이메일·메신저 ID) 미포함. Supabase RLS로 본인/작성자/Moderator만 비공개 데이터 열람.

## Test Cases

- [ ] Section 순서(고정): ① Intro(목적 설명)+작성 CTA(`/travel-tools` 동행 탭 이동) → ② 검색 Filter(CMP-SCR004-FILTER)+결과 요약 텍스트("총 N건") → ③ 동행글 목록 최대 8개 우선 노출(CMP-SCR004-LIST, 데이터 없으면 완성형 Empty State: 필터 초기화+작성 CTA+이용 방법) → ④ 목록+상세 분할(Desktop, CMP-SCR004-DETAIL)/목록→Drawer(Mobile) → ⑤ 참가 신청 방법 3단계(정적 텍스트+CMP-SCR004-APPLICATION 연동) → ⑥ 안전·신고(CMP-SCR004-REPORT)·차단(CMP-SCR004-BLOCK) 안내와 `/travel-tools` CTA.
- [ ] ②③ Filter·목록 Loading(스켈레톤)·Error(danger 텍스트+재시도) 상태 표시 확인.
- [ ] (보안) 참가 요청·신고·차단은 로그인+성인 확인 필요, 비로그인 시 `/account` 로그인 탭 안내.
- [ ] (보안) 모집글 응답에 연락처(전화번호·이메일·메신저 ID) 미포함.
- [ ] (보안) Supabase RLS로 본인/작성자/Moderator만 비공개 데이터 열람.

## Verify

Playwright(E2E-MATE-AUTH) + Unit(UNIT-MATE-STATE) + DB(TEST-RLS-BASIC) + 수동 확인

## Definition of Done

- [ ] Functional AC 전 항목 충족
- [ ] Visual AC 전 항목 충족(해당하는 경우)
- [ ] Security/Privacy AC 전 항목 충족(해당하는 경우)
- [ ] Test Cases 전 항목 통과
- [ ] Expected Files 목록 외 파일 변경 없음
- [ ] Depends On에 명시된 모든 Task(CMP-SCR004-FILTER, CMP-SCR004-LIST, CMP-SCR004-DETAIL, CMP-SCR004-APPLICATION, CMP-SCR004-REPORT, CMP-SCR004-BLOCK, SHARED-HEADER-FOOTER)가 완료된 상태에서 최종 조립 확인

## Forbidden

- 이 Task 범위에서 EXCLUDED 처리된 요구사항(`TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표)을 임의로 구현하지 않는다.
- 구현 코드를 실제로 커밋하거나 Git Branch를 생성하지 않는다(이 문서는 Task 정의 문서다).
- 이 Task는 Component/Data/API/Shared Task를 새로 만들지 않는다 — 이미 완료된 하위 Task의 결과물을 Page Entry 안에서 조립하는 것만 범위다.
- Expected Files 목록 밖의 파일(다른 Screen의 Page Entry 등)을 수정하지 않는다.
