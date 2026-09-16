# Free Traveler — Task List

- **Document ID:** TASK-LIST-001
- **기반 문서:** `docs/02_SRS_BASELINE.md`, `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, 실제 `src/app` 파일 트리
- **작성일:** 2026-09-15
- **선행 검사:** `python3 scripts/validate_inputs.py` 실행 결과 `VALIDATE_INPUTS_PASS`(11/11) 확인 후 작성함
- **상태:** Task List Baseline — 코드/브랜치/커밋/이슈 생성 없음

---

## 요약

### Task 수

| 구분 | 개수 |
|---|---:|
| **전체 Task 수** | **58** |
| Page Owner (`PAGE`) | 5 |
| Component (`COMPONENT`) | 23 |
| Data (`DATA`) | 3 |
| DB (`DB`) | 4 |
| API (`API`) | 6 |
| Shared (`SHARED`) | 7 |
| Governance (`GOV`) | 1 |
| Unit Test (`UNIT_TEST`) | 3 |
| Integration Test (`INTEGRATION_TEST`) | 1 |
| E2E (`E2E`) | 3 |
| CI (`CI`) | 1 |
| Deploy (`DEPLOY`) | 1 |

### Requirement Coverage 요약

| 구분 | 건수 |
|---|---:|
| REQ-FUNC-001 ~ 080 | 80 |
| REQ-NF-001 ~ 034 | 34 |
| **합계** | **114** |
| Task에 연결된 Requirement(IMPLEMENT/IMPLEMENT(축소)) | 85 |
| NON_IMPLEMENTATION 표로 이동(EXCLUDED) | 29 |

**빠진 Requirement ID 없음.** 85건은 아래 Task List의 `Requirement Ref` 열에, 29건은 `## NON_IMPLEMENTATION` 표에 전부 등재되어 114건 전수가 추적된다(교차 검산은 문서 맨 끝 `## Requirement Coverage 교차 확인` 참조).

---

## Task List

열: `Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority`

