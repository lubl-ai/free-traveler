# SRS UI/UX Revision — Free Traveler

- **Document ID:** SRS-TRAVEL-001-REV-UIUX
- **개정 대상:** `02_SRS_BASELINE.md`(SRS-TRAVEL-001 v1.0)
- **개정일:** 2026-09-15
- **개정 범위:** §3.5 Page and Route Inventory, §3.6 Use Case의 화면 참조만 개정. **REQ-FUNC-001~080, REQ-NF-001~034 본문·ID는 삭제·변경하지 않는다.** 요구사항 전문은 `02_SRS_BASELINE.md`를 원문으로 유지한다.
- **상태:** Implementation Baseline (UI/UX 반영판)

이 문서는 Baseline SRS 자체를 대체하지 않는다. `docs/05_UIUX_APPROVED.md`에서 승인된 5개 Screen 구조를 SRS의 라우트·유스케이스 절에 반영한 **개정 부록**이며, 모든 요구사항 ID는 원문 그대로 유지된 채 구현 상태(`PROJECT_SCOPE.md` 판정)만 함께 표기한다.

---

## 1. 개정된 §3.5 Page and Route Inventory

Baseline SRS §3.5의 14개 Route(`/`, `/destinations*`, `/flights`, `/hotels`, `/mates*`, `/safety*`, `/about`, `/auth/*`, `/my/*`, `/admin/*`)는 아래 5개 Screen으로 통합되었다. 통합 상세 매핑은 `docs/05_UIUX_APPROVED.md` §1을 따른다.

| Route | Screen | Page Entry | Access |
|---|---|---|---|
| `/` | SCR-001 | `src/app/page.tsx` | Public |
| `/about` | SCR-002 | `src/app/about/page.tsx` | Public |
| `/travel-tools` | SCR-003 | `src/app/travel-tools/page.tsx` | Public(동행 탭 작성은 Adult Member) |
| `/mates` | SCR-004 | `src/app/mates/page.tsx` | Public(참가 요청·신고·차단은 Adult Member) |
| `/account` | SCR-005 | `src/app/account/page.tsx` | Public(로그인 탭) / Adult Member(내 활동 탭) / Role Restricted(관리자 탭) |

기술 Route(`/auth/callback`, `/api/*`, `not-found`, `error-boundary`)는 Screen으로 세지 않으며 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `technical_routes`를 정본으로 한다.

## 2. 개정된 Use Case ↔ Screen 매핑

Baseline SRS §3.6 UC-01~09를 아래와 같이 신규 Screen에 재매핑한다(Use Case와 REQ-FUNC 대응 관계는 원문 그대로 유지).

| UC | Use Case | 관련 요구사항 | 신규 Screen |
|---|---|---|---|
| UC-01 | 여행지 검색·필터·상세 열람 | REQ-FUNC-001~010 | SCR-001 |
| UC-02 | 항공 여행 조건 입력·요약·외부 이동 | REQ-FUNC-011~018 | SCR-003(항공편 탭) |
| UC-03 | 호텔 숙박 조건 입력·요약·외부 이동 | REQ-FUNC-019~026 | SCR-003(숙소 탭) |
| UC-04 | 동행 모집글 작성·마감 | REQ-FUNC-027~033, 037~038 | SCR-003(동행 구하기 탭 작성) / SCR-005(내 활동 탭 마감·수정) |
| UC-05 | 동행 참가 요청·승인·거절 | REQ-FUNC-034~036, 043 | SCR-004(요청 제출) / SCR-005(승인·거절) |
| UC-06 | 신고·차단·운영 처리 | REQ-FUNC-039~045 | SCR-004(신고·차단 시작) / SCR-005(관리자 탭 처리) |
| UC-07 | 국가별 안전정보 확인 | REQ-FUNC-046~056 | SCR-001(안전정보 Drawer) |
| UC-08 | 대표 소개 확인 | REQ-FUNC-057~063 | SCR-002 |
| UC-09 | 콘텐츠·외부 URL 관리 | REQ-FUNC-072~077 | SCR-005(관리자 탭, 077만 구현) — 072~076은 `PROJECT_SCOPE.md`에서 EXCLUDED |

## 3. UI Route Contract 및 Release Acceptance Criteria

본 개정판의 UI Route Contract는 별도로 반복 기술하지 않고 `docs/05_UIUX_APPROVED.md` §2, `design-reference/SCREEN_ROUTE_CONTRACT.json`을 정본으로 참조한다. Release Acceptance Criteria 역시 `docs/05_UIUX_APPROVED.md` §3을 정본으로 참조하며, SRS 관점에서 추가되는 조건은 다음과 같다.

