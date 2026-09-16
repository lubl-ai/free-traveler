---
name: traveler-project-pipeline
description: Traveler PRD/SRS에서 Task를 생성·상세화·감사하고 5개 Screen과 Wave 개발을 지원하는 프로젝트 Skill
---

# Traveler Project Pipeline

이 Skill은 Free Traveler 저장소에서 PRD/SRS로부터 Task를 생성·상세화·감사하고, 5개 Screen과 Wave 기반 개발을 지원하는 규칙집이다. `/gen-tasklist`, `/gen-task-details`, `/audit-tasks`, `/run-wave WXX` 커맨드는 모두 이 Skill의 규칙을 정본으로 삼는다.

**루트 `CLAUDE.md`의 전역 규칙이 항상 우선한다.** 이 Skill은 `CLAUDE.md`를 보충·구체화할 뿐 그것과 다른 값을 정의하지 않는다(Harness Marker, Wave 실행 방식, Expected Files 경계, EXCLUDED 처리, Playwright 범위, Supabase/DB 제약 등은 `CLAUDE.md`와 동일한 값을 사용한다).

---

## 1. 입력 문서 목록

| 문서 | 역할 |
|---|---|
| `docs/06_SRS_UIUX_REVISED.md` | REQ-FUNC-001~080, REQ-NF-001~034 전수와 Implementation Status(정본) |
| `docs/PROJECT_SCOPE.md` | 각 Requirement의 IMPLEMENT/EXCLUDED 판정 근거·처리 방법·확인 방법(정본) |
| `docs/UIUX_TRACEABILITY.md` | Requirement ↔ Screen ↔ Route ↔ Page Entry 매핑 |
| `design-reference/D-001/DESIGN.md` | 디자인 토큰, Section 계약, Empty State 규칙(LOCKED 정본) |
| `design-reference/UI_CONTRACT.md` | Screen별 영역 순서·컴포넌트·상태·이동·금지 기능 |
| `design-reference/SCREEN_ROUTE_CONTRACT.json` | Screen·Route·Page Entry 정본(schema `traveler-screen-route-v1`) |
| `TASKS/00_TASK_LIST.md` | Task List(구현 Task 표) + `NON_IMPLEMENTATION`(EXCLUDED) 표 |
| `TASKS/TASK-<ID>.md` | Task별 상세 파일 |
| `TASKS/TASK_MANIFEST.csv`, `TASKS/TASK_AUDIT_REPORT.md` | 감사 산출물(`scripts/audit_tasks.py`가 생성) |
| `package.json`, 실제 `src/app/**` 파일 트리 | 현재 의존성과 착수 전 상태 확인 근거 |
| `CLAUDE.md` | 전역 규칙(정본, 이 Skill보다 우선) |

이 문서들과 충돌하는 임의 판단으로 Task를 만들거나 화면을 설계하지 않는다.

---

## 2. 5개 Screen과 Page Entry

Screen의 유일한 정본은 `design-reference/SCREEN_ROUTE_CONTRACT.json`이다. 정확히 5개이며 추가하지 않는다.

| Screen | 분류 | Route | Page Entry |
|---|---|---|---|
| SCR-001 | 핵심 | `/` | `src/app/page.tsx` |
| SCR-002 | 핵심 | `/about` | `src/app/about/page.tsx` |
| SCR-003 | 핵심 | `/travel-tools` | `src/app/travel-tools/page.tsx` |
| SCR-004 | 핵심 | `/mates` | `src/app/mates/page.tsx` |
| SCR-005 | 보조 | `/account` | `src/app/account/page.tsx` |

핵심 4개는 전역 Header 내비게이션에 직접 노출되고, 보조 1개(SCR-005)는 로그인/계정 진입점을 통해서만 도달한다. API Route·인증 콜백(`/auth/callback`)·오류 화면(`not-found`/`error`)은 기술 Route로 Screen 수에 포함하지 않는다.

---

## 3. IMPLEMENT·EXCLUDED 상태 처리 규칙

