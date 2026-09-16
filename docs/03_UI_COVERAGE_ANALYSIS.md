# Free Traveler — UI Coverage Analysis

- **Document ID:** UICOV-TRAVEL-001
- **기반 문서:** `02_SRS_BASELINE.md`(SRS-TRAVEL-001), `PROJECT_SCOPE.md`(SCOPE-TRAVEL-001)
- **작성일:** 2026-09-10
- **상태:** UI Coverage Baseline

본 문서는 `REQ-FUNC-001~080`, `REQ-NF-001~034` 전체(114건)를 5개 디자인 Screen에 배치하고, 각 요구사항을 UI 표현 방식(`UI_DIRECT` / `UI_STATE` / `NON_UI` / `OPERATIONS`)으로 분류한다. `PROJECT_SCOPE.md`의 판정(`IMPLEMENT`, `IMPLEMENT(축소)`, `EXCLUDED`)은 그대로 인용하며 재판정하지 않는다.

## 분류 정의

| 분류 | 의미 |
|---|---|
| **UI_DIRECT** | 화면에 렌더링되는 구체적 요소(버튼, 필드, 목록, 배지, 안내문 등)로 직접 표현되는 요구사항 |
| **UI_STATE** | 화면 요소를 만들어내는 클라이언트 상태·검증·계산 로직(자체는 별도 위젯이 아니지만 특정 Screen의 동작에 반영됨) |
| **NON_UI** | 서버·데이터 계층의 정책·제약으로 특정 Screen에 렌더링되지 않는 요구사항(RLS, 서버 미저장, 스키마 제약 등) |
| **OPERATIONS** | 콘텐츠 거버넌스·CI·모니터링·비용·운영 프로세스 등 화면과 직접 연결되지 않는 운영 성격 요구사항 |

## Screen 고정 목록

| Screen ID | 라우트 | 배치 규칙 |
|---|---|---|
| SCR-001 | `/` 메인 | 여행지 목록·검색·필터 + 여행지 상세/안전정보 상세는 Drawer 또는 Modal |
| SCR-002 | `/about` 대표 소개 | 대표 프로필 콘텐츠 |
| SCR-003 | `/travel-tools` 통합 여행 준비 | 항공 탭 / 숙소 탭 / 동행 작성 탭 |
| SCR-004 | `/mates` 동행 조회 | 목록 + 상세 패널 |
| SCR-005 | `/account` 계정·관리 | 로그인 탭 / 프로필 탭 / 내 활동 탭 / 관리자 탭 |

`API Route`, 인증 콜백, 404/500/오류 화면은 기술 Route로 별도 취급하며 5개 Screen 수에 포함하지 않는다(관련 요구사항은 표에서 Screen 칸에 "기술 Route"로 표기).

---

## 1. Screen별 정의

### SCR-001 `/` 메인

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 국내·해외 여행지를 탐색해 후보를 좁히고, 필요 시 해당 국가 안전정보를 함께 확인한다 |
| 주요 영역 | 국내/해외 탭, 검색창, 국가·도시·계절·테마·기간 필터, 여행지 카드 목록, 빈 결과 안내, 즐겨찾기 토글, 여행지 상세 Drawer/Modal, 안전정보 상세 Drawer/Modal |
| 상태 | 목록 로딩, 필터 적용/초기화, 빈 결과, Drawer 닫힘/여행지 상세 열림/안전정보 상세 열림, 즐겨찾기 on/off, 안전정보 stale 경고 표시 |
| 이동 목적지 | 여행지 상세 내 "안전정보 보기" → 같은 화면의 안전정보 Drawer, "항공/숙소 알아보기" → SCR-003, 대표 소개 링크 → SCR-002, 동행 찾기 링크 → SCR-004 |

### SCR-002 `/about` 대표 소개

| 항목 | 내용 |
|---|---|
| 사용자 목표 | `free_traveler`의 여행 경험과 철학을 확인해 콘텐츠 추천 기준을 신뢰할 수 있는지 판단한다 |
| 주요 영역 | 대표 이미지·한 줄 소개, `50+ Trips`/`30+ Countries` 수치 카드, 여행 철학·편집 원칙, 방문 권역·국가 목록, 여행 타임라인, 추천 여행지 6곳, 문의·SNS 링크 |
| 상태 | 정적 콘텐츠 표시(로딩 외 상태 거의 없음), 방문 국가/추천 여행지 항목 선택 |
| 이동 목적지 | 방문 국가·추천 여행지 클릭 → SCR-001의 해당 여행지 상세 Drawer |

