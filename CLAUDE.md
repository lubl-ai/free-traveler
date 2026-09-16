# Free Traveler — Root Agent Rules

이 문서는 `traveler/app` 저장소에서 작업하는 모든 Agent가 따라야 할 규칙을 담은 단일 정본이다. 다른 Agent 규칙 파일을 참조(import)하지 않으며, 필요한 규칙은 전부 이 문서 안에 직접 기록한다.

## Harness Marker

```
HARNESS_SCHEMA=traveler-screen-route-v1
DESIGN_PATH=design-reference/D-001/DESIGN.md
SCREEN_CONTRACT=design-reference/SCREEN_ROUTE_CONTRACT.json
PROJECT_SCOPE=docs/PROJECT_SCOPE.md
PLAYWRIGHT_ENABLED=true
PLAYWRIGHT_SCOPE=chromium-smoke
AUTO_MERGE=false
AWS_ENABLED=false
```

---

## 필수 규칙

1. **작업 전 확인**: 코드를 작성하기 전 `package.json`(설치된 Next.js/React 버전과 의존성)과 현재 설치된 Next.js 버전의 문서를 확인한다. 이 저장소의 Next.js는 학습 데이터 시점과 API·컨벤션·파일 구조가 다를 수 있으므로, 버전에 맞는 가이드를 확인하지 않고 과거 지식만으로 코드를 작성하지 않는다.
2. **SRS 정본**: 요구사항의 정본은 `docs/06_SRS_UIUX_REVISED.md`다. 요구사항 ID(REQ-FUNC-001~080, REQ-NF-001~034)는 삭제하지 않는다.
3. **Scope 정본**: 각 요구사항의 구현 여부(IMPLEMENT / IMPLEMENT(축소) / EXCLUDED) 판정 정본은 `docs/PROJECT_SCOPE.md`다.
4. **디자인 정본**: 색상·타이포·Spacing·Radius·Shadow·컴포넌트·Section 규칙의 정본은 `design-reference/D-001/DESIGN.md`(LOCKED)다. `design-reference/vendor/airbnb/DESIGN.md`는 구성 원리 참고용일 뿐 정본이 아니며, Airbnb 상표 요소는 가져오지 않는다.
5. **Screen 정본**: Screen·Route·Page Entry의 정본은 `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema `traveler-screen-route-v1`)이다. Screen은 정확히 5개(SCR-001~005)이며 임의로 추가하지 않는다.
6. **표준 개발 명령**: `/run-wave WXX` 형식을 표준 개발 명령으로 사용한다. `TASKS/00_TASK_LIST.md`의 Task를 의존성(`Depends On`)에 따라 묶은 Wave 단위로 실행한다.
7. **Wave 내부 순차 실행**: 한 Wave 안에서는 병렬로 여러 Task를 동시에 구현하지 않는다. `Depends On` 순서를 지켜 한 번에 Task 하나만 구현하고, 완료 후 다음 Task로 넘어간다.
8. **Expected Files 경계**: 현재 수행 중인 Task의 `TASKS/TASK-<ID>.md`에 명시된 Expected Files 목록 밖의 파일은 수정하지 않는다.
9. **Page Owner 범위**: Page Owner Task(`PAGE-SCR001~005`)는 새로운 Component를 만들지 않는다 — 이미 완료된 Component/Data/API/Shared Task의 결과물을 해당 Page Entry 안에서 실제로 조립하는 것만 범위로 한다.
10. **SCR-001 Starter 제거**: `PAGE-SCR001` Task 완료 시 `src/app/page.tsx`의 Next.js 기본 스타터 템플릿(로고, Deploy/Docs 링크 등)을 완전히 제거한다.
11. **SCR-003 3탭 조립**: `PAGE-SCR003`은 항공편·숙소·동행 구하기 3개 탭을 모두 실제로 조립한다. 탭 라벨만 있고 내용이 비어있는 상태로 완료 처리하지 않는다.
12. **항공·숙소 입력 비전송**: 항공·숙소 조건 입력값(국가·지역·날짜)은 서버 API, DB, 외부 URL 쿼리, 서버 로그, 분석 이벤트 어디로도 보내지 않는다. Client Component의 일시 상태로만 유지한다.
13. **Supabase 쓰기 범위 제한**: Supabase에 대한 쓰기(insert/update/delete)는 Auth(가입·인증·프로필·성인 확인), 동행(모집글·참가 요청·차단), 신고, 관리자 외부 URL 설정 범위로만 제한한다. 그 외 목적의 쓰기 경로를 새로 만들지 않는다.
14. **RLS 우회 금지**: Row Level Security를 우회하는 Client 코드(예: RLS를 무시하는 Service Role 호출을 브라우저에서 실행)를 작성하지 않는다.
15. **Service Role Key 보호**: Service Role Key 등 서버 전용 비밀키를 Client Component나 브라우저에 노출되는 코드에서 사용하지 않는다. `NEXT_PUBLIC_` 접두어가 없는 키는 서버 실행 컨텍스트에서만 참조한다.
16. **정적 데이터 사용**: 여행지·국가 안전정보·대표(free_traveler) 소개는 DB가 아닌 `src/data/*.ts` 정적 TypeScript 데이터를 사용한다.
17. **금지 기술**: Prisma 등 ORM, AWS, EC2를 이 프로젝트에 추가하지 않는다.
18. **Playwright 범위**: Playwright 테스트는 Chromium 기반 핵심 Smoke Test만 작성한다. 다른 브라우저 매트릭스나 성능·부하 테스트로 확장하지 않는다.
19. **EXCLUDED 임의 구현 금지**: `docs/PROJECT_SCOPE.md`와 `TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표에서 EXCLUDED로 판정된 기능을 임의로 구현하지 않는다.
20. **Git 안전 수칙**: `git reset --hard`, `git push --force`, `git checkout .`, `git clean -f`, Branch 강제 삭제 등 destructive Git 명령을 사용자 명시적 요청 없이 임의로 사용하지 않는다.
21. **자동 PR/Merge 금지**: Pull Request 생성과 `main` 병합을 자동으로 실행하지 않는다(`AUTO_MERGE=false`). PR·Merge는 사람이 검토 후 수행한다.
22. **사람 확인 후 진행**: 화면 관련 Wave를 완료하면 사람이 Preview(실제 화면)를 확인한 뒤에 다음 화면 Wave로 진행한다. 확인 없이 연속으로 여러 화면 Wave를 이어서 진행하지 않는다.
23. **완료 보고**: 각 작업 완료 시 변경된 파일 목록, 검증(테스트/빌드) 결과, 남은 제한사항(있다면)을 함께 보고한다.

---

## Task 완료 순서

각 Task는 다음 순서로 수행한다.

1. **Task 읽기** — `TASKS/TASK-<ID>.md`의 Context, Requirement Ref, Screen/Route/Page Entry, Design Ref, Depends On, Expected Files, Functional/Visual/Security AC, Forbidden을 전부 읽는다.
2. **입력 확인** — Depends On에 명시된 선행 Task가 실제로 완료되었는지, 참조할 정적 데이터·타입·컴포넌트가 이미 존재하는지 확인한다.
3. **구현** — Expected Files 목록 안에서만 코드를 작성한다.
4. **관련 포맷·Unit Test** — 변경한 코드에 대해 Lint/포맷을 실행하고, 해당 Task에 연결된 Unit Test(있다면)를 작성·실행한다.
5. **필요 시 Playwright** — 해당 Task가 화면 흐름에 영향을 주고 관련 E2E Task(`E2E-PUBLIC-SMOKE`/`E2E-TRAVEL-TOOLS`/`E2E-MATE-AUTH`)가 이미 존재하면 Chromium Smoke로 확인한다.
6. **Diff 확인** — 변경분이 Expected Files 범위를 벗어나지 않았는지, Forbidden 항목을 위반하지 않았는지 diff로 재확인한다.
7. **완료 보고** — 변경 파일 목록, 테스트/검증 결과, 남은 제한사항을 규칙 23에 따라 보고한다.
