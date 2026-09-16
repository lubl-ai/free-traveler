# Free Traveler — UI/UX Traceability Matrix

- **Document ID:** UIUX-TRACE-001
- **기반 문서:** `02_SRS_BASELINE.md`, `PROJECT_SCOPE.md`, `03_UI_COVERAGE_ANALYSIS.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `docs/05_UIUX_APPROVED.md`, `docs/06_SRS_UIUX_REVISED.md`
- **작성일:** 2026-09-15
- **상태:** Traceability Baseline — Task 미생성 상태

REQ-FUNC-001~080, REQ-NF-001~034 전 114건을 Screen·Route·Page Entry와 연결한다. 아직 어떤 Task도 생성되지 않았으므로 `Task` 열은 예외 없이 `PENDING_TASK_GENERATION`으로 기록한다. 코드가 아직 구현되지 않았으므로 `Test` 열은 "실행된 테스트 결과"가 아니라 **향후 사용할 검증 방법**을 기록한 것이며, 구현 완료를 의미하지 않는다.

## 열 정의

| 열 | 의미 |
|---|---|
| **Requirement** | 요구사항 ID + 한 줄 요약(원문은 `02_SRS_BASELINE.md`) |
| **Implementation Status** | `PROJECT_SCOPE.md` 판정 그대로 인용: `IMPLEMENT` / `IMPLEMENT(축소)` / `EXCLUDED` |
| **Screen** | 승인된 SCR-001~005 중 매핑되는 화면. 화면이 없는 항목(서버/운영 성격)은 `—` |
| **Route** | `SCREEN_ROUTE_CONTRACT.json` 기준 Route. 화면 없는 항목은 `N/A` |
| **Page Entry** | 해당 Route의 Next.js Page Entry 파일. 화면 없는 항목은 `N/A` |
| **Task** | 연결된 구현 Task ID. Task 생성 전에는 전부 `PENDING_TASK_GENERATION` |
| **Test** | 향후 적용할 검증 방법(수동 확인, Playwright smoke, 코드 리뷰, CI 스크립트 등) |
| **Status** | 이 traceability 행 자체의 상태: `MAPPED`(Screen 있음) / `MAPPED_NO_UI`(구현하지만 화면 없음, 서버·CI 성격) / `EXCLUDED`(구현하지 않음) |

---

## 1. REQ-FUNC-001~080

### 1.1 F1. Destination Guide → SCR-001

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-001 국내·해외 목록 구분 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright smoke: 탭 전환 시 목록 구성 확인 | MAPPED |
| REQ-FUNC-002 국가·도시·계절·테마·기간 필터 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright smoke + 수동 확인 | MAPPED |
| REQ-FUNC-003 키워드 검색 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-004 여행지 상세 필수 콘텐츠 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TypeScript 타입 체크 + Playwright smoke | MAPPED |
| REQ-FUNC-005 빈 결과 안내·초기화 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-006 해외 상세→안전정보 연결 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 정적 데이터 상호 참조 스크립트 검사 | MAPPED |
| REQ-FUNC-007 대표 이미지 alt·출처 표시 | IMPLEMENT(축소) | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 정적 데이터 alt/sourceUrl 존재 검사 | MAPPED |
| REQ-FUNC-008 게시 수량 기준 검증 | IMPLEMENT | — | N/A | N/A | PENDING_TASK_GENERATION | 빌드 전 데이터 카운트 스크립트 | MAPPED_NO_UI |
| REQ-FUNC-009 관련 여행지 추천 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-010 필터 상태 URL 동기화 | EXCLUDED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 코드 리뷰: query 동기화 로직 부재 확인 | EXCLUDED |

### 1.2 F2. Flight Link-out → SCR-003(항공편 탭)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-011 항공 필수 입력 필드 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright smoke | MAPPED |
| REQ-FUNC-012 국가 종속 지역 옵션 재계산 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-013 항공 날짜 검증 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright smoke: 경계값 케이스 | MAPPED |
| REQ-FUNC-014 항공 입력 요약 표시 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-015 항공 비전달 고지 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-016 항공 외부 URL 새 탭 이동 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | 수동 확인: 새 탭·query 없음 | MAPPED |
| REQ-FUNC-017 항공 입력값 서버 미저장 | IMPLEMENT | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰: 서버 저장 경로 없음 확인 | MAPPED_NO_UI |
| REQ-FUNC-018 항공 URL 오류 안내·재시도 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | 수동 확인: 환경변수 제거 후 동작 | MAPPED |

### 1.3 F3. Hotel Link-out → SCR-003(숙소 탭)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-019 호텔 필수 입력 필드 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright smoke | MAPPED |
| REQ-FUNC-020 호텔 지역 옵션 재계산 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-021 호텔 날짜 검증 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright smoke: 경계값 케이스 | MAPPED |
| REQ-FUNC-022 호텔 입력 요약 표시 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-023 호텔 비전달 고지 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-024 호텔 외부 URL 새 탭 이동 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-025 호텔 입력값 서버 미저장 | IMPLEMENT | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 | MAPPED_NO_UI |
| REQ-FUNC-026 호텔 URL 오류 안내·재시도 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |

### 1.4 F4. Travel Mate → SCR-003(작성)/SCR-004(조회)/SCR-005(내 활동·관리자)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-027 쓰기 액션 인증 세션 요구 | IMPLEMENT | SCR-003, SCR-004 | `/travel-tools`, `/mates` | `src/app/travel-tools/page.tsx`, `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | 수동 확인: 비로그인 접근 시 SCR-005 로그인 탭 리다이렉트 | MAPPED_NO_UI |
| REQ-FUNC-028 성인 확인 상태 요구 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | 수동 확인: DB 컬럼 확인 | MAPPED |
| REQ-FUNC-029 동행 프로필 필드 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright smoke | MAPPED |
| REQ-FUNC-030 동행 목록 필터 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-031 모집글 작성 필드·검증 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright smoke | MAPPED |
| REQ-FUNC-032 공개 연락처 탐지·차단 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | 수동 확인: 샘플 패턴 입력 테스트 | MAPPED |
| REQ-FUNC-033 응답에 연락처 미포함 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | 코드 리뷰: 응답 스키마 확인 | MAPPED_NO_UI |
| REQ-FUNC-034 참가 메시지 비공개 제출 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | Playwright smoke | MAPPED |
| REQ-FUNC-035 중복 요청 차단 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | 수동 확인: DB unique 제약 | MAPPED_NO_UI |
| REQ-FUNC-036 작성자 승인·거절 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | 수동 확인: 비작성자 요청 시 거부 | MAPPED |
| REQ-FUNC-037 종료일 경과 자동 마감 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | 수동 확인: 종료일 지난 글 목록 제외 | MAPPED |
| REQ-FUNC-038 작성자 수동 마감·수정·삭제 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright smoke | MAPPED |
| REQ-FUNC-039 신고(사유코드·설명) | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-040 사용자 차단·해제 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-041 신고 목록·상태 필터 | IMPLEMENT(축소) | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-042 신고 처리(숨김/기각) | IMPLEMENT(축소) | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-043 요청·신고 처리 결과 인앱 알림 | IMPLEMENT(축소) | 전역(5개 Screen 공통) | 전역(5개 Route 공통) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-044 RLS 비공개 데이터 접근 제한 | IMPLEMENT | — | N/A | N/A | PENDING_TASK_GENERATION | 수동 확인: 타 계정 접근 시 차단 | MAPPED_NO_UI |
| REQ-FUNC-045 탈퇴 시 개인정보 삭제 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰: 자동 삭제 배치 부재 확인 | EXCLUDED |