### SCR-003 `/travel-tools` 통합 여행 준비

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 항공·숙소 조건을 정리해 외부 예약 사이트로 이동하거나, 동행 모집글을 작성한다 |
| 주요 영역 | 항공 탭(국가·지역·출발일·귀국일 입력 → 요약 → 외부 이동), 숙소 탭(국가·지역·체크인·체크아웃 입력 → 요약 → 외부 이동), 동행 작성 탭(제목·조건·설명·안전수칙 동의 입력) |
| 상태 | 탭 전환, 입력 검증 실패/성공, 요약 확인, 비전달 고지 노출, 외부 이동 성공/오류, 연락처 패턴 탐지 차단, 동행 작성 제출 성공/실패 |
| 이동 목적지 | 항공/숙소 "보러 가기" → 설정된 외부 사이트(새 탭), 동행글 작성 완료 → SCR-004의 해당 글 상세 패널, 미인증 사용자 작성 시도 → SCR-005 로그인 탭 |

### SCR-004 `/mates` 동행 조회

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 조건이 맞는 동행 모집글을 찾아 참가를 요청하거나 신고·차단으로 자신을 보호한다 |
| 주요 영역 | 국가·지역·기간·연령대·성별·여행 스타일·모집 상태 필터, 모집글 목록, 상세 패널(조건·설명·작성자 정보·참가 요청 버튼·신고·차단) |
| 상태 | 목록 필터 적용, 상세 패널 열림/닫힘, 참가 요청 제출 중/완료/중복 차단, 신고 접수 완료, 차단 완료, 비로그인·미성년·비인증 상태 안내, 자동 계산된 모집중/마감 상태 |
| 이동 목적지 | 새 모집글 작성 → SCR-003 동행 작성 탭, 비로그인·성인 미확인 접근 → SCR-005 로그인 탭, 내 글 관리 → SCR-005 내 활동 탭 |

### SCR-005 `/account` 계정·관리

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 로그인·가입·성인 확인을 완료하고, 내 프로필과 내 활동을 관리하며(권한이 있으면) 신고·외부 URL을 관리한다 |
| 주요 영역 | 로그인 탭(로그인·가입·비밀번호 재설정), 프로필 탭(닉네임·연령대·성별·여행 스타일·자기소개, 성인 확인), 내 활동 탭(내 모집글·참가 요청 관리·즐겨찾기·차단 목록), 관리자 탭(신고 큐 상태 처리, 외부 URL 설정 — 권한 보유자만 노출) |
| 상태 | 비로그인/로그인, 이메일 인증 대기/완료, 성인 확인 미완료/완료, 관리자 권한 유무에 따른 탭 노출, 각 탭 내 목록·폼 상태 |
| 이동 목적지 | 내 활동 탭의 글/즐겨찾기 항목 → SCR-001 또는 SCR-004의 해당 상세, 참가 요청 승인/거절 결과는 SCR-004 상세에 반영 |

---

## 2. 기능 요구사항 배치 (REQ-FUNC-001 ~ 080)

### 2.1 F1. Destination Guide → SCR-001

| ID | 요구사항 요약 | PROJECT_SCOPE | UI 분류 | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-001 | 국내·해외 목록 구분 | IMPLEMENT | UI_DIRECT | SCR-001 | 탭 |
| REQ-FUNC-002 | 국가·도시·계절·테마·기간 필터 | IMPLEMENT | UI_DIRECT | SCR-001 | 필터바 |
| REQ-FUNC-003 | 키워드 검색 | IMPLEMENT | UI_DIRECT | SCR-001 | 검색창 |
| REQ-FUNC-004 | 상세 필수 콘텐츠 표시 | IMPLEMENT | UI_DIRECT | SCR-001 | 여행지 상세 Drawer/Modal |
| REQ-FUNC-005 | 빈 결과 안내·초기화 | IMPLEMENT | UI_DIRECT | SCR-001 | 목록 영역 |
| REQ-FUNC-006 | 해외 상세→안전정보 연결 | IMPLEMENT | UI_DIRECT | SCR-001 | 상세 Drawer 내 안전정보 Drawer 링크 |
| REQ-FUNC-007 | 대표 이미지 alt·출처 표시 | IMPLEMENT(축소) | UI_DIRECT | SCR-001 | 상세 Drawer 이미지 영역 |
| REQ-FUNC-008 | 게시 수량 기준(국내10/해외15개국30도시) 검증 | IMPLEMENT | OPERATIONS | — | 빌드 전 데이터 카운트 스크립트, 화면 요소 아님 |
| REQ-FUNC-009 | 관련 여행지 추천 최대 6개 | IMPLEMENT | UI_DIRECT | SCR-001 | 상세 Drawer 하단 |
| REQ-FUNC-010 | 필터 상태 URL 동기화 | EXCLUDED | UI_STATE | SCR-001 | 로컬 상태만 유지, query 동기화 미구현 |

