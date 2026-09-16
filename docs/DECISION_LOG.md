# Free Traveler — Decision Log

- **Document ID:** DECISION-LOG-001
- **작성일:** 2026-09-16
- **상태:** Active — 이후 결정은 새 DEC-ID를 추가하며, 기존 DEC-ID는 변경하지 않고 상태만 갱신(예: `확정` → `대체됨`)한다.

각 결정은 번복 없이 이후 모든 산출물(SRS 개정, UI Contract, Task List, Architecture)의 전제로 사용한다. 결정을 뒤집으려면 새 DEC-ID로 기존 항목을 "대체"하고, 기존 항목은 삭제하지 않는다.

---

## DEC-001 — 실제 개발 루트는 `traveler/app`

- **결정:** 프로젝트의 실제 Next.js 개발 루트(저장소 루트)는 `traveler/app`이다. `package.json`, `src/app`, `docs/`, `design-reference/`, `TASKS/`, `scripts/`는 모두 이 루트 기준 상대 경로로 관리한다.
- **배경:** 여러 산출물 경로를 인용할 때 루트 기준이 흔들리면 `Expected Files`·`Page Entry` 같은 경로 값이 문서마다 어긋난다. 이번 세션 전체(SRS 개정, UI Contract, Task List, Architecture)가 이 루트를 기준으로 작성되었다.
- **근거 문서:** `package.json`, `design-reference/SCREEN_ROUTE_CONTRACT.json`
- **상태:** 확정

## DEC-002 — 디자인 Screen은 핵심 4개·보조 1개

- **결정:** 디자인 Screen은 정확히 5개(SCR-001~005)로 고정하며, 이 중 SCR-001·SCR-002·SCR-003·SCR-004를 핵심 화면, SCR-005를 보조 화면으로 분류한다. 핵심 4개는 전역 Header의 4개 내비게이션 링크(홈/대표 소개/여행 준비/동행 찾기)에 직접 노출되고, 보조 1개(계정·관리)는 로그인/계정 진입점을 통해서만 도달한다.
- **배경:** Baseline SRS의 14개 개별 Route(`/destinations*`, `/flights`, `/hotels`, `/mates*`, `/safety*`, `/auth/*`, `/my/*`, `/admin/*` 등)를 그대로 구현하면 요구사항은 삭제하지 않되 화면 수가 과도하게 늘어난다. 5개 Screen으로 통합하고 나머지는 탭·패널·Drawer·Modal로 흡수하기로 결정했다.
- **근거 문서:** `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/05_UIUX_APPROVED.md` §1, `design-reference/SCREEN_ROUTE_CONTRACT.json`(`core_screen_ids`, `auxiliary_screen_ids`)
- **상태:** 확정

## DEC-003 — `/travel-tools`에 항공·숙소·동행 작성을 통합

- **결정:** 기존의 `/flights`, `/hotels`, `/mates/new` 세 개 Route를 하나의 Page Entry `src/app/travel-tools/page.tsx`(SCR-003) 안의 3개 탭(항공편/숙소/동행 구하기)으로 통합한다. 세 탭은 입력·검증·완료 상태를 서로 독립적으로 유지한다.
- **배경:** 세 기능 모두 "여행 조건을 정리하고 다음 행동으로 넘어간다"는 동일한 사용자 목표를 공유하므로 하나의 화면 안에서 전환하는 편이 이동 단계를 줄인다.
- **근거 문서:** `docs/05_UIUX_APPROVED.md` §1, `design-reference/UI_CONTRACT.md`(SCR-003), `TASKS/00_TASK_LIST.md`(`PAGE-SCR003`, `CMP-SCR003-TABS/FLIGHT/HOTEL/MATE-WRITE`)
- **상태:** 확정

## DEC-004 — 여행지·안전·대표는 정적 TypeScript Data

- **결정:** 여행지(`DESTINATION`), 국가 안전정보(`COUNTRY_SAFETY`), 대표 소개(`REPRESENTATIVE_PROFILE`) 콘텐츠는 Supabase DB 테이블이 아니라 `src/data/destinations.ts`, `src/data/safety.ts`, `src/data/representative.ts` TypeScript 정적 데이터 모듈로 관리한다.
- **배경:** 콘텐츠 CRUD 관리자 화면(CMS)과 미디어 업로드 워크플로는 이번 범위에서 EXCLUDED로 판정했다(DEC-014). 콘텐츠 변경 주체가 개발자뿐인 현재 단계에서는 DB·관리자 UI보다 코드 배포가 더 간단하고 타입 안전성도 확보된다.
- **근거 문서:** `docs/PROJECT_SCOPE.md`(REQ-FUNC-055, 072, 073 EXCLUDED 근거), `docs/ARCHITECTURE.md` §5
- **상태:** 확정

## DEC-005 — Supabase는 Auth와 동행 기능 중심

