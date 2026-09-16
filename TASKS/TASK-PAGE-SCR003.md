# PAGE-SCR003 — SCR-003 통합 여행 준비 화면 조립

- **Category:** PAGE
- **Implementation Status:** IMPLEMENT
- **Priority:** P1
- **Source:** `TASKS/00_TASK_LIST.md` Seq 3

## Context

이 Task는 SCR-003 Route(`/travel-tools`)의 Page Owner Task로, 하위 Component/Data/API/Shared Task가 만든 결과물을 `src/app/travel-tools/page.tsx`(신규 생성) 안에서 실제 Route Page로 조립하는 책임만 진다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-FUNC-011~026,027,028,029,031,032,080

(요구사항 원문은 `docs/06_SRS_UIUX_REVISED.md`, 판정 근거는 `docs/PROJECT_SCOPE.md` 참조)

## Screen / Route / Page Entry

- **Screen:** SCR-003
- **Route:** `/travel-tools`
- **Page Entry:** `src/app/travel-tools/page.tsx`(신규 생성)

## Design Ref

- `design-reference/D-001/DESIGN.md` — Color/Typography/Spacing/Radius/Shadow 토큰, Section 계약, Empty State 규칙(LOCKED 정본).
- `design-reference/UI_CONTRACT.md` — 해당 Screen의 영역 순서·컴포넌트·상태·이동·금지 기능.
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen·Route·Page Entry 정본(schema `traveler-screen-route-v1`).

## Depends On

- `CMP-SCR003-TABS`
- `CMP-SCR003-FLIGHT`
- `CMP-SCR003-HOTEL`
- `CMP-SCR003-MATE-WRITE`
- `SHARED-HEADER-FOOTER`
- `SHARED-DESIGN-TOKENS`
- `SHARED-POLICY-CONTENT`

## Expected Files

- `src/app/travel-tools/page.tsx`(신규 생성)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- Section 순서(고정): ① Intro(목적·이용 순서 3단계 텍스트) → ② 3탭 전환(CMP-SCR003-TABS: 항공편/숙소/동행 구하기) → ③ 조건 입력 Form(활성 탭에 따라 CMP-SCR003-FLIGHT 또는 CMP-SCR003-HOTEL) → ④ 입력 요약+외부 이동 Action Card(같은 컴포넌트 내) → ⑤ 찾기 Tip 3개(정적 텍스트, 정확히 3개) → ⑥ 동행 탭: 비로그인/미성년이면 로그인 안내 카드, 인증 회원이면 CMP-SCR003-MATE-WRITE 작성 Form+안전수칙 동의.
- **세 탭(항공편/숙소/동행 구하기)이 실제 컴포넌트로 조립되어 하나의 Page Entry 안에서 전환됨**을 완료 조건으로 포함(탭 라벨만 있고 내용이 비어있는 상태는 불가).
- 동행 탭 `CMP-SCR003-MATE-WRITE` 제출 중에는 버튼 텍스트를 유지한 채 스피너로 Loading을 표시(레이아웃 점프 금지)하고, 제출 실패 시 `danger` 텍스트+재시도 안내를 표시한다. 항공·숙소 탭의 외부 이동 오류(URL 미설정/허용목록 밖)는 `CMP-SCR003-FLIGHT`/`CMP-SCR003-HOTEL` Functional AC에 정의된 오류+재시도 표시를 그대로 따른다(`design-reference/D-001/DESIGN.md` §Loading·Empty·Error).

## Visual AC

Desktop 콘텐츠 폭 ~960px, Section 여백 64~80px; Mobile 390px, 풀폭 세그먼트 탭, 56px 입력 필드, 여백 48px, 터치 영역 44px 이상.

## Security/Privacy AC

항공·호텔 입력값(국가·지역·날짜)은 클라이언트 상태로만 유지되며 서버 요청·DB 저장·외부 URL 쿼리 파라미터에 포함되지 않음. 외부 이동은 `noopener,noreferrer` 새 탭. 동행 작성은 로그인+성인 확인 필요.

## Test Cases

- [ ] Section 순서(고정): ① Intro(목적·이용 순서 3단계 텍스트) → ② 3탭 전환(CMP-SCR003-TABS: 항공편/숙소/동행 구하기) → ③ 조건 입력 Form(활성 탭에 따라 CMP-SCR003-FLIGHT 또는 CMP-SCR003-HOTEL) → ④ 입력 요약+외부 이동 Action Card(같은 컴포넌트 내) → ⑤ 찾기 Tip 3개(정적 텍스트, 정확히 3개) → ⑥ 동행 탭: 비로그인/미성년이면 로그인 안내 카드, 인증 회원이면 CMP-SCR003-MATE-WRITE 작성 Form+안전수칙 동의.
- [ ] **세 탭(항공편/숙소/동행 구하기)이 실제 컴포넌트로 조립되어 하나의 Page Entry 안에서 전환됨**을 완료 조건으로 포함(탭 라벨만 있고 내용이 비어있는 상태는 불가).
- [ ] 동행 탭 제출 Loading(스피너)·Error(danger 텍스트+재시도), 항공·숙소 탭 외부 이동 Error(오류+재시도) 상태 표시 확인.
- [ ] (보안) 항공·호텔 입력값(국가·지역·날짜)은 클라이언트 상태로만 유지되며 서버 요청·DB 저장·외부 URL 쿼리 파라미터에 포함되지 않음.
- [ ] (보안) 외부 이동은 `noopener,noreferrer` 새 탭.
- [ ] (보안) 동행 작성은 로그인+성인 확인 필요.

## Verify

Playwright(E2E-TRAVEL-TOOLS) + Unit(UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION) + 수동 확인

## Definition of Done

- [ ] Functional AC 전 항목 충족
- [ ] Visual AC 전 항목 충족(해당하는 경우)
- [ ] Security/Privacy AC 전 항목 충족(해당하는 경우)
- [ ] Test Cases 전 항목 통과
- [ ] Expected Files 목록 외 파일 변경 없음
- [ ] Depends On에 명시된 모든 Task(CMP-SCR003-TABS, CMP-SCR003-FLIGHT, CMP-SCR003-HOTEL, CMP-SCR003-MATE-WRITE, SHARED-HEADER-FOOTER, SHARED-DESIGN-TOKENS, SHARED-POLICY-CONTENT)가 완료된 상태에서 최종 조립 확인

## Forbidden

- 이 Task 범위에서 EXCLUDED 처리된 요구사항(`TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표)을 임의로 구현하지 않는다.
- 구현 코드를 실제로 커밋하거나 Git Branch를 생성하지 않는다(이 문서는 Task 정의 문서다).
- 이 Task는 Component/Data/API/Shared Task를 새로 만들지 않는다 — 이미 완료된 하위 Task의 결과물을 Page Entry 안에서 조립하는 것만 범위다.
- Expected Files 목록 밖의 파일(다른 Screen의 Page Entry 등)을 수정하지 않는다.
