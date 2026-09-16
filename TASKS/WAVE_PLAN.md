# Free Traveler — Wave Plan

- **생성:** `scripts/build_waves.py` (2026-09-16T12:34:42+00:00)
- **정본 선언:** 이 문서와 `TASKS/WAVE_STATE.json`의 Wave ID가 이후 `/run-wave` 등 실행 단계의 정본이다.
  Wave ID는 W01부터 실제로 필요한 만큼만 생성되며 W00~W10으로 미리 고정하지 않는다.
- **재생성:** `scripts/audit_tasks.py`를 다시 실행해 `TASKS/TASK_MANIFEST.csv`가 갱신되면, `wave_id` 열이 사라지므로 `scripts/build_waves.py`를 다시 실행해야 한다.

| Wave | 그룹 | Task 수 | Preview Checkpoint | 대표 그룹 |
|---|---|---:|---|---|
| `W01` | 2 | 5 | — | Airbnb 스타일 공통 UI, 정적 데이터, Layout |
| `W02` | 2 | 2 | — | Airbnb 스타일 공통 UI, 정적 데이터, Layout |
| `W03` | 2 | 1 | — | Airbnb 스타일 공통 UI, 정적 데이터, Layout |
| `W04` | 3 | 2 | — | Supabase Auth, 6개 Table, 기본 RLS + 서버 API 계층 |
| `W05` | 3 | 4 | — | Supabase Auth, 6개 Table, 기본 RLS + 서버 API 계층 |
| `W06` | 3 | 3 | — | Supabase Auth, 6개 Table, 기본 RLS + 서버 API 계층 |
| `W07` | 3 | 1 | — | Supabase Auth, 6개 Table, 기본 RLS + 서버 API 계층 |
| `W08` | 4 | 4 | — | SCR-001 메인 Component와 Page Owner |
| `W09` | 4 | 2 | — | SCR-001 메인 Component와 Page Owner |
| `W10` | 4 | 1 | 예(화면 Wave) | SCR-001 메인 Component와 Page Owner |
| `W11` | 5 | 3 | — | SCR-002 대표 소개 Component와 Page Owner |
| `W12` | 5 | 1 | 예(화면 Wave) | SCR-002 대표 소개 Component와 Page Owner |
| `W13` | 6 | 1 | — | SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner |
| `W14` | 6 | 3 | — | SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner |
| `W15` | 6 | 1 | 예(화면 Wave) | SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner |
| `W16` | 7 | 3 | — | SCR-004 동행 목록·상세·신청 Component와 Page Owner |
| `W17` | 7 | 1 | — | SCR-004 동행 목록·상세·신청 Component와 Page Owner |
| `W18` | 7 | 1 | — | SCR-004 동행 목록·상세·신청 Component와 Page Owner |
| `W19` | 7 | 1 | — | SCR-004 동행 목록·상세·신청 Component와 Page Owner |
| `W20` | 7 | 1 | 예(화면 Wave) | SCR-004 동행 목록·상세·신청 Component와 Page Owner |
| `W21` | 8 | 4 | — | SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner |
| `W22` | 8 | 1 | 예(화면 Wave) | SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner |
| `W23` | 8 | 1 | — | SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner |
| `W24` | 9 | 7 | — | Unit·Playwright·접근성·CI |
| `W25` | 9 | 2 | — | Unit·Playwright·접근성·CI |
| `W26` | 9 | 1 | — | Unit·Playwright·접근성·CI |
| `W27` | 10 | 1 | — | Vercel Preview와 Release 확인 |

---

## `W01` — Airbnb 스타일 공통 UI, 정적 데이터, Layout

| Task ID | Category | Depends On |
|---|---|---|
| `DATA-DESTINATIONS` | DATA | — |
| `DATA-REPRESENTATIVE` | DATA | — |
| `DATA-SAFETY` | DATA | — |
| `SHARED-DESIGN-TOKENS` | SHARED | — |
| `SHARED-POLICY-CONTENT` | SHARED | — |

## `W02` — Airbnb 스타일 공통 UI, 정적 데이터, Layout

