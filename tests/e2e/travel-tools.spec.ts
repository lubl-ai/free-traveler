import { test, expect } from '@playwright/test';

/**
 * E2E-TRAVEL-TOOLS
 * REQ-FUNC-011,014,016,019,022,024; REQ-NF-011,017
 *
 * Chromium only (playwright.config.ts pins the single "chromium" project —
 * CLAUDE.md 규칙 18). Covers: flight condition input -> summary -> external
 * navigation, the same for hotel, the non-transmission notice, and that
 * input values never appear in any network request this page makes.
 *
 * GET /api/admin/settings/outbound is mocked to a fixed https:// URL for
 * the external-navigation assertions — this environment has no live
 * Supabase project configured (APP_SETTING has no real rows), and hitting
 * a real third-party site from an automated suite isn't appropriate
 * anyway. "외부 링크 접근 가능 여부(배포 전 1회성 점검)" is explicitly framed
 * in this task's own AC as a separate one-time pre-deploy check, not
 * something the regular Chromium smoke run should perform — so it is
 * intentionally not exercised here.
 */

const MOCK_FLIGHT_URL = 'https://example.com/flights';
const MOCK_HOTEL_URL = 'https://example.com/hotels';

test.describe('SCR-003 travel tools', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.route('**/api/admin/settings/outbound**', async (route) => {
      const url = new URL(route.request().url());
      const key = url.searchParams.get('key');
      const value = key === 'FLIGHT_OUTBOUND_URL' ? MOCK_FLIGHT_URL : MOCK_HOTEL_URL;
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ key, value }) });
    });

    // The mocked outbound URL is a real (but unrelated) domain, and this
    // sandbox has no outbound internet access — fulfill it locally at the
    // context level (covers the popup tab too) so the redirect completes
    // without needing a real network round-trip.
    await context.route('https://example.com/**', (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<title>mock outbound site</title>' })
    );
  });

  test('flight: condition input -> summary -> external navigation, no input transmitted', async ({ page, context }) => {
    const requestSnapshots: string[] = [];
    page.on('request', (request) => {
      requestSnapshots.push(`${request.method()} ${request.url()} ${request.postData() ?? ''}`);
    });

    await page.goto('/travel-tools?tab=flight');

    const flightPanel = page.locator('#tabpanel-flight');
    await flightPanel.locator('select').nth(0).selectOption({ label: '일본' });
    await flightPanel.locator('select').nth(1).selectOption({ label: '도쿄도' });

    const departure = new Date();
    departure.setDate(departure.getDate() + 10);
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 15);
    const dateInputs = flightPanel.locator('input[type=date]');
    await dateInputs.nth(0).fill(departure.toISOString().slice(0, 10));
    await dateInputs.nth(1).fill(returnDate.toISOString().slice(0, 10));

    await flightPanel.getByRole('button', { name: '조건 확인' }).click();

    // Summary card
    await expect(flightPanel.getByText('여행 조건 요약')).toBeVisible();
    const flightSummary = flightPanel.locator('dl');
    await expect(flightSummary.getByRole('definition').filter({ hasText: '일본' })).toBeVisible();
    await expect(flightSummary.getByRole('definition').filter({ hasText: '도쿄도' })).toBeVisible();

    // Non-transmission notice
    await expect(flightPanel.getByText('입력하신 조건은 서버로 전송되지 않으며')).toBeVisible();

    // External navigation: click opens a new tab at the mocked https URL
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      flightPanel.getByRole('button', { name: '항공편 보러 가기' }).click(),
    ]);
    await popup.waitForURL(MOCK_FLIGHT_URL, { timeout: 5000 }).catch(() => undefined);
    expect(popup.url()).toBe(MOCK_FLIGHT_URL);
    // noopener means the popup has no reference back to the opener window.
    const hasOpener = await popup.evaluate(() => window.opener !== null);
    expect(hasOpener).toBe(false);
    await popup.close();

    // Security AC: none of this page's own requests ever carried the
    // selected country/region or the chosen dates.
    const leaked = requestSnapshots.some(
      (entry) =>
        entry.includes('일본') ||
        entry.includes('도쿄도') ||
        entry.includes(departure.toISOString().slice(0, 10)) ||
        entry.includes(returnDate.toISOString().slice(0, 10))
    );
    expect(leaked).toBe(false);
  });

  test('hotel: condition input -> summary -> external navigation, no input transmitted', async ({ page, context }) => {
    const requestSnapshots: string[] = [];
    page.on('request', (request) => {
      requestSnapshots.push(`${request.method()} ${request.url()} ${request.postData() ?? ''}`);
    });

    await page.goto('/travel-tools?tab=hotel');

    const hotelPanel = page.locator('#tabpanel-hotel');
    await hotelPanel.locator('select').nth(0).selectOption({ label: '태국' });
    await hotelPanel.locator('select').nth(1).selectOption({ label: '방콕' });

    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 20);
    const checkOut = new Date();
    checkOut.setDate(checkOut.getDate() + 23);
    const dateInputs = hotelPanel.locator('input[type=date]');
    await dateInputs.nth(0).fill(checkIn.toISOString().slice(0, 10));
    await dateInputs.nth(1).fill(checkOut.toISOString().slice(0, 10));

    await hotelPanel.getByRole('button', { name: '조건 확인' }).click();

    await expect(hotelPanel.getByText('숙소 조건 요약')).toBeVisible();
    const hotelSummary = hotelPanel.locator('dl');
    await expect(hotelSummary.getByRole('definition').filter({ hasText: '태국' })).toBeVisible();
    await expect(hotelPanel.getByText('입력하신 조건은 서버로 전송되지 않으며')).toBeVisible();

    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      hotelPanel.getByRole('button', { name: '호텔 보러 가기' }).click(),
    ]);
    await popup.waitForURL(MOCK_HOTEL_URL, { timeout: 5000 }).catch(() => undefined);
    expect(popup.url()).toBe(MOCK_HOTEL_URL);
    const hasOpener = await popup.evaluate(() => window.opener !== null);
    expect(hasOpener).toBe(false);
    await popup.close();

    const leaked = requestSnapshots.some(
      (entry) =>
        entry.includes('태국') ||
        entry.includes('방콕') ||
        entry.includes(checkIn.toISOString().slice(0, 10)) ||
        entry.includes(checkOut.toISOString().slice(0, 10))
    );
    expect(leaked).toBe(false);
  });

  test('flight form blocks submission with an invalid (past) date and shows an inline error', async ({ page }) => {
    await page.goto('/travel-tools?tab=flight');
    const flightPanel = page.locator('#tabpanel-flight');

    await flightPanel.locator('select').nth(0).selectOption({ label: '일본' });
    await flightPanel.locator('select').nth(1).selectOption({ label: '도쿄도' });

    const past = new Date();
    past.setDate(past.getDate() - 5);
    const future = new Date();
    future.setDate(future.getDate() + 5);
    const dateInputs = flightPanel.locator('input[type=date]');
    await dateInputs.nth(0).fill(past.toISOString().slice(0, 10));
    await dateInputs.nth(1).fill(future.toISOString().slice(0, 10));

    await flightPanel.getByRole('button', { name: '조건 확인' }).click();

    await expect(flightPanel.getByText('출발일은 오늘 이후 날짜여야 합니다')).toBeVisible();
    await expect(flightPanel.getByText('여행 조건 요약')).not.toBeVisible();
  });
});
