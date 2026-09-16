---
description: 특정 Wave·Task에 대해 구현 착수 전 준비 상태를 점검하고 READY_TO_IMPLEMENT/BLOCKED_* 상태를 보고한다. 코드를 수정하지 않는다.
---

`traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)을 먼저 로드한다. `CLAUDE.md`의 전역 규칙이 항상 우선한다.

**이 커맨드는 읽기 전용 사전 점검이다 — `src/`, `supabase/`, `tests/` 등 어떤 코드도 수정·생성하지 않는다. 상태 판정과 사유만 보고한다.**

## 입력

- `WAVE_ID` — 예: `W01`, `W02`. 사용자가 지정하지 않으면 `/run-wave`로 진행 중인 현재 Wave를 묻는다.
- `TASK_ID` — `TASKS/00_TASK_LIST.md`의 Task ID(예: `PAGE-SCR001`, `CMP-SCR003-FLIGHT`).
- **선택된 상세 Task 파일** — `TASKS/TASK-<TASK_ID>.md`. 실제로 열어서 읽는다(요약·기억 금지).

`TASK_ID`가 `TASKS/00_TASK_LIST.md`에 없거나 `TASKS/TASK-<TASK_ID>.md`가 없으면 즉시 **`BLOCKED_INPUT`**으로 종료한다.

---

## 검사 1 — Working Tree 상태

`git status --short`를 실제로 실행한다.

- 이번 Task와 무관한 미커밋 변경(특히 `src/`, `supabase/`, `tests/` 등 구현 경로)이 남아 있으면 **`BLOCKED_DIRTY_TREE`**.
- `TASKS/`, `docs/`, `design-reference/` 등 문서성 변경만 있거나 Working Tree가 깨끗하면 통과.
- 판정 근거로 `git status --short` 출력 전체를 인용한다.

## 검사 2 — Task가 현재 Wave에 포함되는지

`TASKS/00_TASK_LIST.md`의 `Depends On` 열로 Wave를 계산한다(DEC-010 정의).

1. `Depends On`이 없는 Task를 Wave 1로 둔다.
2. 어떤 Task의 Wave는 `1 + max(그 Task가 의존하는 모든 Task의 Wave)`다.
3. 이렇게 계산한 `TASK_ID`의 Wave 번호가 입력받은 `WAVE_ID`와 일치하는지 확인한다.

일치하지 않으면(아직 이후 Wave에 속하거나 이미 지난 Wave에 속하면) **`BLOCKED_INPUT`**이며, 계산된 실제 Wave 번호를 함께 보고한다.

## 검사 3 — Depends On 완료 여부

상세 파일의 `Depends On` 절과 `TASKS/00_TASK_LIST.md`의 `Depends On` 열을 대조한다. 각 의존 Task가 완료 상태인지 다음 근거로 확인한다.

- `TASKS/00_TASK_LIST.md`의 `Status`(또는 Task List 갱신 시 기록되는 완료 표시)
- 해당 Task의 Expected Files가 실제로 존재하고 스타터/자리표시자 상태가 아닌지(`find src -type f` 등으로 실제 확인)

하나라도 미완료면 **`BLOCKED_DEPENDENCY`**이며, 미완료 Task ID 목록을 보고한다.

## 검사 4 — Expected Files

상세 파일의 `Expected Files` 절을 확인한다.

- 목록이 비어 있거나 Task List 행의 `Expected Files`와 불일치하면 **`BLOCKED_INPUT`**.
- 목록에 있는 경로가 다른 Task의 Expected Files와 겹치면(소유권 충돌) **`BLOCKED_INPUT`**로 처리하고 충돌 Task ID를 명시한다.
- 실제 파일 트리(`find src -type f` 등)와 대조해 "신규 생성"이라고 적힌 파일이 이미 존재하거나 "기존 수정"이라고 적힌 파일이 없으면 불일치로 보고한다(차단 여부는 상황에 맞게 판단하되, 최소한 경고로 남긴다).

## 검사 5 — SRS·Scope·Design·Screen Ref

상세 파일의 `Requirement Ref`, `Design Ref`, `Screen / Route / Page Entry` 절이 실제 정본과 일치하는지 확인한다.

- `Requirement Ref`의 각 REQ ID가 `docs/06_SRS_UIUX_REVISED.md`에 실재하는지.
- `Project Scope` 절의 Implementation Status가 `docs/PROJECT_SCOPE.md`의 판정과 일치하는지.
- `Screen / Route / Page Entry`가 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 값과 일치하는지(해당 Task가 Screen에 속한 경우).
- `Design Ref`가 `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`를 가리키는지.

불일치·누락이 있으면 **`BLOCKED_INPUT`**.

## 검사 6 — 필요한 환경변수 이름

상세 파일의 내용(Supabase 접근, 외부 URL, Auth 등)에서 실제로 필요한 환경변수 이름을 추출한다(예: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, 서버 전용 Service Role 키, `FLIGHT_OUTBOUND_URL`, `HOTEL_OUTBOUND_URL`).

- 해당 Task가 환경변수를 필요로 하지 않으면 이 검사는 자동 통과.
- 필요한데 `.env.local`/`.env.example`/`docs/ARCHITECTURE.md` §14(착수 차단) 어디에도 이름조차 기록되어 있지 않으면 **`BLOCKED_INPUT`**이며, 필요한 환경변수 이름 목록을 보고한다.
- 이름은 존재하지만 로컬에 값이 설정되어 있지 않은 경우는 차단하지 않되(실제 값은 비밀이므로 이 커맨드가 확인할 수 없음), "값 설정 필요"로 보고에 남긴다.

## 검사 7 — Secret 하드코딩 위험

상세 파일의 Functional AC·Expected Files·Security/Privacy AC에서 API 키·Service Role Key·비밀번호 같은 민감 값을 코드에 리터럴로 박아 넣도록 지시하는 내용이 있는지 확인한다.

- Client Component(`Screen`/`Route`가 지정된 UI Task)에서 서버 전용 키를 사용하도록 되어 있으면 위반.
- 상세 파일 어디에도 실제 키 값처럼 보이는 문자열(예: `sk-`, `eyJ`로 시작하는 JWT형 문자열, 20자 이상의 임의 영숫자 토큰)이 예시로라도 박혀 있으면 위반.
- 위반이 발견되면 **`BLOCKED_SCOPE`**이며, 위반 위치(절 이름)와 사유를 보고한다(`CLAUDE.md` 규칙 15).

## 검사 8 — EXCLUDED 범위 침범 여부

상세 파일의 `Requirement Ref`에 등장하는 모든 REQ ID를 `TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표와 대조한다.

