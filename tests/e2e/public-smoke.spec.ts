import { test, expect, type Page } from "@playwright/test";

/**
 * E2E-PUBLIC-SMOKE — 로그인 없이 접근 가능한 공개 화면 Smoke(Chromium 전용).
 *
 * Selector 우선순위: role/accessible name → label → `data-testid` 순으로 사용하고,
 * 텍스트 위치나 CSS 구조에 의존하지 않는다. 아래 role/label/testid 이름은 이 Task List
 * 문서(`TASKS/TASK-PAGE-SCR001.md`, `TASKS/TASK-PAGE-SCR002.md`, `TASKS/TASK-PAGE-SCR003.md`,
 * `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `required_navigation`)에 정의된 문구를
 * 그대로 사용한 계약이다 — SCR-001/002/003 Page Owner/Component 구현 시 아래 이름 그대로
 * 접근 가능 이름(accessible name)·`data-testid`를 부여해야 이 Spec이 통과한다.
 *
 * 외부 사이트(항공/숙소 예매 사이트)는 실제로 이동해 내용을 검사하지 않는다 — 버튼/링크의
 * href·target·rel 속성과 페이지 내 안내 문구만 검사한다. 이미지 출처 URL의 응답 상태도
 * 검사하지 않는다(콘텐츠 완전성은 GOV-CONTENT-COMPLETENESS 스크립트가 별도로 다룸).
 */

async function openMateTab(page: Page) {
  await page.goto("/travel-tools");
  await page.getByRole("tab", { name: "동행 구하기" }).click();
}

test.describe("E2E-001: 메인 페이지(SCR-001)의 추천 여행지와 주요 CTA", () => {
  test("국내·해외 추천 여행지가 노출되고 주요 CTA가 올바른 곳으로 이동한다", async ({
    page,
  }) => {
    await page.goto("/");

    // 주요 CTA 1 — Hero 검색 영역의 "여행 준비 시작하기"는 SCR-003(/travel-tools)으로 이동한다.
    const heroCta = page.getByRole("link", { name: "여행 준비 시작하기" });
    await expect(heroCta).toBeVisible();
    await expect(heroCta).toHaveAttribute("href", "/travel-tools");

    // 국내 추천 여행지 Card 최소 6개.
    const domesticCards = page.getByTestId("destination-card-domestic");
    await expect(domesticCards).toHaveCount(await domesticCards.count());
    expect(await domesticCards.count()).toBeGreaterThanOrEqual(6);

    // 해외 추천 여행지 Card 최소 6개.
    const overseasCards = page.getByTestId("destination-card-overseas");
    expect(await overseasCards.count()).toBeGreaterThanOrEqual(6);

    // 주요 CTA 2 — free_traveler 요약의 "대표 소개 보기"는 SCR-002(/about)로 이동한다.
    const aboutCta = page.getByRole("link", { name: "대표 소개 보기" });
    await expect(aboutCta).toBeVisible();
    await expect(aboutCta).toHaveAttribute("href", "/about");
  });
});

test.describe("E2E-002: 대표 소개(SCR-002)의 free_traveler 핵심 지표", () => {
  test("free_traveler 소개와 50회 이상/30개국 이상 지표가 노출된다", async ({
    page,
  }) => {
    await page.goto("/about");

    await expect(page.getByText(/free_traveler/i).first()).toBeVisible();
    await expect(page.getByText(/50\s*\+/).first()).toBeVisible();
    await expect(page.getByText(/30\s*\+/).first()).toBeVisible();

    // 방문 국가 Chip은 최소 30개 이상이어야 한다(REQ-FUNC-059, CMP-SCR002-COUNTRY-CHIPS).
    const countryChips = page.getByTestId("country-chip");
    expect(await countryChips.count()).toBeGreaterThanOrEqual(30);
  });
});

test.describe("E2E-003: 여행 도구(SCR-003) 항공편 외부 이동 안내", () => {
  test("항공편 조건 입력 후 비전달 고지와 외부 이동 링크가 올바르게 노출된다", async ({
    page,
  }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "항공편" }).click();

    await page.getByLabel("출발 국가").selectOption({ index: 1 });
    await page.getByLabel("도착 국가").selectOption({ index: 1 });
    await page.getByLabel("출발일").fill("2027-01-10");
    await page.getByLabel("귀국일").fill("2027-01-15");

    // 입력값(국가·지역·날짜)이 서버로 전송되지 않는다는 비전달 고지 문구.
    await expect(
      page.getByText(
        /입력한 정보는 서버로 전송되지 않습니다|서버에 저장되지 않습니다/,
      ),
    ).toBeVisible();

    const flightCta = page.getByRole("link", { name: "항공편 보러 가기" });
    await expect(flightCta).toBeVisible();
    await expect(flightCta).toHaveAttribute("target", "_blank");
    await expect(flightCta).toHaveAttribute("rel", /noopener/);
    await expect(flightCta).toHaveAttribute("rel", /noreferrer/);

    const href = await flightCta.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toMatch(/^https:\/\//);
    // 입력한 국가·날짜 값이 쿼리 파라미터로 유출되지 않아야 한다.
    expect(href).not.toContain("2027-01-10");
    expect(href).not.toContain("2027-01-15");

    // 실제로 새 탭을 열되, 그 사이트의 내용은 검사하지 않고 URL만 확인한 뒤 닫는다.
    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      flightCta.click(),
    ]);
    expect(popup.url()).toMatch(/^https:\/\//);
    await popup.close();
  });
});

test.describe("E2E-004: 여행 도구(SCR-003) 숙소 외부 이동 안내", () => {
  test("숙소 조건 입력 후 비전달 고지와 외부 이동 링크가 올바르게 노출된다", async ({
    page,
  }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "숙소" }).click();

    await page.getByLabel("국가").selectOption({ index: 1 });
    await page.getByLabel("지역").selectOption({ index: 1 });
    await page.getByLabel("체크인").fill("2027-01-10");
    await page.getByLabel("체크아웃").fill("2027-01-12");

    await expect(
      page.getByText(
        /입력한 정보는 서버로 전송되지 않습니다|서버에 저장되지 않습니다/,
      ),
    ).toBeVisible();

    const hotelCta = page.getByRole("link", { name: "호텔 보러 가기" });
    await expect(hotelCta).toBeVisible();
    await expect(hotelCta).toHaveAttribute("target", "_blank");
    await expect(hotelCta).toHaveAttribute("rel", /noopener/);
    await expect(hotelCta).toHaveAttribute("rel", /noreferrer/);

    const href = await hotelCta.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toMatch(/^https:\/\//);
    expect(href).not.toContain("2027-01-10");
    expect(href).not.toContain("2027-01-12");

    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      hotelCta.click(),
    ]);
    expect(popup.url()).toMatch(/^https:\/\//);
    await popup.close();
  });
});

test.describe("E2E-005: 여행 도구(SCR-003) 비로그인 동행글 작성 안내", () => {
  test("비로그인 상태에서 동행 구하기 탭은 로그인 안내로 대체된다", async ({
    page,
  }) => {
    await openMateTab(page);

    // 실제 작성 Form(제목 입력 등)은 노출되지 않아야 한다.
    await expect(page.getByLabel("제목")).toHaveCount(0);

    // 로그인 안내 카드와 SCR-005(/account)로 이동하는 링크가 노출되어야 한다.
    const loginGuideLink = page.getByRole("link", {
      name: "로그인하고 성인 인증하기",
    });
    await expect(loginGuideLink).toBeVisible();
    await expect(loginGuideLink).toHaveAttribute("href", "/account");
  });
});