### 1.5 F5. Country Safety → SCR-001(안전정보 Drawer)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-046 해외 국가 100% 안전 페이지 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 데이터 카운트 스크립트 | MAPPED |
| REQ-FUNC-047 8개 카테고리 필수 표시 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TypeScript 타입 체크 | MAPPED |
| REQ-FUNC-048 출처명·URL·확인일 표시 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 정적 데이터 필드 검사 | MAPPED |
| REQ-FUNC-049 외교부 원문 새 탭 링크 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-050 7일 경과 stale 경고 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 수동 확인: 확인일 조작 테스트 | MAPPED |
| REQ-FUNC-051 중대 경보 상단 표시 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-052 국가·지역 경보 범위 구분 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 정적 데이터 필드 검사 | MAPPED |
| REQ-FUNC-053 긴급연락처·영사콜센터 표시 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-054 공식 판단 대체 불가 고지 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-055 Editor/Admin 작성·검수·게시 워크플로 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰: 콘텐츠 상태 전이 UI 부재 확인 | EXCLUDED |
| REQ-FUNC-056 변경 이력 보존 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰: 이력 테이블 부재 확인 | EXCLUDED |

### 1.6 F6. About free_traveler → SCR-002

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-057 대표명·`50+`·`30+` 표시 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | 수동 확인: 홈 소개 카드와 값 일치 | MAPPED |
| REQ-FUNC-058 소개문·철학·편집 원칙 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-059 방문 권역 지도/국가 목록 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | 데이터 카운트 검사(≥30) | MAPPED |
| REQ-FUNC-060 여행 타임라인 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | 수동 확인(≥6개) | MAPPED |
| REQ-FUNC-061 대표 이미지 alt·출처 표시 | IMPLEMENT(축소) | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | 정적 데이터 필드 검사 | MAPPED |
| REQ-FUNC-062 문의·SNS 링크 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-063 추천 여행지 6개 연결 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | 수동 확인: 링크 유효성 | MAPPED |

