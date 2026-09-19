import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // The real `server-only` package throws outside Next's RSC build
      // pipeline. Stubbed here (test-only) so UNIT-MATE-STATE can import
      // pure functions from route.ts files that transitively import
      // src/lib/db/client.ts (which is guarded by `import 'server-only'`).
      "server-only": path.resolve(__dirname, "./tests/unit-stubs/server-only.ts"),
    },
  },
  test: {
    environment: "node",
    // src 안의 Unit Test와 tests/unit만 검색한다. tests/e2e(Playwright)는 절대 포함하지 않는다.
    include: [
      "src/**/*.test.{ts,tsx}",
      "src/**/__tests__/**/*.{ts,tsx}",
      "tests/unit/**/*.test.{ts,tsx}",
    ],
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
    // 아직 Unit Test가 하나도 없는 단계(스캐폴딩 직후)에서는 실패시키지 않고 통과 처리한다.
    passWithNoTests: true,
  },
});
