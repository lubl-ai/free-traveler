# Free Traveler — Project Scope (Implementation Baseline)

- **Document ID:** SCOPE-TRAVEL-001
- **기반 문서:** `01_PRD.md` (PRD-TRAVEL-001), `02_SRS_BASELINE.md` (SRS-TRAVEL-001)
- **상태:** Implementation Scope Decision
- **작성일:** 2026-09-10

본 문서는 `01_PRD.md`와 `02_SRS_BASELINE.md`에 정의된 요구사항 중 이번 구현 단계에서 실제로 만들 범위(`IMPLEMENT`)와 만들지 않는 범위(`EXCLUDED`)를 확정한다. SRS의 요구사항 ID(`REQ-FUNC-001~080`, `REQ-NF-001~034`)는 하나도 삭제하지 않고 전부 본 문서에 기록하며, 각 항목은 판정 근거가 되는 처리 방법과 확인 방법을 함께 남긴다.

---

## 1. 화면 구성

### 1-1. 핵심 화면 4개

| 화면 | 라우트 | 내용 |
|---|---|---|
| 여행지 | `/destinations`, `/destinations/domestic`, `/destinations/overseas`, `/destinations/[slug]` | 국내·해외 목록, 검색·필터, 상세 패널(안전정보 연결 포함) |
| 항공 찾기 | `/flights` | 국가·지역·출발일·귀국일 입력 → 검증 → 요약 → 외부 이동 |
| 호텔 찾기 | `/hotels` | 국가·지역·체크인·체크아웃 입력 → 검증 → 요약 → 외부 이동 |
| 동행 찾기 | `/mates`, `/mates/[id]`, `/mates/new` | 모집글 목록·필터, 작성, 상세, 참가 요청 |

### 1-2. 보조 화면 1개

| 화면 | 라우트 | 내용 |
|---|---|---|
| 국가별 안전정보 | `/safety`, `/safety/[countryCode]` | 8개 카테고리, 경보 범위, 출처, 최종 확인일, stale 표시 |

### 1-3. 그 외 필수 페이지 (화면 수 집계와 별개, 구현 항목 6·9·10에서 요구)

`/about`(대표 소개), `/auth/*`(가입·로그인·성인 확인), `/my/*`(내 글·참가 요청·차단), `/admin`(신고 상태·외부 URL 설정), 정책 페이지(약관·개인정보방침·동행 안전수칙).

---

## 2. 구현 방식 요약

| 항목 | 방식 |
|---|---|
| 여행지·안전정보·대표 콘텐츠 | `src/data`의 정적 TypeScript 데이터. CMS·업로드 UI 없음 |
| 콘텐츠 완전성 검증 | 정적 데이터의 TypeScript 타입/스크립트 검사로 대체 (런타임 게시 게이트 없음) |
| 즐겨찾기 | `localStorage`, 서버 저장 없음 |
| 참가 요청·승인·신고 알림 | Toast 또는 화면 상태 갱신. 실제 이메일 발송 없음 |
| 동행글 자동 마감 | 배치 작업 없음. 조회 시점에 `end_date` 경과 여부를 계산해 CLOSED로 표시 |
| 안전정보 최신성(stale) | 저장된 배치 플래그 없음. 렌더링 시 `verified_at` 기준 7일 경과 여부 계산 |
| 이미지 | 일반 인터넷 URL + `alt` 텍스트만 사용. 라이선스·작가 메타데이터 관리 워크플로 없음 |
| 관리자 범위 | 신고 상태 변경(OPEN/RESOLVED/DISMISSED 등)과 외부 URL(`FLIGHT_OUTBOUND_URL`, `HOTEL_OUTBOUND_URL`) 설정만 제공 |
| 인증 | Supabase Auth 이메일 인증 + 성인(만 19세 이상) 확인 체크박스·확인 시각 저장 |
| 테스트 | Playwright로 핵심 화면의 Smoke Test만 작성 (전수 E2E·성능·접근성 자동화는 범위 밖) |
| 배포 | Vercel |

---

## 3. 명시적 제외 기능