### 1.7 F7. Common, Admin, Governance

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-064 전역 내비게이션·푸터 | IMPLEMENT | 전역(5개 Screen 공통) | 전역(5개 Route 공통) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | Playwright smoke | MAPPED |
| REQ-FUNC-065 반응형 레이아웃 | IMPLEMENT | 전역(5개 Screen 공통) | 전역(5개 Route 공통) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | 수동 확인: 뷰포트 리사이즈 | MAPPED |
| REQ-FUNC-066 이메일 가입·인증·로그인·재설정 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright smoke(콜백 자체는 기술 Route `/auth/callback`) | MAPPED |
| REQ-FUNC-067 통합 검색 | EXCLUDED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 코드 리뷰: 통합 검색 라우트 부재 확인 | EXCLUDED |
| REQ-FUNC-068 즐겨찾기 추가/해제/목록 | IMPLEMENT | SCR-001, SCR-005 | `/`, `/account` | `src/app/page.tsx`, `src/app/account/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-069 URL 공유 | EXCLUDED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 코드 리뷰 | EXCLUDED |
| REQ-FUNC-070 SEO 메타데이터 | IMPLEMENT(축소) | 전역(5개 Screen 공통) | 전역(5개 Route 공통) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | 수동 확인: 페이지 소스 메타 태그 | MAPPED_NO_UI |
| REQ-FUNC-071 행동 분석 이벤트 수집 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰: 이벤트 트래킹 코드 부재 확인 | EXCLUDED |
| REQ-FUNC-072 여행지 콘텐츠 CRUD 관리자 화면 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰: `/account` 관리자 탭에 콘텐츠 CRUD 부재 확인 | EXCLUDED |
| REQ-FUNC-073 미디어 업로드·라이선스 워크플로 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 | EXCLUDED |
| REQ-FUNC-074 게시 전 완전성 게이트 | IMPLEMENT(축소) | — | N/A | N/A | PENDING_TASK_GENERATION | CI 스크립트 실행 결과 | MAPPED_NO_UI |
| REQ-FUNC-075 안전정보 stale 대시보드 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 | EXCLUDED |
| REQ-FUNC-076 관리자 감사 로그 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰: 로그 테이블 부재 확인 | EXCLUDED |
| REQ-FUNC-077 외부 URL 허용목록 설정 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | 수동 확인: HTTP/`javascript:` 입력 시 저장 거부 | MAPPED |
| REQ-FUNC-078 404/500/권한없음/외부연결실패 화면 | IMPLEMENT | 기술 Route | `*` | `src/app/not-found.tsx`, `src/app/error.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-FUNC-079 ARIA/시맨틱 마크업 | IMPLEMENT(축소) | 전역(5개 Screen 공통) | 전역(5개 Route 공통) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | 수동 키보드 탐색 확인 | MAPPED |
| REQ-FUNC-080 약관·정책·안전수칙 동의 | IMPLEMENT | SCR-003(동의 체크박스), 전역(푸터 정책 링크) | `/travel-tools`, 전역(5개 Route 공통) | `src/app/travel-tools/page.tsx`, `src/app/layout.tsx` | PENDING_TASK_GENERATION | Playwright smoke | MAPPED |