### 2.2 F2. Flight Link-out → SCR-003 (항공 탭)

| ID | 요구사항 요약 | PROJECT_SCOPE | UI 분류 | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-011 | 국가·지역·출발일·귀국일 필수 입력 | IMPLEMENT | UI_DIRECT | SCR-003 | 항공 탭 폼 |
| REQ-FUNC-012 | 국가 변경 시 지역 옵션 재계산 | IMPLEMENT | UI_STATE | SCR-003 | 항공 탭 폼 로직 |
| REQ-FUNC-013 | 날짜 유효성 검증·제출 차단 | IMPLEMENT | UI_STATE | SCR-003 | 항공 탭 폼 검증 |
| REQ-FUNC-014 | 입력 요약 단계 표시 | IMPLEMENT | UI_DIRECT | SCR-003 | 항공 탭 요약 화면 |
| REQ-FUNC-015 | 입력값 비전달 고지 | IMPLEMENT | UI_DIRECT | SCR-003 | 폼·요약 문구 |
| REQ-FUNC-016 | 외부 항공 URL 새 탭 이동 | IMPLEMENT | UI_DIRECT | SCR-003 | "항공편 보러 가기" 버튼 |
| REQ-FUNC-017 | 입력값 서버 미저장 | IMPLEMENT | NON_UI | — | 클라이언트 전용 처리, 화면 요소 아님 |
| REQ-FUNC-018 | 외부 URL 오류 시 안내·재시도 | IMPLEMENT | UI_DIRECT | SCR-003 | 오류 배너 |

### 2.3 F3. Hotel Link-out → SCR-003 (숙소 탭)

| ID | 요구사항 요약 | PROJECT_SCOPE | UI 분류 | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-019 | 국가·지역·체크인·체크아웃 필수 입력 | IMPLEMENT | UI_DIRECT | SCR-003 | 숙소 탭 폼 |
| REQ-FUNC-020 | 국가 변경 시 지역 옵션 재계산 | IMPLEMENT | UI_STATE | SCR-003 | 숙소 탭 폼 로직 |
| REQ-FUNC-021 | 날짜 유효성 검증·제출 차단 | IMPLEMENT | UI_STATE | SCR-003 | 숙소 탭 폼 검증 |
| REQ-FUNC-022 | 입력 요약 표시 | IMPLEMENT | UI_DIRECT | SCR-003 | 숙소 탭 요약 화면 |
| REQ-FUNC-023 | 입력값 비전달 고지 | IMPLEMENT | UI_DIRECT | SCR-003 | 폼·요약 문구 |
| REQ-FUNC-024 | 외부 호텔 URL 새 탭 이동 | IMPLEMENT | UI_DIRECT | SCR-003 | "호텔 보러 가기" 버튼 |
| REQ-FUNC-025 | 입력값 서버 미저장 | IMPLEMENT | NON_UI | — | 클라이언트 전용 처리 |
| REQ-FUNC-026 | 외부 URL 오류 시 안내·재시도 | IMPLEMENT | UI_DIRECT | SCR-003 | 오류 배너 |

### 2.4 F4. Travel Mate → SCR-003(작성) / SCR-004(조회) / SCR-005(내 활동·관리자)