| 기능 | 제외 이유 |
|---|---|
| 전체 콘텐츠 CMS | 콘텐츠는 정적 데이터로 개발자가 직접 관리하므로 편집·게시 워크플로 UI가 불필요 |
| 미디어 업로드·라이선스 승인 워크플로 | 이미지가 외부 URL 참조 방식이라 업로드·심사 절차가 없음 |
| 범용 감사 로그 | 별도 로그 저장소·조회 UI를 구축하지 않음. 상태 변경은 데이터 자체의 최신 값으로만 확인 |
| 자동 백업·장애 알림·부하 테스트 | 운영 모니터링·인프라 자동화를 구축하지 않음. Vercel/Supabase 기본 제공 수준에 의존 |
| 외부 이메일 사업자 연동 | 알림은 인앱 Toast/상태로 대체하고 발송 인프라를 연동하지 않음 |
| EC2·AWS 인프라 | Vercel 단일 배포로 한정하고 별도 서버·컨테이너 인프라를 두지 않음 |
| 무인 자동 Merge Runner | 코드 병합은 사람이 직접 검토·승인 |

---

## 4. 기능 요구사항 판정 (REQ-FUNC-001 ~ 080)

### 4.1 F1. Destination Guide

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-001 | IMPLEMENT | 여행지 화면에서 `scope` 필드(DOMESTIC/OVERSEAS)로 정적 데이터를 분기해 탭 표시 | Playwright smoke: 탭 전환 시 목록 구성 확인 |
| REQ-FUNC-002 | IMPLEMENT | 국가·도시·계절·테마·기간 필터를 클라이언트에서 AND 조건으로 정적 데이터에 적용 | Playwright smoke + 수동 확인 |
| REQ-FUNC-003 | IMPLEMENT | 여행지명·국가명·테마 문자열 부분 일치 검색(클라이언트) | 수동 확인 |
| REQ-FUNC-004 | IMPLEMENT | 상세 패널에 소개·명소·시기·일정·예산·교통·음식·에티켓·출처·수정일 표시. 정적 데이터 타입으로 필수 필드 강제 | TypeScript 타입 체크, Playwright smoke |
| REQ-FUNC-005 | IMPLEMENT | 필터 결과 0건 시 안내 문구와 초기화 버튼 표시 | 수동 확인 |
| REQ-FUNC-006 | IMPLEMENT | 여행지 데이터의 `countryCode`로 `/safety/[countryCode]` 링크 연결 | 정적 데이터 상호 참조 스크립트 검사 |
| REQ-FUNC-007 | IMPLEMENT(축소) | 대표 이미지는 `alt` 텍스트와 출처 URL 텍스트만 기록. 작가·라이선스 유형 필드는 관리하지 않음 | 정적 데이터에 `alt`·`sourceUrl` 존재 여부 검사 |
| REQ-FUNC-008 | IMPLEMENT | 정적 데이터 수량(국내 10개 이상, 해외 15개국 30개 도시 이상)을 개발 스크립트로 카운트 검증 | 빌드 전 데이터 카운트 스크립트 |
| REQ-FUNC-009 | IMPLEMENT | 상세 하단에 같은 국가·테마 여행지 최대 6개 표시(비공개 제외) | 수동 확인 |
| REQ-FUNC-010 | EXCLUDED | 필터 상태 URL 동기화·공유 복원은 편의 기능으로 이번 범위에서 제외. 필터는 화면 내 로컬 상태로만 유지 | 코드 리뷰로 query 동기화 로직 부재 확인 |

### 4.2 F2. Flight Link-out

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-011 | IMPLEMENT | 항공 화면에 국가·지역·출발일·귀국일 필수 입력 필드 구성 | Playwright smoke |
| REQ-FUNC-012 | IMPLEMENT | 국가 변경 시 하위 지역 옵션을 재계산하고 기존 값 초기화 | 수동 확인 |
| REQ-FUNC-013 | IMPLEMENT | 클라이언트 검증: 과거 출발일, 귀국일<출발일 시 제출 차단 및 오류 표시 | Playwright smoke: 경계값 케이스 |
| REQ-FUNC-014 | IMPLEMENT | 유효 입력 후 요약 단계로 전환, 값은 화면 상태(useState)로 세션 동안 유지 | 수동 확인 |
| REQ-FUNC-015 | IMPLEMENT | 폼·요약에 "입력값은 외부 사이트로 전달되지 않습니다" 고정 문구 표시 | 수동 확인 |
| REQ-FUNC-016 | IMPLEMENT | 요약에서 설정된 `FLIGHT_OUTBOUND_URL`을 `target=_blank`, `rel=noopener noreferrer`로 오픈 | 수동 확인: 새 탭·query 없음 |
| REQ-FUNC-017 | IMPLEMENT | 항공 폼은 서버 API·DB를 사용하지 않는 클라이언트 전용 컴포넌트로 구현 | 코드 리뷰: 서버 저장 경로 없음 확인 |
| REQ-FUNC-018 | IMPLEMENT | 외부 URL 환경변수 미설정/허용목록 밖이면 이동 대신 오류 메시지와 재시도 버튼 표시 | 수동 확인: 환경변수 제거 후 동작 |