- 모든 Requirement는 `docs/PROJECT_SCOPE.md` 판정을 그대로 인용해 `IMPLEMENT`, `IMPLEMENT(축소)`, `EXCLUDED` 중 하나로 표시한다. 재판정하지 않는다.
- `IMPLEMENT`/`IMPLEMENT(축소)` Requirement는 `TASKS/00_TASK_LIST.md`의 구현 Task 표에 최소 1개 Task의 `Requirement Ref`로 연결한다.
- `EXCLUDED` Requirement는 구현 Task를 만들지 않고 `TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표에 근거와 후속 방향과 함께 등재한다. 삭제하지 않는다(규칙 11).
- REQ-FUNC-001~080(80건) + REQ-NF-001~034(34건) = 114건 전수가 "구현 Task 표 + NON_IMPLEMENTATION 표"에 빠짐없이 존재해야 한다(`scripts/audit_tasks.py` 검사 #17).

---

## 4. Task List·상세 Task 형식

- **Task List**: `TASKS/00_TASK_LIST.md` 한 파일. 열은 `Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority`(16열).
- **Task ID 형식**: 역할이 드러나는 대문자 하이픈 ID(`PAGE-SCR001`, `CMP-SCR003-FLIGHT`, `DATA-DESTINATIONS`, `DB-SCHEMA-BASE`, `API-MATE-POSTS`, `SHARED-HEADER-FOOTER`, `UNIT-TRAVEL-DATES`, `TEST-RLS-BASIC`, `E2E-PUBLIC-SMOKE`, `CI-PIPELINE`, `DEPLOY-VERCEL-SUPABASE-CHECK` 등). 임의의 `T-001`류 일련번호를 새로 도입하지 않는다.
- **상세 Task 파일**: `TASKS/TASK-<ID>.md`, Task List와 1:1. 다음 14개 절을 이 순서로 포함한다: `Context`, `Project Scope`, `Requirement Ref`, `Screen / Route / Page Entry`, `Design Ref`, `Depends On`, `Expected Files`, `Functional AC`, `Visual AC`, `Security/Privacy AC`, `Test Cases`, `Verify`, `Definition of Done`, `Forbidden`.
- Task List에 있는 모든 Task ID는 상세 파일이 정확히 하나 있어야 하고, Task List에 없는 상세 파일(고아 파일)이 있으면 안 된다(`scripts/audit_tasks.py` 검사 #1).

---

## 5. Page Owner·Component 분리 규칙

- **Page Owner Task**: Screen당 정확히 1개(`PAGE-SCR001~005`, 총 5개). Page Entry를 실제로 조립하는 책임만 지며, 하위 Component/Data/API/Shared Task를 새로 만들지 않는다(`CLAUDE.md` 규칙 9와 동일).
- **Component Task**: Page 내부의 개별 영역(Hero, Card Grid, Form, Tab, Filter, Drawer 등)을 구현하며, 해당 Screen의 Page Owner가 `Depends On`으로 참조한다.
- Page Owner는 자신이 조립하는 모든 Component/Data/API Task를 `Depends On`에 명시하고, Component가 존재하는 Screen에는 반드시 대응하는 Page Owner가 있어야 한다(Component-only Screen 금지, `scripts/audit_tasks.py` 검사 #5, #7).
- `PAGE-SCR001` 상세에는 Next.js Starter Template 제거 AC가 있어야 하고(`CLAUDE.md` 규칙 10), `PAGE-SCR003` 상세에는 항공편/숙소/동행 구하기 3탭 조립 AC가 있어야 한다(`CLAUDE.md` 규칙 11).

---

## 6. DB 6개 Table과 정적 Data 경계

- Supabase DB 테이블은 정확히 6개로 제한한다: `USER_PROFILE`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`, `APP_SETTING`. 이 범위를 넘는 테이블을 만드는 Task를 생성하지 않는다.
- 여행지·국가 안전정보·대표(free_traveler) 소개는 DB가 아니라 `src/data/destinations.ts`, `src/data/safety.ts`, `src/data/representative.ts` 정적 TypeScript 데이터 모듈로 만든다(`DATA-DESTINATIONS`, `DATA-SAFETY`, `DATA-REPRESENTATIVE`).
- `DESTINATION`, `COUNTRY_SAFETY`, `REPRESENTATIVE_PROFILE`, `MEDIA_ASSET`, `AUDIT_LOG` 등은 DB 테이블로 만들지 않는다.

---

## 7. 외부 입력 비저장 불변조건