---

## 2. REQ-NF-001~034

### 2.1 Performance

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-001 LCP p75 목표 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰: 성능 측정 도구 부재 확인 | EXCLUDED |
| REQ-NF-002 INP p75 목표 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 | EXCLUDED |
| REQ-NF-003 CLS p75 목표 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 | EXCLUDED |
| REQ-NF-004 필터 응답 p95(동시 50명) | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰: 부하 테스트 스크립트 부재 확인 | EXCLUDED |
| REQ-NF-005 쓰기 API 응답 p95 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 | EXCLUDED |
| REQ-NF-006 이미지 반응형·지연 로드 | IMPLEMENT | SCR-001, SCR-002 | `/`, `/about` | `src/app/page.tsx`, `src/app/about/page.tsx` | PENDING_TASK_GENERATION | 수동 확인: 네트워크 탭 지연 로드 | MAPPED |
| REQ-NF-007 Lighthouse 성능 예산 CI | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰: CI 설정에 Lighthouse 단계 부재 확인 | EXCLUDED |

### 2.2 Reliability and Recovery

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-008 월간 가용성 99.5% | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 | EXCLUDED |
| REQ-NF-009 내부 API 5xx 비율 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 | EXCLUDED |
| REQ-NF-010 DB 백업 RPO/RTO | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 | EXCLUDED |
| REQ-NF-011 외부 링크 주1회 자동 점검 | IMPLEMENT(축소) | — | N/A | N/A | PENDING_TASK_GENERATION | Playwright smoke 결과(배포 전 1회성) | MAPPED_NO_UI |

### 2.3 Security and Privacy

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-012 TLS 1.2 이상 | IMPLEMENT | — | N/A | N/A | PENDING_TASK_GENERATION | 수동 확인: 브라우저 인증서 정보 | MAPPED_NO_UI |
| REQ-NF-013 인증·역할·RLS 서버 검증 | IMPLEMENT | — | N/A | N/A | PENDING_TASK_GENERATION | 수동 확인: 권한별 접근 테스트 | MAPPED_NO_UI |
| REQ-NF-014 CSRF 방어·SameSite 쿠키 | IMPLEMENT | — | N/A | N/A | PENDING_TASK_GENERATION | 수동 확인: 타 오리진 요청 차단 | MAPPED_NO_UI |
| REQ-NF-015 입력 검증·저장 XSS 차단 | IMPLEMENT | — | N/A | N/A | PENDING_TASK_GENERATION | 수동 확인: 스크립트 입력 테스트 | MAPPED_NO_UI |
| REQ-NF-016 비밀키 환경변수 관리 | IMPLEMENT | — | N/A | N/A | PENDING_TASK_GENERATION | 빌드 산출물에서 키 문자열 검색 | MAPPED_NO_UI |
| REQ-NF-017 항공·호텔 원시 입력 미보존 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | 코드 리뷰 + 네트워크 탭 확인 | MAPPED_NO_UI |
| REQ-NF-018 개인정보 내보내기·삭제 요청 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 | EXCLUDED |

