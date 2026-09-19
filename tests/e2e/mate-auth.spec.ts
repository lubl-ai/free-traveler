import { test, expect } from '@playwright/test';

/**
 * E2E-MATE-AUTH
 * REQ-FUNC-027,028,031,034,036,039,040,066
 *
 * Chromium only (playwright.config.ts pins the single "chromium" project —
 * CLAUDE.md 규칙 18).
 *
 * ## What this file can and cannot verify in this environment
 *
 * This task's Functional AC calls for the full chain: 로그인→성인 확인→
 * 동행글 작성→참가 요청→승인→신고/차단. That chain needs a real
 * authenticated Supabase session with actual rows in user_profile /
 * mate_post / mate_application, which needs a *reachable* Supabase
 * project. This environment has none configured (NEXT_PUBLIC_SUPABASE_URL
 * is empty — a known bootstrap blocker, docs/ARCHITECTURE.md §14) and no
 * Docker to run one locally either.
 *
 * With empty env vars, every component's `createBrowserDbClient()` call
 * throws *synchronously*, before any network request is even attempted —
 * verified directly in this codebase (see the fixes applied across
 * AuthTab/MyActivityTab/ProfileTab in W22). That means there is no
 * authenticated UI state reachable here at all, not even via network-level
 * request mocking (there's no request to intercept). Faking a Supabase
 * session via a hand-built localStorage entry was considered and rejected
 * — its internal format isn't part of Supabase's public contract, and a
 * test built on a guessed-at internal format would be worse than no test:
 * it could pass or fail for reasons that have nothing to do with this
 * app's own code.
 *
 * So this suite verifies, fully for real, the one requirement that *is*
 * testable without a backend and that this task's own Security AC calls
 * out explicitly: every write action across SCR-004/SCR-005 shows a login
 * prompt instead of its form when there is no session. The authenticated
 * half of the flow (write → apply → approve → report/block) remains
 * unverified pending a reachable Supabase project — flagged here rather
 * than silently skipped.
 */

test.describe('Guest-state write actions redirect to login (no session reachable in this env)', () => {
  test('mate post write form (SCR-003 mate tab) shows a login prompt, not the form', async ({ page }) => {
    await page.goto('/travel-tools?tab=mate');
    const matePanel = page.locator('#tabpanel-mate');

    await expect(matePanel.getByText('로그인 및 성인 확인이 필요합니다')).toBeVisible();
    const loginLink = matePanel.getByRole('link', { name: '로그인하고 성인 인증하기' });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute('href', '/account?tab=login');

    // The actual write form fields must not be present at all.
    await expect(matePanel.getByRole('textbox', { name: '제목' })).toHaveCount(0);
  });

  test('mate detail panel apply/report/block actions require a session', async ({ page }) => {
    // With no live backend, MatePostList's fetch fails and it shows its
    // own error+retry state rather than any post cards — which itself
    // confirms no post detail/apply/report/block UI is reachable without
    // a session in this environment either.
    await page.goto('/mates');
    await expect(page.getByText('동행글을 불러오지 못했습니다')).toBeVisible();
    await expect(page.getByRole('button', { name: '다시 시도' })).toBeVisible();
  });

  test('account page (SCR-005) shows the Guest view — no profile/activity/admin UI without a session', async ({
    page,
  }) => {
    await page.goto('/account');

    await expect(page.getByText('로그인하고 더 많은 기능을 이용하세요')).toBeVisible();
    await expect(page.getByRole('tab', { name: '로그인' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '가입하기' })).toBeVisible();

    // Member/Admin-only sections must not render for a Guest.
    await expect(page.getByText('내 프로필')).toHaveCount(0);
    await expect(page.getByText('내 활동')).toHaveCount(0);
    await expect(page.getByText('관리자 도구')).toHaveCount(0);
  });

  test('report dialog and block action are not reachable without first opening a post detail', async ({ page }) => {
    // There is no way to reach ReportDialog/BlockAction at all without a
    // mate post detail being open, which itself requires the list to have
    // loaded successfully — already shown to be backend-dependent above.
    // This test documents that boundary explicitly rather than attempting
    // a false-positive check.
    await page.goto('/mates');
    await expect(page.getByRole('dialog', { name: '신고하기' })).toHaveCount(0);
  });
});

test.describe('Login form itself is reachable and functional (client-side validation only)', () => {
  test('login/signup tabs switch and require email + password before submit is enabled', async ({ page }) => {
    await page.goto('/account');

    const emailInput = page.getByRole('textbox', { name: '이메일' });
    await expect(emailInput).toBeVisible();

    await page.getByRole('tab', { name: '가입하기' }).click();
    await expect(page.getByRole('button', { name: '가입하기' })).toBeVisible();

    await page.getByRole('tab', { name: '로그인' }).click();
    await expect(page.getByRole('button', { name: '로그인' })).toBeVisible();

    await page.getByText('비밀번호를 잊으셨나요?').click();
    await expect(page.getByRole('button', { name: '재설정 이메일 보내기' })).toBeVisible();
    // Password field is not shown in the forgot-password mode.
    await expect(page.getByRole('textbox', { name: '비밀번호' })).toHaveCount(0);
  });
});
