# PAGE-SCR002 — SCR-002 대표 소개 화면 조립

- **Category:** PAGE
- **Implementation Status:** IMPLEMENT
- **Priority:** P1
- **Source:** `TASKS/00_TASK_LIST.md` Seq 2

## Context

이 Task는 SCR-002 Route(`/about`)의 Page Owner Task로, 하위 Component/Data/API/Shared Task가 만든 결과물을 `src/app/about/page.tsx`(신규 생성) 안에서 실제 Route Page로 조립하는 책임만 진다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-FUNC-057,058,059,060,061,062,063,064,065,079

(요구사항 원문은 `docs/06_SRS_UIUX_REVISED.md`, 판정 근거는 `docs/PROJECT_SCOPE.md` 참조)

## Screen / Route / Page Entry

- **Screen:** SCR-002
- **Route:** `/about`
- **Page Entry:** `src/app/about/page.tsx`(신규 생성)

## Design Ref

- `design-reference/D-001/DESIGN.md` — Color/Typography/Spacing/Radius/Shadow 토큰, Section 계약, Empty State 규칙(LOCKED 정본).
- `design-reference/UI_CONTRACT.md` — 해당 Screen의 영역 순서·컴포넌트·상태·이동·금지 기능.
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen·Route·Page Entry 정본(schema `traveler-screen-route-v1`).

## Depends On

- `CMP-SCR002-TIMELINE`
- `CMP-SCR002-COUNTRY-CHIPS`
- `CMP-SCR002-GALLERY`
- `DATA-REPRESENTATIVE`
- `SHARED-HEADER-FOOTER`
- `SHARED-DESIGN-TOKENS`

## Expected Files

- `src/app/about/page.tsx`(신규 생성)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- Section 순서(고정): ① Profile Hero(대표 사진+한줄 소개, DATA-REPRESENTATIVE) → ② 여행 지표(`50+ Trips`/`30+ Countries`, DATA-REPRESENTATIVE) → ③ 소개·철학 2~4문단(DATA-REPRESENTATIVE) → ④ Timeline 최소 6개(CMP-SCR002-TIMELINE, DATA-REPRESENTATIVE) → ⑤ 방문 국가 최소 30개 권역별 Chip(CMP-SCR002-COUNTRY-CHIPS, DATA-REPRESENTATIVE) → ⑥ Gallery 최소 8장(CMP-SCR002-GALLERY, DATA-REPRESENTATIVE) → ⑦ 기억에 남는 여행지 4개 + CTA(DATA-REPRESENTATIVE + DATA-DESTINATIONS 참조).
- Timeline/국가/Gallery 최소 개수 미달 시 빌드 경고.
- 이 Page는 정적 데이터(`DATA-REPRESENTATIVE`)만 사용하므로 네트워크 Loading/Error 상태는 해당 없음(`design-reference/D-001/DESIGN.md` §Loading·Empty·Error 검토 결과, 확인 완료).

## Visual AC

Desktop 콘텐츠 폭 1200px, Section 여백 80px, Hero 높이 560~640px; Mobile 1열, 여백 48px. Gallery는 Desktop 4열/Mobile 2열.

## Security/Privacy AC

입력 없음(공개 열람 화면). 모든 이미지에 실제 장소를 설명하는 alt 텍스트 필수.

## Test Cases

- [ ] Section 순서(고정): ① Profile Hero(대표 사진+한줄 소개, DATA-REPRESENTATIVE) → ② 여행 지표(`50+ Trips`/`30+ Countries`, DATA-REPRESENTATIVE) → ③ 소개·철학 2~4문단(DATA-REPRESENTATIVE) → ④ Timeline 최소 6개(CMP-SCR002-TIMELINE, DATA-REPRESENTATIVE) → ⑤ 방문 국가 최소 30개 권역별 Chip(CMP-SCR002-COUNTRY-CHIPS, DATA-REPRESENTATIVE) → ⑥ Gallery 최소 8장(CMP-SCR002-GALLERY, DATA-REPRESENTATIVE) → ⑦ 기억에 남는 여행지 4개 + CTA(DATA-REPRESENTATIVE + DATA-DESTINATIONS 참조).
- [ ] Timeline/국가/Gallery 최소 개수 미달 시 빌드 경고.
- [ ] 정적 데이터만 사용하며 네트워크 Loading/Error 상태가 해당 없음을 확인(D-001 §Loading·Empty·Error 검토 완료).
- [ ] (보안) 입력 없음(공개 열람 화면).
- [ ] (보안) 모든 이미지에 실제 장소를 설명하는 alt 텍스트 필수.

## Verify

Playwright(E2E-PUBLIC-SMOKE) + 수동 확인

## Definition of Done

- [ ] Functional AC 전 항목 충족
- [ ] Visual AC 전 항목 충족(해당하는 경우)
- [ ] Security/Privacy AC 전 항목 충족(해당하는 경우)
- [ ] Test Cases 전 항목 통과
- [ ] Expected Files 목록 외 파일 변경 없음
- [ ] Depends On에 명시된 모든 Task(CMP-SCR002-TIMELINE, CMP-SCR002-COUNTRY-CHIPS, CMP-SCR002-GALLERY, DATA-REPRESENTATIVE, SHARED-HEADER-FOOTER, SHARED-DESIGN-TOKENS)가 완료된 상태에서 최종 조립 확인

## Forbidden

- 이 Task 범위에서 EXCLUDED 처리된 요구사항(`TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표)을 임의로 구현하지 않는다.
- 구현 코드를 실제로 커밋하거나 Git Branch를 생성하지 않는다(이 문서는 Task 정의 문서다).
- 이 Task는 Component/Data/API/Shared Task를 새로 만들지 않는다 — 이미 완료된 하위 Task의 결과물을 Page Entry 안에서 조립하는 것만 범위다.
- Expected Files 목록 밖의 파일(다른 Screen의 Page Entry 등)을 수정하지 않는다.
