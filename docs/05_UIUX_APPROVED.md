# Free Traveler — UI/UX Approved Baseline

- **Document ID:** UIUX-APPROVED-001
- **기반 문서:** `02_SRS_BASELINE.md`, `PROJECT_SCOPE.md`, `03_UI_COVERAGE_ANALYSIS.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`
- **작성일:** 2026-09-15
- **상태:** UI/UX 설계 승인 완료 — **구현은 아직 시작되지 않음** (`src/app`에는 Next.js 기본 스타터 템플릿만 존재)

본 문서는 Baseline SRS(`02_SRS_BASELINE.md`)가 정의한 다수의 공개 Route를 5개 승인 디자인 Screen(SCR-001~005)으로 통합한 결과를 확정하고, 그에 대한 UI Route Contract와 Release Acceptance Criteria를 기록한다. REQ-FUNC-001~080, REQ-NF-001~034는 어떤 것도 삭제되지 않았으며, 제외된 기능은 `PROJECT_SCOPE.md`의 판정 그대로 `EXCLUDED`로 유지된다.

---

## 1. 기존 다중 Route → 5개 Screen 통합 매핑

`02_SRS_BASELINE.md` §3.5 "Page and Route Inventory"에 정의된 Route를 아래와 같이 5개 Screen의 탭·패널·Drawer·Modal로 통합한다. Route 자체가 삭제되는 것이 아니라, **별도 페이지 이동 없이 하나의 Screen 안에서 상태 전환으로 표현**된다.

| Baseline SRS Route | 통합 대상 Screen | 통합 방식 |
|---|---|---|
| `/` (홈) | SCR-001 | 그대로 유지 |
| `/destinations`, `/destinations/domestic`, `/destinations/overseas` | SCR-001 | 국내/해외 탭 + 필터로 통합(별도 라우트 없음) |
| `/destinations/[slug]` | SCR-001 | 같은 화면의 여행지 상세 **Drawer/Modal**로 통합 |
| `/flights` | SCR-003 | 통합 여행 준비 화면의 **항공편 탭**으로 통합 |
| `/hotels` | SCR-003 | 통합 여행 준비 화면의 **숙소 탭**으로 통합 |
| `/mates` | SCR-004 | 그대로 유지(목록) |
| `/mates/[id]` | SCR-004 | 같은 화면의 **상세 패널**(Desktop 분할/Mobile Drawer)로 통합 |
| `/mates/new` | SCR-003 | 통합 여행 준비 화면의 **동행 작성 탭**으로 통합 |
| `/safety`, `/safety/[countryCode]` | SCR-001 | 여행지 상세 Drawer에서 연결되는 **안전정보 Drawer/Modal**로 통합 |
| `/about` | SCR-002 | 그대로 유지 |
| `/auth/*`(가입·로그인·성인확인) | SCR-005 | **로그인/가입 탭**으로 통합 |
| `/my/*`(내 글·참가요청·차단) | SCR-005 | **내 활동 탭**으로 통합 |
| `/admin/*` | SCR-005 | **관리자 탭**으로 통합(신고 상태 변경·외부 URL 설정만) |

> Baseline SRS의 `API-01~17` 내부 API/Server Action 인터페이스는 Route 통합과 무관하게 그대로 유지되며, 화면 통합은 프론트엔드 페이지 구조에만 적용된다.

---

## 2. UI Route Contract

`design-reference/SCREEN_ROUTE_CONTRACT.json`(schema `traveler-screen-route-v1`)을 정본으로 한다.

### 2-1. 디자인 Screen(정확히 5개)

| Screen ID | 분류 | Route | Page Entry |
|---|---|---|---|
| SCR-001 | 핵심 | `/` | `src/app/page.tsx` |
| SCR-002 | 핵심 | `/about` | `src/app/about/page.tsx` |
| SCR-003 | 핵심 | `/travel-tools` | `src/app/travel-tools/page.tsx` |
| SCR-004 | 핵심 | `/mates` | `src/app/mates/page.tsx` |
| SCR-005 | 보조 | `/account` | `src/app/account/page.tsx` |

- `/travel-tools`(SCR-003)는 **항공·숙소·동행 작성 3개 탭**을 하나의 Page Entry 안에 포함한다.
- `/account`(SCR-005)는 **인증(로그인·가입·재설정)·프로필·내 활동·간단 관리자(신고 상태 변경·외부 URL 설정)** 를 역할 기반 탭으로 하나의 Page Entry 안에 포함한다.
- 5개 Route는 서로 중복되지 않으며, 5개 Page Entry도 서로 중복되지 않는다(검증 완료).