### 4.3 F3. Hotel Link-out

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-019 | IMPLEMENT | 호텔 화면에 국가·지역·체크인·체크아웃 필수 입력 필드 구성 | Playwright smoke |
| REQ-FUNC-020 | IMPLEMENT | 국가 변경 시 지역 옵션 재계산·초기화 | 수동 확인 |
| REQ-FUNC-021 | IMPLEMENT | 과거 체크인, 체크아웃≤체크인 시 제출 차단 | Playwright smoke: 경계값 케이스 |
| REQ-FUNC-022 | IMPLEMENT | 유효 입력 후 국가·지역·체크인·체크아웃 요약 표시 | 수동 확인 |
| REQ-FUNC-023 | IMPLEMENT | 폼·요약에 입력값 비전달 고지 표시 | 수동 확인 |
| REQ-FUNC-024 | IMPLEMENT | `HOTEL_OUTBOUND_URL`을 새 탭 + `noopener,noreferrer`로 오픈, query 없음 | 수동 확인 |
| REQ-FUNC-025 | IMPLEMENT | 호텔 폼도 서버 API·DB 미사용 클라이언트 전용 구현 | 코드 리뷰 |
| REQ-FUNC-026 | IMPLEMENT | URL 오류 시 이동 차단, 오류 표시, 입력값 유지 | 수동 확인 |

### 4.4 F4. Travel Mate

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-027 | IMPLEMENT | 동행 글 작성·참가 요청 등 쓰기 액션에 Supabase Auth 세션 확인 미들웨어 적용 | 수동 확인: 비로그인 접근 시 로그인 리다이렉트 |
| REQ-FUNC-028 | IMPLEMENT | 회원가입/첫 동행 이용 시 성인 확인 체크박스 제공, `is_adult`·`adult_verified_at`만 저장(생년월일 미저장) | 수동 확인: DB 컬럼 확인 |
| REQ-FUNC-029 | IMPLEMENT | 프로필에 닉네임(필수)·연령대(필수)·성별(선택)·여행 스타일(필수)·자기소개(선택) 입력 | Playwright smoke |
| REQ-FUNC-030 | IMPLEMENT | 국가·지역·기간 겹침·연령대·성별·여행 스타일·모집 상태 필터, 차단 사용자 글 제외 | 수동 확인 |
| REQ-FUNC-031 | IMPLEMENT | 작성 폼: 제목·국가·지역·기간·인원·조건·스타일·설명·안전수칙 동의. 날짜 역전·과거 종료일 차단 | Playwright smoke |
| REQ-FUNC-032 | IMPLEMENT | 정규식 기반 전화번호·이메일·메신저 ID 패턴 탐지 후 제출 차단 및 안내(간소화된 패턴 세트, 정밀 벤치마크는 생략) | 수동 확인: 샘플 패턴 입력 테스트 |
| REQ-FUNC-033 | IMPLEMENT | 목록·상세 응답에 이메일·전화번호 등 연락처 필드를 포함하지 않음 | 코드 리뷰: 응답 스키마 확인 |
| REQ-FUNC-034 | IMPLEMENT | 참가 메시지(최대 500자) 비공개 제출, `PENDING` 상태로 저장 | Playwright smoke |
| REQ-FUNC-035 | IMPLEMENT | (post_id, applicant_id) 조합에 DB unique 제약 + UI 중복 안내 | 수동 확인 |
| REQ-FUNC-036 | IMPLEMENT | 작성자만 요청 상태를 `ACCEPTED`/`REJECTED`로 변경 가능, 서버에서 소유자 검증 | 수동 확인: 비작성자 요청 시 거부 |
| REQ-FUNC-037 | IMPLEMENT | 별도 배치 없이 조회 시점에 `end_date < 오늘`이면 `CLOSED`로 계산해 표시 | 수동 확인: 종료일 지난 글 목록 제외 |
| REQ-FUNC-038 | IMPLEMENT | 작성자가 모집글 수동 마감·수정·삭제 가능 | Playwright smoke |
| REQ-FUNC-039 | IMPLEMENT | 사유 코드+설명으로 글/사용자/요청 신고, 접수 시 화면에 접수 완료 표시 | 수동 확인 |
| REQ-FUNC-040 | IMPLEMENT | 사용자 차단·해제, 차단 후 상호 글·프로필·요청 비노출 | 수동 확인 |
| REQ-FUNC-041 | IMPLEMENT(축소) | 관리자 탭에서 신고 목록과 상태(OPEN/RESOLVED/DISMISSED)만 확인·필터. 우선순위·증거 첨부 큐는 생략 | 수동 확인 |
| REQ-FUNC-042 | IMPLEMENT(축소) | 관리자가 신고를 처리 완료/기각으로 변경, 필요 시 대상 글 숨김. 경고·계정 일시 제한 등 세부 제재 기능은 생략 | 수동 확인 |
| REQ-FUNC-043 | IMPLEMENT(축소) | 요청 접수·승인·거절·신고 처리 결과를 인앱 Toast/상태로만 표시. 이메일 발송은 하지 않음 | 수동 확인 |
| REQ-FUNC-044 | IMPLEMENT | Supabase RLS로 본인 글·요청, 작성자, Moderator/Admin만 비공개 데이터 열람 가능하도록 정책 적용 | 수동 확인: 타 계정으로 접근 시 차단 |
| REQ-FUNC-045 | EXCLUDED | 회원 탈퇴 시 30일 이내 삭제·법적 보존 예외 처리 등 개인정보 라이프사이클 자동화는 운영 프로세스가 필요해 이번 범위에서 제외. 탈퇴는 계정 비활성화 수준으로 처리 | 코드 리뷰로 자동 삭제 배치 부재 확인 |

