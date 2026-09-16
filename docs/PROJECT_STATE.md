# Free Traveler — Project State

- **Document ID:** PROJECT-STATE-001
- **갱신일:** 2026-09-16
- **갱신 방법:** 이 문서는 살아있는 상태 스냅샷이다. `/run-wave`, `/audit-tasks`, `/release-check` 실행 후 실제 산출물(`TASKS/WAVE_STATE.md`, `TASKS/TASK_AUDIT_REPORT.md`, CI/Vercel/Supabase 결과)을 근거로만 갱신한다. 추정으로 값을 채우지 않는다.

---

| 필드 | 값 |
|---|---|
| **Harness Schema** | `traveler-screen-route-v1` |
| **Design Version** | `D-001`(`design-reference/D-001/DESIGN.md`, Status: `LOCKED`) |
| **Scope Mode** | `docs/PROJECT_SCOPE.md` 기준 — IMPLEMENT 75건 / IMPLEMENT(축소) 10건 / EXCLUDED 29건(114건 전수) |
| **Current Wave** | 없음 — `/run-wave`가 아직 한 번도 실행되지 않음(`TASKS/WAVE_PLAN.md`, `TASKS/WAVE_STATE.md` 미생성) |
| **Current Task** | 없음 |
| **Completed Tasks** | 0 / 58 |
| **Blocked Tasks** | 없음(진행 이력 없음) |
| **Latest CI** | 없음 — `.github/workflows/`가 아직 존재하지 않음(`CI-PIPELINE` Task 착수 전) |
| **Supabase State** | 미프로비저닝 — `supabase/` 디렉터리 없음, 환경변수(`NEXT_PUBLIC_SUPABASE_URL` 등) 미설정(`docs/ARCHITECTURE.md` §14 착수 차단 참조) |
| **Vercel Preview URL** | 없음 — 배포 이력 없음(`vercel.json` 없음, `DEPLOY-VERCEL-SUPABASE-CHECK` Task 착수 전) |
| **Screen Checkpoints** | 아래 표 참조(초기값 전부 `PENDING`) |
| **Playwright State** | 미실행 — `@playwright/test` 의존성 미설치, `E2E-*` Task 착수 전 |
| **Deferred Items** | EXCLUDED 29건(`TASKS/00_TASK_LIST.md` `NON_IMPLEMENTATION` 표) + 착수 차단 7건(`docs/ARCHITECTURE.md` §14: Supabase/Vitest/Playwright 의존성 미설치, Supabase 환경변수 미설정, 외부 URL 환경변수 미설정, `supabase/` 마이그레이션 없음, `.github/workflows/` 없음) |
| **Next Action** | `/gen-tasklist`와 `/gen-task-details` 산출물(`TASKS/00_TASK_LIST.md`, `TASKS/TASK-*.md`)이 이미 존재하므로, `python3 scripts/audit_tasks.py`로 `AUDIT_PASS` 재확인 후 `/run-wave W01`로 첫 Wave 착수 |

---

## Screen Checkpoints

| Screen | Route | Checkpoint |
|---|---|---|
| SCR-001 | `/` | PENDING |
| SCR-002 | `/about` | PENDING |
| SCR-003 | `/travel-tools` | PENDING |
| SCR-004 | `/mates` | PENDING |
| SCR-005 | `/account` | PENDING |
| **FINAL** | — | PENDING |

Checkpoint 값은 `PENDING` → `WAITING_FOR_PREVIEW`(해당 화면 Wave 구현 완료, 사람 확인 대기) → `CONFIRMED`(사람이 Preview 확인 완료) 순서로만 전진한다. `/run-wave`가 화면 Wave를 완료하면 해당 Screen 행을 `WAITING_FOR_PREVIEW`로, 사용자가 Preview를 확인하고 `/run-wave resume`을 실행하면 `CONFIRMED`로 갱신한다. `FINAL`은 5개 Screen이 모두 `CONFIRMED`이고 `/release-check`가 `RELEASE_READY`를 반환한 뒤에만 `CONFIRMED`로 갱신한다.

---

## 참조 문서

- `CLAUDE.md` — 전역 규칙, Harness Marker
- `.claude/skills/traveler-project-pipeline/SKILL.md` — 파이프라인 규칙 12개 절
- `TASKS/00_TASK_LIST.md`, `TASKS/TASK_MANIFEST.csv`, `TASKS/TASK_AUDIT_REPORT.md` — Task 정의·감사 산출물
- `docs/DECISION_LOG.md` — DEC-001~014 결정 근거
- `docs/ARCHITECTURE.md` — 착수 차단·범위 제외 상세
