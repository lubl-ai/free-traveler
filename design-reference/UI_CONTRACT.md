# UI Contract — Free Traveler (Next.js App Router)

- **Document ID:** UI-CONTRACT-001
- **기반 문서:** `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/04_UIUX_PLAN.md`, `docs/STITCH_VALIDATION_REPORT.md`, `design-reference/D-001/DESIGN.md`
- **작성일:** 2026-09-15
- **상태:** Implementation Contract (5개 승인 Screen → Next.js App Router 라우트로 변환)

본 문서는 승인된 5개 Screen(SCR-001~005)을 `src/app` 구현 계약으로 확정한다. 화면 수·라우트·컴포넌트·상태·이동 관계는 여기 기록된 대로 구현하며, 임의로 화면을 추가하거나 금지 기능을 복원하지 않는다.

## 화면 분류

| 구분 | Screen |
|---|---|
| **핵심 화면 4개** | SCR-001, SCR-003, SCR-004 — 전역 헤더의 4개 내비게이션 링크(홈/대표 소개/여행 준비/동행 찾기)에 직접 노출되는 화면. *(대표 소개는 SCR-002)* |
| **보조 화면 1개** | SCR-005 — 헤더의 로그인/계정 진입점을 통해서만 도달하는 유틸리티 화면(주 내비게이션에 없음) |

> 주 내비게이션 4개 링크(`design-reference/D-001/DESIGN.md` Header 절)는 SCR-001·SCR-002·SCR-003·SCR-004에 대응하므로 이 4개가 핵심 화면이며, SCR-005(계정·관리)는 로그인 버튼/아바타를 통해서만 진입하는 보조 화면이다.

---

## SCR-001 — 메인

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-001 |
| **Route** | `/` |
| **Page Entry** | `src/app/page.tsx` |
| **영역 순서** | Header(공통) → ① 검색 Hero(`/travel-tools` CTA 포함) → ② 국내 인기 여행지 Card Grid(6) → ③ 해외 인기 여행지 Card Grid(6) → ④ 여행 동기·테마 Chip(6) → ⑤ 국가별 주의사항 Card(6, Drawer 연결) → ⑥ 최근 동행글(3) 또는 완성형 Empty State → ⑦ free_traveler 요약 CTA Banner(`/about`) → Footer(공통) |
| **주요 Component** | `search-bar-pill`, `destination-card`×12, `filter-chip`×6, 안전정보 `destination-card` 변형×6(경보 라벨+최종 확인일), `Drawer`(여행지 상세 ↔ 안전정보 상세 전환), `mate-post-card`(mini)×3 또는 EmptyState, CTA Banner |
| **상태** | Loading(카드 스켈레톤) · Success · Empty(⑥만 해당, 완성형 Empty State) · Error(카드 목록 로드 실패 시 Section 단위 재시도 배너). Unauthorized 없음(전체 공개) |
| **사용자 행동** | 검색어 입력, 테마 Chip 선택(필터 적용), 여행지 카드 클릭(같은 화면 Drawer 오픈), 즐겨찾기 토글(localStorage), 안전정보 카드 클릭(Drawer 오픈), 동행글 카드 클릭 |
| **다른 화면으로의 이동** | Hero CTA → `/travel-tools` · 안전정보 Drawer 내 링크 → 같은 Drawer 스택에서 안전정보 상세로 전환(페이지 이동 아님) · ⑥ "동행 더 보기"/작성 CTA → `/mates` · ⑦ CTA → `/about` |
| **Desktop·Mobile 규칙** | Desktop 1440px, 콘텐츠 폭 1240px, Section 여백 80px, Hero 높이 560~640px(다음 Section 헤드라인 노출). Mobile 390px 변형 승인됨(1열 스택, Header 로고+햄버거, Hero 480px 내외, Section 여백 48px) |
| **금지 기능** | 스타터 템플릿 잔존 금지(`starter_template_forbidden`) · 여행지·안전정보 통합 검색 UI(EXCLUDED) · URL 공유 버튼(EXCLUDED) · "실시간" 항공권/호텔 검색·가격비교 암시 문구 · Lorem ipsum/`준비 중`/`정보 확인 필요` · Airbnb 상표 요소 · 구매·예약·결제 UI · 별점·리뷰 |

---