| # | SRS 관점 추가 기준 | 현재 상태 |
|---|---|---|
| R1 | Baseline SRS REQ-FUNC-001~080, REQ-NF-001~034가 하나도 삭제되지 않고 `docs/UIUX_TRACEABILITY.md`에 전수 등재됨 | **충족**(114건 등재 확인) |
| R2 | EXCLUDED 판정 요구사항이 신규 Screen 구조에서도 EXCLUDED로 유지되고 임의로 복원되지 않음 | **충족**(판정 재사용, 변경 없음) |
| R3 | §3.5 개정 Route 표와 `SCREEN_ROUTE_CONTRACT.json`이 서로 불일치하지 않음 | **충족**(동일 소스 참조) |
| R4 | 개정된 Use Case 매핑이 실제 코드에서 구현됨 | **미충족** — 구현 착수 전 |

## 4. REQ-FUNC-001~080, REQ-NF-001~034 개정 상태 목록

요구사항 전문(Given/When/Then, 데이터 모델 등)은 `02_SRS_BASELINE.md`를 그대로 참조한다. 아래 표는 **삭제 없이 전수 재기재**하며, Implementation Status는 `PROJECT_SCOPE.md` 판정을 그대로 인용한다. Screen/Route 상세 매핑과 Task/Test 추적은 `docs/UIUX_TRACEABILITY.md`를 정본으로 한다.

### 4.1 REQ-FUNC-001~080