### 4.5 F5. Country Safety

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-046 | IMPLEMENT | 소개되는 모든 해외 국가의 안전정보를 `src/data`에 등록 | 데이터 카운트 스크립트: 해외 국가 수=안전정보 수 |
| REQ-FUNC-047 | IMPLEMENT | 치안·사기·법규·교통·재난·보건·문화·긴급연락처 8개 카테고리를 정적 데이터 스키마로 필수화 | TypeScript 타입 체크 |
| REQ-FUNC-048 | IMPLEMENT | 각 안전정보에 출처명·URL·최종 확인일 필드 기록 | 정적 데이터 필드 존재 검사 |
| REQ-FUNC-049 | IMPLEMENT | 외교부 해외안전여행 링크를 새 탭 + `noopener,noreferrer`로 제공 | 수동 확인 |
| REQ-FUNC-050 | IMPLEMENT | 배치 없이 렌더링 시 `verified_at` 기준 7일 경과 여부를 계산해 stale 경고 표시 | 수동 확인: 확인일 조작 테스트 |
| REQ-FUNC-051 | IMPLEMENT | 여행금지·출국권고 등 중대 경보를 본문 상단에 텍스트로 표시 | 수동 확인 |
| REQ-FUNC-052 | IMPLEMENT | `scopeType`/`scopeText` 정적 필드로 국가 전체·지역 경보 구분 | 정적 데이터 필드 검사 |
| REQ-FUNC-053 | IMPLEMENT | 현지 긴급전화·영사콜센터 정보를 정적 데이터로 표시 | 수동 확인 |
| REQ-FUNC-054 | IMPLEMENT | 안전 페이지·항공 요약에 "공식 판단을 대체하지 않음" 고지 문구 표시 | 수동 확인 |
| REQ-FUNC-055 | EXCLUDED | Editor/Admin의 작성·검수·게시 역할 분리 워크플로는 CMS 성격이라 제외. 콘텐츠는 개발자가 정적 데이터로 직접 관리 | 코드 리뷰: 콘텐츠 상태 전이 UI 부재 확인 |
| REQ-FUNC-056 | EXCLUDED | 이전 값·새 값·사유·담당자 변경 이력 보존은 범용 감사 로그에 해당해 제외 | 코드 리뷰: 이력 테이블 부재 확인 |