### A. Page Owner (SCR-001~005, 정확히 5개)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | PAGE-SCR001 | SCR-001 메인 화면 조립 | PAGE | IMPLEMENT | REQ-FUNC-001,002,003,004,005,006,007,008,009,046~054,057,059,060,062,063,064,065,068,070,079 | SCR-001 | `/` | `src/app/page.tsx`(기존 스타터 템플릿 교체) | CMP-SCR001-SEARCH, CMP-SCR001-DESTINATION-GRID, CMP-SCR001-DESTINATION-DRAWER, CMP-SCR001-SAFETY-DRAWER, CMP-SCR001-MATE-PREVIEW, CMP-SCR001-FAVORITES, DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE, SHARED-HEADER-FOOTER, SHARED-DESIGN-TOKENS | `src/app/page.tsx`(기존 스타터 템플릿 교체) | Section 순서(고정): ① 검색 Hero(`/travel-tools` CTA) → ② 국내 여행지 Card 6개(DATA-DESTINATIONS `scope=DOMESTIC`) → ③ 해외 여행지 Card 6개(DATA-DESTINATIONS `scope=OVERSEAS`) → ④ 여행 동기·테마 Chip 6개(DATA-DESTINATIONS의 theme 필드 집계) → ⑤ 국가별 주의사항 Card 6개(DATA-SAFETY, Drawer 연결) → ⑥ 최근 동행글 3개 또는 완성형 Empty State(API-MATE-POSTS 최신순) → ⑦ free_traveler 요약(DATA-REPRESENTATIVE) + `/about` CTA. 각 Card 그리드 최소 개수(국내 6, 해외 6, 테마 6, 안전정보 6, 동행글 3)를 코드로 강제(개수 미달 시 렌더링 실패 또는 경고). **Next.js Starter Template(기본 로고, Deploy/Docs 링크 등 `create-next-app` 기본 마크업) 완전 제거**를 완료 조건으로 포함. ⑥ 최근 동행글 섹션은 `API-MATE-POSTS` 조회 중 스켈레톤 Loading(`surface-soft` 블록)을 표시하고, 조회 실패 시 `danger` 텍스트+재시도 버튼을 표시(레이아웃 점프 금지, D-001 §Loading·Empty·Error). | Desktop 1440px 콘텐츠 폭 1240px, Section 상하 여백 80px, Hero 높이 560~640px(다음 Section 헤드라인 노출); Mobile 390px 1열 스택, Section 여백 48px, Card 1열. Card 밀도는 Desktop 3~4열, Mobile 1열로 반응형 전환. | 입력 없음(공개 열람 화면). 즐겨찾기는 `localStorage`에만 저장, 서버 전송 없음. 안전정보 링크는 `noopener,noreferrer`. | Playwright(E2E-PUBLIC-SMOKE) + 수동 확인(Desktop/Mobile) | P1 |
| 2 | PAGE-SCR002 | SCR-002 대표 소개 화면 조립 | PAGE | IMPLEMENT | REQ-FUNC-057,058,059,060,061,062,063,064,065,079 | SCR-002 | `/about` | `src/app/about/page.tsx`(신규 생성) | CMP-SCR002-TIMELINE, CMP-SCR002-COUNTRY-CHIPS, CMP-SCR002-GALLERY, DATA-REPRESENTATIVE, SHARED-HEADER-FOOTER, SHARED-DESIGN-TOKENS | `src/app/about/page.tsx`(신규 생성) | Section 순서(고정): ① Profile Hero(대표 사진+한줄 소개, DATA-REPRESENTATIVE) → ② 여행 지표(`50+ Trips`/`30+ Countries`, DATA-REPRESENTATIVE) → ③ 소개·철학 2~4문단(DATA-REPRESENTATIVE) → ④ Timeline 최소 6개(CMP-SCR002-TIMELINE, DATA-REPRESENTATIVE) → ⑤ 방문 국가 최소 30개 권역별 Chip(CMP-SCR002-COUNTRY-CHIPS, DATA-REPRESENTATIVE) → ⑥ Gallery 최소 8장(CMP-SCR002-GALLERY, DATA-REPRESENTATIVE) → ⑦ 기억에 남는 여행지 4개 + CTA(DATA-REPRESENTATIVE + DATA-DESTINATIONS 참조). Timeline/국가/Gallery 최소 개수 미달 시 빌드 경고. 모든 콘텐츠가 정적 데이터(`DATA-REPRESENTATIVE`)이므로 네트워크 Loading/Error 상태는 해당 없음(D-001 §Loading·Empty·Error 검토 결과, 확인 완료). | Desktop 콘텐츠 폭 1200px, Section 여백 80px, Hero 높이 560~640px; Mobile 1열, 여백 48px. Gallery는 Desktop 4열/Mobile 2열. | 입력 없음(공개 열람 화면). 모든 이미지에 실제 장소를 설명하는 alt 텍스트 필수. | Playwright(E2E-PUBLIC-SMOKE) + 수동 확인 | P1 |
| 3 | PAGE-SCR003 | SCR-003 통합 여행 준비 화면 조립 | PAGE | IMPLEMENT | REQ-FUNC-011~026,027,028,029,031,032,080 | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx`(신규 생성) | CMP-SCR003-TABS, CMP-SCR003-FLIGHT, CMP-SCR003-HOTEL, CMP-SCR003-MATE-WRITE, SHARED-HEADER-FOOTER, SHARED-DESIGN-TOKENS, SHARED-POLICY-CONTENT | `src/app/travel-tools/page.tsx`(신규 생성) | Section 순서(고정): ① Intro(목적·이용 순서 3단계 텍스트) → ② 3탭 전환(CMP-SCR003-TABS: 항공편/숙소/동행 구하기) → ③ 조건 입력 Form(활성 탭에 따라 CMP-SCR003-FLIGHT 또는 CMP-SCR003-HOTEL) → ④ 입력 요약+외부 이동 Action Card(같은 컴포넌트 내) → ⑤ 찾기 Tip 3개(정적 텍스트, 정확히 3개) → ⑥ 동행 탭: 비로그인/미성년이면 로그인 안내 카드, 인증 회원이면 CMP-SCR003-MATE-WRITE 작성 Form+안전수칙 동의. **세 탭(항공편/숙소/동행 구하기)이 실제 컴포넌트로 조립되어 하나의 Page Entry 안에서 전환됨**을 완료 조건으로 포함(탭 라벨만 있고 내용이 비어있는 상태는 불가). 동행 탭 CMP-SCR003-MATE-WRITE 제출 중에는 버튼 텍스트 유지+스피너로 Loading을 표시(레이아웃 점프 금지)하고, 제출 실패 시 `danger` 텍스트+재시도 안내를 표시(D-001 §Loading·Empty·Error). 항공·숙소 탭의 외부 이동 오류는 CMP-SCR003-FLIGHT/HOTEL Functional AC의 오류+재시도 표시를 그대로 따른다. | Desktop 콘텐츠 폭 ~960px, Section 여백 64~80px; Mobile 390px, 풀폭 세그먼트 탭, 56px 입력 필드, 여백 48px, 터치 영역 44px 이상. | 항공·호텔 입력값(국가·지역·날짜)은 클라이언트 상태로만 유지되며 서버 요청·DB 저장·외부 URL 쿼리 파라미터에 포함되지 않음. 외부 이동은 `noopener,noreferrer` 새 탭. 동행 작성은 로그인+성인 확인 필요. | Playwright(E2E-TRAVEL-TOOLS) + Unit(UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION) + 수동 확인 | P1 |
| 4 | PAGE-SCR004 | SCR-004 동행 조회 화면 조립 | PAGE | IMPLEMENT | REQ-FUNC-030,033,034,035,036,037,039,040,079,080 | SCR-004 | `/mates` | `src/app/mates/page.tsx`(신규 생성) | CMP-SCR004-FILTER, CMP-SCR004-LIST, CMP-SCR004-DETAIL, CMP-SCR004-APPLICATION, CMP-SCR004-REPORT, CMP-SCR004-BLOCK, SHARED-HEADER-FOOTER | `src/app/mates/page.tsx`(신규 생성) | Section 순서(고정): ① Intro(목적 설명)+작성 CTA(`/travel-tools` 동행 탭 이동) → ② 검색 Filter(CMP-SCR004-FILTER)+결과 요약 텍스트("총 N건") → ③ 동행글 목록 최대 8개 우선 노출(CMP-SCR004-LIST, 데이터 없으면 완성형 Empty State: 필터 초기화+작성 CTA+이용 방법) → ④ 목록+상세 분할(Desktop, CMP-SCR004-DETAIL)/목록→Drawer(Mobile) → ⑤ 참가 신청 방법 3단계(정적 텍스트+CMP-SCR004-APPLICATION 연동) → ⑥ 안전·신고(CMP-SCR004-REPORT)·차단(CMP-SCR004-BLOCK) 안내와 `/travel-tools` CTA. ②③ Filter·목록은 `API-MATE-POSTS` 조회 중 스켈레톤 Loading을 표시하고, 조회 실패 시 `danger` 텍스트+재시도 버튼을 표시(D-001 §Loading·Empty·Error). | Desktop 콘텐츠 폭 1240px(목록 40%+상세 60% 분할), 여백 64~80px; Mobile 1열, 카드 탭 시 하단 Drawer. | 참가 요청·신고·차단은 로그인+성인 확인 필요, 비로그인 시 `/account` 로그인 탭 안내. 모집글 응답에 연락처(전화번호·이메일·메신저 ID) 미포함. Supabase RLS로 본인/작성자/Moderator만 비공개 데이터 열람. | Playwright(E2E-MATE-AUTH) + Unit(UNIT-MATE-STATE) + DB(TEST-RLS-BASIC) + 수동 확인 | P1 |
| 5 | PAGE-SCR005 | SCR-005 계정·관리 화면 조립 | PAGE | IMPLEMENT | REQ-FUNC-028,029,036,038,040,041,042,066,068,077 | SCR-005 | `/account` | `src/app/account/page.tsx`(신규 생성) | CMP-SCR005-AUTH, CMP-SCR005-PROFILE, CMP-SCR005-MY-ACTIVITY, CMP-SCR005-ADMIN, SHARED-HEADER-FOOTER | `src/app/account/page.tsx`(신규 생성) | 역할별 렌더링(현재 역할에 해당하는 것만): **Guest** — 계정 기능 Intro → CMP-SCR005-AUTH(로그인/가입/비밀번호 재설정) → 로그인 후 가능한 기능 Chip → 보안 안내 Card. **Member** — CMP-SCR005-PROFILE(프로필·성인 확인 요약) → CMP-SCR005-MY-ACTIVITY(내 글: 작성 글 또는 완성형 Empty State, 참가 요청 보낸/받은, 차단 목록: 완성형 Empty State) → 새 동행글 작성 CTA(`/travel-tools`). **Admin** — 관리 Intro → CMP-SCR005-ADMIN(신고 상태 변경, 항공·숙소 외부 URL 설정). **역할에 없는 관리 영역(예: Guest에게 관리자 탭, Member에게 관리자 탭)은 렌더링하지 않음**을 완료 조건으로 포함. CMP-SCR005-MY-ACTIVITY 하위 목록(내 글/참가 요청/차단) 조회 중 스켈레톤 Loading, 조회 실패 시 `danger` 텍스트+재시도 버튼 표시; CMP-SCR005-AUTH/ADMIN Form 제출 중 버튼 스피너, 제출 실패 시 `danger` 텍스트+재시도 안내 표시(D-001 §Loading·Empty·Error). | Desktop 콘텐츠 폭 ~960px, 여백 64~80px. 역할별 탭 전환 시 레이아웃 점프 없이 전환. | 관리자 탭은 신고 상태 변경·외부 URL 설정 외 기능(콘텐츠 CRUD, 감사 로그 등) 없음. 비밀번호는 Supabase Auth 암호화 저장, 생년월일 대신 성인 확인 여부·확인 시각만 저장. Guest가 `/account`의 Member/Admin URL에 직접 접근 시 로그인 탭으로 리다이렉트. | Playwright(E2E-MATE-AUTH) + 수동 확인(역할별 3케이스) | P1 |

### B. Component — SCR-001

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | CMP-SCR001-SEARCH | 검색·테마 필터 | COMPONENT | IMPLEMENT | REQ-FUNC-002,003 | SCR-001 | — (PAGE-SCR001 소유) | — (PAGE-SCR001 소유) | DATA-DESTINATIONS | `src/components/scr001/SearchFilterBar.tsx`(신규) | 여행지명·국가명·테마 키워드 한글 부분 일치 검색. 국가·도시·계절·테마·기간 필터는 AND 조건, 정적 데이터(`DATA-DESTINATIONS`)에 대해 클라이언트 필터링. | 검색창은 pill 형태(`rounded.full`), 테마 Chip은 선택 시 코랄 배경. | 서버 요청 없음(클라이언트 필터). | 수동 확인 + Playwright(E2E-PUBLIC-SMOKE) | P1 |
| 7 | CMP-SCR001-DESTINATION-GRID | 국내·해외 여행지 Card Grid | COMPONENT | IMPLEMENT | REQ-FUNC-001,004,005,007,009 | SCR-001 | — (PAGE-SCR001 소유) | — (PAGE-SCR001 소유) | DATA-DESTINATIONS | `src/components/scr001/DestinationCardGrid.tsx`(신규) | `scope` prop(DOMESTIC/OVERSEAS)에 따라 최소 6개 Card 렌더링. 결과 0건이면 조건 완화 안내+전체 초기화 버튼(완성형, Placeholder 문구 금지). 관련 여행지 추천 최대 6개. | Desktop 3열, Mobile 1열. Card는 `rounded.md`, hover 시 `shadow.floating`. | 없음. | 수동 확인 + Playwright | P1 |
| 8 | CMP-SCR001-DESTINATION-DRAWER | 여행지 상세 Drawer | COMPONENT | IMPLEMENT | REQ-FUNC-004,006,007,009 | SCR-001 | — (PAGE-SCR001 소유) | — (PAGE-SCR001 소유) | CMP-SCR001-DESTINATION-GRID, DATA-DESTINATIONS, DATA-SAFETY, SHARED-DESIGN-TOKENS | `src/components/scr001/DestinationDrawer.tsx`(신규) | 소개 300자 이상, 명소 5개 이상, 1일/3일 일정, 예산, 교통, 음식 3개 이상, 에티켓 3개 이상, 출처·수정일 표시. 해외 여행지는 "국가 안전정보 보기" 링크로 같은 Drawer 스택에서 안전정보로 전환. | Desktop 우측 슬라이드 480px, Mobile 하단 Sheet. `Esc`와 닫기 버튼으로 닫기 가능. | 없음. | 수동 확인 + Playwright | P1 |
| 9 | CMP-SCR001-SAFETY-DRAWER | 국가 안전정보 Card+Drawer | COMPONENT | IMPLEMENT | REQ-FUNC-046,047,048,049,050,051,052,053,054 | SCR-001 | — (PAGE-SCR001 소유) | — (PAGE-SCR001 소유) | DATA-SAFETY, SHARED-DESIGN-TOKENS | `src/components/scr001/SafetyDrawer.tsx`(신규) | 8개 카테고리(치안/사기/법규/교통/재난/보건/문화/긴급연락처) 표시, 출처·최종확인일 표시, 렌더링 시점에 `verified_at` 기준 7일 경과 여부 계산해 stale 경고(`warning` 색상), 중대 경보는 `danger` 색상으로 상단 표시, 외교부 링크는 새 탭 `noopener,noreferrer`. | Card 최소 6개, 경보 라벨은 색상+텍스트 병기. | 없음(공개 정적 콘텐츠). | 수동 확인(확인일 조작 테스트) + Playwright | P1 |
| 10 | CMP-SCR001-MATE-PREVIEW | 최근 동행글 미리보기 | COMPONENT | IMPLEMENT | REQ-FUNC-030,033,037 | SCR-001 | — (PAGE-SCR001 소유) | — (PAGE-SCR001 소유) | API-MATE-POSTS, DB-ACCESS | `src/components/scr001/MatePreview.tsx`(신규) | 최신 동행글 최대 3개(모집중만), 없으면 완성형 Empty State(설명+이용 방법+작성 CTA). 응답에 연락처 미포함. 종료일 경과 글은 조회 시 자동 제외. | Card 3개 가로 배치(Desktop)/세로(Mobile). | 비공개 필드(연락처) 응답 미포함. | 수동 확인 | P1 |
| 11 | CMP-SCR001-FAVORITES | 즐겨찾기 토글 | COMPONENT | IMPLEMENT | REQ-FUNC-068 | SCR-001 | — (PAGE-SCR001 소유) | — (PAGE-SCR001 소유) | — | `src/lib/favorites.ts`(신규), Card 컴포넌트에 토글 아이콘 추가 | `localStorage`에 여행지 id 배열로 저장, 중복 추가 방지, 추가/해제/목록 조회 지원. | 아이콘 버튼 44px 이상 터치 영역. | 서버 저장 없음(localStorage 전용). | 수동 확인 | P2 |

### C. Component — SCR-002

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 12 | CMP-SCR002-TIMELINE | 여행 Timeline | COMPONENT | IMPLEMENT | REQ-FUNC-060 | SCR-002 | — (PAGE-SCR002 소유) | — (PAGE-SCR002 소유) | DATA-REPRESENTATIVE | `src/components/scr002/Timeline.tsx`(신규) | 연도·장소·한 줄 요약으로 구성된 항목 **최소 6개**. 6개 미만이면 컴포넌트가 경고를 렌더링(빈 화면 금지). | 세로 단계형 리스트, Desktop/Mobile 모두 1열. | 없음. | 수동 확인 | P2 |
| 13 | CMP-SCR002-COUNTRY-CHIPS | 방문 국가 Chip | COMPONENT | IMPLEMENT | REQ-FUNC-059 | SCR-002 | — (PAGE-SCR002 소유) | — (PAGE-SCR002 소유) | DATA-REPRESENTATIVE | `src/components/scr002/CountryChips.tsx`(신규) | 4개 권역(아시아/유럽/북미/오세아니아) 그룹별 Chip, 총 **최소 30개** 국가. Chip 클릭 시 관련 여행지 필터로 이동(가능한 경우). | Chip은 `rounded.full`. | 없음. | 수동 확인(데이터 카운트 ≥30) | P2 |
| 14 | CMP-SCR002-GALLERY | 여행 Gallery | COMPONENT | IMPLEMENT | REQ-FUNC-061 | SCR-002 | — (PAGE-SCR002 소유) | — (PAGE-SCR002 소유) | DATA-REPRESENTATIVE | `src/components/scr002/Gallery.tsx`(신규) | 사진 **최소 8장**, 각 사진에 실제 장소를 설명하는 alt 텍스트 필수(출처 URL도 표시). | Desktop 4열/Mobile 2열. | 없음. | 수동 확인(alt 텍스트 존재) | P2 |

### D. Component — SCR-003 (항공·숙소·동행 작성 분리)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 15 | CMP-SCR003-TABS | 항공편/숙소/동행 구하기 탭 전환 셸 | COMPONENT | IMPLEMENT | — (UI 구조, 없음) | SCR-003 | — (PAGE-SCR003 소유) | — (PAGE-SCR003 소유) | SHARED-DESIGN-TOKENS | `src/components/scr003/TabSwitcher.tsx`(신규) | 3개 탭 상태 관리, 각 탭의 입력·검증·완료 상태는 서로 독립(한 탭 오류가 다른 탭에 영향 없음). | pill 탭, 활성 탭 코랄 배경. | 없음. | 수동 확인 | P1 |
| 16 | CMP-SCR003-FLIGHT | 항공편 조건 입력·요약·외부 이동 | COMPONENT | IMPLEMENT | REQ-FUNC-011,012,013,014,015,016,017,018 | SCR-003 | — (PAGE-SCR003 소유) | — (PAGE-SCR003 소유) | CMP-SCR003-TABS | `src/components/scr003/FlightForm.tsx`(신규) | 국가·지역·출발일·귀국일 필수 입력, 국가 변경 시 지역 옵션 재계산, 과거 출발일/역전 날짜 제출 차단(**지정 구현 방법: 클라이언트 상태로만 검증, 서버 API 없음**), 유효 시 요약+비전달 고지 표시, "항공편 보러 가기" 클릭 시 설정된 외부 URL을 `target=_blank, noopener noreferrer`로 오픈(쿼리 파라미터 없음), URL 미설정/허용목록 밖이면 오류+재시도 표시. | 56px 입력 필드, 요약 카드는 코랄 CTA 버튼. | **입력값(국가·지역·날짜)은 서버 요청·DB 저장·외부 URL 쿼리에 포함되지 않음**(클라이언트 상태 전용). | Unit(UNIT-TRAVEL-DATES) + Playwright(E2E-TRAVEL-TOOLS) | P1 |
| 17 | CMP-SCR003-HOTEL | 숙소 조건 입력·요약·외부 이동 | COMPONENT | IMPLEMENT | REQ-FUNC-019,020,021,022,023,024,025,026 | SCR-003 | — (PAGE-SCR003 소유) | — (PAGE-SCR003 소유) | CMP-SCR003-TABS | `src/components/scr003/HotelForm.tsx`(신규) | 국가·지역·체크인·체크아웃 필수 입력, 지역 옵션 재계산, 체크아웃≤체크인/과거 체크인 차단(클라이언트 검증), 요약+비전달 고지, "호텔 보러 가기" 새 탭 이동(쿼리 없음), URL 오류 시 재시도. | 56px 입력 필드, 요약 카드는 코랄 CTA 버튼. | **입력값은 서버·DB·외부 URL 쿼리에 미전달**(클라이언트 상태 전용). | Unit(UNIT-TRAVEL-DATES) + Playwright(E2E-TRAVEL-TOOLS) | P1 |
| 18 | CMP-SCR003-MATE-WRITE | 동행 작성 Form 또는 로그인 안내 | COMPONENT | IMPLEMENT | REQ-FUNC-027,028,029,031,032,080 | SCR-003 | — (PAGE-SCR003 소유) | — (PAGE-SCR003 소유) | CMP-SCR003-TABS, API-MATE-POSTS, API-AUTH-ADULT-VERIFY | `src/components/scr003/MateWriteForm.tsx`(신규) | 비로그인/성인 미확인 시 로그인 안내 카드(`/account` 로그인 탭 링크)로 대체. 인증 회원은 제목·국가·지역·기간·인원·조건·스타일·설명·안전수칙 동의 Form. **지정 구현 방법: 연락처 탐지는 정규식 기반 클라이언트+서버 이중 검증**, 탐지 시 제출 차단+수정 안내. | Info Card는 `info` 톤(코랄 아님). | 로그인+성인 확인 없이는 제출 불가(서버 재검증 필수). | Unit(UNIT-CONTACT-DETECTION) + Playwright(E2E-MATE-AUTH) | P1 |

### E. Component — SCR-004 (목록·필터·상세·참가·신고·차단 분리)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 19 | CMP-SCR004-FILTER | 동행 검색 Filter | COMPONENT | IMPLEMENT | REQ-FUNC-030 | SCR-004 | — (PAGE-SCR004 소유) | — (PAGE-SCR004 소유) | API-MATE-POSTS | `src/components/scr004/MateFilterBar.tsx`(신규) | 국가·지역·기간 겹침·연령대·성별·여행 스타일·모집 상태 필터, 차단 사용자 글 결과에서 제외. | 드롭다운 가로 배치(Desktop)/세로(Mobile). | 차단 관계 필터링은 서버(RLS/쿼리)에서 처리. | 수동 확인 | P1 |
| 20 | CMP-SCR004-LIST | 동행글 목록 | COMPONENT | IMPLEMENT | REQ-FUNC-030,033,037 | SCR-004 | — (PAGE-SCR004 소유) | — (PAGE-SCR004 소유) | CMP-SCR004-FILTER, API-MATE-POSTS, DB-ACCESS | `src/components/scr004/MatePostList.tsx`(신규) | 최대 8개 우선 노출, 조회 시점에 `end_date` 경과 글은 CLOSED로 계산해 표시(**지정 구현 방법: 배치 없이 조회 시 계산**). 결과 0건이면 완성형 Empty State(필터 초기화+작성 CTA+이용 방법, Placeholder 문구 금지). 응답에 연락처 미포함. | Card `rounded.md`, `hairline` 테두리, 그림자 없음. | 없음(공개 필드만). | 수동 확인 + Playwright(E2E-MATE-AUTH) | P1 |
| 21 | CMP-SCR004-DETAIL | 상세 패널(목록+상세 분할/Drawer) | COMPONENT | IMPLEMENT | REQ-FUNC-033,037,039,040 | SCR-004 | — (PAGE-SCR004 소유) | — (PAGE-SCR004 소유) | CMP-SCR004-LIST, DB-RLS-BASE | `src/components/scr004/MateDetailPanel.tsx`(신규) | 제목·조건·설명·작성자 정보(닉네임·연령대·인증 배지만, 연락처 제외) 표시, "참가 요청 보내기"·신고·차단 진입점 제공. Desktop은 목록 옆 분할, Mobile은 Drawer. | Desktop 우측 60%, Mobile 하단 Sheet. | 비공개 필드는 RLS로 서버 단에서 차단(작성자/본인/Moderator만). | 수동 확인 + Playwright | P1 |
| 22 | CMP-SCR004-APPLICATION | 참가 요청 제출 | COMPONENT | IMPLEMENT | REQ-FUNC-034,035,036 | SCR-004 | — (PAGE-SCR004 소유) | — (PAGE-SCR004 소유) | CMP-SCR004-DETAIL, API-MATE-APPLICATIONS, API-AUTH-ADULT-VERIFY | `src/components/scr004/ApplicationForm.tsx`(신규) | 최대 500자 비공개 메시지 제출, `PENDING` 저장, 동일 글 중복 PENDING/ACCEPTED 차단(서버 unique 제약+UI 오류). 작성자만 승인/거절 가능(비작성자 요청은 403). | 제출 버튼 44px 이상. | 로그인+성인 확인 필요, 요청 대상 작성자/본인만 열람. | Unit(UNIT-MATE-STATE) + Playwright | P1 |
| 23 | CMP-SCR004-REPORT | 신고 | COMPONENT | IMPLEMENT | REQ-FUNC-039 | SCR-004 | — (PAGE-SCR004 소유) | — (PAGE-SCR004 소유) | API-REPORTS | `src/components/scr004/ReportDialog.tsx`(신규) | 사유 코드+설명 입력, 접수 시 접수번호·접수 시각 3초 이내 화면 표시. | 모달/Drawer 형태, `Esc`로 닫기. | 신고자/피신고자 상세는 관리자만 열람(RLS). | 수동 확인 | P1 |
| 24 | CMP-SCR004-BLOCK | 차단 | COMPONENT | IMPLEMENT | REQ-FUNC-040 | SCR-004 | — (PAGE-SCR004 소유) | — (PAGE-SCR004 소유) | API-USER-BLOCKS | `src/components/scr004/BlockAction.tsx`(신규) | 차단·해제 액션, 차단 후 상호 글·프로필·요청 비노출(서버 필터링). | 버튼 44px 이상. | 차단 관계는 RLS/쿼리 필터로 서버에서 강제. | 수동 확인 | P1 |

### F. Component — SCR-005 (Auth·Profile·My Activity·Admin 분리)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 25 | CMP-SCR005-AUTH | 로그인·가입·재설정 | COMPONENT | IMPLEMENT | REQ-FUNC-066 | SCR-005 | — (PAGE-SCR005 소유) | — (PAGE-SCR005 소유) | API-AUTH-ADULT-VERIFY | `src/components/scr005/AuthTab.tsx`(신규) | Supabase Auth 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정. 인증 콜백은 `/auth/callback`(기술 Route) 처리 후 `/account`로 복귀. | Form 필드 56px. | 비밀번호는 Supabase Auth 암호화 저장(직접 평문 저장 금지). | 수동 확인 + Playwright(E2E-MATE-AUTH) | P1 |
| 26 | CMP-SCR005-PROFILE | 프로필·성인 확인 | COMPONENT | IMPLEMENT | REQ-FUNC-028,029 | SCR-005 | — (PAGE-SCR005 소유) | — (PAGE-SCR005 소유) | API-AUTH-ADULT-VERIFY, DB-ACCESS | `src/components/scr005/ProfileTab.tsx`(신규) | 닉네임(필수)·연령대(필수)·성별(선택)·여행 스타일(필수)·자기소개 편집, 성인 확인 배지(확인 시각 표시). **지정 구현 방법: 생년월일 미저장, `is_adult`/`adult_verified_at`만 저장**. | 성인 확인 완료 배지는 `success` 색상. | 정확한 생년월일 저장 금지. | 수동 확인(DB 컬럼 확인) | P1 |
| 27 | CMP-SCR005-MY-ACTIVITY | 내 글·참가 요청·차단 목록 | COMPONENT | IMPLEMENT | REQ-FUNC-036,038,040,068 | SCR-005 | — (PAGE-SCR005 소유) | — (PAGE-SCR005 소유) | API-MATE-POSTS, API-MATE-APPLICATIONS, API-USER-BLOCKS | `src/components/scr005/MyActivityTab.tsx`(신규) | 내 글(수정/마감/삭제, 데이터 없으면 완성형 Empty State+작성 CTA), 참가 요청(보낸/받은, 승인/거절 버튼), 차단 목록(완성형 Empty State: "차단한 사용자가 없어요"+설명), 즐겨찾기 목록(`localStorage` 연동). | 각 하위 목록 Card 동일한 시각 언어(`rounded.md`). | 비작성자의 승인/거절 시도는 403. | 수동 확인 + Playwright | P1 |
| 28 | CMP-SCR005-ADMIN | 신고 상태 변경·외부 URL 설정 | COMPONENT | IMPLEMENT(축소) | REQ-FUNC-041,042,077 | SCR-005 | — (PAGE-SCR005 소유) | — (PAGE-SCR005 소유) | API-REPORTS, API-ADMIN-SETTINGS | `src/components/scr005/AdminTab.tsx`(신규) | 신고 목록(OPEN/RESOLVED/DISMISSED 상태 필터·변경), 항공·숙소 외부 URL 설정 Form(HTTPS 허용목록 내에서만 저장, `javascript:`/HTTP 거부). Admin 권한 없는 사용자에게는 이 탭 자체를 렌더링하지 않음. | Form 입력 56px, 저장 버튼 코랄. | Admin 역할이 아닌 사용자의 접근은 서버에서도 차단(RLS/역할 검증). | 수동 확인(HTTP/`javascript:` 입력 시 저장 거부) | P1 |

### G. Data (정적 데이터, DB 아님)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 29 | DATA-DESTINATIONS | 여행지 정적 데이터 | DATA | IMPLEMENT | REQ-FUNC-001,002,004,005,007,008,009; REQ-NF-006,026 | — | — | — | — | `src/data/destinations.ts`(신규) | **지정 구현 방법: DB가 아닌 TypeScript 정적 데이터 모듈**. 국내 10개 이상, 해외 15개국 30개 도시 이상. 각 항목 필수 필드(소개 300자 이상, 명소 5개 이상, 1일/3일 일정, 예산, 교통, 음식 3개 이상, 에티켓 3개 이상, 출처·수정일)를 타입으로 강제. | — | 없음(공개 정적 콘텐츠). | TypeScript 타입 체크 + 데이터 카운트 스크립트(GOV-CONTENT-COMPLETENESS) | P0 |
| 30 | DATA-SAFETY | 국가 안전정보 정적 데이터 | DATA | IMPLEMENT | REQ-FUNC-046,047,048,049,051,052,053,054; REQ-NF-027,028 | — | — | — | — | `src/data/safety.ts`(신규) | 소개되는 모든 해외 국가에 안전정보 등록, 8개 카테고리·출처·최종확인일·경보 범위(`scopeType`/`scopeText`) 필드 포함. `verified_at`은 stale 계산을 위해 ISO 날짜로 저장. | — | 없음(공개 정적 콘텐츠). | 데이터 카운트 스크립트(해외 국가 수 = 안전정보 수) | P0 |
| 31 | DATA-REPRESENTATIVE | 대표(free_traveler) 정적 데이터 | DATA | IMPLEMENT | REQ-FUNC-057,058,059,060,061,062,063 | — | — | — | — | `src/data/representative.ts`(신규) | 대표명·`50+ Trips`·`30+ Countries`·소개문·철학·타임라인(6개 이상)·방문국가(30개 이상)·이미지(alt+출처)·SNS 링크·추천 여행지 4~6개를 단일 데이터 소스로 관리(전역에서 값 일관성 보장). | — | 없음(공개 정적 콘텐츠). | 데이터 카운트 스크립트(타임라인≥6, 국가≥30) | P0 |

### H. DB (Supabase, 6개 테이블 한도)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 32 | DB-SCHEMA-BASE | Supabase 스키마 정의 | DB | IMPLEMENT | REQ-FUNC-028,029,031,034,035,039,040,044,077 | — | — | — | — | `supabase/migrations/0001_schema.sql`(신규) | **정확히 6개 테이블만 생성**: `USER_PROFILE`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`, `APP_SETTING`. 여행지·안전정보·대표 프로필·미디어·감사 로그 테이블은 만들지 않음(정적 데이터 또는 EXCLUDED). | — | 개인정보 최소 수집(정확한 생년월일 컬럼 없음). | 스키마 리뷰(테이블 6개 확인) | P0 |
| 33 | DB-RLS-BASE | Row Level Security 정책 | DB | IMPLEMENT | REQ-FUNC-033,044; REQ-NF-013 | — | — | — | DB-SCHEMA-BASE | `supabase/migrations/0002_rls.sql`(신규) | 6개 테이블에 RLS 활성화, 본인·작성자·Moderator/Admin만 비공개 데이터 접근 가능하도록 정책 작성. | — | 타 계정으로 비공개 데이터 접근 시 빈 결과/403. | DB(TEST-RLS-BASIC) | P0 |
| 34 | DB-ACCESS | 서버 DB 접근 계층 | DB | IMPLEMENT | REQ-FUNC-027; REQ-NF-014,015,016,017 | — | — | — | — | `src/lib/db/client.ts`(신규) | Supabase 서버 클라이언트 래퍼, 입력 검증·이스케이프 공통 처리, 환경변수로만 키 관리(클라이언트 번들 미포함). | — | CSRF 방어(Server Actions 기본 Origin 검증), XSS 방지, 비밀키 서버 전용. | 코드 리뷰 + 빌드 산출물 키 검색 | P0 |
| 35 | DB-SEED-BASE | 로컬/개발 Seed 데이터 | DB | IMPLEMENT | — (테스트 지원용, 직접 연결 REQ 없음) | — | — | — | DB-SCHEMA-BASE | `supabase/seed.sql`(신규) | 개발·테스트용 최소 Seed(테스트 계정 2~3개, 동행글 3~5개, 신고 1~2건)로 E2E/RLS 테스트 지원. | — | 실제 개인정보 미포함(더미 데이터만). | DB(TEST-RLS-BASIC), Playwright | P2 |