### 2-2. 기술 Route(Screen 수에 미포함)

| 이름 | Route | 용도 |
|---|---|---|
| auth-callback | `/auth/callback` | Supabase 이메일 인증 콜백, 완료 후 `/account`로 리다이렉트 |
| destinations-api | `/api/destinations` | SCR-001 목록·필터·검색 |
| safety-api | `/api/safety/[countryCode]` | SCR-001 안전정보 Drawer |
| mates-api | `/api/mates` | SCR-004 목록·작성·참가요청 |
| reports-api | `/api/reports` | SCR-004 신고 제출, SCR-005 관리자 처리 |
| admin-settings-api | `/api/admin/settings/outbound` | SCR-005 외부 URL 설정 저장 |
| not-found | `*` | `src/app/not-found.tsx` |
| error-boundary | `*` | `src/app/error.tsx` |

### 2-3. 필수 이동 관계(요약)

SCR-001 ↔ SCR-002 ↔ SCR-003 ↔ SCR-004 ↔ SCR-005 간 이동 관계는 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `required_navigation`을 정본으로 하며, `design-reference/UI_CONTRACT.md`의 화면별 "다른 화면으로의 이동" 절과 반드시 일치해야 한다.

---

## 3. Release Acceptance Criteria

아래 조건은 **UI/UX 설계 승인** 기준이며, 실제 코드 구현 완료 기준이 아니다. 현재 시점 상태를 있는 그대로 기록한다(허위 구현 기록 금지).

| # | 기준 | 현재 상태 |
|---|---|---|
| 1 | SCR-001~005 Route·Page Entry 중복 없음, Screen 수 정확히 5개 | **충족**(JSON 검증 완료) |
| 2 | 핵심 4개(SCR-001~004)·보조 1개(SCR-005) 구분 존재 | **충족**(`UI_CONTRACT.md` 화면 분류 절) |
| 3 | REQ-FUNC-001~080, REQ-NF-001~034 전수가 Screen/Route 또는 EXCLUDED로 추적됨 | **충족**(`docs/UIUX_TRACEABILITY.md`) |
| 4 | `src/app/page.tsx`가 Next.js 스타터 템플릿이 아닌 SCR-001 콘텐츠로 교체됨 | **미충족** — 현재 스타터 템플릿 상태 유지 중, 구현 미착수 |
| 5 | `src/app/about`, `/travel-tools`, `/mates`, `/account` Page Entry 실제 파일 생성 | **미충족** — 아직 파일 없음 |
| 6 | EXCLUDED로 판정된 기능(통합 검색, 콘텐츠 CMS, 감사 로그, 실시간 가격비교 문구, 별점 등)이 코드에 없음 | **해당 없음(코드 자체가 아직 없음)** |
| 7 | Playwright 핵심 Smoke Test가 5개 Desktop Screen + 2개 Mobile 변형(SCR-001, SCR-003)에 대해 통과 | **미충족** — 테스트 미작성 |
| 8 | 화면별 Loading/Success/Empty/Error/Unauthorized 상태가 `UI_CONTRACT.md` 정의대로 구현 | **미충족** — 구현 전 |
| 9 | Vercel 배포 후 5개 Route 접근 가능 | **미충족** — 배포 전 |

> 이 표는 승인된 설계를 구현 착수의 기준선으로 삼기 위한 체크리스트이며, 각 Task 완료 시 `docs/UIUX_TRACEABILITY.md`의 해당 행 `Task`/`Status`를 갱신해 반영한다.

---

## 4. 승인 결론

- 5개 디자인 Screen(SCR-001~005)과 그 Route·Page Entry를 UI/UX 구현 정본으로 승인한다.
- Baseline SRS의 다중 공개 Route는 삭제되지 않고 위 §1의 매핑대로 5개 Screen의 탭·패널·Drawer·Modal 상태로 재구성된다.
- REQ-FUNC-001~080, REQ-NF-001~034는 전수 유지되며 구현 여부는 `PROJECT_SCOPE.md` 판정(IMPLEMENT/EXCLUDED)을 따른다.
- 본 승인은 **설계 승인**이며, §3 Release Acceptance Criteria가 모두 충족되기 전까지 "구현 완료"로 간주하지 않는다.