| Task ID | Category | Depends On |
|---|---|---|
| `SHARED-HEADER-FOOTER` | SHARED | SHARED-DESIGN-TOKENS |
| `SHARED-TOAST-ALERT` | SHARED | SHARED-DESIGN-TOKENS |

## `W03` — Airbnb 스타일 공통 UI, 정적 데이터, Layout

| Task ID | Category | Depends On |
|---|---|---|
| `SHARED-ERROR-PAGES` | SHARED | SHARED-HEADER-FOOTER |

## `W04` — Supabase Auth, 6개 Table, 기본 RLS + 서버 API 계층

| Task ID | Category | Depends On |
|---|---|---|
| `DB-ACCESS` | DB | — |
| `DB-SCHEMA-BASE` | DB | — |

## `W05` — Supabase Auth, 6개 Table, 기본 RLS + 서버 API 계층

| Task ID | Category | Depends On |
|---|---|---|
| `API-ADMIN-SETTINGS` | API | DB-ACCESS, DB-SCHEMA-BASE |
| `API-AUTH-ADULT-VERIFY` | API | DB-ACCESS, DB-SCHEMA-BASE |
| `DB-RLS-BASE` | DB | DB-SCHEMA-BASE |
| `DB-SEED-BASE` | DB | DB-SCHEMA-BASE |

## `W06` — Supabase Auth, 6개 Table, 기본 RLS + 서버 API 계층

| Task ID | Category | Depends On |
|---|---|---|
| `API-MATE-POSTS` | API | DB-ACCESS, DB-RLS-BASE, DB-SCHEMA-BASE |
| `API-REPORTS` | API | DB-ACCESS, DB-RLS-BASE, DB-SCHEMA-BASE |
| `API-USER-BLOCKS` | API | DB-ACCESS, DB-RLS-BASE, DB-SCHEMA-BASE |

## `W07` — Supabase Auth, 6개 Table, 기본 RLS + 서버 API 계층

| Task ID | Category | Depends On |
|---|---|---|
| `API-MATE-APPLICATIONS` | API | API-MATE-POSTS, DB-ACCESS, DB-RLS-BASE, DB-SCHEMA-BASE |

## `W08` — SCR-001 메인 Component와 Page Owner

| Task ID | Category | Depends On |
|---|---|---|
| `CMP-SCR001-FAVORITES` | COMPONENT | — |
| `CMP-SCR001-DESTINATION-GRID` | COMPONENT | DATA-DESTINATIONS |
| `CMP-SCR001-SAFETY-DRAWER` | COMPONENT | DATA-SAFETY, SHARED-DESIGN-TOKENS |
| `CMP-SCR001-SEARCH` | COMPONENT | DATA-DESTINATIONS |

## `W09` — SCR-001 메인 Component와 Page Owner

| Task ID | Category | Depends On |
|---|---|---|
| `CMP-SCR001-DESTINATION-DRAWER` | COMPONENT | CMP-SCR001-DESTINATION-GRID, DATA-DESTINATIONS, DATA-SAFETY, SHARED-DESIGN-TOKENS |
| `CMP-SCR001-MATE-PREVIEW` | COMPONENT | API-MATE-POSTS, DB-ACCESS |

## `W10` — SCR-001 메인 Component와 Page Owner

**화면 Wave** — 이 Wave가 `DONE`이 되면 `/run-wave`는 다음 Wave로 자동 진행하지 않고 `WAITING_FOR_PREVIEW`로 종료한다(`CLAUDE.md` 규칙 22).

| Task ID | Category | Depends On |
|---|---|---|
| `PAGE-SCR001` | PAGE | CMP-SCR001-DESTINATION-DRAWER, CMP-SCR001-DESTINATION-GRID, CMP-SCR001-FAVORITES, CMP-SCR001-MATE-PREVIEW, CMP-SCR001-SAFETY-DRAWER, CMP-SCR001-SEARCH, DATA-DESTINATIONS, DATA-REPRESENTATIVE, DATA-SAFETY, SHARED-DESIGN-TOKENS, SHARED-HEADER-FOOTER |