### I. API (Server Action / Route Handler)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 36 | API-MATE-POSTS | 동행글 CRUD | API | IMPLEMENT | REQ-FUNC-031,037,038 | — | `/api/mates` | — | DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS | `src/app/api/mates/route.ts`(신규) | 생성/조회/수정/마감/삭제. 조회 시 `end_date` 경과 글을 CLOSED로 계산해 응답(배치 없음). | — | 작성자 본인만 수정/마감/삭제 가능(RLS). | 수동 확인 + Playwright | P1 |
| 37 | API-MATE-APPLICATIONS | 참가 요청 처리 | API | IMPLEMENT | REQ-FUNC-034,035,036,043 | — | `/api/mates/[id]/applications` | — | DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS, API-MATE-POSTS | `src/app/api/mates/[id]/applications/route.ts`(신규) | 제출(PENDING), 승인/거절(작성자만), 중복 제출 차단(DB unique). 처리 결과는 인앱 Toast로만 통지(실제 이메일 발송 없음). | — | 비작성자 승인/거절 시도는 403. | Unit(UNIT-MATE-STATE) + Playwright | P1 |
| 38 | API-USER-BLOCKS | 차단 관계 처리 | API | IMPLEMENT | REQ-FUNC-040 | — | `/api/blocks` | — | DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS | `src/app/api/blocks/route.ts`(신규) | 차단 생성/해제, (blocker, blocked) unique. | — | 차단 목록은 본인만 조회 가능. | 수동 확인 | P1 |
| 39 | API-REPORTS | 신고 접수·처리 | API | IMPLEMENT(축소) | REQ-FUNC-039,041,042; REQ-NF-019 | — | `/api/reports` | — | DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS | `src/app/api/reports/route.ts`(신규) | 신고 접수(3초 이내 응답), 상태 변경(OPEN/RESOLVED/DISMISSED, Admin만). | — | 신고자/피신고자 상세는 Admin만 열람. | 수동 확인 | P1 |
| 40 | API-ADMIN-SETTINGS | 외부 URL 설정 저장 | API | IMPLEMENT | REQ-FUNC-077 | — | `/api/admin/settings/outbound` | — | DB-SCHEMA-BASE, DB-ACCESS | `src/app/api/admin/settings/outbound/route.ts`(신규) | HTTPS 허용목록 내 URL만 `APP_SETTING`에 저장, HTTP/`javascript:`/data URL 거부. | — | Admin 역할만 호출 가능(서버 역할 검증). | 수동 확인 | P1 |
| 41 | API-AUTH-ADULT-VERIFY | 인증·성인 확인 처리 | API | IMPLEMENT | REQ-FUNC-027,028,066 | — | `/auth/callback`(기술 Route) | — | DB-SCHEMA-BASE, DB-ACCESS | `src/app/auth/callback/route.ts`(신규), `src/lib/auth.ts`(신규) | Supabase Auth 이메일 인증 콜백 처리, 로그인 세션 검증 미들웨어, 성인 확인 상태 기록(`is_adult`, `adult_verified_at`). | — | 생년월일 미저장, 세션은 Supabase Auth 표준 쿠키. | 수동 확인 + Playwright(E2E-MATE-AUTH) | P1 |

