# PAGE-SCR005 — SCR-005 계정·관리 화면 조립

- **Category:** PAGE
- **Implementation Status:** IMPLEMENT
- **Priority:** P1
- **Source:** `TASKS/00_TASK_LIST.md` Seq 5

## Context

이 Task는 SCR-005 Route(`/account`)의 Page Owner Task로, 하위 Component/Data/API/Shared Task가 만든 결과물을 `src/app/account/page.tsx`(신규 생성) 안에서 실제 Route Page로 조립하는 책임만 진다.

## Project Scope

`PROJECT_SCOPE.md` 판정: **IMPLEMENT** — 축소 없이 실제 구현 대상.

## Requirement Ref

REQ-FUNC-028,029,036,038,040,041,042,066,068,077

(요구사항 원문은 `docs/06_SRS_UIUX_REVISED.md`, 판정 근거는 `docs/PROJECT_SCOPE.md` 참조)

## Screen / Route / Page Entry

- **Screen:** SCR-005
- **Route:** `/account`
- **Page Entry:** `src/app/account/page.tsx`(신규 생성)

## Design Ref

- `design-reference/D-001/DESIGN.md` — Color/Typography/Spacing/Radius/Shadow 토큰, Section 계약, Empty State 규칙(LOCKED 정본).
- `design-reference/UI_CONTRACT.md` — 해당 Screen의 영역 순서·컴포넌트·상태·이동·금지 기능.
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen·Route·Page Entry 정본(schema `traveler-screen-route-v1`).

## Depends On

- `CMP-SCR005-AUTH`
- `CMP-SCR005-PROFILE`
- `CMP-SCR005-MY-ACTIVITY`
- `CMP-SCR005-ADMIN`
- `SHARED-HEADER-FOOTER`

## Expected Files

- `src/app/account/page.tsx`(신규 생성)

**이 Task는 위 Expected Files 목록 밖의 파일을 수정하지 않는다.**

## Functional AC

- 역할별 렌더링(현재 역할에 해당하는 것만): **Guest** — 계정 기능 Intro → CMP-SCR005-AUTH(로그인/가입/비밀번호 재설정) → 로그인 후 가능한 기능 Chip → 보안 안내 Card.
- **Member** — CMP-SCR005-PROFILE(프로필·성인 확인 요약) → CMP-SCR005-MY-ACTIVITY(내 글: 작성 글 또는 완성형 Empty State, 참가 요청 보낸/받은, 차단 목록: 완성형 Empty State) → 새 동행글 작성 CTA(`/travel-tools`).
- **Admin** — 관리 Intro → CMP-SCR005-ADMIN(신고 상태 변경, 항공·숙소 외부 URL 설정).
- **역할에 없는 관리 영역(예: Guest에게 관리자 탭, Member에게 관리자 탭)은 렌더링하지 않음**을 완료 조건으로 포함.
- `CMP-SCR005-MY-ACTIVITY` 하위 목록(내 글/참가 요청/차단)은 조회 중 스켈레톤 Loading, 조회 실패 시 `danger` 텍스트+재시도 버튼을 표시한다. `CMP-SCR005-AUTH`/`CMP-SCR005-ADMIN` Form 제출 중에는 버튼 스피너, 제출 실패 시 `danger` 텍스트+재시도 안내를 표시한다(`design-reference/D-001/DESIGN.md` §Loading·Empty·Error).

## Visual AC

Desktop 콘텐츠 폭 ~960px, 여백 64~80px. 역할별 탭 전환 시 레이아웃 점프 없이 전환.

## Security/Privacy AC

관리자 탭은 신고 상태 변경·외부 URL 설정 외 기능(콘텐츠 CRUD, 감사 로그 등) 없음. 비밀번호는 Supabase Auth 암호화 저장, 생년월일 대신 성인 확인 여부·확인 시각만 저장. Guest가 `/account`의 Member/Admin URL에 직접 접근 시 로그인 탭으로 리다이렉트.

## Test Cases

- [ ] 역할별 렌더링(현재 역할에 해당하는 것만): **Guest** — 계정 기능 Intro → CMP-SCR005-AUTH(로그인/가입/비밀번호 재설정) → 로그인 후 가능한 기능 Chip → 보안 안내 Card.
- [ ] **Member** — CMP-SCR005-PROFILE(프로필·성인 확인 요약) → CMP-SCR005-MY-ACTIVITY(내 글: 작성 글 또는 완성형 Empty State, 참가 요청 보낸/받은, 차단 목록: 완성형 Empty State) → 새 동행글 작성 CTA(`/travel-tools`).
- [ ] **Admin** — 관리 Intro → CMP-SCR005-ADMIN(신고 상태 변경, 항공·숙소 외부 URL 설정).
- [ ] **역할에 없는 관리 영역(예: Guest에게 관리자 탭, Member에게 관리자 탭)은 렌더링하지 않음**을 완료 조건으로 포함.
- [ ] MY-ACTIVITY 하위 목록 Loading(스켈레톤)·Error(danger 텍스트+재시도), AUTH/ADMIN Form 제출 Loading(스피너)·Error(재시도) 상태 표시 확인.
- [ ] (보안) 관리자 탭은 신고 상태 변경·외부 URL 설정 외 기능(콘텐츠 CRUD, 감사 로그 등) 없음.
- [ ] (보안) 비밀번호는 Supabase Auth 암호화 저장, 생년월일 대신 성인 확인 여부·확인 시각만 저장.
- [ ] (보안) Guest가 `/account`의 Member/Admin URL에 직접 접근 시 로그인 탭으로 리다이렉트.

## Verify

Playwright(E2E-MATE-AUTH) + 수동 확인(역할별 3케이스)

## Definition of Done

- [ ] Functional AC 전 항목 충족
- [ ] Visual AC 전 항목 충족(해당하는 경우)
- [ ] Security/Privacy AC 전 항목 충족(해당하는 경우)
- [ ] Test Cases 전 항목 통과
- [ ] Expected Files 목록 외 파일 변경 없음
- [ ] Depends On에 명시된 모든 Task(CMP-SCR005-AUTH, CMP-SCR005-PROFILE, CMP-SCR005-MY-ACTIVITY, CMP-SCR005-ADMIN, SHARED-HEADER-FOOTER)가 완료된 상태에서 최종 조립 확인

## Forbidden

- 이 Task 범위에서 EXCLUDED 처리된 요구사항(`TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표)을 임의로 구현하지 않는다.
- 구현 코드를 실제로 커밋하거나 Git Branch를 생성하지 않는다(이 문서는 Task 정의 문서다).
- 이 Task는 Component/Data/API/Shared Task를 새로 만들지 않는다 — 이미 완료된 하위 Task의 결과물을 Page Entry 안에서 조립하는 것만 범위다.
- Expected Files 목록 밖의 파일(다른 Screen의 Page Entry 등)을 수정하지 않는다.
