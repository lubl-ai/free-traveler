---
description: Wave 단위로 Task를 순차 구현하는 표준 개발 명령. `/run-wave W03`, `/run-wave status`, `/run-wave resume`, `/run-wave dry-run W03`을 지원한다.
---

`traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)을 먼저 로드한다. `CLAUDE.md`의 전역 규칙(특히 규칙 6 표준 개발 명령, 규칙 7 Wave 내부 순차 실행, 규칙 20 destructive Git 금지, 규칙 21 자동 PR/Merge 금지, 규칙 22 사람 Preview 확인 후 다음 화면 Wave 진행)이 항상 우선한다.

**이 커맨드는 `/prepare-task`와 `/implement-task`를 내부에서 순서대로 호출하는 오케스트레이터다. 자동 Branch 생성, 자동 PR 생성, 자동 Merge 기능은 포함하지 않는다.**

---

## 상태 파일

| 파일 | 역할 |
|---|---|
| `TASKS/WAVE_PLAN.md` | Task를 Wave 번호로 분류한 표(`Wave \| Task ID \| Category \| Depends On`) |
| `TASKS/WAVE_STATE.md` | Task별 진행 상태(`Task ID \| Wave \| Status \| Updated \| Notes`). `Status` ∈ `NOT_STARTED`, `READY`, `IN_PROGRESS`, `DONE`, `BLOCKED` |

두 파일이 없으면 `/run-wave`가 최초 실행 시 아래 규칙으로 생성한다. 있으면 실제로 읽어서 이어서 쓴다(임의로 덮어쓰지 않는다).

### Wave 계산 규칙(`TASKS/WAVE_PLAN.md` 생성/검증)

`TASKS/00_TASK_LIST.md`의 `Depends On` 열로 계산한다(DEC-010, `/prepare-task` 검사 2와 동일 알고리즘).

1. `Depends On`이 없는 Task는 Wave 1.
2. 그 외 Task의 Wave = `1 + max(그 Task가 의존하는 모든 Task의 Wave)`.
3. `TASKS/00_TASK_LIST.md`가 갱신되어 `TASKS/WAVE_PLAN.md`와 어긋나면(Task 추가/삭제, Depends On 변경) `TASKS/WAVE_PLAN.md`를 재계산해 갱신하고 그 사실을 보고한다.

### "화면 Wave" 판정(Preview Checkpoint)

어떤 Wave에 `Category = PAGE`인 Task(`PAGE-SCR0XX`)가 하나라도 포함되어 있으면 그 Wave는 **화면 Wave**다. 화면 Wave가 전부 `DONE`이 되면 다음 Wave로 자동 진행하지 않고 `WAITING_FOR_PREVIEW`로 종료한다(`CLAUDE.md` 규칙 22).

---

## `/run-wave W03` — 지정 Wave 실행

1. **WAVE_PLAN·WAVE_STATE 읽기**: `TASKS/WAVE_PLAN.md`, `TASKS/WAVE_STATE.md`를 실제로 읽는다(없으면 위 규칙으로 생성). `TASKS/00_TASK_LIST.md`도 함께 읽어 Task 상세를 확인한다.
2. **현재 Wave의 READY Task 선택**: `Wave == W03`인 Task 중 `Status ∈ {NOT_STARTED, READY}`이고 `Depends On`에 나열된 모든 Task의 `Status == DONE`인 Task를 찾는다. 여러 개면 `TASKS/00_TASK_LIST.md`의 `Seq`가 가장 작은 것 하나를 선택한다(Depends On 순서 보장).
   - 후보가 없고 Wave의 모든 Task가 `DONE`이면 §"Wave 종료 처리"로 이동.
   - 후보가 없고 `DONE`이 아닌 Task가 남아 있는데 모두 `Depends On` 미충족이면(다른 Wave의 선행 Task 미완료) 중단하고 `BLOCKED_DEPENDENCY`로 보고한다.
3. **`/prepare-task` 규칙으로 검사**: 선택한 Task에 대해 `/prepare-task WAVE_ID=W03 TASK_ID=<선택>`과 동일한 8개 검사를 수행한다.
   - `READY_TO_IMPLEMENT`가 아니면: `TASKS/WAVE_STATE.md`에서 해당 Task `Status = BLOCKED`, `Notes`에 사유 기록.
     - `BLOCKED_DIRTY_TREE` 또는 `BLOCKED_SCOPE`: **Wave 실행 전체를 중단**하고 즉시 보고(Working Tree 문제나 범위 침범은 사람 확인이 먼저 필요).
     - `BLOCKED_INPUT` 또는 `BLOCKED_DEPENDENCY`: 이 Task는 건너뛰고 같은 Wave의 다음 READY Task를 §2부터 다시 찾는다. 더 이상 READY 후보가 없으면 Wave를 중단하고 BLOCKED 목록과 함께 보고한다.
4. **`/implement-task` 규칙으로 구현**: `READY_TO_IMPLEMENT`면 `TASKS/WAVE_STATE.md`에서 해당 Task `Status = IN_PROGRESS`로 갱신 후, `/implement-task TASK_ID=<선택>`과 동일한 절차(Expected Files 범위 내 구현, AC 반영, Page Owner 조립 규칙, 금지 기술 미추가)로 Task 하나를 구현한다.
5. **검증 PASS 시 DONE 갱신**: 관련 Unit Test(그리고 `Category`가 `PAGE`/`E2E`면 관련 Playwright Chromium Smoke)를 실행한다.
   - 전부 PASS면 `TASKS/WAVE_STATE.md`에서 `Status = DONE`, `Updated` 시각 기록.
   - 하나라도 FAIL이면 `Status = BLOCKED`로 유지하고 Wave 실행을 중단, 실패 내용을 그대로 보고한다(실패를 넘기고 다음 Task로 진행하지 않는다).
6. **다음 READY Task 계속 처리**: 5에서 DONE으로 갱신됐으면 §2로 돌아가 같은 Wave의 다음 READY Task를 계속 처리한다.
7. **Wave Task 전부 DONE이면 종료**: 더 이상 처리할 Task가 없고 Wave의 모든 Task가 `DONE`이면 Wave 완료로 보고한다.
8. **Preview Checkpoint**: 7에서 완료된 Wave가 "화면 Wave"였다면, 완료 보고 대신 **`WAITING_FOR_PREVIEW`**로 종료한다 — 사람이 실제 화면(Preview)을 확인하기 전에는 `/run-wave`가 다음 Wave를 자동으로 시작하지 않는다. 화면 Wave가 아니었다면 일반 Wave 완료로 보고하고 종료한다(사용자가 원하면 이어서 다음 Wave를 실행).

## `/run-wave status` — 현재 상태 조회(읽기 전용)

- `TASKS/WAVE_PLAN.md`, `TASKS/WAVE_STATE.md`를 읽어 다음을 보고한다: 전체 Wave 수, 각 Wave의 DONE/전체 Task 수, 현재 진행 중(가장 앞선 미완료) Wave, 그 Wave 안의 다음 READY Task, `BLOCKED` 상태인 Task와 사유, 마지막 상태가 `WAITING_FOR_PREVIEW`인지 여부.
- 아무것도 수정하지 않는다.

## `/run-wave resume` — 중단 지점부터 재개

1. `TASKS/WAVE_STATE.md`를 읽어 가장 앞선 미완료 Wave를 찾는다.
2. 직전 종료 상태가 **`WAITING_FOR_PREVIEW`**였다면: 사람이 Preview를 확인했다는 전제로, **다음 Wave 번호**를 계산해 `/run-wave <다음 Wave>`를 그대로 실행한다.
3. 직전 종료 상태가 실행 도중 `BLOCKED`(§3·§5)였다면: 그 원인이 해결되었는지 실제로 재확인(예: Working Tree 재확인, 의존 Task 상태 재확인)한 뒤, 같은 Wave에서 `/run-wave <해당 Wave>`를 그대로 실행해 §2부터 이어간다.
4. 재개할 미완료 Wave가 없으면(모든 Wave `DONE`) "더 이상 진행할 Wave가 없다"고 보고하고 종료한다.

## `/run-wave dry-run W03` — 시뮬레이션(구현 없음)

- §1~3만 수행한다: WAVE_PLAN·WAVE_STATE 읽기 → 이번에 선택될 READY Task 확인 → `/prepare-task` 8개 검사 수행.
- **§4(구현)는 실행하지 않는다.** 코드를 작성하지 않고, `TASKS/WAVE_STATE.md`도 갱신하지 않는다(읽기 전용 시뮬레이션).
- 선택될 Task ID, `/prepare-task` 판정(`READY_TO_IMPLEMENT` 또는 `BLOCKED_*`와 사유), 만약 `READY_TO_IMPLEMENT`라면 "이 Task가 실제로 구현될 예정"이라는 사실만 보고한다.

---

## 공통 제약

- 자동으로 Git Branch를 생성하지 않는다.
- 자동으로 Pull Request를 생성하지 않는다.
- 자동으로 Merge를 수행하지 않는다.
- Commit은 `/implement-task`의 정책을 그대로 따른다 — 기본적으로 Commit도 자동 수행하지 않으며, 사용자가 명시적으로 요청한 경우에만 Task 단위로 Commit한다(Push·PR·Merge는 여전히 자동 수행하지 않는다).
- `git reset --hard`, `git push --force`, `git clean -f` 등 destructive 명령은 사용하지 않는다.
- Wave·Task 상태 갱신은 `TASKS/WAVE_STATE.md`에만 기록하며, `TASKS/00_TASK_LIST.md`·`TASKS/TASK-*.md`의 내용(AC, Expected Files 등)은 이 커맨드가 임의로 바꾸지 않는다(변경이 필요하면 `/gen-tasklist`/`/gen-task-details`로 별도 진행).