- SCR-003의 항공·숙소 조건 입력값(국가·지역·출발일·귀국일 또는 체크인·체크아웃)은 Client Component의 일시 상태로만 유지한다.
- 이 값을 서버 API·DB·외부 URL 쿼리·서버 로그·분석 이벤트 어디로도 전달·저장하지 않는다(`CLAUDE.md` 규칙 12).
- 관련 Component Task(`CMP-SCR003-FLIGHT`, `CMP-SCR003-HOTEL`)의 상세 파일에는 이 불변조건을 Security/Privacy AC로 명시한다(`scripts/audit_tasks.py` 검사 #13).

---

## 8. 기본 Auth·성인·RLS 규칙

- Supabase Auth로 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정을 구현한다.
- 성인 확인은 정확한 생년월일을 저장하지 않고 `is_adult`, `adult_verified_at`만 기록한다.
- 6개 테이블 모두 RLS를 활성화하고 단순한 3단계 원칙만 적용한다: ① 본인 행만(`USER_PROFILE`, `USER_BLOCK`), ② 작성자·대상자만(`MATE_POST`, `MATE_APPLICATION`), ③ Admin만(`REPORT` 상태 변경, `APP_SETTING`).
- RLS를 우회하는 Client 코드를 작성하지 않고, Service Role Key는 서버 전용으로만 사용한다(`CLAUDE.md` 규칙 14, 15).

---

## 9. Playwright Chromium Smoke 범위

- E2E 테스트는 Playwright, **Chromium 단일 브라우저**의 Smoke Test만 작성한다(`E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH`).
- Firefox/WebKit/Safari 매트릭스, 성능·부하 테스트(Lighthouse, 동시 사용자 부하 등)로 범위를 확장하는 Task를 만들지 않는다(`CLAUDE.md` 규칙 18, `scripts/audit_tasks.py` 검사 #15).

---

## 10. Wave 내부 순차 실행

- 실제 개발은 `TASKS/00_TASK_LIST.md`의 `Depends On` 그래프를 기준으로 묶은 **Wave** 단위로 진행하며, 표준 개발 명령은 `/run-wave WXX`다(`CLAUDE.md` 규칙 6).
- 한 Wave 안에서는 병렬로 여러 Task를 동시에 구현하지 않는다. `Depends On` 순서를 지켜 한 번에 Task 하나만 구현한다(`CLAUDE.md` 규칙 7).
- 각 Task는 `CLAUDE.md`의 "Task 완료 순서"(Task 읽기 → 입력 확인 → 구현 → 관련 포맷·Unit Test → 필요 시 Playwright → Diff 확인 → 완료 보고)를 따른다.
- 화면 관련 Wave 완료 후에는 사람이 Preview를 확인한 뒤 다음 화면 Wave로 진행한다(`CLAUDE.md` 규칙 22).

---

## 11. EXCLUDED 보호

- `docs/PROJECT_SCOPE.md`와 `TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표에서 EXCLUDED로 판정된 기능을 어떤 Task에서도 임의로 구현하지 않는다(`CLAUDE.md` 규칙 19).
- EXCLUDED Requirement에 대한 상세 구현 Task 파일(`TASKS/TASK-<ID>.md`)을 생성하지 않는다(`scripts/audit_tasks.py` 검사 #18).
- EXCLUDED 항목을 다시 구현 범위로 되돌리려면 `docs/PROJECT_SCOPE.md`의 판정을 먼저 바꾸는 별도 결정이 필요하며, Task 생성 단계에서 임의로 복원하지 않는다.

---

## 12. AWS·EC2·자동 Merge 금지

- 인프라는 Vercel(Web) + Supabase(DB/Auth)로 한정한다. AWS, EC2 등 별도 인프라를 구성하는 Task를 만들지 않는다(`AWS_ENABLED=false`, `CLAUDE.md` 규칙 17).
- 자동 Merge Runner를 구성하지 않는다. Pull Request 생성과 `main` 병합은 사람이 수동으로 수행한다(`AUTO_MERGE=false`, `CLAUDE.md` 규칙 21).
- 이 두 금지는 `scripts/validate_inputs.py`(검사 #11)와 `scripts/audit_tasks.py`(검사 #16)가 부정어 없는 "AWS"/"EC2"/"자동 머지" 언급을 스캔해 위반 여부를 감사한다.

---

## 커맨드 실행 순서

1. `/gen-tasklist` — 입력 검증(`scripts/validate_inputs.py`) 후 `TASKS/00_TASK_LIST.md` 생성/갱신.
2. `/gen-task-details` — Task List의 각 구현 Task ID에 대해 `TASKS/TASK-<ID>.md` 생성.
3. `/audit-tasks` — `scripts/audit_tasks.py` 실행, `TASKS/TASK_MANIFEST.csv`·`TASKS/TASK_AUDIT_REPORT.md` 갱신, `AUDIT_PASS`/`AUDIT_FAIL` 판정.
4. `/run-wave WXX` — 감사 통과 후 Wave 단위로 실제 구현 착수(규칙 10).