| ID | 요구사항 요약 | PROJECT_SCOPE | UI 분류 | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-027 | 쓰기 액션 인증 세션 요구 | IMPLEMENT | NON_UI | SCR-003, SCR-004, SCR-005 | 인증 미들웨어, 실패 시 SCR-005 로그인 탭으로 안내 |
| REQ-FUNC-028 | 성인 확인 상태 요구(생년월일 미저장) | IMPLEMENT | UI_DIRECT | SCR-005 | 프로필 탭 성인 확인 체크박스 |
| REQ-FUNC-029 | 프로필(닉네임·연령대·성별·스타일·소개) | IMPLEMENT | UI_DIRECT | SCR-005 | 프로필 탭 폼 |
| REQ-FUNC-030 | 국가·지역·기간·연령대·성별·스타일·상태 필터 | IMPLEMENT | UI_DIRECT | SCR-004 | 목록 필터 |
| REQ-FUNC-031 | 모집글 작성 필드·검증 | IMPLEMENT | UI_DIRECT | SCR-003 | 동행 작성 탭 폼 |
| REQ-FUNC-032 | 공개 연락처 패턴 탐지 후 제출 차단 | IMPLEMENT | UI_STATE | SCR-003 | 동행 작성 탭 검증 로직 |
| REQ-FUNC-033 | 응답에 연락처 미포함 | IMPLEMENT | NON_UI | SCR-004 | 응답 스키마 제한 |
| REQ-FUNC-034 | 참가 메시지 비공개 제출 | IMPLEMENT | UI_DIRECT | SCR-004 | 상세 패널 참가 요청 폼 |
| REQ-FUNC-035 | 중복 요청 차단 | IMPLEMENT | NON_UI | SCR-004 | DB unique 제약 |
| REQ-FUNC-036 | 작성자 승인·거절 | IMPLEMENT | UI_DIRECT | SCR-005 | 내 활동 탭 참가 요청 관리 |
| REQ-FUNC-037 | 종료일 경과 시 자동 마감 | IMPLEMENT | UI_STATE | SCR-004 | 조회 시 계산되어 목록/상세 상태에 반영 |
| REQ-FUNC-038 | 작성자 수동 마감·수정·삭제 | IMPLEMENT | UI_DIRECT | SCR-005 | 내 활동 탭 글 관리 |
| REQ-FUNC-039 | 신고(사유코드·설명) | IMPLEMENT | UI_DIRECT | SCR-004 | 상세 패널 신고 버튼 |
| REQ-FUNC-040 | 사용자 차단·해제 | IMPLEMENT | UI_DIRECT | SCR-004 | 상세 패널 차단 버튼(관리는 SCR-005 내 활동 탭) |
| REQ-FUNC-041 | 신고 목록·상태 필터(축소) | IMPLEMENT(축소) | UI_DIRECT | SCR-005 | 관리자 탭 신고 큐 |
| REQ-FUNC-042 | 신고 처리(숨김/기각, 축소) | IMPLEMENT(축소) | UI_DIRECT | SCR-005 | 관리자 탭 처리 액션 |
| REQ-FUNC-043 | 요청·신고 처리 결과 인앱 알림(이메일 제외) | IMPLEMENT(축소) | UI_DIRECT | 전역(모든 Screen) | Toast/상태 배지 |
| REQ-FUNC-044 | RLS로 비공개 데이터 접근 제한 | IMPLEMENT | NON_UI | — | 서버 정책 |
| REQ-FUNC-045 | 탈퇴 시 30일 내 삭제 등 개인정보 라이프사이클 | EXCLUDED | NON_UI | — | 운영 프로세스 필요, 미구현 |

### 2.5 F5. Country Safety → SCR-001 (안전정보 Drawer/Modal)

| ID | 요구사항 요약 | PROJECT_SCOPE | UI 분류 | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-046 | 해외 국가 100% 안전 페이지 | IMPLEMENT | UI_DIRECT | SCR-001 | 안전정보 Drawer 존재 여부 |
| REQ-FUNC-047 | 8개 카테고리 필수 표시 | IMPLEMENT | UI_DIRECT | SCR-001 | 안전정보 Drawer 섹션 |
| REQ-FUNC-048 | 출처명·URL·확인일 표시 | IMPLEMENT | UI_DIRECT | SCR-001 | 안전정보 Drawer 메타 영역 |
| REQ-FUNC-049 | 외교부 원문 새 탭 링크 | IMPLEMENT | UI_DIRECT | SCR-001 | 안전정보 Drawer 링크 |
| REQ-FUNC-050 | 7일 경과 stale 경고 | IMPLEMENT | UI_STATE | SCR-001 | 렌더링 시 계산 → 경고 배지 |
| REQ-FUNC-051 | 중대 경보 상단 텍스트 표시 | IMPLEMENT | UI_DIRECT | SCR-001 | 안전정보 Drawer 상단 |
| REQ-FUNC-052 | 국가·지역 경보 범위 구분 | IMPLEMENT | UI_DIRECT | SCR-001 | 안전정보 Drawer 범위 라벨 |
| REQ-FUNC-053 | 긴급연락처·영사콜센터 표시 | IMPLEMENT | UI_DIRECT | SCR-001 | 안전정보 Drawer 섹션 |
| REQ-FUNC-054 | 공식 판단 대체 불가 고지 | IMPLEMENT | UI_DIRECT | SCR-001 | 안전정보 Drawer 고지문 |
| REQ-FUNC-055 | Editor/Admin 작성·검수·게시 워크플로 | EXCLUDED | OPERATIONS | — | CMS 성격, 정적 데이터로 직접 관리 |
| REQ-FUNC-056 | 변경 이력 보존 | EXCLUDED | OPERATIONS | — | 감사 로그 제외 범위 |

