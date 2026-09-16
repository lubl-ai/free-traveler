---
version: D-001
name: Free-Traveler-design-system
status: LOCKED
description: A white-canvas, coral-accented travel-prep platform design system. Restrained type weights, photography-led destination cards, and a single coral CTA color inspired by (but not copied from) Airbnb's compositional restraint — no Airbnb trademark, font, or component naming is reused. Built for 5 approved Stitch screens (SCR-001~005, mobile variants for SCR-001/SCR-003) and locked as the implementation baseline.

colors:
  canvas: "#FFFFFF"
  surface-soft: "#F7F7F8"
  surface-strong: "#F0F0F2"
  hairline: "#E4E4E8"
  hairline-soft: "#EFEFF2"
  border-strong: "#C7C7CE"
  ink: "#2A2A2E"
  body: "#4B4B50"
  muted: "#767680"
  muted-soft: "#9B9BA3"
  coral: "#FF6B4A"
  coral-active: "#E5502F"
  coral-disabled: "#FFD9CC"
  on-coral: "#FFFFFF"
  danger: "#C4351A"
  warning: "#B8720A"
  info: "#2557C7"
  success: "#1E8A5F"

typography:
  display-xl:
    fontFamily: "'Inter', 'Pretendard Variable', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.2px
  display-lg:
    fontFamily: "'Inter', 'Pretendard Variable', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 26px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  display-md:
    fontFamily: "'Inter', 'Pretendard Variable', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 21px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: 0
  title-md:
    fontFamily: "'Inter', 'Pretendard Variable', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  title-sm:
    fontFamily: "'Inter', 'Pretendard Variable', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "'Inter', 'Pretendard Variable', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-sm:
    fontFamily: "'Inter', 'Pretendard Variable', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "'Inter', 'Pretendard Variable', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  button-md:
    fontFamily: "'Inter', 'Pretendard Variable', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  link:
    fontFamily: "'Inter', 'Pretendard Variable', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section-desktop-min: 64px
  section-desktop-max: 96px
  section-mobile-min: 40px
  section-mobile-max: 64px

rounded:
  sm: 8px
  md: 14px
  lg: 20px
  full: 9999px

shadow:
  none: "none — 기본 상태(카드, Hero, 본문 전체의 95% 이상)"
  floating: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.08) — Drawer, Modal, Dropdown, 카드 hover 전용 단일 티어"
  scrim: "rgba(0,0,0,0.5) — Drawer/Modal 배경 스크림"

components:
  button-primary:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.on-coral}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    height: 48px
    padding: "12px 24px"
  button-primary-active:
    backgroundColor: "{colors.coral-active}"
    textColor: "{colors.on-coral}"
  button-primary-disabled:
    backgroundColor: "{colors.coral-disabled}"
    textColor: "{colors.on-coral}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    height: 48px
    border: "1px solid {colors.border-strong}"
  button-text:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.link}"
  search-bar-pill:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.full}"
    height: 56px
    border: "1px solid {colors.hairline}"
  filter-chip:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.body}"
    rounded: "{rounded.full}"
    height: 40px
    padding: "8px 16px"
  filter-chip-selected:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.on-coral}"
    rounded: "{rounded.full}"
  destination-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    shadow: "{shadow.none}"
    shadowHover: "{shadow.floating}"
  mate-post-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline}"
  text-input:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
    height: 56px
    border: "1px solid {colors.border-strong}"
    borderFocus: "2px solid {colors.ink}"
  tab-pill:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.muted}"
    rounded: "{rounded.full}"
    height: 44px
  tab-pill-active:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.on-coral}"
    rounded: "{rounded.full}"
  drawer:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg} (모바일 상단 모서리만)"
    shadow: "{shadow.floating}"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-coral}"
    rounded: "{rounded.sm}"
    shadow: "{shadow.floating}"
---

## Overview / Visual Theme