### J. Shared (5개 Screen 공통)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 42 | SHARED-HEADER-FOOTER | 전역 Header·Footer | SHARED | IMPLEMENT | REQ-FUNC-064,065 | 전역 | 전역(5개 Route 공통) | `src/app/layout.tsx`(기존 파일 수정) | SHARED-DESIGN-TOKENS | `src/components/shared/Header.tsx`, `src/components/shared/Footer.tsx`(신규) | Header: 로고+4개 내비게이션(홈/대표 소개/여행 준비/동행 찾기)+로그인·계정 진입점. Footer: 브랜드 소개+서비스/정보/정책 3컬럼+외부 링크 고지. | Desktop 72px/Mobile 56px+햄버거. | 없음. | 수동 확인(뷰포트 리사이즈) | P0 |
| 43 | SHARED-DESIGN-TOKENS | 디자인 토큰·Tailwind 설정 | SHARED | IMPLEMENT | REQ-NF-006,023 | 전역 | — | `tailwind.config.ts`(신규 또는 수정), `src/app/globals.css`(기존 파일 수정) | — | `tailwind.config.ts`, `src/styles/tokens.css`(신규) | `design-reference/D-001/DESIGN.md`의 Color/Typography/Spacing/Radius/Shadow 토큰을 Tailwind 테마로 반영. Inter+한글 폴백 폰트 스택. | 코랄 `#FF6B4A`는 1차 CTA에만 사용되도록 유틸리티 클래스 제한. | 없음. | 코드 리뷰(토큰 값 일치) | P0 |
| 44 | SHARED-TOAST-ALERT | Toast·Alert 컴포넌트 | SHARED | IMPLEMENT(축소) | REQ-FUNC-043 | 전역 | 전역(5개 Route 공통) | `src/app/layout.tsx`(기존 파일 수정) | SHARED-DESIGN-TOKENS | `src/components/shared/Toast.tsx`(신규) | 참가 요청 접수·승인·거절·신고 처리 결과를 인앱 Toast로 표시(실제 이메일 발송 없음). | `ink` 배경+흰 텍스트, `shadow.floating`. | 없음. | 수동 확인 | P2 |
| 45 | SHARED-SEO-METADATA | 공개 페이지 메타데이터 | SHARED | IMPLEMENT(축소) | REQ-FUNC-070; REQ-NF-030 | 전역 | 전역(5개 Route 공통) | 각 Page Entry(기존/신규 파일 수정) | DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE | 각 `page.tsx`에 Next.js `generateMetadata` 추가 | title/description/canonical 기본 메타데이터 제공(Open Graph·구조화 데이터는 축소 범위 밖). | — | 없음. | 수동 확인(페이지 소스 메타 태그) | P2 |
| 46 | SHARED-A11Y-FOCUS | 접근성 기본 마크업 | SHARED | IMPLEMENT(축소) | REQ-FUNC-079; REQ-NF-023 | 전역 | 전역(5개 Route 공통) | 전역 컴포넌트(기존 파일 수정) | SHARED-DESIGN-TOKENS | 각 인터랙티브 컴포넌트에 ARIA 속성·시맨틱 태그 추가 | 폼·모달·탭·알림에 올바른 HTML 시맨틱과 ARIA 상태, `:focus-visible` 2px 코랄 아웃라인, 터치 영역 44px 이상. | 색상만으로 상태 구분 금지(텍스트 라벨 병기). | 없음. | 수동 키보드 탐색 확인 | P2 |
| 47 | SHARED-ERROR-PAGES | 404/500 오류 화면 | SHARED | IMPLEMENT | REQ-FUNC-078 | 기술 Route | `*` | `src/app/not-found.tsx`, `src/app/error.tsx`(신규) | SHARED-HEADER-FOOTER | `src/app/not-found.tsx`, `src/app/error.tsx`(신규) | 404/500/외부 연결 실패 시 홈·이전·재시도 중 최소 1개 복구 행동 제공. | Header/Footer 유지. | 없음. | 수동 확인 | P2 |
| 48 | SHARED-POLICY-CONTENT | 약관·정책·안전수칙 콘텐츠 | SHARED | IMPLEMENT | REQ-FUNC-080 | 전역(SCR-003 동의 체크박스 연동) | `/travel-tools`(동의), 전역(푸터 링크) | `src/app/travel-tools/page.tsx`(연동), 정책 콘텐츠는 `src/data/policies.ts`(신규) | — | `src/data/policies.ts`(신규) | 이용약관·개인정보처리방침·동행 안전수칙·콘텐츠 면책 안내 콘텐츠, 동행글 작성 시 안전수칙 동의 체크와 정책 버전·동의 시각 저장. | — | 동의 기록은 버전과 타임스탬프 포함. | 수동 확인 | P2 |