## `W11` — SCR-002 대표 소개 Component와 Page Owner

| Task ID | Category | Depends On |
|---|---|---|
| `CMP-SCR002-COUNTRY-CHIPS` | COMPONENT | DATA-REPRESENTATIVE |
| `CMP-SCR002-GALLERY` | COMPONENT | DATA-REPRESENTATIVE |
| `CMP-SCR002-TIMELINE` | COMPONENT | DATA-REPRESENTATIVE |

## `W12` — SCR-002 대표 소개 Component와 Page Owner

**화면 Wave** — 이 Wave가 `DONE`이 되면 `/run-wave`는 다음 Wave로 자동 진행하지 않고 `WAITING_FOR_PREVIEW`로 종료한다(`CLAUDE.md` 규칙 22).

| Task ID | Category | Depends On |
|---|---|---|
| `PAGE-SCR002` | PAGE | CMP-SCR002-COUNTRY-CHIPS, CMP-SCR002-GALLERY, CMP-SCR002-TIMELINE, DATA-REPRESENTATIVE, SHARED-DESIGN-TOKENS, SHARED-HEADER-FOOTER |

## `W13` — SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner

| Task ID | Category | Depends On |
|---|---|---|
| `CMP-SCR003-TABS` | COMPONENT | SHARED-DESIGN-TOKENS |

## `W14` — SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner

| Task ID | Category | Depends On |
|---|---|---|
| `CMP-SCR003-FLIGHT` | COMPONENT | CMP-SCR003-TABS |
| `CMP-SCR003-HOTEL` | COMPONENT | CMP-SCR003-TABS |
| `CMP-SCR003-MATE-WRITE` | COMPONENT | API-AUTH-ADULT-VERIFY, API-MATE-POSTS, CMP-SCR003-TABS |

## `W15` — SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner

**화면 Wave** — 이 Wave가 `DONE`이 되면 `/run-wave`는 다음 Wave로 자동 진행하지 않고 `WAITING_FOR_PREVIEW`로 종료한다(`CLAUDE.md` 규칙 22).

| Task ID | Category | Depends On |
|---|---|---|
| `PAGE-SCR003` | PAGE | CMP-SCR003-FLIGHT, CMP-SCR003-HOTEL, CMP-SCR003-MATE-WRITE, CMP-SCR003-TABS, SHARED-DESIGN-TOKENS, SHARED-HEADER-FOOTER, SHARED-POLICY-CONTENT |

## `W16` — SCR-004 동행 목록·상세·신청 Component와 Page Owner

| Task ID | Category | Depends On |
|---|---|---|
| `CMP-SCR004-BLOCK` | COMPONENT | API-USER-BLOCKS |
| `CMP-SCR004-FILTER` | COMPONENT | API-MATE-POSTS |
| `CMP-SCR004-REPORT` | COMPONENT | API-REPORTS |

## `W17` — SCR-004 동행 목록·상세·신청 Component와 Page Owner

| Task ID | Category | Depends On |
|---|---|---|
| `CMP-SCR004-LIST` | COMPONENT | API-MATE-POSTS, CMP-SCR004-FILTER, DB-ACCESS |

## `W18` — SCR-004 동행 목록·상세·신청 Component와 Page Owner

| Task ID | Category | Depends On |
|---|---|---|
| `CMP-SCR004-DETAIL` | COMPONENT | CMP-SCR004-LIST, DB-RLS-BASE |

## `W19` — SCR-004 동행 목록·상세·신청 Component와 Page Owner

| Task ID | Category | Depends On |
|---|---|---|
| `CMP-SCR004-APPLICATION` | COMPONENT | API-AUTH-ADULT-VERIFY, API-MATE-APPLICATIONS, CMP-SCR004-DETAIL |

## `W20` — SCR-004 동행 목록·상세·신청 Component와 Page Owner

**화면 Wave** — 이 Wave가 `DONE`이 되면 `/run-wave`는 다음 Wave로 자동 진행하지 않고 `WAITING_FOR_PREVIEW`로 종료한다(`CLAUDE.md` 규칙 22).

