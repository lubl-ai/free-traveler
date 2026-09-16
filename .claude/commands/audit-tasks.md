---
description: traveler-project-pipeline Skill을 사용해 scripts/audit_tasks.py로 TASKS/00_TASK_LIST.md와 TASKS/TASK-*.md를 감사하고, 실패를 무시하지 않고 그대로 보고한다.
---

`traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)을 먼저 로드한다. `CLAUDE.md`의 전역 규칙이 항상 우선한다.

**이 커맨드는 읽기 전용 감사다 — Task List, 상세 파일, 소스 코드를 수정하지 않고, 구현 코드도 작성하지 않는다.**

## 1. 대상 실재 확인(실제 파일 읽기)

`TASKS/00_TASK_LIST.md`가 있는지 실제로 확인한다. 없으면 "아직 Task가 생성되지 않았다"고 보고하고 `/gen-tasklist`를 먼저 실행하라고 안내한 뒤 종료한다.

## 2. 감사 실행

`python3 scripts/audit_tasks.py`를 실행한다. 이 스크립트는 다음 18개 검사를 수행하고 `TASKS/TASK_MANIFEST.csv`, `TASKS/TASK_AUDIT_REPORT.md`를 생성/갱신한다: Task List↔상세 파일 1:1, 중복 Task ID, Depends On 누락, Dependency Cycle, Screen 5개 Page Owner 정확히 1개, Route·Page Entry·Expected Files 정본 일치, Component-only Screen, SCR-001 Starter 제거 AC, SCR-003 3탭 조립 AC, SCR-005 역할별 조립 AC, DB Schema·RLS·Access·Seed Task 존재, DB Table 6개 한도, 외부 입력 비저장 AC, Auth·성인·기본 RLS AC, Playwright Chromium Smoke Task, AWS·EC2·자동 Merge 금지, REQ 114건 커버리지, EXCLUDED 상세 파일 미생성.

## 3. 결과 정리 — 실패를 무시하지 않는다

스크립트 종료 코드와 출력을 그대로 확인한다.

- **`AUDIT_PASS`(exit 0)**: 통과한 18개 검사 번호를 요약해 보고한다.
- **`AUDIT_FAIL`(exit ≠ 0) 또는 비정상 종료**: **절대 완료·통과로 보고하지 않는다.** `TASKS/TASK_AUDIT_REPORT.md`를 실제로 열어 FAIL 항목의 검사 번호·사유·관련 Task ID/Requirement ID를 그대로 인용해 보고한다. 스크립트가 아예 산출물을 만들지 못했다면(예: `TASKS/00_TASK_LIST.md` 파싱 자체가 실패) 그 원인도 함께 보고한다.

## 4. 요약 항목

- 전체 Task 개수, Page Owner 개수(5개 기대)
- DB 테이블 사용 개수(6개 이하 기대)
- Requirement Coverage: 구현 Task 연결 건수 + EXCLUDED 건수 = 114건 여부
- Task List ↔ 상세 파일 1:1 여부
- Dependency Cycle 유무
- Playwright Chromium 단일 범위 준수 여부
- AWS·EC2·자동 Merge 관련 위반 유무

## 5. 수정 여부

사용자가 명시적으로 수정을 요청하지 않는 한 이 커맨드에서 Task List·상세 파일·코드를 고치지 않는다. `AUDIT_FAIL`이면 원인을 보고한 뒤 `/gen-task-details`(상세 재생성) 또는 `/gen-tasklist`(Task List 자체 재설계)로 이어가도록 안내한다.