### K. Governance

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 49 | GOV-CONTENT-COMPLETENESS | 콘텐츠 완전성 검증 스크립트 | GOV | IMPLEMENT(축소) | REQ-FUNC-008,074; REQ-NF-026,027,028 | — | — | — | DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE | `scripts/check_content_completeness.py`(신규) | 빌드 전 국내 10개 이상/해외 15개국 30개 도시 이상, 안전정보 국가 수=해외 국가 수, Timeline≥6/국가≥30/Gallery≥8 카운트 검사. 실패 시 누락 목록과 함께 종료 코드 1. | — | 없음. | CI(CI-PIPELINE) | P1 |

### L. Test — Unit / Integration

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 50 | UNIT-TRAVEL-DATES | 날짜 검증 Unit Test | UNIT_TEST | IMPLEMENT | REQ-FUNC-013,021 | — | — | — | CMP-SCR003-FLIGHT, CMP-SCR003-HOTEL | `src/lib/__tests__/travel-dates.test.ts`(신규) | 과거 출발일/체크인, 역전 날짜, 체크인=체크아웃 등 경계값 케이스 전수 검증(statement 커버리지 목표 80% 이상). | — | 없음. | `npm test`(Vitest 등) | P1 |
| 51 | UNIT-CONTACT-DETECTION | 연락처 탐지 Unit Test | UNIT_TEST | IMPLEMENT | REQ-FUNC-032 | — | — | — | CMP-SCR003-MATE-WRITE | `src/lib/__tests__/contact-detection.test.ts`(신규) | 전화번호·이메일·메신저 ID 패턴 샘플셋 기준 탐지율 검증(목표 95% 이상, 오탐 5% 이하). | — | 없음. | `npm test` | P1 |
| 52 | UNIT-MATE-STATE | 동행 상태 전이 Unit Test | UNIT_TEST | IMPLEMENT | REQ-FUNC-035,036,037 | — | — | — | API-MATE-POSTS, API-MATE-APPLICATIONS | `src/lib/__tests__/mate-state.test.ts`(신규) | PENDING→ACCEPTED/REJECTED, OPEN→CLOSED(종료일 경과 계산) 등 상태 전이 규칙 전수 검증. | — | 없음. | `npm test` | P1 |
| 53 | TEST-RLS-BASIC | RLS 정책 기본 검증 | INTEGRATION_TEST | IMPLEMENT | REQ-FUNC-044; REQ-NF-013 | — | — | — | DB-RLS-BASE, DB-SEED-BASE | `supabase/tests/rls_basic.sql` 또는 `scripts/test_rls.py`(신규) | 권한별(Guest/Adult Member/Owner/Moderator/Admin) 부정 접근 테스트가 전부 403 또는 빈 결과인지 확인. | — | RLS 우회 0건. | DB 정책 테스트 실행 | P1 |

