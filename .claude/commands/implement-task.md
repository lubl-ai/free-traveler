---
description: /prepare-task가 READY_TO_IMPLEMENT로 판정한 Task 하나를 Expected Files 범위 안에서 구현하고, 관련 검증을 실행한 뒤 변경 파일·검증 결과·제약을 보고한다.
---

`traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)을 먼저 로드한다. `CLAUDE.md`의 전역 규칙, 특히 "Task 완료 순서"(Task 읽기 → 입력 확인 → 구현 → 관련 포맷·Unit Test → 필요 시 Playwright → Diff 확인 → 완료 보고)와 규칙 8(Expected Files 경계), 20(destructive Git 명령 금지), 21(자동 PR/Merge 금지)이 항상 우선한다.

**이 커맨드는 이 파이프라인에서 실제로 코드를 작성하는 유일한 커맨드다. 한 번의 실행은 정확히 Task 하나만 구현한다.**

## 입력

- `TASK_ID` — 구현할 Task(예: `CMP-SCR003-FLIGHT`).
- `TASKS/TASK-<TASK_ID>.md` — 실제로 열어서 읽는다.

## 0. 선행 조건 — `/prepare-task` 결과 확인

1. 먼저 `/prepare-task`를 (아직 실행하지 않았다면) 이 Task에 대해 실행하거나, 직전에 실행된 결과를 확인한다.
2. 결과가 **`READY_TO_IMPLEMENT`가 아니면 구현을 시작하지 않는다.** `BLOCKED_*` 상태와 사유를 그대로 보고하고 종료한다.
3. 여러 Task ID가 후보로 제시된 경우에도 **정확히 하나만** 선택해 구현한다(`CLAUDE.md` 규칙 7 — Wave 내부 순차 실행, 한 번에 Task 하나).

## 1. Task 읽기·입력 확인

`TASK-<TASK_ID>.md`의 `Context`, `Project Scope`, `Requirement Ref`, `Screen / Route / Page Entry`, `Design Ref`, `Depends On`, `Expected Files`, `Functional AC`, `Visual AC`, `Security/Privacy AC`, `Test Cases`, `Verify`, `Definition of Done`, `Forbidden`을 전부 읽는다. `Design Ref`가 가리키는 `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`도 실제로 확인한다.

## 2. 구현 — Expected Files 범위 안에서만

- **`Expected Files` 절에 나열된 파일만 생성·수정한다.** 그 밖의 파일(다른 Task 소유 파일, 다른 Screen의 Page Entry 등)은 건드리지 않는다.
- **Functional AC, Visual AC, Security/Privacy AC를 모두 반영한다.** 하나라도 코드에 반영하지 않고 넘어가지 않는다.
- **Page Owner Task**(`PAGE-SCR0XX`)라면 새로운 Component/Data/API를 만들지 않고, `Depends On`에 명시된 완료된 Component/Data/API/Shared 결과물을 실제 Page Entry(`src/app/.../page.tsx`) 안에 조립하는 것만 수행한다(`traveler-project-pipeline` Skill §5).
  - `PAGE-SCR001`을 구현할 때는 Next.js 기본 스타터 템플릿(로고, Deploy/Docs 링크 등)을 완전히 제거한다.
  - `PAGE-SCR003`을 구현할 때는 항공편/숙소/동행 구하기 3개 탭이 실제로 전환되도록 조립한다.
  - `PAGE-SCR005`를 구현할 때는 Guest/Member/Admin 역할별 상태를 실제로 조립하고, 역할에 없는 관리 영역은 렌더링하지 않는다.
- **금지 기술을 추가하지 않는다**: AWS, EC2, Prisma를 포함한 어떤 ORM, 자동 Merge 관련 기능(GitHub Actions의 자동 병합 스텝 등)을 이 Task 구현 중에 새로 추가하지 않는다(`CLAUDE.md` 규칙 17, 21; Skill §12). `Forbidden` 절에 명시된 항목도 함께 지킨다.
- 항공·숙소 입력값을 다루는 Task라면 서버 API·DB·외부 URL 쿼리·로그·분석으로 값이 전달되지 않는지 구현 중 스스로 재확인한다(Skill §7).

## 3. 관련 Unit Test 실행

- `TASK-<TASK_ID>.md`의 `Verify` 절과 `Test Cases` 절에 언급된 Unit Test(예: `UNIT-TRAVEL-DATES`, `UNIT-CONTACT-DETECTION`, `UNIT-MATE-STATE`)가 이 Task와 관련되면 실제로 실행한다(예: `npm test` 또는 해당 Vitest 파일 지정 실행).
- 관련 Unit Test 파일이 아직 없다면, 이 Task의 `Expected Files`에 포함된 경우에만 작성하고, 아니라면 실행을 건너뛴 이유를 보고에 남긴다.
- 실패하면 코드를 수정해 통과시킨다. 실패를 무시하고 다음 단계로 넘어가지 않는다.

## 4. Playwright Smoke 실행 — Page Owner 또는 E2E Task일 때만

- 이번 `TASK_ID`의 `Category`가 **`PAGE`(Page Owner) 또는 `E2E`인 경우에만** 관련 Playwright Chromium Smoke Test(`E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH` 중 해당 Screen을 다루는 것)를 실행한다(`npx playwright test`, Chromium만).
- 그 외 Category(`COMPONENT`, `DATA`, `DB`, `API`, `SHARED`, `GOV`, `UNIT_TEST`, `INTEGRATION_TEST`, `CI`, `DEPLOY`)는 Playwright를 실행하지 않는다 — 불필요한 브라우저 매트릭스·범위 확장을 만들지 않는다(Skill §9).
- Playwright 대상 E2E Task가 의존하는 Page Owner가 아직 완료되지 않아 실행할 수 없으면, 실행하지 않은 이유를 보고에 남긴다.

## 5. Diff 확인

- `git status --short`와 `git diff --stat`으로 변경된 파일 목록이 `Expected Files`와 정확히 일치하는지 확인한다.
- 벗어난 파일이 있으면 되돌리거나(사용자 확인 후), 왜 필요했는지 보고에 명시한다.

## 6. 완료 보고

다음을 포함해 보고한다.

- **변경 파일**: 실제로 생성·수정된 파일 목록(Expected Files와 일치 여부 포함)
- **검증 결과**: 실행한 Unit Test 결과(통과/실패, 실행하지 않았다면 이유), Playwright 실행 여부와 결과(해당하는 경우)
- **AC 반영 확인**: Functional/Visual/Security AC 각 항목 반영 여부
- **남은 제약사항**: 이 Task 범위에서 의도적으로 다루지 않은 것, 후속 Task에 넘긴 것, `Definition of Done` 중 미충족 항목이 있다면 명시

## 7. Commit·Push·PR 정책

- **기본적으로 이 커맨드는 Commit, Push, Pull Request를 자동으로 수행하지 않는다.** 구현과 검증까지만 하고 변경사항은 Working Tree에 남겨둔다.
- **사용자가 명시적으로 요청한 경우에만** 이번 Task 범위로 한정한 Commit을 수행할 수 있다(예: "이 Task를 커밋해줘"). 이때도:
  - 커밋 대상은 이번 `Expected Files`에 해당하는 변경만 포함한다(`git add -A`처럼 범위를 넓히는 방식을 쓰지 않는다).
  - Push, PR 생성, Merge는 사용자가 별도로 명시하지 않는 한 수행하지 않는다(`CLAUDE.md` 규칙 21).
  - `git reset --hard`, `git push --force`, `git clean -f` 등 destructive 명령은 사용하지 않는다(`CLAUDE.md` 규칙 20).