### 2.6 F6. About free_traveler → SCR-002

| ID | 요구사항 요약 | PROJECT_SCOPE | UI 분류 | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-057 | 대표명·`50+`·`30+` 표시 | IMPLEMENT | UI_DIRECT | SCR-002 | 수치 카드 |
| REQ-FUNC-058 | 소개문·철학·편집 원칙 | IMPLEMENT | UI_DIRECT | SCR-002 | 본문 |
| REQ-FUNC-059 | 방문 권역 지도/30개국 목록 | IMPLEMENT | UI_DIRECT | SCR-002 | 지도/목록 영역 |
| REQ-FUNC-060 | 여행 타임라인 | IMPLEMENT | UI_DIRECT | SCR-002 | 타임라인 영역 |
| REQ-FUNC-061 | 대표 이미지 alt·출처 표시 | IMPLEMENT(축소) | UI_DIRECT | SCR-002 | 이미지 영역 |
| REQ-FUNC-062 | 문의·SNS 링크 | IMPLEMENT | UI_DIRECT | SCR-002 | 하단 링크 |
| REQ-FUNC-063 | 추천 여행지 6곳 연결 | IMPLEMENT | UI_DIRECT | SCR-002 | 추천 카드→SCR-001 상세 이동 |

### 2.7 F7. Common, Admin, Governance

| ID | 요구사항 요약 | PROJECT_SCOPE | UI 분류 | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-064 | 전역 내비게이션·푸터 | IMPLEMENT | UI_DIRECT | 전역(5개 Screen 공통) | 공통 레이아웃 |
| REQ-FUNC-065 | 반응형 레이아웃(320px~) | IMPLEMENT | UI_DIRECT | 전역(5개 Screen 공통) | 공통 레이아웃 |
| REQ-FUNC-066 | 이메일 가입·인증·로그인·로그아웃·재설정 | IMPLEMENT | UI_DIRECT | SCR-005 | 로그인 탭 (인증 콜백 자체는 기술 Route) |
| REQ-FUNC-067 | 여행지·안전정보 통합 검색 | EXCLUDED | UI_DIRECT | SCR-001 | 미구현, 화면별 개별 검색으로 대체 |
| REQ-FUNC-068 | 즐겨찾기 추가/해제/목록 | IMPLEMENT | UI_DIRECT | SCR-001, SCR-005 | 토글은 SCR-001, 목록은 SCR-005 내 활동 탭 |
| REQ-FUNC-069 | URL 공유 | EXCLUDED | UI_DIRECT | SCR-001 | 미구현 |
| REQ-FUNC-070 | title/description/canonical 메타데이터 | IMPLEMENT(축소) | NON_UI | 전역 | `<head>` 메타 태그, 렌더링 요소 아님 |
| REQ-FUNC-071 | 행동 분석 이벤트 수집 | EXCLUDED | NON_UI | — | 분석 파이프라인 미구축 |
| REQ-FUNC-072 | 여행지 콘텐츠 CRUD 관리자 화면 | EXCLUDED | OPERATIONS | — | CMS 제외 |
| REQ-FUNC-073 | 미디어 업로드·라이선스 입력 워크플로 | EXCLUDED | OPERATIONS | — | 업로드 워크플로 제외 |
| REQ-FUNC-074 | 게시 전 완전성 게이트 | IMPLEMENT(축소) | OPERATIONS | — | CI 데이터 검증 스크립트 |
| REQ-FUNC-075 | 안전정보 stale 대시보드 | EXCLUDED | OPERATIONS | — | 관리자 범위 밖 |
| REQ-FUNC-076 | 관리자 변경·신고 처리 감사 로그 | EXCLUDED | OPERATIONS | — | 범용 감사 로그 제외 |
| REQ-FUNC-077 | 외부 URL 허용목록 설정 | IMPLEMENT | UI_DIRECT | SCR-005 | 관리자 탭 외부 URL 설정 폼 |
| REQ-FUNC-078 | 404/500/권한없음/외부연결실패 화면 | IMPLEMENT | UI_DIRECT | 기술 Route | 5개 디자인 Screen에 포함하지 않음 |
| REQ-FUNC-079 | 폼·모달·탭·알림 ARIA/시맨틱 | IMPLEMENT(축소) | UI_STATE | 전역(5개 Screen 공통) | 접근성 마크업, 전수 자동 검사는 제외 |
| REQ-FUNC-080 | 약관·정책·안전수칙 동의 | IMPLEMENT | UI_DIRECT | SCR-003(동의 체크박스), 전역 푸터(정책 본문 링크) | 정책 본문은 5개 핵심 Screen과 별도 보조 콘텐츠 |

