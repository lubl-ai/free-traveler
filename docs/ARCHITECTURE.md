# Free Traveler — Architecture

- **Document ID:** ARCH-001
- **기반 문서:** `package.json`, `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `TASKS/TASK_MANIFEST.csv`
- **작성일:** 2026-09-16
- **상태:** Implementation Boundary Baseline — 이 문서는 "무엇을 어떻게 짓는가"의 경계를 정의하며, 구현 코드는 포함하지 않는다.

---

## 1. 기술 스택

| 계층 | 기술 | 근거 |
|---|---|---|
| 프레임워크 | **Next.js App Router**(`next@16.3.4`) | `package.json`, `SCREEN_ROUTE_CONTRACT.json`의 `framework: nextjs-app-router` |
| 언어 | **TypeScript**(`typescript@^5`) | `package.json` |
| UI 런타임 | React 19 (`react`, `react-dom`) | `package.json` |
| 스타일 | Tailwind CSS 4(`tailwindcss`, `@tailwindcss/postcss`) + `design-reference/D-001/DESIGN.md` 토큰 | `package.json`, `D-001/DESIGN.md` |
| 백엔드/DB | Supabase(Auth + PostgreSQL), **Auth와 동행 기능 중심으로만 사용**(§7) | `PROJECT_SCOPE.md` |
| ORM | **미사용** — Supabase JS 클라이언트로 직접 쿼리(§11) | — |
| 테스트 | **Vitest**(Unit) + **Playwright Chromium Smoke**(E2E)(§12) | `PROJECT_SCOPE.md`, `TASK_MANIFEST.csv`(`UNIT-*`, `E2E-*`) |
| CI/CD | **GitHub Actions** + **Vercel Preview**(§13) | `TASK_MANIFEST.csv`(`CI-PIPELINE`, `DEPLOY-VERCEL-SUPABASE-CHECK`) |
| 인프라 | Vercel(Web) + Supabase(DB/Auth) 단 둘. **AWS·EC2 미사용**(§14) | `PROJECT_SCOPE.md` |

현재 `package.json`에는 Next.js/React/Tailwind만 존재하고 Supabase·Vitest·Playwright 의존성은 아직 설치되지 않았다(§16 착수 차단 참조).

---

## 2. 화면 구조 — 핵심 화면 4개·보조 화면 1개

`SCREEN_ROUTE_CONTRACT.json`을 정본으로, 5개 디자인 Screen이 정확히 5개의 Next.js Page Entry에 대응한다.

| Screen | 분류 | Route | Page Entry |
|---|---|---|---|
| SCR-001 | 핵심 | `/` | `src/app/page.tsx` |
| SCR-002 | 핵심 | `/about` | `src/app/about/page.tsx` |
| SCR-003 | 핵심 | `/travel-tools` | `src/app/travel-tools/page.tsx` |
| SCR-004 | 핵심 | `/mates` | `src/app/mates/page.tsx` |
| SCR-005 | 보조 | `/account` | `src/app/account/page.tsx` |

핵심 4개(SCR-001~004)는 전역 Header의 4개 내비게이션 링크(홈/대표 소개/여행 준비/동행 찾기)에 직접 노출되고, 보조 1개(SCR-005)는 로그인/계정 진입점을 통해서만 도달한다(`design-reference/UI_CONTRACT.md`, `docs/06_SRS_UIUX_REVISED.md` §2). API Route·인증 콜백(`/auth/callback`)·오류 화면(`not-found`/`error`)은 기술 Route로, 5개 Screen 수에 포함하지 않는다.

---

## 3. Server Component와 Client Component 경계

| 구분 | 적용 대상 | 이유 |
|---|---|---|
| **Server Component(기본)** | 각 Page Entry의 최상위 컴포넌트, 정적 데이터(`src/data/*`) 렌더링, Supabase 서버 클라이언트로 읽는 목록·상세(동행글, 안전정보 stale 계산 등) | 초기 로드 성능, 비밀키를 서버에서만 사용 |
| **Client Component(`"use client"`)** | 검색·필터 입력, 여행지/안전정보 Drawer 열고 닫기, SCR-003 탭 전환과 항공·숙소 Form, 동행 작성 Form, 참가 요청/신고/차단 버튼, SCR-005 로그인/프로필 Form, 즐겨찾기 토글(`localStorage`) | 사용자 상호작용·브라우저 전용 상태(`localStorage`, Form 상태)가 필요한 영역만 한정 |

Server/Client 경계는 화면 전체가 아니라 상호작용이 필요한 최소 단위(버튼, Form, Drawer)로 좁혀 적용한다. 목록·상세의 정적 콘텐츠 표시 자체는 Server Component로 유지한다.

---

## 4. 항공·숙소 입력 Form — Client Component 일시 상태 전용

SCR-003(`/travel-tools`)의 항공편·숙소 조건 입력 Form은 **Client Component의 `useState`(또는 동등한 일시 상태)만 사용**하며, 다음을 명시적으로 금지한다.

- Server Action / Route Handler 호출로 입력값(국가·지역·출발일·귀국일 또는 체크인·체크아웃)을 서버에 전달하지 않는다.
- Supabase DB에 입력값을 저장하지 않는다(항공·숙소 전용 테이블을 만들지 않음, §8).
- 외부 이동 URL의 쿼리 파라미터·본문·쿠키에 입력값을 포함하지 않는다(설정된 외부 URL을 `target=_blank, rel="noopener noreferrer"`로 그대로 오픈).
- 서버 로그·분석 이벤트에 국가·지역·정확한 날짜를 기록하지 않는다.

브라우저 세션(탭 유지) 동안에만 값이 남고, 새로고침·탭 종료 시 소멸한다. 이 원칙은 `TASK_MANIFEST.csv`의 `CMP-SCR003-FLIGHT`, `CMP-SCR003-HOTEL` Task의 Security/Privacy AC와 동일하다.

---

## 5. 정적 데이터 — `src/data`

여행지·국가 안전정보·대표(free_traveler) 소개는 DB가 아닌 **TypeScript 정적 데이터 모듈**로 관리한다.

| 파일 | 내용 | 대응 Task |
|---|---|---|
| `src/data/destinations.ts` | 국내 10개 이상, 해외 15개국 30개 도시 이상 | `DATA-DESTINATIONS` |
| `src/data/safety.ts` | 소개된 모든 해외 국가의 8개 카테고리 안전정보 | `DATA-SAFETY` |
| `src/data/representative.ts` | 대표명·`50+ Trips`·`30+ Countries`·철학·타임라인·방문국가·추천 여행지 | `DATA-REPRESENTATIVE` |

콘텐츠 CRUD 관리자 화면·미디어 업로드 워크플로는 만들지 않는다(`PROJECT_SCOPE.md` EXCLUDED: REQ-FUNC-072, 073). 콘텐츠 변경은 코드 배포로만 이루어진다. 안전정보의 "최신성(stale)"은 별도 배치 없이 `verified_at` 값을 렌더링 시점에 7일 기준으로 계산해 표시한다.

---

## 6. Supabase 사용 범위 — Auth와 동행 기능 중심

Supabase는 다음 두 영역에만 사용하고, 그 외 용도로 확장하지 않는다.

1. **Auth**: 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정, 성인 확인 상태(`is_adult`, `adult_verified_at`, 생년월일 미저장).
2. **동행(Mate) 기능**: 동행글 CRUD, 참가 요청, 차단, 신고, 관리자 신고 상태 변경·외부 URL 설정.

여행지·안전정보·대표 소개(§5)는 Supabase를 거치지 않는다.

---

## 7. DB 스키마 — 정확히 6개 테이블

| 테이블 | 역할 |
|---|---|
| `USER_PROFILE` | 회원 프로필, 성인 확인 상태 |
| `MATE_POST` | 동행 모집글 |
| `MATE_APPLICATION` | 참가 요청 |
| `USER_BLOCK` | 차단 관계 |
| `REPORT` | 신고 |
| `APP_SETTING` | 관리자 외부 URL 설정(항공·숙소) |

`TASK_MANIFEST.csv`의 `DB-SCHEMA-BASE`가 이 6개 테이블 정의를 소유한다. 여행지·안전정보·대표 프로필·미디어·감사 로그 테이블은 만들지 않는다(§5, `PROJECT_SCOPE.md` EXCLUDED: REQ-FUNC-055, 056, 076).

---

## 8. Supabase Client 전략 — Browser·Server 분리

| Client | 위치 | 용도 |
|---|---|---|
| **Browser Client** | Client Component 내부(`src/lib/supabase/client.ts` 등) | 로그인 세션 확인, 클라이언트 측 Auth 상태 구독 |
| **Server Client** | Server Component·Route Handler·Server Action(`src/lib/db/client.ts`, `DB-ACCESS` Task) | RLS가 적용된 DB 읽기/쓰기, 비밀키(Service Role 등)는 서버 전용 환경변수로만 사용 |

비밀키는 클라이언트 번들에 포함되지 않으며(`NEXT_PUBLIC_` 접두어가 붙은 값만 브라우저에 노출), Server Client가 사용하는 키는 서버 실행 컨텍스트에서만 참조한다.

---

## 9. RLS 원칙 — 간단한 접근 규칙

6개 테이블 모두 RLS를 활성화하고, 다음 3단계 규칙만 적용한다(`DB-RLS-BASE` Task).

1. **본인 행만**: `USER_PROFILE`, `USER_BLOCK`은 `auth.uid()`와 일치하는 행만 읽기/쓰기 가능.
2. **작성자 또는 대상자만**: `MATE_POST`는 누구나 읽기 가능하되 수정·삭제는 작성자만, `MATE_APPLICATION`은 신청자 본인과 해당 글 작성자만 읽기/처리 가능.
3. **Admin만**: `REPORT`, `APP_SETTING`은 신고자 본인이 자신의 신고만 조회 가능하고, 상태 변경·설정 저장은 Admin 역할만 가능.

복잡한 계층적 정책, 커스텀 함수 기반 세분화 정책은 만들지 않는다.

---

## 10. ORM 미사용

Prisma 등 ORM을 도입하지 않는다. Supabase JS 클라이언트(`@supabase/supabase-js`)의 쿼리 빌더를 `DB-ACCESS` 계층(`src/lib/db/client.ts`)에서 직접 사용하고, 스키마 변경은 `supabase/migrations/*.sql`로 관리한다(`DB-SCHEMA-BASE`, `DB-RLS-BASE`).

---

## 11. 테스트 전략 — Vitest + Playwright Chromium Smoke

| 유형 | 도구 | 범위 |
|---|---|---|
| Unit | **Vitest** | 날짜 검증(`UNIT-TRAVEL-DATES`), 연락처 탐지(`UNIT-CONTACT-DETECTION`), 동행 상태 전이(`UNIT-MATE-STATE`) |
| Integration | 스크립트/SQL 기반 | RLS 정책 검증(`TEST-RLS-BASIC`) |
| E2E | **Playwright, Chromium 단일 브라우저**(Smoke만) | `E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH` |

다른 브라우저(Firefox/WebKit/Safari) 매트릭스, 성능·부하 테스트는 범위에 포함하지 않는다(`PROJECT_SCOPE.md` EXCLUDED: REQ-NF-004, 007 등).

---

## 12. CI/CD — GitHub Actions + Vercel Preview

- **GitHub Actions**(`CI-PIPELINE`): PR마다 TypeScript strict 검사, ESLint, Vitest, `scripts/check_content_completeness.py`(콘텐츠 완전성), Playwright Chromium Smoke를 실행하는 병합 게이트.
- **Vercel Preview**: PR마다 Preview 배포 자동 생성, `main` 병합 시 Production 배포(`DEPLOY-VERCEL-SUPABASE-CHECK`).
- **자동 Merge는 사용하지 않는다** — PR 병합은 항상 사람이 검토 후 수행한다(`PROJECT_SCOPE.md` 금지 목록).

---

## 13. 인프라 — AWS·EC2 미사용

배포·호스팅은 **Vercel(Web) + Supabase(DB/Auth)** 두 서비스로 한정한다. EC2, ECS, Lambda, S3 등 AWS 리소스나 별도 컨테이너/서버 인프라를 구성하지 않는다(`PROJECT_SCOPE.md` 명시적 제외 기능).

---

## 14. 착수 차단(Bootstrap Blockers)

아래는 **실제로 파일 또는 환경변수가 존재하지 않아** 구현 착수 전에 준비해야 하는 항목만 기록한다(추측성 항목 제외).

| # | 항목 | 현재 상태 | 필요 조치 |
|---|---|---|---|
| 1 | `@supabase/supabase-js` 의존성 | `package.json`에 없음 | `npm install @supabase/supabase-js` |
| 2 | `vitest` 및 테스트 유틸 의존성 | `package.json`에 없음 | `npm install -D vitest` |
| 3 | `@playwright/test` 의존성 | `package.json`에 없음 | `npm install -D @playwright/test`, `npx playwright install chromium` |
| 4 | Supabase 프로젝트 환경변수(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, 서버 전용 Service Role 키) | 저장소에 `.env.local`/`.env.example` 파일 없음, 값 미설정 | Supabase 프로젝트 생성 후 `.env.local`에 키 설정(커밋 금지), 팀 공유용 `.env.example`에 키 이름만 기록 |
| 5 | 항공·숙소 외부 URL 환경변수(`FLIGHT_OUTBOUND_URL`, `HOTEL_OUTBOUND_URL`) | 미설정 | 기본값 또는 관리자 설정 값을 환경변수/`APP_SETTING` 테이블에 준비 |
| 6 | `supabase/` 마이그레이션 디렉터리 | 저장소에 없음(`DB-SCHEMA-BASE` 미착수) | `DB-SCHEMA-BASE` Task 수행 시 `supabase/migrations/0001_schema.sql` 생성 |
| 7 | `.github/workflows/` CI 설정 | 저장소에 없음 | `CI-PIPELINE` Task 수행 시 워크플로 파일 생성 |

`src/app/page.tsx`가 아직 Next.js 스타터 템플릿 상태인 것은 착수 차단이 아니라 `PAGE-SCR001` Task 자체의 작업 대상이다.

---

## 15. 명시적 범위 제외

다음은 이번 프로젝트 아키텍처 범위에서 완전히 제외한다(`PROJECT_SCOPE.md` 제외 기능과 동일).

- **콘텐츠 CMS**: 여행지·안전정보·대표 소개용 관리자 CRUD·미디어 업로드 워크플로를 만들지 않는다(§5).
- **외부 Email 공급자 연동**: 실제 이메일 발송(SendGrid 등)을 연동하지 않는다. 참가 요청/신고 처리 결과는 인앱 Toast로만 통지한다.
- **Monitoring/옵저버빌리티 도구**: APM, 구조화 로그 수집, 에러 트래킹(Sentry 등), 가용성·SLA 대시보드를 구성하지 않는다. 장애 확인은 Vercel/Supabase 기본 대시보드 확인으로 대체한다.
- AWS·EC2 인프라(§13), 자동 Merge Runner(§12), Prisma/ORM(§10), 다중 브라우저·성능 테스트(§11)도 함께 제외한다.