### M. Test — E2E (Playwright, Chromium Smoke만)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 54 | E2E-PUBLIC-SMOKE | 공개 열람 Smoke(SCR-001/002/004) | E2E | IMPLEMENT | REQ-FUNC-001,004,006,046,057; REQ-NF-019 | SCR-001, SCR-002, SCR-004 | `/`, `/about`, `/mates` | — | PAGE-SCR001, PAGE-SCR002, PAGE-SCR004 | `tests/e2e/public-smoke.spec.ts`(신규) | **Chromium 단일 브라우저**로 5~7개 핵심 흐름 검증: 여행지 목록→상세 Drawer, 안전정보 Drawer, 대표 소개 열람, 동행 목록 열람, SCR-001 Mobile(390px) 반응형 확인. 다른 브라우저·성능·부하 테스트 범위는 포함하지 않음. | — | 없음(공개 화면). | `npx playwright test`(Chromium) | P1 |
| 55 | E2E-TRAVEL-TOOLS | 여행 준비 Smoke(SCR-003) | E2E | IMPLEMENT | REQ-FUNC-011,014,016,019,022,024; REQ-NF-011,017 | SCR-003 | `/travel-tools` | — | PAGE-SCR003 | `tests/e2e/travel-tools.spec.ts`(신규) | **Chromium 단일 브라우저**로 항공 조건 입력→요약→외부 이동, 숙소 조건 입력→요약→외부 이동, 비전달 고지 노출, 외부 링크 접근 가능 여부(배포 전 1회성 점검) 흐름 검증. | — | 입력값이 네트워크 요청에 포함되지 않는지 확인. | `npx playwright test`(Chromium) | P1 |
| 56 | E2E-MATE-AUTH | 동행·인증 Smoke(SCR-004/005) | E2E | IMPLEMENT | REQ-FUNC-027,028,031,034,036,039,040,066 | SCR-004, SCR-005 | `/mates`, `/account` | — | PAGE-SCR004, PAGE-SCR005 | `tests/e2e/mate-auth.spec.ts`(신규) | **Chromium 단일 브라우저**로 로그인→성인 확인→동행글 작성→참가 요청→승인→신고/차단 흐름 검증(약 6~7개 흐름을 이 Task 하나로 묶음). | — | 비로그인 상태에서 쓰기 액션 시도 시 로그인 안내로 리다이렉트되는지 확인. | `npx playwright test`(Chromium) | P1 |