| ID | 요구사항 요약(원문 참조) | Implementation Status |
|---|---|---|
| REQ-FUNC-001 | 국내·해외 여행지 목록 구분 제공 | IMPLEMENT |
| REQ-FUNC-002 | 국가·도시·계절·테마·기간 필터 | IMPLEMENT |
| REQ-FUNC-003 | 키워드 검색 | IMPLEMENT |
| REQ-FUNC-004 | 여행지 상세 필수 콘텐츠 표시 | IMPLEMENT |
| REQ-FUNC-005 | 빈 결과 안내·초기화 | IMPLEMENT |
| REQ-FUNC-006 | 해외 상세→안전정보 연결 | IMPLEMENT |
| REQ-FUNC-007 | 대표 이미지 alt·출처 표시 | IMPLEMENT(축소) |
| REQ-FUNC-008 | 게시 수량 기준 검증 | IMPLEMENT |
| REQ-FUNC-009 | 관련 여행지 추천 | IMPLEMENT |
| REQ-FUNC-010 | 필터 상태 URL 동기화 | EXCLUDED |
| REQ-FUNC-011 | 항공 필수 입력 필드 | IMPLEMENT |
| REQ-FUNC-012 | 국가 종속 지역 옵션 재계산 | IMPLEMENT |
| REQ-FUNC-013 | 항공 날짜 검증 | IMPLEMENT |
| REQ-FUNC-014 | 항공 입력 요약 표시 | IMPLEMENT |
| REQ-FUNC-015 | 항공 비전달 고지 | IMPLEMENT |
| REQ-FUNC-016 | 항공 외부 URL 새 탭 이동 | IMPLEMENT |
| REQ-FUNC-017 | 항공 입력값 서버 미저장 | IMPLEMENT |
| REQ-FUNC-018 | 항공 URL 오류 안내·재시도 | IMPLEMENT |
| REQ-FUNC-019 | 호텔 필수 입력 필드 | IMPLEMENT |
| REQ-FUNC-020 | 호텔 지역 옵션 재계산 | IMPLEMENT |
| REQ-FUNC-021 | 호텔 날짜 검증 | IMPLEMENT |
| REQ-FUNC-022 | 호텔 입력 요약 표시 | IMPLEMENT |
| REQ-FUNC-023 | 호텔 비전달 고지 | IMPLEMENT |
| REQ-FUNC-024 | 호텔 외부 URL 새 탭 이동 | IMPLEMENT |
| REQ-FUNC-025 | 호텔 입력값 서버 미저장 | IMPLEMENT |
| REQ-FUNC-026 | 호텔 URL 오류 안내·재시도 | IMPLEMENT |
| REQ-FUNC-027 | 쓰기 액션 인증 세션 요구 | IMPLEMENT |
| REQ-FUNC-028 | 성인 확인 상태 요구 | IMPLEMENT |
| REQ-FUNC-029 | 동행 프로필 필드 | IMPLEMENT |
| REQ-FUNC-030 | 동행 목록 필터 | IMPLEMENT |
| REQ-FUNC-031 | 모집글 작성 필드·검증 | IMPLEMENT |
| REQ-FUNC-032 | 공개 연락처 탐지·차단 | IMPLEMENT |
| REQ-FUNC-033 | 응답에 연락처 미포함 | IMPLEMENT |
| REQ-FUNC-034 | 참가 메시지 비공개 제출 | IMPLEMENT |
| REQ-FUNC-035 | 중복 요청 차단 | IMPLEMENT |
| REQ-FUNC-036 | 작성자 승인·거절 | IMPLEMENT |
| REQ-FUNC-037 | 종료일 경과 자동 마감 | IMPLEMENT |
| REQ-FUNC-038 | 작성자 수동 마감·수정·삭제 | IMPLEMENT |
| REQ-FUNC-039 | 신고(사유코드·설명) | IMPLEMENT |
| REQ-FUNC-040 | 사용자 차단·해제 | IMPLEMENT |
| REQ-FUNC-041 | 신고 목록·상태 필터 | IMPLEMENT(축소) |
| REQ-FUNC-042 | 신고 처리(숨김/기각) | IMPLEMENT(축소) |
| REQ-FUNC-043 | 요청·신고 처리 결과 인앱 알림 | IMPLEMENT(축소) |
| REQ-FUNC-044 | RLS 비공개 데이터 접근 제한 | IMPLEMENT |
| REQ-FUNC-045 | 탈퇴 시 개인정보 삭제 | EXCLUDED |
| REQ-FUNC-046 | 해외 국가 100% 안전 페이지 | IMPLEMENT |
| REQ-FUNC-047 | 8개 카테고리 필수 표시 | IMPLEMENT |
| REQ-FUNC-048 | 출처명·URL·확인일 표시 | IMPLEMENT |
| REQ-FUNC-049 | 외교부 원문 새 탭 링크 | IMPLEMENT |
| REQ-FUNC-050 | 7일 경과 stale 경고 | IMPLEMENT |
| REQ-FUNC-051 | 중대 경보 상단 표시 | IMPLEMENT |
| REQ-FUNC-052 | 국가·지역 경보 범위 구분 | IMPLEMENT |
| REQ-FUNC-053 | 긴급연락처·영사콜센터 표시 | IMPLEMENT |
| REQ-FUNC-054 | 공식 판단 대체 불가 고지 | IMPLEMENT |
| REQ-FUNC-055 | Editor/Admin 작성·검수·게시 워크플로 | EXCLUDED |
| REQ-FUNC-056 | 변경 이력 보존 | EXCLUDED |
| REQ-FUNC-057 | 대표명·`50+`·`30+` 표시 | IMPLEMENT |
| REQ-FUNC-058 | 소개문·철학·편집 원칙 | IMPLEMENT |
| REQ-FUNC-059 | 방문 권역 지도/국가 목록 | IMPLEMENT |
| REQ-FUNC-060 | 여행 타임라인 | IMPLEMENT |
| REQ-FUNC-061 | 대표 이미지 alt·출처 표시 | IMPLEMENT(축소) |
| REQ-FUNC-062 | 문의·SNS 링크 | IMPLEMENT |
| REQ-FUNC-063 | 추천 여행지 6개 연결 | IMPLEMENT |
| REQ-FUNC-064 | 전역 내비게이션·푸터 | IMPLEMENT |
| REQ-FUNC-065 | 반응형 레이아웃 | IMPLEMENT |
| REQ-FUNC-066 | 이메일 가입·인증·로그인·재설정 | IMPLEMENT |
| REQ-FUNC-067 | 통합 검색 | EXCLUDED |
| REQ-FUNC-068 | 즐겨찾기 추가/해제/목록 | IMPLEMENT |
| REQ-FUNC-069 | URL 공유 | EXCLUDED |
| REQ-FUNC-070 | SEO 메타데이터 | IMPLEMENT(축소) |
| REQ-FUNC-071 | 행동 분석 이벤트 수집 | EXCLUDED |
| REQ-FUNC-072 | 여행지 콘텐츠 CRUD 관리자 화면 | EXCLUDED |
| REQ-FUNC-073 | 미디어 업로드·라이선스 워크플로 | EXCLUDED |
| REQ-FUNC-074 | 게시 전 완전성 게이트 | IMPLEMENT(축소) |
| REQ-FUNC-075 | 안전정보 stale 대시보드 | EXCLUDED |
| REQ-FUNC-076 | 관리자 감사 로그 | EXCLUDED |
| REQ-FUNC-077 | 외부 URL 허용목록 설정 | IMPLEMENT |
| REQ-FUNC-078 | 404/500/권한없음/외부연결실패 화면 | IMPLEMENT |
| REQ-FUNC-079 | ARIA/시맨틱 마크업 | IMPLEMENT(축소) |
| REQ-FUNC-080 | 약관·정책·안전수칙 동의 | IMPLEMENT |