- 하나라도 `NON_IMPLEMENTATION`(EXCLUDED)에 있는 REQ ID가 발견되면 **`BLOCKED_SCOPE`**.
- AC·Expected Files에 EXCLUDED로 판정된 기능(콘텐츠 CMS, 감사 로그, 미디어 업로드 워크플로, AWS/EC2, 자동 Merge 등)을 구현하도록 지시하는 문구가 있으면 마찬가지로 **`BLOCKED_SCOPE`**.

---

## 판정 우선순위와 출력

검사는 1→8 순서로 실행하되, 위반이 여러 개 발견되면 **가장 먼저 발견된 것을 대표 상태로 출력**하고 나머지 위반도 함께 나열한다. 우선순위(높은 것이 먼저 보고됨):

1. `BLOCKED_DIRTY_TREE`(검사 1)
2. `BLOCKED_INPUT`(검사 2, 4, 5, 6, 또는 TASK_ID/상세 파일 부재)
3. `BLOCKED_DEPENDENCY`(검사 3)
4. `BLOCKED_SCOPE`(검사 7, 8)
5. 모든 검사 통과 → **`READY_TO_IMPLEMENT`**

## 출력 형식

```
STATUS: READY_TO_IMPLEMENT | BLOCKED_INPUT | BLOCKED_DEPENDENCY | BLOCKED_DIRTY_TREE | BLOCKED_SCOPE
WAVE_ID: <입력값>
TASK_ID: <입력값>
계산된 Wave: <검사 2에서 계산한 실제 Wave 번호>
검사 결과:
  1. Working Tree: PASS|FAIL — <근거>
  2. Wave 포함 여부: PASS|FAIL — <근거>
  3. Depends On 완료: PASS|FAIL — <근거>
  4. Expected Files: PASS|FAIL — <근거>
  5. SRS·Scope·Design·Screen Ref: PASS|FAIL — <근거>
  6. 필요 환경변수: PASS|FAIL — <필요한 이름 목록, 있다면>
  7. Secret 하드코딩 위험: PASS|FAIL — <근거>
  8. EXCLUDED 침범: PASS|FAIL — <근거>
다음 행동: <STATUS별 권고 — 예: READY_TO_IMPLEMENT면 "구현 착수 가능", BLOCKED_DEPENDENCY면 "선행 Task 완료 후 재실행">
```

이 커맨드는 상태와 사유만 보고하며, 위 검사를 통과시키기 위해 Task List·상세 파일·소스 코드를 수정하지 않는다. 수정이 필요하면 `/gen-tasklist`, `/gen-task-details`, 또는 사용자 직접 지시로 이어가도록 안내한다.
