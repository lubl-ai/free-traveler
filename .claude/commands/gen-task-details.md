---
description: traveler-project-pipeline Skill을 사용해 TASKS/00_TASK_LIST.md의 각 구현 Task ID에 대해 TASKS/TASK-<ID>.md 상세 파일을 생성하고 scripts/audit_tasks.py로 검증한다.
---

`traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)을 먼저 로드해 12개 절을 확인한 뒤 아래 순서로 진행한다. `CLAUDE.md`의 전역 규칙이 항상 우선한다.

**이 커맨드는 Task 상세 문서만 만든다. `src/`, `supabase/`, `tests/` 등 구현 코드는 절대 작성하지 않는다.**

## 1. 선행 조건 확인(실제 파일 읽기)

`TASKS/00_TASK_LIST.md`가 없으면 중단하고 먼저 `/gen-tasklist`를 실행하라고 안내한다. 있으면 실제로 파일을 읽어 Task List 표(구현 Task, `NON_IMPLEMENTATION` 표는 제외)의 모든 Task ID를 추출하고, `TASKS/TASK-*.md`를 실제로 `ls`해서 이미 존재하는 상세 파일 목록과 대조해 아직 없는 Task ID를 추린다.

## 2. Task 상세 파일 생성

빠진 각 Task ID에 대해 `TASKS/TASK-<ID>.md`를 만든다. Task List의 해당 행(Category, Implementation Status, Requirement Ref, Screen/Route/Page Entry, Depends On, Expected Files, Functional/Visual/Security AC, Verify, Priority)을 그대로 옮기고, 아래 14개 절을 이 순서로 포함한다(Skill §4).

```markdown
# <Task ID> — <제목>

- **Category:** ...
- **Implementation Status:** ...
- **Priority:** ...
- **Source:** `TASKS/00_TASK_LIST.md` Seq ...

## Context
## Project Scope
## Requirement Ref
## Screen / Route / Page Entry
## Design Ref
## Depends On
## Expected Files
## Functional AC
## Visual AC
## Security/Privacy AC
## Test Cases
## Verify
## Definition of Done
## Forbidden
```

작성 시 반드시 지킬 것:

- **Page Owner Task**(`PAGE-SCR0XX`): `design-reference/UI_CONTRACT.md`의 해당 Screen "영역 순서"와 `design-reference/D-001/DESIGN.md`의 최소 콘텐츠 수(Timeline 6개 이상, Gallery 8장 이상, 방문국가 30개 이상, Card 최소 개수 등)를 Functional AC에 숫자로 명시한다. 하위 Component/Data/API/Shared Task를 새로 만들지 않고 조립만 함을 Forbidden에 명시한다(Skill §5).
- **Page Owner Forbidden**에는 큰 빈 영역·Placeholder 문구(`Lorem ipsum`, `준비 중`, `정보 확인 필요`) 금지와, 데이터가 없을 때도 설명 문장·이용 방법·다음 행동 CTA가 있는 완성형 Empty State 요구를 포함한다.
- **`PAGE-SCR001`**: "Next.js Starter Template 제거"를 Functional AC에 포함.
- **`PAGE-SCR003`**: "항공편/숙소/동행 구하기 3개 탭이 실제로 조립됨"을 Functional AC에 포함.
- **`PAGE-SCR005`**: "Guest/Member/Admin 역할별 조립, 역할에 없는 관리 영역은 렌더링하지 않음"을 Functional AC에 포함.
- **항공·숙소 관련 Task**(`CMP-SCR003-FLIGHT`, `CMP-SCR003-HOTEL` 등): "입력값은 서버·DB·외부 URL 쿼리·로그·분석으로 전달되지 않는다"를 Security/Privacy AC에 포함(Skill §7).
- **DB Task**: `USER_PROFILE`/`MATE_POST`/`MATE_APPLICATION`/`USER_BLOCK`/`REPORT`/`APP_SETTING` 6개 테이블 범위를 벗어나지 않는다(Skill §6). RLS 관련 Task는 본인/작성자·대상자/Admin 3단계 원칙을 명시한다(Skill §8).
- **E2E Task**: Playwright **Chromium** Smoke Test 범위만 기술한다(Skill §9).
- **Expected Files**는 작성 직전 `find src -type f`로 실제 트리를 다시 확인한 뒤 적는다.
- EXCLUDED Requirement를 참조하거나 그 구현을 암시하는 내용을 넣지 않는다(Skill §11).

## 3. Task List와 1:1 정합성 확인

`TASKS/00_TASK_LIST.md`의 모든 구현 Task ID에 상세 파일이 정확히 하나씩 있는지, `TASKS/TASK-*.md`에 Task List에 없는 고아 파일이 없는지 실제로 나열해 확인한다.

## 4. 감사 실행 — 실패를 무시하지 않는다

`python3 scripts/audit_tasks.py`를 실행한다. 출력이 `AUDIT_PASS`가 아니면(즉 `AUDIT_FAIL` 또는 비정상 종료면):

1. **이 상태를 완료로 보고하지 않는다.**
2. 실패한 검사 번호와 사유(`TASKS/TASK_AUDIT_REPORT.md`에도 기록됨)를 그대로 사용자에게 보여준다.
3. 원인이 된 Task List/상세 파일을 수정한다. EXCLUDED Requirement에 임의로 Task를 만들어 통과시키는 식으로 우회하지 않는다.
4. `python3 scripts/audit_tasks.py`를 다시 실행해 `AUDIT_PASS`가 나올 때까지 반복한다.

## 5. 보고

- 새로 생성된 상세 파일 개수
- `scripts/audit_tasks.py` 최종 결과(`AUDIT_PASS`/`AUDIT_FAIL`)와 통과 검사 수
- Task List와 상세 파일 개수가 1:1인지 여부
- `TASKS/TASK_MANIFEST.csv`, `TASKS/TASK_AUDIT_REPORT.md` 갱신 여부
