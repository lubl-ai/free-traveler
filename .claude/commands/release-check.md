---
description: 배포 전 Task/Wave·Page Owner·CI·Playwright·Supabase·Preview Checkpoint·EXCLUDED 목록을 점검해 RELEASE_READY/RELEASE_BLOCKED를 판정한다. 코드를 수정하지 않는다.
---

`traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)을 먼저 로드한다. `CLAUDE.md`의 전역 규칙이 항상 우선한다.

**이 커맨드는 읽기 전용 배포 게이트다 — Task List, 상세 파일, Wave 상태, 소스 코드를 수정하지 않고 구현 코드도 작성하지 않는다.** 어떤 항목이든 확인할 근거 파일/기록이 없으면 "통과했다고 추정"하지 않고 `RELEASE_BLOCKED`로 보고한다(허위 완료 보고 금지).

---

## 검사 1 — Task·Wave 상태

- `TASKS/WAVE_PLAN.md`, `TASKS/WAVE_STATE.md`를 실제로 읽는다. 둘 중 하나라도 없으면 즉시 **`RELEASE_BLOCKED`**("Wave 실행 이력 없음").
- `TASKS/00_TASK_LIST.md`의 구현 Task 전부(58개 기준, Task List 갱신 시 실제 개수 재확인)가 `TASKS/WAVE_STATE.md`에 `Status = DONE`인지 확인한다.
- `DONE`이 아닌 Task가 하나라도 있으면 **`RELEASE_BLOCKED`**이며, 미완료 Task ID와 현재 `Status`(`NOT_STARTED`/`READY`/`IN_PROGRESS`/`BLOCKED`)를 전부 나열한다.

## 검사 2 — 5개 Page Owner DONE

- `TASKS/00_TASK_LIST.md`에서 `Category = PAGE`인 Task(`PAGE-SCR001`~`PAGE-SCR005`) 5개를 확인한다.
- `TASKS/WAVE_STATE.md`에서 5개 전부 `Status = DONE`인지 개별 확인한다(검사 1과 별개로 명시적으로 재확인 — Page Owner는 화면 완성의 직접 증거이므로 단독 항목으로 검사).
- 5개 중 하나라도 `DONE`이 아니면 **`RELEASE_BLOCKED`**.
- 5개 모두 `DONE`이어도, 실제로 `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/travel-tools/page.tsx`, `src/app/mates/page.tsx`, `src/app/account/page.tsx`가 전부 존재하는지 `find src/app -name page.tsx`로 다시 확인한다. 파일이 없으면 상태 기록과 실제 파일이 불일치하는 것이므로 **`RELEASE_BLOCKED`**.

## 검사 3 — CI PASS

- `TASKS/00_TASK_LIST.md`의 `CI-PIPELINE` Task가 `TASKS/WAVE_STATE.md`에서 `DONE`인지 확인한다.
- `gh` CLI 사용이 가능하면 `gh run list --limit 5`(또는 동등한 명령)로 최신 GitHub Actions 실행 결과를 실제로 조회해 최근 실행이 성공(`success`/`completed`)인지 확인한다.
- `gh` CLI를 사용할 수 없거나 `.github/workflows/` 자체가 없으면, "CI 실행 결과를 확인할 근거가 없다"고 명시하고 **`RELEASE_BLOCKED`**로 처리한다(Task 상태만으로 실제 CI 통과를 추정하지 않는다).

## 검사 4 — Playwright Smoke PASS

- `E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH` 3개 Task가 `TASKS/WAVE_STATE.md`에서 전부 `DONE`인지 확인한다.
- 가능하면 `npx playwright test` 실행 로그나 `playwright-report/` 산출물 등 실제 실행 증거를 확인한다. 증거를 찾지 못하면 Task 상태만으로 간주하지 않고 그 사실을 보고에 남긴다(증거 없음은 단독으로 `RELEASE_BLOCKED` 사유는 아니되, 검사 3의 CI PASS가 이 증거를 대신할 수 있음을 명시 — CI가 Playwright 단계를 포함하기 때문).
- 3개 중 하나라도 `DONE`이 아니면 **`RELEASE_BLOCKED`**.

## 검사 5 — Supabase 6개 Table·기본 RLS 확인 기록

- `DB-SCHEMA-BASE`, `DB-RLS-BASE`, `DB-ACCESS`, `DB-SEED-BASE` 4개 Task가 `TASKS/WAVE_STATE.md`에서 전부 `DONE`인지 확인한다.
- **Task 상태만으로 충분하지 않다.** 다음 중 하나의 실제 확인 기록이 있어야 통과로 간주한다:
  - `supabase/migrations/`에 정확히 6개 테이블(`USER_PROFILE`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`, `APP_SETTING`)을 정의하는 마이그레이션 파일이 실제로 존재하고, RLS 활성화 구문이 포함되어 있는지 직접 확인.
  - 또는 `TASKS/WAVE_STATE.md`의 해당 Task `Notes`에 6개 테이블·RLS 3단계 원칙(본인 행만/작성자·대상자만/Admin만) 확인 결과가 사람이 남긴 기록으로 존재.