### N. CI / Deploy

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 57 | CI-PIPELINE | CI 게이트(typecheck/lint/test) | CI | IMPLEMENT | REQ-NF-031 | — | — | — | UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION, UNIT-MATE-STATE, TEST-RLS-BASIC, E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, E2E-MATE-AUTH, GOV-CONTENT-COMPLETENESS | `.github/workflows/ci.yml` 또는 Vercel 빌드 훅(신규) | TypeScript strict, ESLint, Unit/Integration/E2E 테스트, 콘텐츠 완전성 스크립트를 main 병합 전 게이트로 실행. | — | 없음. | CI 실행 결과(그린) | P2 |
| 58 | DEPLOY-VERCEL-SUPABASE-CHECK | Vercel/Supabase 배포 확인 | DEPLOY | IMPLEMENT | REQ-NF-012,016,034 | — | — | — | CI-PIPELINE | `vercel.json`(선택), 배포 체크리스트 문서(신규) | Vercel 배포 후 5개 Route 접근 가능 확인, 환경변수(Supabase URL/Key, 외부 URL)가 Vercel 프로젝트 설정에만 존재하고 클라이언트 번들에 노출되지 않는지 확인, TLS 적용 확인, 월 비용이 무료/저가 티어 범위인지 확인. **EC2·AWS 등 별도 인프라는 구성하지 않음.** | — | 비밀키 클라이언트 노출 0건. | 수동 확인(배포 후 브라우저 점검) | P2 |