| Task ID | Category | Depends On |
|---|---|---|
| `PAGE-SCR004` | PAGE | CMP-SCR004-APPLICATION, CMP-SCR004-BLOCK, CMP-SCR004-DETAIL, CMP-SCR004-FILTER, CMP-SCR004-LIST, CMP-SCR004-REPORT, SHARED-HEADER-FOOTER |

## `W21` — SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner

| Task ID | Category | Depends On |
|---|---|---|
| `CMP-SCR005-AUTH` | COMPONENT | API-AUTH-ADULT-VERIFY |
| `CMP-SCR005-PROFILE` | COMPONENT | API-AUTH-ADULT-VERIFY, DB-ACCESS |
| `CMP-SCR005-ADMIN` | COMPONENT | API-ADMIN-SETTINGS, API-REPORTS |
| `CMP-SCR005-MY-ACTIVITY` | COMPONENT | API-MATE-APPLICATIONS, API-MATE-POSTS, API-USER-BLOCKS |

## `W22` — SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner

**화면 Wave** — 이 Wave가 `DONE`이 되면 `/run-wave`는 다음 Wave로 자동 진행하지 않고 `WAITING_FOR_PREVIEW`로 종료한다(`CLAUDE.md` 규칙 22).

| Task ID | Category | Depends On |
|---|---|---|
| `PAGE-SCR005` | PAGE | CMP-SCR005-ADMIN, CMP-SCR005-AUTH, CMP-SCR005-MY-ACTIVITY, CMP-SCR005-PROFILE, SHARED-HEADER-FOOTER |

## `W23` — SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner

> 참고: `SHARED-SEO-METADATA`는 원래 그룹 힌트 2(Airbnb 스타일 공통 UI, 정적 데이터, Layout)였으나, 의존 관계상 그룹 8로 재배치됨.

| Task ID | Category | Depends On |
|---|---|---|
| `SHARED-SEO-METADATA` | SHARED | DATA-DESTINATIONS, DATA-REPRESENTATIVE, DATA-SAFETY |

## `W24` — Unit·Playwright·접근성·CI

| Task ID | Category | Depends On |
|---|---|---|
| `GOV-CONTENT-COMPLETENESS` | GOV | DATA-DESTINATIONS, DATA-REPRESENTATIVE, DATA-SAFETY |
| `SHARED-A11Y-FOCUS` | SHARED | SHARED-DESIGN-TOKENS |
| `TEST-RLS-BASIC` | INTEGRATION_TEST | DB-RLS-BASE, DB-SEED-BASE |
| `UNIT-TRAVEL-DATES` | UNIT_TEST | CMP-SCR003-FLIGHT, CMP-SCR003-HOTEL |
| `UNIT-CONTACT-DETECTION` | UNIT_TEST | CMP-SCR003-MATE-WRITE |
| `UNIT-MATE-STATE` | UNIT_TEST | API-MATE-APPLICATIONS, API-MATE-POSTS |
| `E2E-TRAVEL-TOOLS` | E2E | PAGE-SCR003 |

## `W25` — Unit·Playwright·접근성·CI

| Task ID | Category | Depends On |
|---|---|---|
| `E2E-MATE-AUTH` | E2E | PAGE-SCR004, PAGE-SCR005 |
| `E2E-PUBLIC-SMOKE` | E2E | PAGE-SCR001, PAGE-SCR002, PAGE-SCR004 |

## `W26` — Unit·Playwright·접근성·CI

| Task ID | Category | Depends On |
|---|---|---|
| `CI-PIPELINE` | CI | E2E-MATE-AUTH, E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, GOV-CONTENT-COMPLETENESS, TEST-RLS-BASIC, UNIT-CONTACT-DETECTION, UNIT-MATE-STATE, UNIT-TRAVEL-DATES |

## `W27` — Vercel Preview와 Release 확인

| Task ID | Category | Depends On |
|---|---|---|
| `DEPLOY-VERCEL-SUPABASE-CHECK` | DEPLOY | CI-PIPELINE |