## SCR-002 — 대표 소개

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-002 |
| **Route** | `/about` |
| **Page Entry** | `src/app/about/page.tsx` |
| **영역 순서** | Header(공통) → ① Profile Hero(대표 사진+한 줄 소개) → ② 여행 지표(`50+ Trips`/`30+ Countries`) → ③ 소개·철학(2~4문단, 좌우 분할) → ④ 여행 Timeline(6개 이상) → ⑤ 방문 국가 Chip(권역별, 30개 이상) → ⑥ Gallery(8장 이상) → ⑦ 기억에 남는 여행지 4개+CTA Banner → Footer(공통) |
| **주요 Component** | Profile Hero, 통계 카드×2, 좌우 분할 텍스트 블록, Timeline 리스트, 권역별 `filter-chip` 그룹×4, Gallery Grid(사진 8+), `destination-card`×4, CTA Banner |
| **상태** | Success 위주(정적 콘텐츠, 로딩 스켈레톤은 이미지에만 적용) · Error(이미지 로드 실패 시 대체 배경+alt 텍스트 유지). Empty/Unauthorized 없음 |
| **사용자 행동** | 방문 국가 Chip 클릭(관련 여행지로 이동), 추천 여행지 카드 클릭, 하단 CTA 클릭 |
| **다른 화면으로의 이동** | 방문 국가·추천 여행지 클릭 → `/`의 해당 여행지 상세 Drawer(SCR-001) · CTA "여행 준비 시작하기" → `/travel-tools` · CTA "동행 찾아보기" → `/mates` |
| **Desktop·Mobile 규칙** | Desktop 1440px, 콘텐츠 폭 1200px, Section 여백 80px, Hero 높이 560~640px. 별도 Mobile Stitch 변형은 미승인이나 D-001 공통 반응형 규칙(390px, 1열, 여백 40~64px)을 그대로 적용해 구현한다 |
| **금지 기능** | 별점·매너온도 등 리뷰 요소 · Airbnb 상표 요소 · 구매·예약·결제 UI · 콘텐츠 CRUD/CMS 업로드 UI · Lorem ipsum/`준비 중`/`정보 확인 필요` |

---

## SCR-003 — 통합 여행 준비

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-003 |
| **Route** | `/travel-tools` |
| **Page Entry** | `src/app/travel-tools/page.tsx` |
| **영역 순서** | Header(공통) → ① Intro(목적·이용 순서) → ② 3탭 전환(항공편/숙소/동행 구하기) → ③ 조건 입력 Form(국가·지역·출발일·귀국일 또는 체크인·체크아웃) → ④ 입력 요약+외부 이동 Action Card → ⑤ 찾기 Tip 3단계 → ⑥ 동행 탭 콘텐츠(로그인 안내 카드 또는 작성 Form+안전수칙 동의) → Footer(공통) |
| **주요 Component** | Intro band, `tab-pill`×3(항공편/숙소/동행 구하기), `text-input`×4, Action Card+`button-primary`(외부 이동), Tip 카드×3(3단계 안내), 로그인 유도 Info Card(`info` 톤) 또는 동행 작성 Form |
| **상태** | Loading(외부 이동 버튼 처리 중) · Success(요약 확인) · Error(날짜 검증 실패, 외부 URL 연결 실패 시 재시도 배너) · Unauthorized(동행 탭에서 비로그인·성인 미확인 시 로그인 안내 카드로 대체) |
| **사용자 행동** | 탭 전환(항공편/숙소/동행 구하기, 3개 상태 상호 독립), 국가·지역·날짜 입력 및 검증, 요약 확인, 외부 이동 버튼 클릭, 동행글 작성 제출, 안전수칙 동의 체크, 연락처 패턴 탐지 시 수정 |
| **다른 화면으로의 이동** | "항공편/숙소 보러 가기" → 설정된 외부 사이트(새 탭, `noopener,noreferrer`, query 없음) · 동행 탭 "로그인하고 성인 인증하기" → `/account`(로그인 탭) · 동행글 작성 완료 → `/mates`의 해당 글 상세 |
| **Desktop·Mobile 규칙** | Desktop 1440px, 콘텐츠 폭 ~960px(폼 중심), Section 여백 64~80px. Mobile 390px 변형 승인됨(풀폭 세그먼트 탭, 56px 입력 필드, 여백 48px, 터치 영역 44px+) |
| **금지 기능** | "실시간 최적 노선 및 가격 비교" 등 실시간 항공권/호텔 검색·가격비교를 암시하는 문구(검증 보고서에서 발견된 위반 — 재발 금지) · 입력값 서버 저장/외부 URL 쿼리·본문·쿠키 전달 · 구매·예약·결제·발권 UI · 실제 이메일 발송 연동 · Lorem ipsum/`준비 중`/`정보 확인 필요` |

---

