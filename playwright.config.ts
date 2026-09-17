import { defineConfig, devices } from "@playwright/test";

// Traveler 프로젝트의 Playwright 범위는 Chromium 기반 핵심 Smoke Test로 고정한다
// (CLAUDE.md 규칙 18, PLAYWRIGHT_SCOPE=chromium-smoke). 다른 브라우저 프로젝트는
// 추가하지 않는다.
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // 로컬 실행 시에는 이 webServer가 `npm run dev`로 개발 서버를 직접 띄운다.
  // PLAYWRIGHT_BASE_URL이 설정된 경우(예: Vercel Preview URL)는 이미 떠 있는
  // 서버를 검사하는 것이므로 webServer 자체를 등록하지 않는다.
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