### 4.6 F6. About free_traveler

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-057 | IMPLEMENT | `/about`에 대표명 `free_traveler`, `50+ Trips`, `30+ Countries`를 정적 데이터 단일 소스로 표시 | 수동 확인: 홈 소개 카드와 값 일치 |
| REQ-FUNC-058 | IMPLEMENT | PRD 확정 소개문·여행 철학·편집 원칙을 정적 데이터로 표시 | 수동 확인 |
| REQ-FUNC-059 | IMPLEMENT | 방문 국가 30개 이상 목록(또는 권역 지도)을 정적 데이터로 제공 | 데이터 카운트 검사(≥30) |
| REQ-FUNC-060 | IMPLEMENT | 대표 여행 타임라인(연도·장소·요약)을 정적 데이터로 표시 | 수동 확인 |
| REQ-FUNC-061 | IMPLEMENT(축소) | 대표 이미지는 `alt` 텍스트와 출처 URL만 기록, 작가·라이선스 유형 필드는 관리하지 않음 | 정적 데이터 필드 검사 |
| REQ-FUNC-062 | IMPLEMENT | 관리자 설정 값 기반 문의·SNS 링크. 값이 없으면 렌더링하지 않음 | 수동 확인 |
| REQ-FUNC-063 | IMPLEMENT | 대표 추천 여행지 6개를 공개 여행지 상세로 연결 | 수동 확인: 링크 유효성 |

### 4.7 F7. Common, Admin, Governance

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-064 | IMPLEMENT | 전역 내비게이션·푸터에 6개 핵심 기능과 정책 페이지 링크 배치 | Playwright smoke |
| REQ-FUNC-065 | IMPLEMENT | Tailwind 반응형 레이아웃(320px~데스크톱) | 수동 확인: 뷰포트 리사이즈 |
| REQ-FUNC-066 | IMPLEMENT | Supabase Auth로 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정 제공 | Playwright smoke |
| REQ-FUNC-067 | EXCLUDED | 여행지·안전정보 통합 검색 UI는 편의 기능으로 제외. 각 화면별 개별 검색·필터로 대체 | 코드 리뷰: 통합 검색 라우트 부재 확인 |
| REQ-FUNC-068 | IMPLEMENT | 즐겨찾기 추가/해제/목록을 `localStorage`에 여행지 id 배열로 저장, 중복 방지 | 수동 확인 |
| REQ-FUNC-069 | EXCLUDED | Web Share API 기반 공유 UI는 제외. 브라우저 주소창 공유로 대체 | 코드 리뷰 |
| REQ-FUNC-070 | IMPLEMENT(축소) | Next.js Metadata API로 title·description·canonical 기본 메타데이터 제공. Open Graph·구조화 데이터는 생략 | 수동 확인: 페이지 소스 메타 태그 |
| REQ-FUNC-071 | EXCLUDED | 별도 행동 분석 이벤트 수집 파이프라인을 구축하지 않음(분석 도구 미연동) | 코드 리뷰: 이벤트 트래킹 코드 부재 확인 |
| REQ-FUNC-072 | EXCLUDED | 여행지·콘텐츠 CRUD 관리자 화면은 전체 콘텐츠 CMS에 해당해 제외. 콘텐츠 변경은 코드 배포로 처리 | 코드 리뷰: `/admin`에 콘텐츠 CRUD 라우트 부재 확인 |
| REQ-FUNC-073 | EXCLUDED | 미디어 업로드·출처·라이선스 필수 입력 워크플로는 제외 기능. 이미지는 정적 데이터에 URL 문자열로 직접 기재 | 코드 리뷰 |
| REQ-FUNC-074 | IMPLEMENT(축소) | 런타임 게시 게이트 대신 정적 데이터 필수 필드를 TypeScript 타입으로 강제하고 수량/필드 검증 스크립트를 CI에서 실행 | CI 스크립트 실행 결과 |
| REQ-FUNC-075 | EXCLUDED | 안전정보 stale 현황 대시보드는 관리자 범위(신고 상태·외부 URL) 밖이라 제외. stale 여부는 공개 페이지에서 렌더링 시 계산해 표시 | 코드 리뷰 |
| REQ-FUNC-076 | EXCLUDED | 관리자 변경·신고 처리·권한 변경에 대한 감사 로그는 범용 감사 로그 제외 기능에 해당 | 코드 리뷰: 로그 테이블 부재 확인 |
| REQ-FUNC-077 | IMPLEMENT | 관리자가 항공·호텔 외부 URL을 HTTPS 허용목록 내에서만 설정하도록 폼 검증 | 수동 확인: HTTP/`javascript:` 입력 시 저장 거부 |
| REQ-FUNC-078 | IMPLEMENT | Next.js `not-found`/`error` 경계와 외부 연결 실패 화면에 홈·재시도 버튼 제공 | 수동 확인 |
| REQ-FUNC-079 | IMPLEMENT(축소) | 폼·모달·탭·알림에 기본 시맨틱 HTML과 ARIA 속성 적용. 자동화된 axe 검사·전수 스크린리더 검증은 생략 | 수동 키보드 탐색 확인 |
| REQ-FUNC-080 | IMPLEMENT | 이용약관·개인정보방침·동행 안전수칙·콘텐츠 면책 페이지 제공, 동행글 작성 시 안전수칙 동의 체크와 동의 시각 저장 | Playwright smoke |