## SCR-004 — 동행 조회

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-004 |
| **Route** | `/mates` |
| **Page Entry** | `src/app/mates/page.tsx` |
| **영역 순서** | Header(공통) → ① Intro+작성 CTA → ② 검색 Filter(국가·지역·기간·모집 상태)+결과 요약 → ③ 동행글 목록(최대 8개 우선 노출, 데이터 없으면 완성형 Empty State) → ④ 목록+상세 분할(Desktop) / 목록→상세 Drawer(Mobile) → ⑤ 참가 신청 방법 3단계 → ⑥ 안전·신고·차단 안내+`/travel-tools` CTA → Footer(공통) |
| **주요 Component** | Filter Bar(드롭다운+결과 요약 텍스트), `mate-post-card`×N(모집중/마감 배지), 상세 패널(제목·조건·설명·작성자 정보·`button-primary`"참가 요청 보내기"·신고/차단 텍스트 링크), 3단계 안내 카드, CTA Banner |
| **상태** | Loading(목록/상세 스켈레톤) · Success · Empty(검색 결과 0건, 완성형 Empty State: 필터 초기화+작성 CTA+이용 방법) · Error(참가 요청/신고 제출 실패 배너) · Unauthorized(참가 요청·신고·차단 시도 시 로그인/성인 확인 안내로 전환) |
| **사용자 행동** | 필터 변경, 필터 초기화, 카드 클릭(상세 열람), 참가 요청 메시지 제출, 신고, 차단, 작성 CTA 클릭 |
| **다른 화면으로의 이동** | "새 동행글 작성하기" → `/travel-tools`(동행 구하기 탭) · 비로그인/성인 미확인 시도 → `/account`(로그인 탭) · "내 활동에서 관리" 유도 링크 → `/account`(내 활동 탭) |
| **Desktop·Mobile 규칙** | Desktop 1440px, 콘텐츠 폭 1240px(목록 40%+상세 60% 분할), Section 여백 64~80px. Mobile 390px: 카드 탭 시 하단 Drawer로 상세 오픈 |
| **금지 기능** | 별점·매너온도·"N회 성공" 등 리뷰/신뢰도 수치(검증 보고서에서 발견된 위반 — 재발 금지) · 실시간 위치 공유·채팅·영상통화 · 미성년 동행 · 공개 연락처(전화번호·이메일·메신저 ID) 노출 · Lorem ipsum/`준비 중`/`정보 확인 필요` |

---

## SCR-005 — 계정·관리

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-005 |
| **Route** | `/account` |
| **Page Entry** | `src/app/account/page.tsx` |
| **영역 순서** | Header(공통) → 역할별 탭(현재 역할에 해당하는 탭만 렌더링): **Guest** — 계정 기능 Intro → 로그인/가입/비밀번호 재설정 Card → 로그인 후 가능한 기능 Chip → 보안 안내 Card / **Member** — 프로필·성인 확인 요약 → 내 글(작성 글+완성형 Empty State) → 참가 요청(보낸/받은) → 차단 목록(완성형 Empty State) → 새 동행글 작성 CTA / **Admin** — 관리 Intro → 신고 상태 변경 → 항공·숙소 외부 URL 설정 → Footer(공통) |
| **주요 Component** | Role `tab-pill`(프로필/내 활동/관리자 — 권한 없는 탭은 렌더링하지 않음), 로그인/가입 Form, 프로필 Form(닉네임·연령대·성별·여행 스타일·자기소개), 보안 Info Card(`info` 톤), `mate-post-card`(mini) 목록, 참가 요청 리스트(상태 배지), 차단 목록, 신고 큐 리스트(상태 변경 컨트롤), 외부 URL 설정 Form |
| **상태** | Loading(프로필/목록 스켈레톤) · Success(역할별) · Empty(내 글·참가 요청·차단 목록·신고 목록 각각 완성형 Empty State) · Error(저장/상태 변경 실패 문구) · Unauthorized(Guest가 프로필·내 활동·관리자 URL 직접 접근 시 로그인 탭으로 리다이렉트, Member가 관리자 탭 접근 시 접근 불가 안내) |
| **사용자 행동** | 로그인/가입/비밀번호 재설정, 프로필 수정, 성인 확인, 내 글 수정·마감·삭제, 참가 요청 승인/거절, 차단 해제, 신고 상태 변경(접수/처리중/처리완료), 외부 URL 저장 |
| **다른 화면으로의 이동** | 내 글/즐겨찾기 항목 → `/`(SCR-001) 또는 `/mates`(SCR-004)의 해당 상세 · "새 동행글 작성하기" → `/travel-tools`(동행 구하기 탭) |
| **Desktop·Mobile 규칙** | Desktop 1440px, 콘텐츠 폭 ~960px, Section 여백 64~80px. 별도 Mobile Stitch 변형은 미승인이나 D-001 공통 반응형 규칙을 적용해 구현한다 |
| **금지 기능** | 관리자 탭에 신고 상태 변경·외부 URL 설정 **외**의 기능(콘텐츠 CRUD, 범용 감사 로그, 통계 Dashboard, 미디어 업로드 워크플로) 추가 금지 · 실제 이메일 발송 연동 · Lorem ipsum/`준비 중`/`정보 확인 필요` · Airbnb 상표 요소 |

---

## 기술 Route (Screen 수에 포함하지 않음)

API Route, 인증 콜백, 오류 처리(404/500)는 디자인 Screen이 아닌 기술 Route로 별도 관리하며 위 5개 Screen 수에 포함하지 않는다. 상세 목록은 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `technical_routes`를 참조한다.