- **결정:** Supabase 사용 범위를 ① 이메일 Auth(가입·인증·로그인·로그아웃·재설정, 성인 확인 상태)와 ② 동행(Mate) 기능(모집글·참가 요청·차단·신고·관리자 설정) 두 영역으로 한정한다. 여행지·안전정보·대표 소개는 Supabase를 거치지 않는다(DEC-004).
- **배경:** 실제로 쓰기·권한 제어가 필요한 데이터(회원, 동행 상호작용)만 DB화하고, 나머지는 정적 데이터로 남겨 인프라 복잡도를 최소화한다.
- **근거 문서:** `docs/ARCHITECTURE.md` §6, `docs/PROJECT_SCOPE.md`
- **상태:** 확정

## DEC-006 — DB는 6개 Table로 제한

- **결정:** Supabase PostgreSQL 스키마는 `USER_PROFILE`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`, `APP_SETTING` 정확히 6개 테이블로 제한한다. 그 이상의 테이블(여행지·안전정보·대표 프로필·미디어·감사 로그 등)을 만들지 않는다.
- **배경:** DEC-004·DEC-005의 직접적 귀결이다. 감사 로그(REQ-FUNC-076)와 콘텐츠 CRUD(REQ-FUNC-072, 073)를 EXCLUDED로 판정했으므로 관련 테이블도 함께 배제한다.
- **근거 문서:** `docs/ARCHITECTURE.md` §7, `TASKS/00_TASK_LIST.md`(`DB-SCHEMA-BASE`), `scripts/audit_tasks.py`(검사 #12)
- **상태:** 확정

## DEC-007 — 항공·숙소 입력은 Browser Memory에만 유지

- **결정:** SCR-003의 항공·숙소 조건 입력값(국가·지역·출발일·귀국일 또는 체크인·체크아웃)은 Client Component의 일시 상태(`useState` 등)로만 유지한다. 서버 API·DB·외부 URL 쿼리·서버 로그·분석 이벤트 어디에도 전달·저장하지 않는다.
- **배경:** 실제 항공·호텔 검색/예약 기능은 범위 밖이며(Out of Scope), 사용자가 조건을 정리하도록 돕고 외부 사이트로 안내만 하는 것이 목적이다. 개인정보·행동 데이터를 최소 수집한다는 원칙과도 일치한다.
- **근거 문서:** `docs/ARCHITECTURE.md` §4, `TASKS/00_TASK_LIST.md`(`CMP-SCR003-FLIGHT`, `CMP-SCR003-HOTEL`의 Security/Privacy AC), `docs/PROJECT_SCOPE.md`
- **상태:** 확정

## DEC-008 — Airbnb DESIGN.md는 vendor 참고본, D-001이 실제 정본

- **결정:** `design-reference/vendor/airbnb/DESIGN.md`는 구성 원리(절제된 타이포, 카드 중심 레이아웃, 단일 포인트 컬러 운용)만 참고하는 vendor 자료이며, 실제 구현 시 따라야 할 디자인 정본은 `design-reference/D-001/DESIGN.md`(LOCKED)다. Airbnb 고유 상표·컴포넌트 명칭·색상명(Rausch 등)·폰트는 가져오지 않는다.
- **배경:** 참고 자료와 구현 정본을 구분하지 않으면 상표 요소가 실수로 섞여 들어갈 위험이 있다.
- **근거 문서:** `design-reference/D-001/DESIGN.md`(Overview, Do/Do Not), `design-reference/DESIGN_MANIFEST.md`(`Status: LOCKED`, `Vendor Reference`)
- **상태:** 확정

## DEC-009 — Playwright는 Chromium Smoke만 필수

- **결정:** E2E 테스트는 Playwright로 작성하되 **Chromium 단일 브라우저**의 Smoke Test로 한정한다(`E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH` 3개 Task). Firefox/WebKit/Safari 매트릭스, 성능·부하 테스트는 범위에 포함하지 않는다.
- **배경:** MVP 단계에서 브라우저 매트릭스·성능 테스트 인프라를 유지할 인력·예산이 없다. 핵심 흐름이 대표 브라우저에서 동작하는지 확인하는 것으로 충분하다.
- **근거 문서:** `docs/ARCHITECTURE.md` §11, `docs/PROJECT_SCOPE.md`(REQ-NF-004, 007 EXCLUDED), `scripts/audit_tasks.py`(검사 #15)
- **상태:** 확정

## DEC-010 — 사용자의 개발 실행 단위는 Wave

- **결정:** `TASKS/00_TASK_LIST.md`의 58개 Task를 한 번에 전부 실행하지 않고, 의존성 그래프(`Depends On`)를 기준으로 묶은 **Wave** 단위로 순차 실행한다(예: Wave 1 = 의존성 없는 기반 Task, Wave 2 = Wave 1에만 의존하는 Task, …). Wave 경계는 Task List의 `Depends On` 열이 전부 이전 Wave 안에서 해소되는 지점으로 정한다.
- **배경:** 58개 Task를 개별적으로 하나씩 지시하기보다 의존성이 끝난 묶음 단위로 진행 상황을 확인하는 편이 실행·검토 효율이 높다.
- **근거 문서:** `TASKS/00_TASK_LIST.md`(Depends On 열), `TASKS/TASK_MANIFEST.csv`
- **상태:** 확정

## DEC-011 — Single Agent가 Wave 내부 Task를 순차 수행

- **결정:** 하나의 Wave 안에서는 병렬 다중 Agent가 아니라 **Single Agent가 Task를 순차적으로** 수행한다. Task 간 병렬화는 이번 프로젝트 실행 방식으로 채택하지 않는다.
- **배경:** Task 상세 파일(`TASKS/TASK-<ID>.md`)의 Expected Files 경계가 Task 간에 겹치는 경우가 있어(예: 여러 Component가 같은 Page Owner의 하위 파일을 함께 건드릴 가능성), 동시 실행 시 충돌 위험이 있다. 순차 수행으로 충돌을 원천 차단한다.
- **근거 문서:** `TASKS/00_TASK_LIST.md`(Task별 Expected Files), DEC-010
- **상태:** 확정

## DEC-012 — PR·Merge는 사용자가 수동 수행

- **결정:** Pull Request 생성과 `main` 브랜치로의 Merge는 자동화하지 않고 사용자가 직접 검토 후 수동으로 수행한다.
- **배경:** 자동 Merge Runner는 명시적 금지 항목이다(DEC-013과 별개로 별도 채택된 프로세스 결정). 사람의 최종 검토 없이 코드가 `main`에 반영되는 흐름을 만들지 않는다.
- **근거 문서:** `docs/PROJECT_SCOPE.md`(제외 기능: 무인 자동 Merge Runner), `docs/ARCHITECTURE.md` §12, `scripts/audit_tasks.py`(검사 #16)
- **상태:** 확정

## DEC-013 — EC2·AWS는 사용하지 않음

- **결정:** 인프라는 Vercel(Web 배포) + Supabase(DB/Auth) 두 서비스로 한정한다. AWS EC2, ECS, Lambda, S3 등 AWS 리소스나 별도 컨테이너·서버 인프라를 구성하지 않는다.
- **배경:** MVP 단계에서 운영 인력 없이 관리 가능한 관리형 서비스만 사용해 운영 부담과 비용을 최소화한다.
- **근거 문서:** `docs/PROJECT_SCOPE.md`(제외 기능: EC2·AWS 인프라), `docs/ARCHITECTURE.md` §13, `scripts/validate_inputs.py`(검사 #11)
- **상태:** 확정

## DEC-014 — 제외 기능은 EXCLUDED로 관리

- **결정:** 범위에서 제외하는 모든 기능·요구사항은 삭제하지 않고 `EXCLUDED` 상태로 명시적으로 기록·추적한다. `docs/PROJECT_SCOPE.md`가 최초 판정을 내리고, `docs/06_SRS_UIUX_REVISED.md`·`docs/UIUX_TRACEABILITY.md`·`TASKS/00_TASK_LIST.md`(`NON_IMPLEMENTATION` 표)가 동일한 판정을 인용·유지한다.
- **배경:** "요구사항을 삭제하지 않는다"는 원칙을 지키면서도 구현 범위를 명확히 좁히려면, 제외를 별도 상태값으로 남기고 근거·후속 방향까지 함께 기록하는 방식이 필요했다.
- **근거 문서:** `docs/PROJECT_SCOPE.md`, `docs/06_SRS_UIUX_REVISED.md` §4, `docs/UIUX_TRACEABILITY.md`, `TASKS/00_TASK_LIST.md`(`NON_IMPLEMENTATION`), `scripts/audit_tasks.py`(검사 #17, #18)
- **상태:** 확정

---

## 결정 색인

| ID | 요약 | 상태 |
|---|---|---|
| DEC-001 | 개발 루트 = `traveler/app` | 확정 |
| DEC-002 | Screen 핵심 4개·보조 1개 | 확정 |
| DEC-003 | `/travel-tools`에 항공·숙소·동행 작성 통합 | 확정 |
| DEC-004 | 여행지·안전·대표 = 정적 TypeScript Data | 확정 |
| DEC-005 | Supabase = Auth·동행 기능 중심 | 확정 |
| DEC-006 | DB 6개 Table 제한 | 확정 |
| DEC-007 | 항공·숙소 입력 = Browser Memory 전용 | 확정 |
| DEC-008 | Airbnb DESIGN.md = vendor 참고, D-001 = 정본 | 확정 |
| DEC-009 | Playwright = Chromium Smoke만 필수 | 확정 |
| DEC-010 | 개발 실행 단위 = Wave | 확정 |
| DEC-011 | Wave 내부 = Single Agent 순차 수행 | 확정 |
| DEC-012 | PR·Merge = 사용자 수동 수행 | 확정 |
| DEC-013 | EC2·AWS 미사용 | 확정 |
| DEC-014 | 제외 기능 = EXCLUDED 관리 | 확정 |
