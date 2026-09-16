---
description: traveler-project-pipeline Skill을 사용해 정본 문서로부터 TASKS/00_TASK_LIST.md(Task List + NON_IMPLEMENTATION)를 생성/갱신한다.
---

`traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)을 먼저 로드해 12개 절을 확인한 뒤 아래 순서로 진행한다. `CLAUDE.md`의 전역 규칙이 항상 우선한다.

**이 커맨드는 Task List 문서만 만든다. `src/`, `supabase/`, `tests/` 등 구현 코드는 절대 작성하지 않는다.**

## 1. 입력 검증(실제 실행)

`python3 scripts/validate_inputs.py`를 실행한다. `VALIDATE_INPUTS_PASS`가 아니면 즉시 중단하고 실패한 검사 번호와 사유를 그대로 보고한다. 입력 문서를 임의로 고쳐 통과시키지 않는다.

## 2. 실제 파일 읽기

다음을 직접 열어서 읽는다(요약이나 기억에 의존하지 않는다):

- `design-reference/SCREEN_ROUTE_CONTRACT.json` — 5개 Screen(ID, route, page_entry, classification). Screen의 유일한 정본(Skill §2).
- `docs/06_SRS_UIUX_REVISED.md` — REQ-FUNC-001~080, REQ-NF-001~034 114건과 Implementation Status.
- `docs/PROJECT_SCOPE.md` — 각 Requirement의 IMPLEMENT/EXCLUDED 판정·처리 방법·확인 방법(정본, Skill §3).
- `design-reference/UI_CONTRACT.md` — Screen별 영역 순서·주요 Component·상태·금지 기능.
- `design-reference/D-001/DESIGN.md` — Section 순서, 최소 콘텐츠 수, Empty State 규칙(LOCKED 정본).
- `find src -type f`로 현재 `src/app` 실제 트리, `package.json`으로 현재 의존성을 확인한다. 여기서 확인한 파일만 Expected Files 판단 근거로 쓴다.
- 이미 `TASKS/00_TASK_LIST.md`가 있으면 먼저 전체를 읽는다. 기존 Task ID·Depends On 구조와 상세 파일(`TASKS/TASK-*.md`)이 이미 존재하면 임의로 ID를 바꾸지 않는다(상세 파일과의 1:1이 깨짐).

## 3. Task 목록 설계

Skill §5(Page Owner·Component 분리), §6(DB 6개 Table·정적 Data), §7(외부 입력 비저장), §8(Auth·성인·RLS), §9(Playwright Chromium Smoke), §12(AWS·EC2·자동 Merge 금지)를 따라 아래를 빠짐없이 설계한다.

1. **Page Owner Task 5개**(`PAGE-SCR001~005`) — Screen당 정확히 1개. 같은 Screen의 Component/Data/API/Shared Task 전체를 `Depends On`에 나열한다.
   - `PAGE-SCR001`은 Next.js Starter Template 제거를 Functional AC에 포함.
   - `PAGE-SCR003`은 항공편/숙소/동행 구하기 3개 탭 조립을 Functional AC에 포함.
   - `PAGE-SCR005`는 Guest/Member/Admin 역할별 조립을 Functional AC에 포함.
2. **Component Task** — `design-reference/UI_CONTRACT.md`의 Screen별 영역 순서를 단위로 분해(`CMP-SCR0XX-*`).
3. **Data Task 3개**(`DATA-DESTINATIONS`, `DATA-SAFETY`, `DATA-REPRESENTATIVE`) — DB가 아닌 `src/data/*.ts` 정적 데이터.
4. **DB Task**(`DB-SCHEMA-BASE`, `DB-RLS-BASE`, `DB-ACCESS`, `DB-SEED-BASE`) — `USER_PROFILE`/`MATE_POST`/`MATE_APPLICATION`/`USER_BLOCK`/`REPORT`/`APP_SETTING` 6개 테이블 한도 내.
5. **API Task**(`API-*`) — 동행글/참가요청/차단/신고/관리자 설정/인증. 항공·숙소 입력값은 서버로 보내지 않으므로 이를 위한 API Task를 만들지 않는다.
6. **Shared Task**(`SHARED-*`) — Header/Footer/Toast/디자인 토큰/SEO/A11y/오류 화면/정책 콘텐츠.
7. **Governance Task**(`GOV-CONTENT-COMPLETENESS`) — 콘텐츠 완전성 검증 스크립트.
8. **Unit/Integration Test Task**(`UNIT-*`, `TEST-RLS-BASIC`) — 날짜 검증·연락처 탐지·상태 전이·RLS 기본 검증.
9. **E2E Task**(`E2E-*`) — Playwright **Chromium** Smoke만. 다른 브라우저·성능·부하 Task를 만들지 않는다.
10. **CI/Deploy Task**(`CI-PIPELINE`, `DEPLOY-VERCEL-SUPABASE-CHECK`) — GitHub Actions와 Vercel/Supabase 확인. EC2/AWS/자동 Merge Runner Task는 만들지 않는다.

각 Task에 `Task ID`, `Category`, `Implementation Status`, `Requirement Ref`, `Screen`/`Route`/`Page Entry`(해당 시), `Depends On`, `Expected Files`, `Functional AC`, `Visual AC`, `Security/Privacy AC`, `Verify`, `Priority`를 배정한다.

## 4. Requirement 전수 반영

REQ-FUNC-001~080, REQ-NF-001~034 **114건 전부**를 다음 중 하나로 기록한다(Skill §3).

- `IMPLEMENT`/`IMPLEMENT(축소)` → 구현 Task 표의 `Requirement Ref`에 최소 1회 연결.
- `EXCLUDED` → 구현 Task를 만들지 않고 `TASKS/00_TASK_LIST.md`의 `## NON_IMPLEMENTATION` 표에 근거·후속 방향과 함께 등재. `docs/PROJECT_SCOPE.md`의 판정을 재판정하지 않는다.

## 5. 파일 작성

`TASKS/00_TASK_LIST.md` 한 파일만 생성/갱신한다(요약 표 + Task List 표 + `NON_IMPLEMENTATION` 표 + Requirement Coverage 교차 확인). `TASKS/TASK-*.md` 상세 파일은 이 단계에서 만들지 않는다(`/gen-task-details`의 역할).

## 6. 보고

- 생성/갱신된 Task 총 개수와 Category별 개수
- Page Owner Task 5개 목록과 각각의 Depends On 개수
- Requirement Coverage: 구현 Task 연결 건수 + EXCLUDED 건수 = 114건 확인
- DB 테이블 사용 개수(6개 이하 확인)
- 다음 단계로 `/gen-task-details` 실행을 안내