---

## 3. 비기능 요구사항 배치 (REQ-NF-001 ~ 034)

### 3.1 Performance

| ID | 요구사항 요약 | PROJECT_SCOPE | UI 분류 | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-001 | LCP p75 목표 | EXCLUDED | OPERATIONS | — | 성능 모니터링 인프라 없음 |
| REQ-NF-002 | INP p75 목표 | EXCLUDED | OPERATIONS | — | 상동 |
| REQ-NF-003 | CLS p75 목표 | EXCLUDED | OPERATIONS | — | 상동 |
| REQ-NF-004 | 필터 응답 p95(동시 50명) | EXCLUDED | OPERATIONS | — | 부하 테스트 제외 |
| REQ-NF-005 | 쓰기 API 응답 p95 | EXCLUDED | OPERATIONS | — | 성능 측정 인프라 없음 |
| REQ-NF-006 | 이미지 반응형·지연 로드 | IMPLEMENT | UI_STATE | SCR-001, SCR-002 | Next.js Image 기본 동작 |
| REQ-NF-007 | Lighthouse 성능 예산 CI | EXCLUDED | OPERATIONS | — | 성능 CI 게이트 제외 |

### 3.2 Reliability and Recovery

| ID | 요구사항 요약 | PROJECT_SCOPE | UI 분류 | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-008 | 월간 가용성 99.5% | EXCLUDED | OPERATIONS | — | SLA 모니터링 없음 |
| REQ-NF-009 | 내부 API 5xx 비율 | EXCLUDED | OPERATIONS | — | 모니터링 대시보드 없음 |
| REQ-NF-010 | DB 백업 RPO/RTO | EXCLUDED | OPERATIONS | — | 자동 백업 제외 |
| REQ-NF-011 | 외부 링크 주1회 자동 점검 | IMPLEMENT(축소) | OPERATIONS | — | Playwright smoke 시점 1회성 점검으로 대체 |

### 3.3 Security and Privacy

| ID | 요구사항 요약 | PROJECT_SCOPE | UI 분류 | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-012 | TLS 1.2 이상 | IMPLEMENT | NON_UI | — | Vercel/Supabase 기본 제공 |
| REQ-NF-013 | 인증·역할·RLS 서버 검증 | IMPLEMENT | NON_UI | — | 서버 정책 |
| REQ-NF-014 | CSRF 방어·SameSite 쿠키 | IMPLEMENT | NON_UI | — | Server Actions 기본값 |
| REQ-NF-015 | 입력 검증·저장 XSS 차단 | IMPLEMENT | NON_UI | — | 서버 검증·이스케이프 |
| REQ-NF-016 | 비밀키 환경변수 관리 | IMPLEMENT | NON_UI | — | 빌드/배포 설정 |
| REQ-NF-017 | 항공·호텔 원시 입력 미보존 | IMPLEMENT | NON_UI | SCR-003 | 클라이언트 전용 처리 |
| REQ-NF-018 | 개인정보 내보내기·삭제 요청 | EXCLUDED | NON_UI | — | 운영 프로세스 필요 |

### 3.4 Safety and Moderation

