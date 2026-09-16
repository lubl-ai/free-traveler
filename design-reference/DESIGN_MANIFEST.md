# Design Manifest — Free Traveler

- **Active Design Version:** D-001
- **Status:** LOCKED
- **Active File:** `design-reference/D-001/DESIGN.md`
- **Vendor Reference:** `design-reference/vendor/airbnb/DESIGN.md` (구성 원리 참고용, 상표 요소 미사용)
- **Locked Date:** 2026-09-15
- **Source Documents:** `docs/04_UIUX_PLAN.md`, `docs/STITCH_VALIDATION_REPORT.md`

## Approved Screens

| Screen ID | Route | Device |
|---|---|---|
| SCR-001 | `/` | Desktop |
| SCR-002 | `/about` | Desktop |
| SCR-003 | `/travel-tools` | Desktop |
| SCR-004 | `/mates` | Desktop |
| SCR-005 | `/account` | Desktop |

## Mobile Variants

| Screen ID | Route | Device |
|---|---|---|
| SCR-001 | `/` | Mobile (390px) |
| SCR-003 | `/travel-tools` | Mobile (390px) |

## Notes

- `D-001/DESIGN.md`는 정본(LOCKED)이다. 색상·타이포·Spacing·Radius·Shadow 등 새 토큰이 필요하면 이 매니페스트가 가리키는 Active File을 먼저 갱신한 뒤 화면 작업에 반영한다.
- Stitch에서 생성·수정된 화면과 실제 다운로드된 HTML 간 반영 지연/불일치가 `docs/STITCH_VALIDATION_REPORT.md`에 기록되어 있으므로, 구현 시에는 이 DESIGN.md의 토큰·규칙을 기준으로 하고 Stitch 화면은 레이아웃 참고 자료로만 사용한다.
- 금지 사항(Airbnb 상표, 구매·예약·결제 UI, Proprietary 폰트 파일, 토큰 외 임의 색상)은 `D-001/DESIGN.md`의 "Do / Do Not" 절을 따른다.