### 2.4 Safety and Moderation

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-019 신고 접수 응답 p95 ≤3s | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-NF-020 신고 1차 검토 24h 90% | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 | EXCLUDED |
| REQ-NF-021 글·요청·신고 속도 제한 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 | EXCLUDED |
| REQ-NF-022 Moderator 조치 추적 가능성 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 | EXCLUDED |

### 2.5 Accessibility

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-023 WCAG 2.2 AA 목표 | IMPLEMENT | 전역(5개 Screen 공통) | 전역(5개 Route 공통) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED |
| REQ-NF-024 axe 자동 검사 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰: CI 설정 확인 | EXCLUDED |
| REQ-NF-025 키보드·스크린리더 전수 수동 검사 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 수동 확인 범위 기록 | EXCLUDED |

### 2.6 Content, Freshness, SEO, Copyright

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-026 여행지 콘텐츠 완전성 100% | IMPLEMENT | — | N/A | N/A | PENDING_TASK_GENERATION | TypeScript 타입 체크 | MAPPED_NO_UI |
| REQ-NF-027 해외 국가 안전정보 커버리지 100% | IMPLEMENT | — | N/A | N/A | PENDING_TASK_GENERATION | 데이터 카운트 스크립트 | MAPPED_NO_UI |
| REQ-NF-028 안전정보 최신 확인 목표(95%) | IMPLEMENT | — | N/A | N/A | PENDING_TASK_GENERATION | 수동 확인(구현 로직은 REQ-FUNC-050 SCR-001 참조) | MAPPED_NO_UI |
| REQ-NF-029 미디어 라이선스 메타데이터 100% | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 | EXCLUDED |
| REQ-NF-030 공개 페이지 SEO 메타데이터 | IMPLEMENT(축소) | 전역(5개 Screen 공통) | 전역(5개 Route 공통) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | 수동 확인 | MAPPED_NO_UI |

### 2.7 Maintainability, Monitoring, Cost

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-031 TypeScript strict·lint·테스트 게이트 | IMPLEMENT | — | N/A | N/A | PENDING_TASK_GENERATION | CI 실행 결과 | MAPPED_NO_UI |
| REQ-NF-032 구조화 로그 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 | EXCLUDED |
| REQ-NF-033 5분 이내 장애 알림 | EXCLUDED | — | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 | EXCLUDED |
| REQ-NF-034 월 인프라 비용 목표 | IMPLEMENT | — | N/A | N/A | PENDING_TASK_GENERATION | 요금제 확인 | MAPPED_NO_UI |

---

## 3. 집계 확인

| 구분 | 건수 |
|---|---:|
| REQ-FUNC-001 ~ 080 | 80 |
| REQ-NF-001 ~ 034 | 34 |
| **합계** | **114** |

| Status | 건수 |
|---|---:|
| MAPPED | 63 |
| MAPPED_NO_UI | 22 |
| EXCLUDED | 29 |
| **합계** | **114** |

| Task 값 | 건수 |
|---|---:|
| `PENDING_TASK_GENERATION`(전건) | 114 |

> 삭제된 요구사항 없음. Task가 아직 생성되지 않았으므로 전 행의 `Task` 값은 `PENDING_TASK_GENERATION`이며, `Test` 열의 방법은 실제 실행 결과가 아니라 향후 검증 계획이다. `EXCLUDED` 판정 요구사항은 `PROJECT_SCOPE.md`의 사유를 그대로 유지하며 임의로 구현 범위로 복원하지 않았다.