---

## NON_IMPLEMENTATION (EXCLUDED, 29건)

`PROJECT_SCOPE.md` 판정을 그대로 인용한다. 상세 구현 Task를 만들지 않으며, 아래 표에서 항목 자체를 삭제하지 않는다.

| Requirement | 근거(EXCLUDED 사유) | 후속 방향 |
|---|---|---|
| REQ-FUNC-010 | 필터 상태 URL 동기화·공유 복원은 편의 기능으로 이번 범위에서 제외 | 트래픽/요청 패턴 확인 후 재우선순위화 검토 |
| REQ-FUNC-045 | 회원 탈퇴 시 30일 이내 삭제 등 개인정보 라이프사이클 자동화는 운영 프로세스 필요, MVP 범위 밖 | 운영 인력 확보 후 수동 삭제 프로세스부터 도입 |
| REQ-FUNC-055 | Editor/Admin 작성·검수·게시 워크플로는 CMS 성격, 콘텐츠는 정적 데이터로 개발자가 직접 관리 | 콘텐츠 편집자 채용 시 헤드리스 CMS 도입 검토 |
| REQ-FUNC-056 | 변경 이력 보존은 범용 감사 로그에 해당 | 감사 로그 인프라 도입 시 함께 설계 |
| REQ-FUNC-067 | 여행지·안전정보 통합 검색 UI는 편의 기능, 각 화면별 개별 검색으로 대체 | 검색 트래픽 분석 후 통합 검색 필요성 재검토 |
| REQ-FUNC-069 | Web Share API 공유 UI는 제외, 브라우저 기본 공유로 대체 | 사용자 피드백에 따라 재검토 |
| REQ-FUNC-071 | 행동 분석 이벤트 수집 파이프라인 미구축 | 분석 도구(GA4 등) 도입 시 이벤트 스키마부터 설계 |
| REQ-FUNC-072 | 여행지 콘텐츠 CRUD 관리자 화면은 전체 콘텐츠 CMS, 명시적 제외 기능 | 콘텐츠 볼륨 증가 시 CMS 도입 검토 |
| REQ-FUNC-073 | 미디어 업로드·라이선스 워크플로, 명시적 제외 기능 | CMS 도입과 함께 재검토 |
| REQ-FUNC-075 | 안전정보 stale 대시보드, 관리자 범위(신고 상태·외부 URL) 밖 | 운영 인력 확보 시 대시보드 추가 검토 |
| REQ-FUNC-076 | 관리자 감사 로그, 명시적 제외 기능(범용 감사 로그) | 컴플라이언스 요구 발생 시 전용 감사 로그 설계 |
| REQ-NF-001 | LCP p75 측정 인프라 없음 | 실사용자 트래픽 확보 후 RUM 도입 |
| REQ-NF-002 | INP p75 측정 인프라 없음 | 상동 |
| REQ-NF-003 | CLS p75 측정 인프라 없음 | 상동 |
| REQ-NF-004 | 동시 50명 부하 테스트, 명시적 제외 기능 | 트래픽 증가 시 부하 테스트 도구 도입 |
| REQ-NF-005 | 쓰기 API 응답 p95 측정 인프라 없음 | 모니터링 도구 도입 시 재검토 |
| REQ-NF-007 | Lighthouse CI 성능 예산 게이트, 성능/부하 테스트 인프라 제외 범위 | CI 고도화 시 추가 검토 |
| REQ-NF-008 | 가용성 SLA 측정·알림 체계 없음, Vercel/Supabase 기본 가용성에 의존 | SLA 계약 필요 시 모니터링 도구 도입 |
| REQ-NF-009 | 5xx 비율 모니터링 대시보드 없음 | 상동 |
| REQ-NF-010 | DB 백업 RPO/RTO, 명시적 제외 기능(자동 백업) | Supabase 유료 플랜 전환 시 재검토 |
| REQ-NF-018 | 개인정보 내보내기·삭제 요청 플로우, 운영 프로세스 필요 | REQ-FUNC-045와 함께 재검토 |
| REQ-NF-020 | 신고 24시간 1차 검토 SLA 추적 대시보드, 운영 인력 필요 | 운영 인력 확보 시 대시보드 추가 |
| REQ-NF-021 | 요청 속도 제한(rate limiting), 별도 인프라 필요 | 남용 징후 발견 시 우선 도입 |
| REQ-NF-022 | Moderator 조치 추적 가능성, 감사 로그 제외 범위 | REQ-FUNC-076과 함께 재검토 |
| REQ-NF-024 | axe 자동 검사 CI 파이프라인 미구축 | CI 고도화 시 추가 |
| REQ-NF-025 | 전체 UC 키보드·스크린리더 수동 검사는 Smoke 범위로 축소 | 접근성 감사 예산 확보 시 확대 |
| REQ-NF-029 | 라이선스 메타데이터 100% 검증, 미디어 업로드 워크플로 제외와 동일 사유 | REQ-FUNC-073과 함께 재검토 |
| REQ-NF-032 | 구조화 로그 시스템, 별도 로깅 인프라 필요 | 로깅 도구(Datadog 등) 도입 시 추가 |
| REQ-NF-033 | 5분 이내 장애 알림, 명시적 제외 기능(장애 알림) | 모니터링 도구 도입 시 추가 |

---

## Requirement Coverage 교차 확인

- REQ-FUNC-001 ~ 080(80건) + REQ-NF-001 ~ 034(34건) = **114건**, 삭제 없이 전수 등재.
- Task List `Requirement Ref`에 최소 1회 이상 등장하는 IMPLEMENT/IMPLEMENT(축소) Requirement: **85건**.
- `NON_IMPLEMENTATION` 표에 등재된 EXCLUDED Requirement: **29건**.
- 85 + 29 = **114건**, 빠진 Requirement ID 없음.
- 이 문서는 Task List만 제공한다. 구현 코드, Git Branch, Commit, Issue는 생성하지 않았다.
