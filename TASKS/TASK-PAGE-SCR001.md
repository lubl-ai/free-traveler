# PAGE-SCR001 — SCR-001 메인 화면 조립

- **Category:** PAGE
- **Implementation Status:** IMPLEMENT
- **Priority:** P1
- **Source:** `TASKS/00_TASK_LIST.md` Seq 1

## Context

이 Task는 SCR-001 Route(`/`)의 Page Owner Task로, 하위 Component/Data/API/Shared Task가 만든 결과물을 `src/app/page.tsx`(기존 스타터 템플릿 교체) 안에서 실제 Route Page로 조립하는 책임만 진다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-FUNC-001,002,003,004,005,006,007,008,009,046~054,057,059,060,062,063,064,065,068,070,079

(요구사항 원문은 `docs/06_SRS_UIUX_REVISED.md`, 판정 근거는 `docs/PROJECT_SCOPE.md` 참조)

## Screen / Route / Page Entry

- **Screen:** SCR-001
- **Route:** `/`
- **Page Entry:** `src/app/page.tsx`(기존 스타터 템플릿 교체)

## Design Ref

- `design-reference/D-001/DESIGN.md` — Color/Typography/Spacing/Radius/Shadow 토큰, Section 계약, Empty State 규칙(LOCKED 정본).
- `design-reference/UI_CONTRACT.md` — 해당 Screen의 영역 순서·컴포넌트·상태·이동·금지 기능.
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen·Route·Page Entry 정본(schema `traveler-screen-route-v1`).

## Depends On

- `CMP-SCR001-SEARCH`
- `CMP-SCR001-DESTINATION-GRID`
- `CMP-SCR001-DESTINATION-DRAWER`
- `CMP-SCR001-SAFETY-DRAWER`
- `CMP-SCR001-MATE-PREVIEW`
- `CMP-SCR001-FAVORITES`
- `DATA-DESTINATIONS`
- `DATA-SAFETY`
- `DATA-REPRESENTATIVE`
- `SHARED-HEADER-FOOTER`
- `SHARED-DESIGN-TOKENS`

## Expected Files

- `src/app/page.tsx`(기존 스타터 템플릿 교체)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- Section 순서(고정): ① 검색 Hero(`/travel-tools` CTA) → ② 국내 여행지 Card 6개(DATA-DESTINATIONS `scope=DOMESTIC`) → ③ 해외 여행지 Card 6개(DATA-DESTINATIONS `scope=OVERSEAS`) → ④ 여행 동기·테마 Chip 6개(DATA-DESTINATIONS의 theme 필드 집계) → ⑤ 국가별 주의사항 Card 6개(DATA-SAFETY, Drawer 연결) → ⑥ 최근 동행글 3개 또는 완성형 Empty State(API-MATE-POSTS 최신순) → ⑦ free_traveler 요약(DATA-REPRESENTATIVE) + `/about` CTA.
- 각 Card 그리드 최소 개수(국내 6, 해외 6, 테마 6, 안전정보 6, 동행글 3)를 코드로 강제(개수 미달 시 렌더링 실패 또는 경고).
- **Next.js Starter Template(기본 로고, Deploy/Docs 링크 등 `create-next-app` 기본 마크업) 완전 제거**를 완료 조건으로 포함.
- ⑥ 최근 동행글 섹션은 `API-MATE-POSTS` 조회 중 스켈레톤 Loading(`surface-soft` 블록)을 표시하고(레이아웃 점프 금지), 조회 실패 시 `danger` 텍스트+재시도 버튼을 표시한다(`design-reference/D-001/DESIGN.md` §Loading·Empty·Error).

## Visual AC

Desktop 1440px 콘텐츠 폭 1240px, Section 상하 여백 80px, Hero 높이 560~640px(다음 Section 헤드라인 노출); Mobile 390px 1열 스택, Section 여백 48px, Card 1열. Card 밀도는 Desktop 3~4열, Mobile 1열로 반응형 전환.

## Security/Privacy AC

입력 없음(공개 열람 화면). 즐겨찾기는 `localStorage`에만 저장, 서버 전송 없음. 안전정보 링크는 `noopener,noreferrer`.

## Test Cases

- [ ] Section 순서(고정): ① 검색 Hero(`/travel-tools` CTA) → ② 국내 여행지 Card 6개(DATA-DESTINATIONS `scope=DOMESTIC`) → ③ 해외 여행지 Card 6개(DATA-DESTINATIONS `scope=OVERSEAS`) → ④ 여행 동기·테마 Chip 6개(DATA-DESTINATIONS의 theme 필드 집계) → ⑤ 국가별 주의사항 Card 6개(DATA-SAFETY, Drawer 연결) → ⑥ 최근 동행글 3개 또는 완성형 Empty State(API-MATE-POSTS 최신순) → ⑦ free_traveler 요약(DATA-REPRESENTATIVE) + `/about` CTA.
- [ ] 각 Card 그리드 최소 개수(국내 6, 해외 6, 테마 6, 안전정보 6, 동행글 3)를 코드로 강제(개수 미달 시 렌더링 실패 또는 경고).
- [ ] **Next.js Starter Template(기본 로고, Deploy/Docs 링크 등 `create-next-app` 기본 마크업) 완전 제거**를 완료 조건으로 포함.
- [ ] ⑥ 최근 동행글 섹션 Loading(스켈레톤)·Error(danger 텍스트+재시도) 상태 표시 확인.
- [ ] (보안) 입력 없음(공개 열람 화면).
- [ ] (보안) 즐겨찾기는 `localStorage`에만 저장, 서버 전송 없음.
- [ ] (보안) 안전정보 링크는 `noopener,noreferrer`.

## Verify

Playwright(E2E-PUBLIC-SMOKE) + 수동 확인(Desktop/Mobile)

## Definition of Done

- [ ] Functional AC 전 항목 충족
- [ ] Visual AC 전 항목 충족(해당하는 경우)
- [ ] Security/Privacy AC 전 항목 충족(해당하는 경우)
- [ ] Test Cases 전 항목 통과
- [ ] Expected Files 목록 외 파일 변경 없음
- [ ] Depends On에 명시된 모든 Task(CMP-SCR001-SEARCH, CMP-SCR001-DESTINATION-GRID, CMP-SCR001-DESTINATION-DRAWER, CMP-SCR001-SAFETY-DRAWER, CMP-SCR001-MATE-PREVIEW, CMP-SCR001-FAVORITES, DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE, SHARED-HEADER-FOOTER, SHARED-DESIGN-TOKENS)가 완료된 상태에서 최종 조립 확인

## Forbidden

- 이 Task 범위에서 EXCLUDED 처리된 요구사항(`TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표)을 임의로 구현하지 않는다.
- 구현 코드를 실제로 커밋하거나 Git Branch를 생성하지 않는다(이 문서는 Task 정의 문서다).
- 이 Task는 Component/Data/API/Shared Task를 새로 만들지 않는다 — 이미 완료된 하위 Task의 결과물을 Page Entry 안에서 조립하는 것만 범위다.
- Expected Files 목록 밖의 파일(다른 Screen의 Page Entry 등)을 수정하지 않는다.