---

## 5. 비기능 요구사항 판정 (REQ-NF-001 ~ 034)

### 5.1 Performance

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-001 | EXCLUDED | LCP p75 측정용 성능 모니터링 인프라를 구축하지 않음 | 코드 리뷰: 성능 측정 도구 부재 확인 |
| REQ-NF-002 | EXCLUDED | INP 실사용자 필드 데이터 수집 도구 미연동 | 코드 리뷰 |
| REQ-NF-003 | EXCLUDED | CLS 측정 도구 미연동 | 코드 리뷰 |
| REQ-NF-004 | EXCLUDED | 동시 사용자 50명 부하 테스트는 명시적 제외 기능(부하 테스트) | 코드 리뷰: 부하 테스트 스크립트 부재 확인 |
| REQ-NF-005 | EXCLUDED | API p95 응답 시간 측정 인프라 미구축 | 코드 리뷰 |
| REQ-NF-006 | IMPLEMENT | Next.js `Image` 컴포넌트의 기본 lazy loading을 사용해 초기 로드 최적화 | 수동 확인: 네트워크 탭에서 지연 로드 |
| REQ-NF-007 | EXCLUDED | Lighthouse CI 성능 예산 게이트는 부하/성능 테스트 인프라 제외 범위에 포함 | 코드 리뷰: CI 설정에 Lighthouse 단계 부재 확인 |

### 5.2 Reliability and Recovery

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-008 | EXCLUDED | 가용성 SLA 측정·알림 체계 없음. Vercel/Supabase 기본 인프라 가용성에 의존 | 코드 리뷰 |
| REQ-NF-009 | EXCLUDED | 5xx 비율 모니터링 대시보드 미구축 | 코드 리뷰 |
| REQ-NF-010 | EXCLUDED | DB 백업 RPO/RTO 정책은 명시적 제외 기능(자동 백업) | 코드 리뷰 |
| REQ-NF-011 | IMPLEMENT(축소) | 자동 주간 점검 대신 Playwright smoke test 실행 시점(배포 전)에 외부 링크 접근 가능 여부를 1회 확인 | Playwright smoke 결과 |
| REQ-NF-012 | IMPLEMENT | Vercel/Supabase 기본 제공 TLS 1.2+ 사용 | 수동 확인: 브라우저 인증서 정보 |
| REQ-NF-013 | IMPLEMENT | Supabase Auth 세션 검증 + RLS 정책을 서버 측에서 적용 | 수동 확인: 권한별 접근 테스트 |
| REQ-NF-014 | IMPLEMENT | Next.js Server Actions의 기본 Origin 검증과 Supabase 세션 쿠키(SameSite) 사용 | 수동 확인: 타 오리진 요청 차단 |
| REQ-NF-015 | IMPLEMENT | 폼 입력 검증 + React 기본 이스케이프로 저장 XSS 방지 | 수동 확인: 스크립트 입력 테스트 |
| REQ-NF-016 | IMPLEMENT | Supabase 키 등 비밀값은 서버 전용 환경변수로 관리, 클라이언트 번들 미포함 | 빌드 산출물에서 키 문자열 검색 |
| REQ-NF-017 | IMPLEMENT | 항공·호텔 폼은 서버 요청을 만들지 않는 클라이언트 컴포넌트로 구현 | 코드 리뷰 + 네트워크 탭 확인 |
| REQ-NF-018 | EXCLUDED | 개인정보 내보내기·삭제 요청 플로우는 운영 프로세스가 필요해 제외 | 코드 리뷰 |