- 위 두 근거 중 어느 것도 실제로 확인되지 않으면(파일이 없거나 확인 기록이 비어 있으면) **`RELEASE_BLOCKED`**("Supabase 6개 Table·RLS 확인 기록 없음")로 처리한다. 존재를 추정하지 않는다.

## 검사 6 — Vercel Preview Checkpoint

- `TASKS/WAVE_PLAN.md`에서 `Category = PAGE`인 Task를 하나라도 포함하는 모든 "화면 Wave"를 찾는다.
- 각 화면 Wave가 과거에 `WAITING_FOR_PREVIEW`로 종료된 뒤, 사람이 Preview를 확인했다는 근거(`TASKS/WAVE_STATE.md`의 해당 Wave/Task `Notes`에 사람이 남긴 확인 기록, 또는 `/run-wave resume` 재개 이력)가 있는지 확인한다.
- 확인 근거가 없는 화면 Wave가 하나라도 있으면 **`RELEASE_BLOCKED`**("Wave <ID> Preview 확인 기록 없음").
- `DEPLOY-VERCEL-SUPABASE-CHECK` Task가 `DONE`인지도 함께 확인한다. `DONE`이 아니면 **`RELEASE_BLOCKED`**.

## 검사 7 — EXCLUDED 목록

- `TASKS/00_TASK_LIST.md`의 `## NON_IMPLEMENTATION` 표를 실제로 읽어 `docs/PROJECT_SCOPE.md`의 EXCLUDED 판정과 여전히 일치하는지 확인한다(항목이 삭제되거나 임의로 줄어들지 않았는지).
- `python3 scripts/audit_tasks.py`를 실행해 검사 #17(REQ 114건 커버리지), #18(EXCLUDED 상세 구현 파일 미생성)이 `PASS`인지 확인한다.
- 두 검사 중 하나라도 `FAIL`이거나 `NON_IMPLEMENTATION` 표의 건수가 줄어들었으면 **`RELEASE_BLOCKED`**("EXCLUDED 항목이 임의로 구현되었거나 목록에서 빠짐").

---

## 판정

7개 검사를 전부 실행한 뒤 판정한다.

- **`RELEASE_READY`** — 검사 1~7이 전부 통과(실제 근거 확인 완료, 추정 없음).
- **`RELEASE_BLOCKED`** — 하나라도 실패하거나 근거를 확인할 수 없으면. 여러 개가 동시에 실패해도 발견된 것을 전부 나열한다(첫 실패에서 멈추지 않는다).

## 출력 형식

```
RELEASE_CHECK: RELEASE_READY | RELEASE_BLOCKED
검사 결과:
  1. Task·Wave 상태: PASS|FAIL — <근거>
  2. 5개 Page Owner DONE: PASS|FAIL — <근거>
  3. CI PASS: PASS|FAIL — <근거>
  4. Playwright Smoke PASS: PASS|FAIL — <근거>
  5. Supabase 6개 Table·기본 RLS 확인 기록: PASS|FAIL — <근거>
  6. Vercel Preview Checkpoint: PASS|FAIL — <근거>
  7. EXCLUDED 목록: PASS|FAIL — <근거>
남은 차단 사유: <RELEASE_BLOCKED인 경우, 해결해야 할 항목을 우선순위 없이 전부 나열>
```

이 커맨드는 판정과 근거만 보고한다. `RELEASE_BLOCKED`를 해소하기 위한 코드·문서 수정은 이 커맨드에서 직접 수행하지 않고, 해당하는 다른 커맨드(`/run-wave`, `/gen-task-details` 등)나 사용자 직접 조치로 안내한다.
