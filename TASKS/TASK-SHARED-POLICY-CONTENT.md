# SHARED-POLICY-CONTENT — 약관·정책·안전수칙 콘텐츠

- **Category:** SHARED
- **Implementation Status:** IMPLEMENT
- **Priority:** P2
- **Source:** `TASKS/00_TASK_LIST.md` Seq 48

## Context

이 Task는 5개 Screen이 공통으로 사용하는 전역 요소를 구현하는 Shared Task다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-FUNC-080

(요구사항 원문은 `docs/06_SRS_UIUX_REVISED.md`, 판정 근거는 `docs/PROJECT_SCOPE.md` 참조)

## Screen / Route / Page Entry

- **Screen:** 전역(SCR-003 동의 체크박스 연동)
- **Route:** `/travel-tools`(동의), 전역(푸터 링크)
- **Page Entry:** `src/app/travel-tools/page.tsx`(연동), 정책 콘텐츠는 `src/data/policies.ts`(신규)

## Design Ref

- `design-reference/D-001/DESIGN.md` — Color/Typography/Spacing/Radius/Shadow 토큰, Section 계약, Empty State 규칙(LOCKED 정본).
- `design-reference/UI_CONTRACT.md` — 해당 Screen의 영역 순서·컴포넌트·상태·이동·금지 기능.
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen·Route·Page Entry 정본(schema `traveler-screen-route-v1`).

## Depends On

없음

## Expected Files

- `src/data/policies.ts`(신규)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- 이용약관·개인정보처리방침·동행 안전수칙·콘텐츠 면책 안내 콘텐츠, 동행글 작성 시 안전수칙 동의 체크와 정책 버전·동의 시각 저장.

## Visual AC

없음

## Security/Privacy AC

동의 기록은 버전과 타임스탬프 포함.

## Test Cases

- [ ] 이용약관·개인정보처리방침·동행 안전수칙·콘텐츠 면책 안내 콘텐츠, 동행글 작성 시 안전수칙 동의 체크와 정책 버전·동의 시각 저장.
- [ ] (보안) 동의 기록은 버전과 타임스탬프 포함.

## Verify

수동 확인

## Definition of Done

- [ ] Functional AC 전 항목 충족
- [ ] Visual AC 해당 없음
- [ ] Security/Privacy AC 전 항목 충족(해당하는 경우)
- [ ] Test Cases 전 항목 통과
- [ ] Expected Files 목록 외 파일 변경 없음

## Forbidden

- 이 Task 범위에서 EXCLUDED 처리된 요구사항(`TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표)을 임의로 구현하지 않는다.
- 구현 코드를 실제로 커밋하거나 Git Branch를 생성하지 않는다(이 문서는 Task 정의 문서다).
- Airbnb 상표 요소, 구매·예약·결제 UI를 추가하지 않는다.
- Proprietary 폰트 파일을 저장소에 포함하지 않는다.
- Expected Files 목록 밖의 파일을 수정하지 않는다.