### 5.3 Security and Privacy는 5.2에 통합 기재됨(REQ-NF-012~018)

### 5.4 Safety and Moderation

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-019 | IMPLEMENT | 신고 제출 시 즉시 접수 상태를 화면에 반영(비동기 대기 없음) | 수동 확인 |
| REQ-NF-020 | EXCLUDED | 24시간 1차 검토 SLA 추적 대시보드는 운영 인력 필요, 관리자 범위(신고 상태·외부 URL) 밖이라 제외 | 코드 리뷰 |
| REQ-NF-021 | EXCLUDED | 요청 속도 제한(rate limiting)은 별도 인프라가 필요해 제외 | 코드 리뷰 |
| REQ-NF-022 | EXCLUDED | Moderator 조치 추적성은 범용 감사 로그 제외 범위에 포함 | 코드 리뷰 |

### 5.5 Accessibility

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-023 | IMPLEMENT(목표) | WCAG 2.2 AA를 목표로 시맨틱 마크업·라벨·대비를 적용하되 공식 인증은 진행하지 않음 | 수동 확인 |
| REQ-NF-024 | EXCLUDED | axe 자동 검사 CI 파이프라인 미구축 | 코드 리뷰: CI 설정 확인 |
| REQ-NF-025 | EXCLUDED | 전체 UC에 대한 키보드·스크린리더 수동 검사는 생략하고 Playwright smoke 범위의 핵심 흐름만 수동 확인 | 수동 확인 범위 기록 |

### 5.6 Content, Freshness, SEO, Copyright

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-026 | IMPLEMENT | 정적 데이터 타입으로 여행지 필수 필드를 강제 | TypeScript 타입 체크 |
| REQ-NF-027 | IMPLEMENT | 소개되는 해외 국가 100%에 안전정보 등록 | 데이터 카운트 스크립트 |
| REQ-NF-028 | IMPLEMENT | 렌더링 시 stale 계산 로직 적용(수치 목표 측정·대시보드는 생략) | 수동 확인 |
| REQ-NF-029 | EXCLUDED | 라이선스 메타데이터 100% 검증은 미디어 업로드 워크플로 제외와 동일 사유로 제외. `alt` 텍스트만 관리 | 코드 리뷰 |
| REQ-NF-030 | IMPLEMENT(축소) | Next.js Metadata API로 title/description 기본 제공, Open Graph·구조화 데이터는 생략 | 수동 확인 |

### 5.7 Maintainability, Monitoring, Cost

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-031 | IMPLEMENT | TypeScript strict, ESLint, Playwright smoke test를 CI에서 실행하고 실패 시 병합 차단 | CI 실행 결과 |
| REQ-NF-032 | EXCLUDED | 구조화 로그 시스템(request_id 등)은 별도 로깅 인프라가 필요해 제외 | 코드 리뷰 |
| REQ-NF-033 | EXCLUDED | 5분 이내 장애 알림은 명시적 제외 기능(장애 알림)에 해당 | 코드 리뷰 |
| REQ-NF-034 | IMPLEMENT | Vercel/Supabase 무료·저가 티어 사용으로 월 인프라 비용 목표(10만원 이하)를 별도 모니터링 없이 충족 | 요금제 확인 |

---

## 6. 요구사항 커버리지 확인

- REQ-FUNC-001 ~ REQ-FUNC-080: 80건 전수 기록 (섹션 4.1~4.7).
- REQ-NF-001 ~ REQ-NF-034: 34건 전수 기록 (섹션 5.1~5.7).
- 총 114건 중 삭제된 항목 없음. `IMPLEMENT`(축소 포함) 및 `EXCLUDED` 두 분류로만 판정.
