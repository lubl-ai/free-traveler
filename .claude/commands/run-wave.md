---
description: Wave 단위로 Task를 순차 구현하는 표준 개발 명령. `/run-wave <WAVE_ID>`, `/run-wave <WAVE_ID> --dry-run`, `/run-wave <WAVE_ID> --resume`, `/run-wave [<WAVE_ID>] --status`를 지원한다.
---

`traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)을 먼저 로드한다. `CLAUDE.md`의 전역 규칙(특히 규칙 6 표준 개발 명령, 규칙 7 Wave 내부 순차 실행, 규칙 20 destructive Git 금지, 규칙 21 자동 PR/Merge 금지, 규칙 22 사람 Preview 확인 후 다음 화면 Wave 진행)이 항상 우선한다.

**이 커맨드는 `/prepare-task`와 `/implement-task`를 내부에서 순서대로 호출하는 오케스트레이터다. 자동 Branch 생성, 자동 Commit, 자동 Push, 자동 PR 생성, 자동 Merge 기능은 포함하지 않는다.**

---

## 상태 파일

| 파일 | 소유자 | 역할 |
|---|---|---|
| `TASKS/WAVE_PLAN.md` | `scripts/build_waves.py` | Wave 정본(사람이 읽는 계획). 이 커맨드는 **읽기만** 하고 직접 수정하지 않는다. |
| `TASKS/WAVE_STATE.json` | `scripts/build_waves.py` | Wave 정본(기계가 읽는 계획): `wave_id`, `title`, `task_ids`, `checkpoint_required` 등. 이 커맨드는 **읽기만** 한다 — Task List/Depends On이 바뀌어 `build_waves.py`가 다시 실행되면 이 파일은 통째로 재생성되므로, 진행 상태를 여기에 기록하면 유실된다. |
| `TASKS/WAVE_RUN_STATE.json` | **이 커맨드(`/run-wave`)** | 실제 실행 진행 상태(Ledger). 계획이 아니라 "무엇을 실제로 했는가"만 기록하며, 이 커맨드만 쓴다. |

### `TASKS/WAVE_RUN_STATE.json` 초기화·드리프트 감지

1. 파일이 없으면, `TASKS/WAVE_STATE.json`을 읽어 각 Wave·Task를 `status: "pending"`으로 초기화하고 `plan_generated_at`에 `TASKS/WAVE_STATE.json`의 `generated_at` 값을 그대로 복사해 둔다.
2. 파일이 있으면, 그 안의 `plan_generated_at`이 현재 `TASKS/WAVE_STATE.json`의 `generated_at`과 같은지, 그리고 각 Wave의 `task_ids`가 서로 같은지 확인한다.
   - 다르면(즉 `build_waves.py`가 그 사이 다시 실행되어 계획이 바뀌었으면) **어떤 모드에서도 실행을 진행하지 않고** "Wave 계획이 변경됨 — 사람이 `TASKS/WAVE_RUN_STATE.json`을 검토하고 재초기화해야 한다"고 보고한 뒤 종료한다(진행 이력을 임의로 지우거나 임의로 새 계획에 끼워 맞추지 않는다).
3. Task 상태값: `pending` | `in_progress` | `blocked` | `completed`.
4. Wave 상태값: `pending` | `in_progress` | `blocked` | `awaiting_checkpoint` | `completed`.
   - `awaiting_checkpoint`는 그 Wave의 Task가 전부 `completed`이고 `checkpoint_required: true`인데, 아직 사람의 Preview 확인 기록이 없는 상태다(아래 "Browser Checkpoint" 참조).

---

## 공통 사전 조건 — 규칙 1 (이전 Wave 완료 확인)

기본 모드와 `--resume`은 실행 전에 항상 이 조건을 확인한다(`--status`, `--dry-run`은 읽기 전용이므로 이 조건으로 실행 자체를 막지 않고, 대신 상태를 있는 그대로 보여준다).

- `TASKS/WAVE_STATE.json`에 나열된 Wave 순서(`W01, W02, ...`)에서, 지정한 `WAVE_ID` 바로 앞 Wave의 Ledger 상태가 `completed`가 아니면 **이 Wave를 시작하지 않는다.**
- `W01`처럼 앞 Wave가 없으면 이 조건은 자동으로 통과한다.
- 위반 시: "이전 Wave(`<앞 Wave ID>`, 상태: `<상태>`)가 completed가 아니므로 `<WAVE_ID>`를 시작하지 않는다"고 보고하고 즉시 종료한다. 어떤 파일도 수정하지 않는다.

---

## `/run-wave <WAVE_ID> --status` (또는 `/run-wave --status`)

읽기 전용. 아무것도 수정하지 않는다(`TASKS/WAVE_RUN_STATE.json`이 아직 없어도 생성하지 않고, `TASKS/WAVE_STATE.json`을 기준으로 "전부 pending"이라고 가정해 보여준다).

- `WAVE_ID`를 지정하면: 그 Wave의 제목, 상태, 포함된 Task 전체와 각 Task의 상태(`pending`/`in_progress`/`blocked`/`completed`)를 표로 보여준다. `checkpoint_required`이면 그 사실과 대응하는 `docs/preview-checks/SCR-0XX.md` 존재 여부도 함께 보여준다.
- `WAVE_ID`를 생략하면: 전체 Wave 수, Wave별 완료/전체 Task 수, 가장 앞선 미완료 Wave(다음에 실행해야 할 Wave), 그 Wave의 다음 pending Task, `blocked`/`awaiting_checkpoint` 상태인 Wave 목록을 요약해 보여준다.

## `/run-wave <WAVE_ID> --dry-run`

읽기 전용 시뮬레이션. **`/implement-task`는 절대 호출하지 않고, `TASKS/WAVE_RUN_STATE.json`도 갱신하지 않는다.**

1. 공통 사전 조건(규칙 1)을 확인하고 결과를 보고한다(막히더라도 dry-run 자체는 계속 진행해 "만약 진행한다면" 정보를 보여주되, 실제로는 실행 불가임을 명시한다).
2. `TASKS/WAVE_RUN_STATE.json`(없으면 `TASKS/WAVE_STATE.json` 기준 초기 상태)에서 이 Wave의 첫 `pending` Task를 찾는다. 없으면 "이 Wave에 실행할 pending Task가 없음(상태: `<Wave 상태>`)"이라고 보고하고 종료한다.
3. 그 Task에 대해 `/prepare-task`의 8개 검사를 **실제로 실행**해 `READY_TO_IMPLEMENT`/`BLOCKED_*` 판정을 보여준다(읽기 전용이라 실행해도 안전함).
4. 다음 정보를 함께 보여준다 — 실제로 실행하지는 않는다:
   - 이 Task의 `Expected Files`(어떤 파일이 새로 생기거나 수정될지).
   - 이 Task에 지정된 최소 검증(`TASK-<ID>.md`의 `Verify` 절 — Unit Test 대상, `Category`가 `PAGE`/`E2E`인 경우에만 Playwright 대상이 되는 규칙은 `implement-task.md` §4를 그대로 따름).
   - 이 Wave에 `checkpoint_required: true`가 있는지, 있다면 이 Task까지 끝나야 어떤 Screen의 Browser Checkpoint가 걸리는지.

## `/run-wave <WAVE_ID>` — 기본 모드

1. 공통 사전 조건(규칙 1)을 확인한다. 위반이면 즉시 종료.
2. `TASKS/WAVE_RUN_STATE.json`을 읽는다(없으면 초기화). 이 Wave의 Ledger 상태를 확인한다.
   - `completed`면: "이미 완료된 Wave"라고 보고하고 다음 Wave 번호를 안내한 뒤 종료(다시 실행하지 않는다).
   - `blocked`면: **규칙 2**에 따라 자동으로 다시 시도하지 않는다 — "`<WAVE_ID>`는 blocked 상태다. `/run-wave <WAVE_ID> --resume`을 사용하라"고 안내하고 종료.
   - `awaiting_checkpoint`면: "사람의 Preview 확인이 필요하다(규칙 4/5)"고 안내하고, 확인 방법(`docs/preview-checks/SCR-0XX.md` 작성 후 `--resume`)을 안내한 뒤 종료 — 확인 없이 강제로 다음 단계를 진행하지 않는다.
   - `pending`/`in_progress`면 3으로 진행.
3. Ledger의 `task_ids` 순서대로(이 순서는 `build_waves.py`가 이미 "같은 Wave 안에 의존 관계가 없도록" 보장해 두었으므로 그대로 Task ID 순차 실행 순서로 쓴다 — `CLAUDE.md` 규칙 7) 상태가 `pending`인 첫 Task를 하나 고른다.
4. 그 Task에 `/prepare-task` 규칙을 그대로 적용한다.
   - `READY_TO_IMPLEMENT`가 아니면: 이 Task 상태를 `blocked`로, Wave 상태도 `blocked`로 기록하고, 판정과 사유를 그대로 남긴 뒤 **Wave 실행을 멈춘다**(규칙 2 — 다른 pending Task로 건너뛰어 계속 진행하지 않는다. 하나가 막히면 그 즉시 전체를 멈춘다).
5. `READY_TO_IMPLEMENT`면 이 Task 상태를 `in_progress`로 기록하고 `/implement-task` 규칙대로 구현한다(Expected Files 범위 내 구현, AC 반영, Page Owner 조립 규칙, 금지 기술 미추가).
6. **규칙 3 — 지정된 최소 검증**: `implement-task.md` §3(관련 Unit Test)·§4(`Category ∈ {PAGE, E2E}`일 때만 Playwright)를 그대로 실행한다.
   - 전부 PASS면 이 Task 상태를 `completed`로 기록하고 3으로 돌아가 같은 Wave의 다음 pending Task를 처리한다.
   - 하나라도 FAIL이면 이 Task와 Wave 상태를 `blocked`로 기록하고 **즉시 멈춘다**(실패를 넘기고 다음 Task로 진행하지 않는다 — 규칙 2).
7. 이 Wave의 모든 Task가 `completed`가 되면:
   - `checkpoint_required: false`면 Wave 상태를 `completed`로 기록하고 종료(사용자가 원하면 다음 Wave를 이어서 요청할 수 있음 — 자동으로 이어가지 않는다).
   - `checkpoint_required: true`면(**규칙 4** — Page Owner가 있는 Wave) Wave 상태를 `awaiting_checkpoint`로 기록하고 종료한다. **규칙 5**에 따라 사람이 실제 화면을 확인하고 `docs/preview-checks/SCR-0XX.md`에 확인 기록을 남기기 전에는 다음 Wave를 자동 실행하지 않는다.

## `/run-wave <WAVE_ID> --resume`

`WAVE_ID`를 생략하면 `TASKS/WAVE_RUN_STATE.json`에서 `completed`가 아닌 가장 앞선 Wave를 자동으로 찾아 그 Wave에 대해 아래를 수행한다.

1. 공통 사전 조건(규칙 1)을 확인한다.
2. 대상 Wave의 Ledger 상태에 따라 분기한다.
   - `awaiting_checkpoint`: 대응하는 `docs/preview-checks/SCR-0XX.md`가 실제로 존재하고 비어 있지 않은지 확인한다(추정 금지 — 실제로 파일을 읽는다). 있으면 Wave 상태를 `completed`로 갱신하고, "이제 다음 Wave(`<다음 Wave ID>`)를 사람이 직접 요청할 수 있다"고 안내한 뒤 종료한다(다음 Wave를 자동으로 이어서 실행하지 않는다 — 규칙 5). 없으면 여전히 확인 대기 중이라고 보고하고 종료한다.
   - `blocked`: 막힌 원인이 실제로 해소됐는지 다시 확인한다(예: Working Tree 재확인, 의존 Task 상태 재확인, 검증 실패 원인이 실제로 고쳐졌는지). 첫 `pending` 또는 여전히 `blocked`인 Task부터 기본 모드의 §3 이후 절차를 그대로 이어간다.
   - `pending`/`in_progress`: 첫 `pending` Task부터 기본 모드의 §3 이후 절차를 그대로 이어간다.
   - `completed`: "이 Wave는 이미 끝났다"고 보고하고, 재개할 다른 미완료 Wave가 있는지 확인해 안내한다. 전부 `completed`면 "더 이상 진행할 Wave가 없다"고 보고하고 종료한다.

---

## Browser Checkpoint(규칙 4·5)

- `TASKS/WAVE_STATE.json`에서 `checkpoint_required: true`인 Wave는 예외 없이 `Category=PAGE` Task(`PAGE-SCR0XX`)를 포함한 Wave다(화면 Wave).
- 그 Wave의 `PAGE-SCR0XX` Task가 속한 Screen ID를 확인해, 대응하는 확인 문서를 `docs/preview-checks/SCR-0XX.md`로 고정한다(`scripts/check_screen_contract.py --mode=release`, `release-check.md` 검사 6과 동일한 파일 규칙).
- 이 커맨드는 그 파일을 **대신 작성하지 않는다** — 사람이 실제 브라우저에서 화면을 확인한 뒤 직접 남겨야 하는 기록이다. `/run-wave`는 파일의 존재·비어있음 여부만 확인한다.
- 확인 전에는 `awaiting_checkpoint` 상태에서 멈춰 있으며, 다음 Wave를 요청해도(기본 모드로 다음 `WAVE_ID`를 입력해도) 규칙 1(이전 Wave completed 확인)에 걸려 시작되지 않는다.

## `/prepare-task`와의 관계(정합성 참고)

`prepare-task.md`의 "검사 2 — Task가 현재 Wave에 포함되는지"는 `Depends On`으로부터 Wave를 직접 재계산하는 예전 방식이며, 지금은 `scripts/build_waves.py`가 생성한 `TASKS/WAVE_STATE.json`이 Wave 배정의 정본이다. `/run-wave`는 Task가 이 `WAVE_ID`에 속하는지를 **`TASKS/WAVE_STATE.json`의 `task_ids` 소속 여부로 판정하며, `/prepare-task` 검사 2의 자체 재계산 결과보다 이 값을 우선한다.** (`/prepare-task` 자체의 검사 2 로직 갱신은 이 커맨드의 범위 밖이며 별도 작업으로 남겨둔다.)

---

## 종료 보고

기본 모드와 `--resume`은 실행이 끝나면(정상 종료든 `blocked`/`awaiting_checkpoint`로 멈추든) 항상 아래 5개 항목을 보고한다. `--status`/`--dry-run`은 해당 사항만 보고한다(완료 Task·변경 파일이 없으므로 생략 가능).

- **완료 Task**: 이번 실행에서 새로 `completed`가 된 Task ID 목록(없으면 "없음").
- **변경 파일**: 각 Task의 `/implement-task` 완료 보고에 나온 실제 변경 파일 목록을 합친 것.
- **통과한 검사**: 실행된 Unit Test/Playwright 등 검증 결과(무엇을 실행했고 통과했는지).
- **남은 수동 Browser 확인**: 지금 `awaiting_checkpoint`인 Wave와 그에 대응하는 `docs/preview-checks/SCR-0XX.md` 경로(없으면 "없음").
- **다음에 입력할 명령**: 상황별로 정확히 하나를 제시한다 — 예: 정상 완료·다음 Wave 진행 가능이면 `/run-wave <다음 WAVE_ID>`; `blocked`면 `/run-wave <WAVE_ID> --resume`; `awaiting_checkpoint`면 "사람이 `docs/preview-checks/SCR-0XX.md` 작성 후 `/run-wave <WAVE_ID> --resume`".

---

## 공통 제약

- 자동으로 Git Branch를 생성하지 않는다.
- 자동으로 Commit하지 않는다(`implement-task.md` §7 정책을 그대로 따름 — 사용자가 명시적으로 요청한 경우에만 이번 Task의 Expected Files로 한정한 Commit).
- 자동으로 Push, Pull Request 생성, Merge를 수행하지 않는다(`CLAUDE.md` 규칙 21).
- `git reset --hard`, `git push --force`, `git clean -f` 등 destructive 명령은 사용하지 않는다(`CLAUDE.md` 규칙 20).
- `TASKS/WAVE_PLAN.md`, `TASKS/WAVE_STATE.json`, `TASKS/00_TASK_LIST.md`, `TASKS/TASK-*.md`의 내용은 이 커맨드가 직접 바꾸지 않는다(변경이 필요하면 `/gen-tasklist`/`/gen-task-details`/`scripts/build_waves.py`로 별도 진행). 이 커맨드가 쓰는 유일한 상태 파일은 `TASKS/WAVE_RUN_STATE.json`이다.