### 4.2 REQ-NF-001~034

| ID | 요구사항 요약(원문 참조) | Implementation Status |
|---|---|---|
| REQ-NF-001 | LCP p75 목표 | EXCLUDED |
| REQ-NF-002 | INP p75 목표 | EXCLUDED |
| REQ-NF-003 | CLS p75 목표 | EXCLUDED |
| REQ-NF-004 | 필터 응답 p95(동시 50명) | EXCLUDED |
| REQ-NF-005 | 쓰기 API 응답 p95 | EXCLUDED |
| REQ-NF-006 | 이미지 반응형·지연 로드 | IMPLEMENT |
| REQ-NF-007 | Lighthouse 성능 예산 CI | EXCLUDED |
| REQ-NF-008 | 월간 가용성 99.5% | EXCLUDED |
| REQ-NF-009 | 내부 API 5xx 비율 | EXCLUDED |
| REQ-NF-010 | DB 백업 RPO/RTO | EXCLUDED |
| REQ-NF-011 | 외부 링크 주1회 자동 점검 | IMPLEMENT(축소) |
| REQ-NF-012 | TLS 1.2 이상 | IMPLEMENT |
| REQ-NF-013 | 인증·역할·RLS 서버 검증 | IMPLEMENT |
| REQ-NF-014 | CSRF 방어·SameSite 쿠키 | IMPLEMENT |
| REQ-NF-015 | 입력 검증·저장 XSS 차단 | IMPLEMENT |
| REQ-NF-016 | 비밀키 환경변수 관리 | IMPLEMENT |
| REQ-NF-017 | 항공·호텔 원시 입력 미보존 | IMPLEMENT |
| REQ-NF-018 | 개인정보 내보내기·삭제 요청 | EXCLUDED |
| REQ-NF-019 | 신고 접수 응답 p95 ≤3s | IMPLEMENT |
| REQ-NF-020 | 신고 1차 검토 24h 90% | EXCLUDED |
| REQ-NF-021 | 글·요청·신고 속도 제한 | EXCLUDED |
| REQ-NF-022 | Moderator 조치 추적 가능성 | EXCLUDED |
| REQ-NF-023 | WCAG 2.2 AA 목표 | IMPLEMENT |
| REQ-NF-024 | axe 자동 검사 | EXCLUDED |
| REQ-NF-025 | 키보드·스크린리더 전수 수동 검사 | EXCLUDED |
| REQ-NF-026 | 여행지 콘텐츠 완전성 100% | IMPLEMENT |
| REQ-NF-027 | 해외 국가 안전정보 커버리지 100% | IMPLEMENT |
| REQ-NF-028 | 안전정보 최신 확인 목표(95%) | IMPLEMENT |
| REQ-NF-029 | 미디어 라이선스 메타데이터 100% | EXCLUDED |
| REQ-NF-030 | 공개 페이지 SEO 메타데이터 | IMPLEMENT(축소) |
| REQ-NF-031 | TypeScript strict·lint·테스트 게이트 | IMPLEMENT |
| REQ-NF-032 | 구조화 로그 | EXCLUDED |
| REQ-NF-033 | 5분 이내 장애 알림 | EXCLUDED |
| REQ-NF-034 | 월 인프라 비용 목표 | IMPLEMENT |

**전수 확인**: REQ-FUNC-001~080(80건) + REQ-NF-001~034(34건) = **114건, 삭제 없이 전수 재기재됨.**

---

## 5. 다음 단계

- 본 개정판과 `docs/UIUX_TRACEABILITY.md`를 근거로 Task를 생성하면, 각 Task는 생성 즉시 해당 요구사항 행의 `Task` 값을 `PENDING_TASK_GENERATION`에서 실제 Task ID로 갱신한다.
- Task 생성 전까지 모든 요구사항의 `Task` 값은 `PENDING_TASK_GENERATION`으로 유지한다.
