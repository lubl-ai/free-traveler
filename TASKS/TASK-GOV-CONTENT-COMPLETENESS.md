# GOV-CONTENT-COMPLETENESS — 콘텐츠 완전성 검증 스크립트

- **Category:** GOV
- **Implementation Status:** IMPLEMENT(축소)
- **Priority:** P1
- **Source:** `TASKS/00_TASK_LIST.md` Seq 49

## Context

이 Task는 콘텐츠 완전성을 빌드 전에 자동 검증하는 Governance Task다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT(축소)** — 지정된 축소 범위 내에서만 구현(전체 기능이 아님).

## Requirement Ref

REQ-FUNC-008,074; REQ-NF-026,027,028

(요구사항 원문은 `docs/06_SRS_UIUX_REVISED.md`, 판정 근거는 `docs/PROJECT_SCOPE.md` 참조)

## Screen / Route / Page Entry

- **Screen:** 없음
- **Route:** 없음
- **Page Entry:** 없음

## Design Ref

- `design-reference/D-001/DESIGN.md` — Color/Typography/Spacing/Radius/Shadow 토큰, Section 계약, Empty State 규칙(LOCKED 정본).
- `design-reference/UI_CONTRACT.md` — 해당 Screen의 영역 순서·컴포넌트·상태·이동·금지 기능.
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen·Route·Page Entry 정본(schema `traveler-screen-route-v1`).

## Depends On

- `DATA-DESTINATIONS`
- `DATA-SAFETY`
- `DATA-REPRESENTATIVE`

## Expected Files

- `scripts/check_content_completeness.py`(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- 빌드 전 국내 10개 이상/해외 15개국 30개 도시 이상, 안전정보 국가 수=해외 국가 수, Timeline≥6/국가≥30/Gallery≥8 카운트 검사.
- 실패 시 누락 목록과 함께 종료 코드 1.

## Visual AC

없음

## Security/Privacy AC

없음.

## Test Cases

- [ ] 빌드 전 국내 10개 이상/해외 15개국 30개 도시 이상, 안전정보 국가 수=해외 국가 수, Timeline≥6/국가≥30/Gallery≥8 카운트 검사.
- [ ] 실패 시 누락 목록과 함께 종료 코드 1.
- [ ] (보안) 없음.

## Verify

CI(CI-PIPELINE)

## Definition of Done

- [ ] Functional AC 전 항목 충족
- [ ] Visual AC 해당 없음
- [ ] Security/Privacy AC 전 항목 충족(해당하는 경우)
- [ ] Test Cases 전 항목 통과
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- 이 Task 범위에서 EXCLUDED 처리된 요구사항(`TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표)을 임의로 구현하지 않는다.
- 구현 코드를 실제로 커밋하거나 Git Branch를 생성하지 않는다(이 문서는 Task 정의 문서다).
- 콘텐츠 CRUD 관리자 UI 등 EXCLUDED 처리된 기능을 이 스크립트에 포함하지 않는다.
- Expected Files 목록 밖의 파일을 수정하지 않는다.