| ID | 요구사항 요약 | PROJECT_SCOPE | UI 분류 | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-019 | 신고 접수 응답 p95 ≤3s | IMPLEMENT | UI_STATE | SCR-004 | 신고 제출 즉시 접수 반영 |
| REQ-NF-020 | 신고 1차 검토 24h 90% | EXCLUDED | OPERATIONS | — | SLA 추적 없음 |
| REQ-NF-021 | 글·요청·신고 속도 제한 | EXCLUDED | OPERATIONS | — | rate limit 인프라 없음 |
| REQ-NF-022 | Moderator 조치 추적 가능성 | EXCLUDED | OPERATIONS | — | 감사 로그 제외 |

### 3.5 Accessibility

| ID | 요구사항 요약 | PROJECT_SCOPE | UI 분류 | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-023 | WCAG 2.2 AA 목표 | IMPLEMENT | UI_STATE | 전역(5개 Screen 공통) | 목표 수준, 공식 인증 아님 |
| REQ-NF-024 | axe 자동 검사(serious/critical 0) | EXCLUDED | OPERATIONS | — | 접근성 CI 미구축 |
| REQ-NF-025 | 키보드·스크린리더 전수 수동 검사 | EXCLUDED | OPERATIONS | — | Smoke 범위 수동 확인으로 축소 |

### 3.6 Content, Freshness, SEO, Copyright

| ID | 요구사항 요약 | PROJECT_SCOPE | UI 분류 | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-026 | 여행지 콘텐츠 완전성 100% | IMPLEMENT | OPERATIONS | — | 정적 데이터 타입 강제 |
| REQ-NF-027 | 해외 국가 안전정보 커버리지 100% | IMPLEMENT | OPERATIONS | — | 데이터 등록 검증 |
| REQ-NF-028 | 안전정보 최신 확인 목표(95%) | IMPLEMENT | OPERATIONS | — | stale 계산 로직은 FUNC-050에서 UI_STATE로 구현, 본 항목은 커버리지 목표 |
| REQ-NF-029 | 미디어 라이선스 메타데이터 100% | EXCLUDED | OPERATIONS | — | 라이선스 워크플로 제외 |
| REQ-NF-030 | 공개 페이지 SEO 메타데이터 | IMPLEMENT(축소) | NON_UI | 전역 | `<head>` 메타 태그 |

### 3.7 Maintainability, Monitoring, Cost

| ID | 요구사항 요약 | PROJECT_SCOPE | UI 분류 | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-031 | TypeScript strict·lint·테스트 게이트 | IMPLEMENT | OPERATIONS | — | CI 게이트 |
| REQ-NF-032 | 구조화 로그 | EXCLUDED | OPERATIONS | — | 로깅 인프라 없음 |
| REQ-NF-033 | 5분 이내 장애 알림 | EXCLUDED | OPERATIONS | — | 장애 알림 제외 |
| REQ-NF-034 | 월 인프라 비용 목표 | IMPLEMENT | OPERATIONS | — | 무료/저가 티어로 자연 충족 |

---

## 4. 요구사항 총수 확인

| 구분 | 건수 |
|---|---:|
| REQ-FUNC-001 ~ 080 | 80 |
| REQ-NF-001 ~ 034 | 34 |
| **합계** | **114** |

### 4.1 UI 분류별 집계

| UI 분류 | 건수 |
|---|---:|
| UI_DIRECT | 54 |
| UI_STATE | 12 |
| NON_UI | 17 |
| OPERATIONS | 31 |
| **합계** | **114** |

### 4.2 Screen별 배치 건수(UI_DIRECT·UI_STATE 기준, 전역/기술 Route 제외)

| Screen | 건수(주요 배치 요구사항, 복수 Screen 표기 시 첫 번째 Screen 기준) |
|---|---:|
| SCR-001 | 22 |
| SCR-002 | 7 |
| SCR-003 | 17 |
| SCR-004 | 6 |
| SCR-005 | 8 |
| 전역(5개 Screen 공통) | 5 |
| 기술 Route(디자인 Screen 미포함) | 1 |
| **합계** | **66** |

> 삭제된 요구사항 없음. `PROJECT_SCOPE.md`에서 `EXCLUDED`로 판정된 항목은 본 문서에서도 `EXCLUDED`로 그대로 인용했으며 구현 범위로 복원하지 않았다. 디자인 Screen은 SCR-001~005 5개로 고정했고 추가 핵심 Screen을 만들지 않았다.