Free Traveler는 흰 배경(`{colors.canvas}`)과 짙은 회색 텍스트(`{colors.ink}` #2A2A2E, 순검정 사용 안 함)를 기본으로, 단일 포인트 컬러인 코랄(`{colors.coral}` #FF6B4A)을 1차 CTA·활성 탭·선택된 Chip에만 절제해서 사용하는 사진 중심 여행 준비 플랫폼이다. Airbnb DESIGN.md는 "절제된 타이포그래피 무게, 카드 중심의 사진 레이아웃, 단일 브랜드 컬러 운용" 같은 구성 원리만 참고했으며 Rausch 색상명, Airbnb Cereal 폰트, "Guest favorite" 배지 같은 Airbnb 고유 상표·컴포넌트 명칭·자산은 그대로 가져오지 않았다. 본 문서는 `docs/04_UIUX_PLAN.md`에서 확정한 화면 계획과 `docs/STITCH_VALIDATION_REPORT.md`에서 검증·승인된 Stitch 화면(SCR-001~005, SCR-001·SCR-003 Mobile)을 기준으로 한 **정본(Locked Design Baseline)** 이다.

## Color Token

| 토큰 | 값 | 용도 |
|---|---|---|
| `colors.canvas` | `#FFFFFF` | 전 화면 배경, 다크모드 없음 |
| `colors.surface-soft` | `#F7F7F8` | Section 배경 구분, 비활성 필드 |
| `colors.surface-strong` | `#F0F0F2` | Chip, 아이콘 버튼 배경 |
| `colors.hairline` / `hairline-soft` | `#E4E4E8` / `#EFEFF2` | 1px 구분선 |
| `colors.border-strong` | `#C7C7CE` | 입력 필드 기본 테두리 |
| `colors.ink` | `#2A2A2E` | 제목·본문 기본 텍스트 |
| `colors.body` | `#4B4B50` | 카드 설명, 장문 본문 |
| `colors.muted` / `muted-soft` | `#767680` / `#9B9BA3` | 메타 정보, 비활성 텍스트 |
| `colors.coral` | `#FF6B4A` | 1차 CTA, 활성 탭, 선택 Chip, 강조 링크 — **전체 화면의 소수 지점에만 사용** |
| `colors.coral-active` | `#E5502F` | 코랄 버튼 pressed 상태 |
| `colors.coral-disabled` | `#FFD9CC` | 비활성 CTA |
| `colors.danger` | `#C4351A` | 오류 메시지, 여행금지·출국권고 등 중대 안전경보 — 코랄과 명확히 다른 색상군 |
| `colors.warning` | `#B8720A` | 안전정보 stale 경고, 입력 검증 경고 |
| `colors.info` | `#2557C7` | 보안·개인정보 안내, 정보성 카드 |
| `colors.success` | `#1E8A5F` | 승인·모집중 등 완료 상태 배지 |

**규칙**: 이 표에 없는 색상값은 화면에 임의로 추가하지 않는다. 새로운 의미가 필요하면 토큰을 이 문서에 먼저 추가한 뒤 사용한다. 상태 표시는 색상만으로 구분하지 않고 텍스트 라벨(`오류`, `경고`, `모집중`, `마감`)을 항상 병기한다.

## Typography

폰트: `"Inter", "Pretendard Variable", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif` — Inter·Pretendard는 오픈소스 웹폰트로 CDN/시스템에서 로드하며, **폰트 파일을 저장소에 번들하지 않는다**(Proprietary Font 파일 금지). 한글은 시스템 폰트로 자연 폴백한다.

| 토큰 | 크기/두께 | 용도 |
|---|---|---|
| `display-xl` | 32px/700 | 메인 Hero 제목(SCR-001, SCR-002) |
| `display-lg` | 26px/600 | Section 대제목 |
| `display-md` | 21px/600 | 카드 그룹 소제목 |
| `title-md` | 18px/600 | 카드 제목 |
| `title-sm` | 16px/600 | 폼 라벨 그룹, Chip 그룹 제목 |
| `body-md` | 16px/400 | 기본 본문, Section 설명 |
| `body-sm` | 14px/400 | 카드 메타(날짜·지역·상태) |
| `caption` | 13px/500 | 배지, 입력 보조 라벨 |
| `button-md` | 16px/600 | 버튼 라벨 |
| `link` | 14px/500 | 인라인 링크 |

Display 계열은 22~32px 범위의 절제된 무게(600~700)만 쓰고, 그보다 무거운 임의 웨이트나 장식적 디스플레이 서체를 추가하지 않는다.

## Spacing

4px 베이스 스케일: `xxs 4 · xs 8 · sm 12 · md 16 · lg 24 · xl 32 · xxl 48px`. Section 상하 여백은 별도 범위로 관리한다(아래 "Page Section" 참조).

## Radius

| 토큰 | 값 | 용도 |
|---|---|---|
| `rounded.sm` | 8px | 버튼, 입력 필드 |
| `rounded.md` | 14px | 카드(여행지·동행글·안전정보) |
| `rounded.lg` | 20px | Drawer/Modal 모서리 |
| `rounded.full` | 9999px | 검색창, Chip, 탭 pill |

직각(0px) 모서리는 레이아웃 그리드 자체 외에는 사용하지 않는다.

## Shadow

한 개의 그림자 티어만 존재한다.

- **Flat(그림자 없음)**: 본문, Hero, Footer, 카드 기본 상태 — 화면의 95% 이상.
- **Floating**: `0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.08)` — 카드 hover, Drawer, Modal, Dropdown, Toast에만 적용.
- **Scrim**: `rgba(0,0,0,0.5)` — Drawer/Modal 뒤 배경.

단계별(elevation tier) 그림자를 추가하지 않는다.

## Header · Footer

5개 Screen(SCR-001~005) 전체에서 동일한 컴포넌트를 재사용한다.

**Header**: 좌측 `Free Traveler` 워드마크(텍스트 로고, 코랄 포인트 1개소). 중앙 4개 내비게이션 링크(홈 / 대표 소개 / 여행 준비 / 동행 찾기, 활성 탭은 코랄 밑줄). 우측 비로그인 시 `로그인` 버튼, 로그인 시 프로필 아바타. Desktop 높이 72px, Mobile 56px(로고+햄버거로 축소, 하단 1px hairline).

**Footer**: 브랜드 한 줄 소개 + 3개 링크 컬럼(서비스 / 정보 / 정책) + 하단 고지 문구("항공·숙소 링크는 외부 사이트의 일반 페이지로 연결되며 예약을 대행하지 않습니다"). Mobile은 컬럼이 세로 1열 아코디언으로 축소된다.

## Search · Filter

- **검색창(`search-bar-pill`)**: 완전 라운드(`rounded.full`), 56px 높이, 흰 배경 + 1px hairline 테두리. SCR-001 Hero에서 사용.
- **필터 Chip(`filter-chip`)**: 완전 라운드, 미선택 시 `surface-strong` 배경 + `body` 텍스트, 선택 시 코랄 배경 + 흰 텍스트. SCR-001 테마 필터, SCR-004 검색 필터에서 사용.
- **필터 바**: 국가·지역·기간·상태 등 드롭다운을 가로로 배치하고(Mobile은 세로 스택 또는 가로 스크롤), 결과 옆에 "총 N건" 요약 텍스트를 항상 함께 표시한다.

## Destination Card

- 비율 유지 사진(상단) + `rounded.md` 클리핑, 하단에 제목(`title-md`)·지역/국가(`body-sm` muted)·테마 배지 1개.
- Hover 시에만 `shadow.floating` 적용, 기본 상태는 무그림자.
- 최소 구성 요소: 사진(실제 장소를 설명하는 alt 필수) + 제목 + 배지 1개 이상. 셋 중 하나라도 없는 빈 카드는 만들지 않는다.
- 안전정보 카드는 동일 그리드 패턴을 쓰되 사진 대신 경보 단계 라벨(`warning`/`danger` 색상) + "최종 확인 YYYY.MM.DD" 캡션을 포함한다.

## Form · Tabs

- **입력 필드(`text-input`)**: 56px 높이, `rounded.sm`, 기본 1px `border-strong` 테두리, 포커스 시 2px `ink` 테두리(글로우·링 없음).
- **탭(`tab-pill`)**: 완전 라운드 pill, 비활성은 `surface-strong` 배경 + `muted` 텍스트, 활성은 코랄 배경 + 흰 텍스트. SCR-003의 항공편/숙소/동행 구하기 3탭에 사용하며, **세 탭은 입력값·검증 오류·완료 상태를 서로 독립적으로 유지**한다(한 탭의 오류가 다른 탭에 영향을 주지 않음).
- 폼 검증 오류는 `colors.danger` 텍스트로 해당 필드 하단에 표시하고, 제출 버튼은 필수값 미충족 시 `button-primary-disabled` 스타일로 비활성화한다.

## Mate Post Card

- `rounded.md`, `hairline` 1px 테두리, 그림자 없음(리스트 밀도 우선).
- 필수 구성: 제목, 국가·지역, 기간, 모집 상태 배지(`success`=모집중, `muted`=마감), 모집 인원.
- **작성자 신뢰도 표현은 인증 배지("본인인증 완료")와 연령대만 사용하며, 별점·평점·매너온도·"N회 성공" 등 리뷰성 수치는 절대 추가하지 않는다** — 자유 리뷰·별점은 PRD Won't-have 항목이다.
- 상세 패널(Desktop: 목록 옆 분할 / Mobile: Drawer)에는 설명, 참가 요청 버튼, 신고·차단 텍스트 링크를 포함한다.

## Drawer · Modal

- 배경: `scrim`(50% 검정). 컨테이너: `canvas` 배경, `rounded.lg`(모바일은 상단 모서리만), `shadow.floating`.
- Desktop: 우측 슬라이드 패널(폭 약 480px). Mobile: 하단에서 올라오는 전체 폭 Sheet.
- 용도: SCR-001의 여행지 상세·안전정보 상세(같은 화면 안에서 전환), SCR-004의 Mobile 상세 보기.
- 닫기는 키보드 `Esc`와 명시적 닫기 버튼으로 모두 가능해야 한다.

## Alert · Toast

- **Alert(인라인 배너)**: `info`(파랑)는 보안·안내, `warning`(앰버)는 안전정보 stale·검증 경고, `danger`(브릭레드)는 오류·중대 안전경보. 코랄은 alert/toast에 사용하지 않는다(경고·오류와 CTA 색상을 시각적으로 분리).
- **Toast**: `ink` 배경 + 흰 텍스트, `rounded.sm`, `shadow.floating`, 화면 하단에 일시 노출(참가 요청 접수, 승인/거절, 신고 접수 등 인앱 알림에 사용. 실제 이메일 발송 없음).

## Loading · Empty · Error 상태

- **Loading**: 카드/목록 영역에 스켈레톤(회색 `surface-soft` 블록)을 표시하고, 버튼 자체 로딩은 텍스트를 유지한 채 스피너를 추가하는 방식만 허용(레이아웃 점프 금지).
- **Empty**: 아래 "완성형 Empty State" 규칙을 따른다. 빈 카드·빈 여백만 두지 않는다.
- **Error**: `danger` 색상 텍스트/아이콘 + 무엇이 잘못됐는지 설명 + 재시도 또는 대체 행동 버튼을 항상 함께 표시한다(예: 외부 URL 연결 실패, 폼 검증 실패).

## Desktop · Mobile 규칙

| 기준 | 값 | 비고 |
|---|---|---|
| Desktop 기준 폭 | **1440px** | 승인된 Stitch Desktop 화면 5개(SCR-001~005) 기준 |
| Mobile 기준 폭 | **390px** | 승인된 Mobile 변형 2개(SCR-001, SCR-003) 기준 |
| Tablet | 744~1128px | Card Grid 2열, 목록+상세 분할 유지 |
| 터치 영역 | 최소 44×44px | 아이콘 버튼도 히트 영역 확장 |
| 키보드 포커스 | `:focus-visible` 2px 코랄 아웃라인 | 모든 인터랙티브 요소 공통 |

## Page Section 최대 폭과 Desktop·Mobile 상하 여백

- **콘텐츠 최대 폭**: Desktop **1200~1280px** 중앙 정렬(SCR-003·SCR-005처럼 폼 중심 화면은 그 안에서 더 좁은 ~960px 컬럼을 써도 되지만 1280px을 넘지 않는다).
- **Section 상하 여백**: Desktop **64~96px**, Mobile **40~64px**.
- **Card Grid**: Mobile은 1열로 배치(가로 스크롤 캐러셀 예외 허용), Desktop은 3~4열.

## Hero 높이와 "다음 Section 보이기" 규칙

- Hero는 뷰포트 전체 높이를 차지하지 않는다. Desktop 1440px 기준 Hero 높이는 **560~640px** 범위로 제한해, 스크롤 없이도 다음 Section의 제목 일부가 화면에 걸쳐 보여야 한다.
- Mobile Hero는 **480px 내외**로 더 짧게 잡아, 첫 스크롤 한 번으로 다음 Section에 도달하게 한다.
- Hero 안에는 제목 1개, 1~3문장 설명, 검색창 또는 주요 CTA 1개만 두고 장식적 여백으로 높이를 채우지 않는다.

## Section별 제목·설명·본문·CTA 계층과 시각적 리듬

1. **제목**: `display-lg`(26px/600), 화면당 Section 제목은 한 문장형 헤드라인.
2. **설명**: `body-md`, 1~3문장, 왜/무엇을 보는 Section인지 설명.
3. **본문**: 실제 콘텐츠(카드/폼/타임라인/Chip 등) — 절대 비워두지 않는다.
4. **CTA**: 문맥에 맞는 CTA 1개(과다 CTA 금지), 코랄 1차 버튼 또는 텍스트 링크.
5. **리듬**: 같은 Card Grid를 연속 배치하지 않는다. Hero, Card Grid, 좌우 분할, Chip 목록, 3단계 안내, CTA Banner **6종 레이아웃 패턴을 화면 안에서 교차 사용**해 시각적 단조로움을 피한다.

## 화면별 Section 순서와 최소 콘텐츠 수

`docs/04_UIUX_PLAN.md` 및 `docs/STITCH_VALIDATION_REPORT.md`에서 승인된 구성을 그대로 고정한다.

| Screen | Section 순서(고정) | 최소 콘텐츠 수 |
|---|---|---|
| **SCR-001** `/` | Hero(검색+`/travel-tools` CTA) → 국내 인기 여행지 → 해외 인기 여행지 → 여행 동기/테마 → 국가별 주의사항(Drawer 연결) → 최근 동행글 또는 Empty State → free_traveler 요약(`/about` CTA) | 국내 6·해외 6·테마 6·안전정보 6 Card, 동행글 3(또는 완성형 Empty State) — 총 7 Section |
| **SCR-002** `/about` | Profile Hero → 여행 지표(50+/30+) → 소개·철학 → Timeline → 방문국가 Chip → Gallery → 추천 여행지+CTA | Timeline **6개 이상**, 방문국가 **30개 이상**, Gallery **8장 이상**, 추천 여행지 4개 — 총 7 Section |
| **SCR-003** `/travel-tools` | Intro → 3탭(항공편/숙소/동행 구하기) → Form → 요약+외부이동 Action Card → Tip 3단계 → 동행 탭(로그인 안내 또는 작성 Form+안전 안내) | 탭 3개 모두 마크업에 존재, Tip 정확히 3개 — 총 6 Section |
| **SCR-004** `/mates` | Intro+작성 CTA → 검색 Filter+결과 요약 → 동행글 목록 → 목록+상세 분할(Desktop)/Drawer(Mobile) → 신청 방법 3단계 → 안전·신고·차단 CTA | 목록 카드 최대 8개 우선 노출, 3단계 안내 정확히 3개 — 총 6 Section |
| **SCR-005** `/account` | 역할별(Guest/Member/Admin) 탭 — 해당 역할 Section만 렌더링 | 각 탭에 Intro/핵심 작업/다음 행동(CTA)을 최소 1개씩 포함. Member 탭은 프로필·내 글·참가 요청·차단 목록을 모두 포함하고, **Admin 탭은 반드시 "신고 상태 변경"과 "외부 URL 설정" 두 영역을 포함**한다 |

## 완성형 Empty State와 Placeholder 문구 금지 규칙

- 모든 Empty State는 **① 상황 설명 문장 + ② 이용 방법(선택) + ③ 다음 행동 CTA** 3요소를 함께 표시한다. 빈 카드, 빈 여백, 아이콘만 있는 화면은 허용하지 않는다.
  - 예(승인된 패턴): "아직 작성한 동행글이 없어요" + "새 동행글 작성하기" CTA(SCR-005), "조건에 맞는 동행글이 아직 없어요" + 필터 초기화 + 작성 CTA(SCR-004).
- **금지 문구**: `Lorem ipsum`, `준비 중`, `정보 확인 필요`, 그 외 의미 없는 placeholder 텍스트 일체.
- 모든 제목·설명은 자연스러운 한국어 완성 문장으로 작성하고, 사진에는 실제 장소를 설명하는 `alt` 텍스트를 붙인다(예: `alt="태국 방콕 왓아룬 사원 전경"`).

## Do / Do Not

### Do
- 코랄(`{colors.coral}`)은 1차 CTA·활성 탭·선택 Chip 등 소수 지점에만 사용한다.
- 오류·경고·안전 경보는 `danger`/`warning`/`info`처럼 코랄과 다른 semantic 컬러를 쓰고 텍스트 라벨을 병기한다.
- 항공·숙소 도구는 "조건 입력 → 요약 확인 → 외부 이동"이라는 사실 그대로의 문구만 쓴다(예: "국가와 지역, 출발일과 귀국일을 입력하면 조건을 정리해 외부 사이트로 안내해드립니다").
- 안전정보는 "최종 확인일" + 7일 초과 시 stale 경고로 표현하고, 공식 출처 링크를 함께 둔다.
- SCR-005 Admin 탭에는 신고 상태 변경과 외부 URL 설정만 둔다(그 이상의 콘텐츠 CRUD·감사 로그 UI는 만들지 않는다).
- 새로운 색상이 필요하면 먼저 이 문서의 Color Token 표에 추가한 뒤에 화면에 사용한다.

### Do Not
- Airbnb 로고·워드마크·Rausch 색상명·Cereal 폰트명·"Guest favorite" 같은 Airbnb 고유 상표·컴포넌트 명칭을 사용하지 않는다.
- 구매·예약·결제·체크아웃 UI(가격 비교, 장바구니, 결제 수단 입력 등)를 만들지 않는다 — 항공·숙소는 외부 사이트로의 단순 링크 아웃만 제공한다.
- **"실시간 최적 노선 및 가격 비교" 같이 실시간 항공권/호텔 검색·가격비교 엔진이 있는 것처럼 암시하는 문구를 쓰지 않는다** — `docs/STITCH_VALIDATION_REPORT.md`에서 이 표현이 실제 구현(외부 링크 아웃, 서버 미저장)과 어긋난다고 확인됨.
- **별점·매너온도·"N회 성공" 같은 사용자 리뷰/평점 요소를 추가하지 않는다** — 자유 리뷰·별점은 PRD `Won't` 항목이며, `STITCH_VALIDATION_REPORT.md`에서 SCR-004 상세 패널에 잘못 삽입된 사례가 발견·기록되었다.
- Proprietary 폰트 파일(예: Airbnb Cereal VF 등)을 저장소에 포함하지 않는다 — Inter·Pretendard 같은 오픈소스 웹폰트만 사용한다.
- 이 문서의 Color/Typography/Spacing/Radius/Shadow 토큰에 없는 임의의 색상·폰트 크기·그림자 값을 화면에 추가하지 않는다.
- 동일한 Screen을 중복 생성하지 않는다(중복이 생겼다면 재사용하지 말고 정본 하나만 참조).
- Dashboard형 통계 화면이나 범용 관리자 CMS를 만들지 않는다.
