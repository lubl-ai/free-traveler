import { test, expect } from '@playwright/test';

/**
 * E2E-PUBLIC-SMOKE
 * REQ-FUNC-001,004,006,046,057; REQ-NF-019
 *
 * Chromium only (playwright.config.ts pins the single "chromium" project —
 * CLAUDE.md 규칙 18). Covers the 5 flows this task's own AC names:
 * destination list -> detail drawer, safety-info drawer, representative
 * page viewing, mate list viewing, and SCR-001 mobile (390px) responsive
 * layout — all fully real, no mocking needed (every route here reads only
 * static data or gracefully degrades without a backend).
 *
 * Selectors match this app's actual accessible names/roles as built
 * (PAGE-SCR001/002/004 + their Component tasks) — not fabricated
 * data-testid attributes.
 */

test.describe('SCR-001: destination list -> detail drawer', () => {
  test('clicking a domestic destination card opens its detail drawer with real content', async ({ page }) => {
    await page.goto('/');

    const domesticSection = page.locator('h2', { hasText: '국내 여행지' }).locator('..');
    const firstCard = domesticSection.locator('div.card').first();
    const destinationName = await firstCard.locator('h3').innerText();

    await firstCard.click();

    const drawer = page.getByRole('dialog', { name: `${destinationName} 상세정보` });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText('소개')).toBeVisible();
    await expect(drawer.getByText('주요 명소')).toBeVisible();
    await expect(drawer.getByText('추천 일정')).toBeVisible();

    await drawer.getByRole('button', { name: '닫기' }).click();
    await expect(drawer).not.toBeVisible();
  });

  test('an international destination drawer offers a link to its country safety info', async ({ page }) => {
    await page.goto('/');

    const overseasSection = page.locator('h2', { hasText: '해외 여행지' }).locator('..');
    const firstCard = overseasSection.locator('div.card').first();
    const destinationName = await firstCard.locator('h3').innerText();
    await firstCard.click();

    const drawer = page.getByRole('dialog', { name: `${destinationName} 상세정보` });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole('button', { name: '국가 안전정보 보기 →' })).toBeVisible();
  });
});

test.describe('SCR-001: country safety drawer', () => {
  test('clicking a country safety card opens its safety detail with 8 categories', async ({ page }) => {
    await page.goto('/');

    const safetySection = page.locator('h2', { hasText: '국가별 여행 안전정보' }).locator('..');
    const firstCountryCard = safetySection.getByRole('button').first();
    const countryName = await firstCountryCard.locator('p').first().innerText();

    await firstCountryCard.click();

    const drawer = page.getByRole('dialog', { name: `${countryName} 안전정보` });
    await expect(drawer).toBeVisible();

    // 8 category cards inside the drawer's grid.
    const categoryCards = drawer.locator('.grid > div.rounded-sm');
    expect(await categoryCards.count()).toBe(8);

    await expect(drawer.getByRole('link', { name: /외교부 해외안전여행 원문 보기/ })).toHaveAttribute(
      'target',
      '_blank'
    );
    await expect(drawer.getByRole('link', { name: /외교부 해외안전여행 원문 보기/ })).toHaveAttribute(
      'rel',
      /noopener/
    );
  });
});

test.describe('SCR-002: representative page', () => {
  test('free_traveler intro, stats, timeline, country chips, and gallery are all present', async ({ page }) => {
    await page.goto('/about');

    await expect(page.getByRole('heading', { name: 'free_traveler', level: 1 })).toBeVisible();
    await expect(page.getByText('57+', { exact: true })).toBeVisible();
    await expect(page.getByText('31+', { exact: true })).toBeVisible();

    await expect(page.getByRole('heading', { name: '여행 타임라인' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '방문 국가' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '여행 갤러리' })).toBeVisible();

    // At least 30 visited-country chips (REQ-FUNC-059).
    const countryChips = page.locator('span.chip, a.chip').filter({ hasNotText: '전체' });
    expect(await countryChips.count()).toBeGreaterThanOrEqual(30);

    await expect(page.getByRole('link', { name: '여행 준비 시작하기' })).toHaveAttribute('href', '/travel-tools');
  });
});

test.describe('SCR-004: mate list viewing', () => {
  test('mates page renders its static sections without crashing (list itself needs a backend)', async ({
    page,
  }) => {
    await page.goto('/mates');

    await expect(page.getByRole('heading', { name: '동행을 찾아보세요' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '참가 신청 방법' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '안전한 동행을 위해' })).toBeVisible();
    await expect(page.getByRole('link', { name: '동행글 작성하기' }).first()).toHaveAttribute(
      'href',
      '/travel-tools?tab=mate'
    );
  });
});

test.describe('SCR-001: mobile (390px) responsive layout', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('hero, hamburger menu, and single-column destination grid render correctly at 390px', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: '당신의 다음 여행을 준비하세요' })).toBeVisible();

    // Desktop nav is hidden, hamburger button is the mobile entry point.
    // Its accessible name flips between 메뉴 열기/메뉴 닫기 on toggle, so this
    // locator (by id, stable across that change) is used instead of a
    // name-based one that would go stale right after the click.
    const hamburger = page.locator('button[aria-controls="mobile-nav-menu"]');
    await expect(hamburger).toBeVisible();
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
    await expect(hamburger).toHaveAccessibleName('메뉴 열기');

    await hamburger.click();
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true');
    await expect(hamburger).toHaveAccessibleName('메뉴 닫기');
    const mobileMenu = page.locator('#mobile-nav-menu');
    await expect(mobileMenu.getByRole('link', { name: '동행 찾기' })).toBeVisible();

    // Destination cards stack in a single column at this width.
    const domesticSection = page.locator('h2', { hasText: '국내 여행지' }).locator('..');
    const grid = domesticSection.locator('.grid').first();
    const gridColumns = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(gridColumns).toBe(1);
  });
});
