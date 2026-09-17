import { test, expect } from "@playwright/test";

/**
 * E2E-MATE-AUTH — 로그인이 필요한 동행 흐름 Smoke(Chromium 전용)의 골격.
 *
 * 실제 Supabase 테스트 계정 없이는 로그인 자체가 불가능하므로, 아래 두 환경변수가 모두
 * 없으면 이 파일 전체를 명시적으로 skip한다(공개 Smoke인 `public-smoke.spec.ts`는 이 조건과
 * 무관하게 항상 실행된다). CI에 Supabase Secret이 없는 경우 `npm run test:e2e:public`만
 * 실행하도록 구성하는 것과는 별개의 방어선이다.
 *
 *   - E2E_TEST_USER_EMAIL
 *   - E2E_TEST_USER_PASSWORD
 *
 * Selector 우선순위: role/accessible name → label → `data-testid` 순. 아래 이름은
 * `TASKS/TASK-CMP-SCR005-AUTH.md`, `TASKS/TASK-CMP-SCR003-MATE-WRITE.md`,
 * `TASKS/TASK-CMP-SCR004-*.md`, `TASKS/TASK-CMP-SCR005-MY-ACTIVITY.md`에 정의된 계약을
 * 그대로 반영한 것이며, 실제 구현 시 이 이름대로 접근 가능 이름/label을 부여해야 한다.
 */

const email = process.env.E2E_TEST_USER_EMAIL;
const password = process.env.E2E_TEST_USER_PASSWORD;

test.describe("E2E-006/007: 인증이 필요한 동행 흐름", () => {
  test.skip(
    !email || !password,
    "E2E_TEST_USER_EMAIL/E2E_TEST_USER_PASSWORD 환경변수가 없어 인증 Smoke를 건너뜀(공개 Smoke만 실행됨)",
  );

  test.beforeEach(async ({ page }) => {
    await page.goto("/account");
    await page.getByRole("tab", { name: "로그인" }).click();
    await page.getByLabel("이메일").fill(email!);
    await page.getByLabel("비밀번호").fill(password!);
    await page.getByRole("button", { name: "로그인" }).click();
    await expect(page.getByRole("tab", { name: "프로필" })).toBeVisible();
  });

  test("E2E-006: 로그인 사용자가 동행글을 작성하고 목록·상세에서 확인한다", async ({
    page,
  }) => {
    // 1) SCR-003 동행 구하기 탭에서 글 작성.
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "동행 구하기" }).click();

    const title = `E2E-006 테스트 동행글 ${Date.now()}`;
    await page.getByLabel("제목").fill(title);
    // TODO(구현 후 보완): 국가·지역·기간·인원·조건·스타일·설명 필드는 CMP-SCR003-MATE-WRITE
    // 구현이 확정되면 실제 label에 맞춰 채운다.
    await page.getByLabel("안전수칙에 동의합니다").check();
    await page.getByRole("button", { name: "동행글 등록" }).click();

    // 2) SCR-004 목록에서 방금 쓴 글이 보인다.
    await page.goto("/mates");
    await expect(page.getByRole("link", { name: title })).toBeVisible();

    // 3) 상세 진입 시 작성한 내용이 그대로 보인다(연락처 등 비공개 정보는 노출되지 않아야 함).
    await page.getByRole("link", { name: title }).click();
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
  });

  test("E2E-007: 동행글 참가 신청 후 계정 화면의 내 활동에서 확인한다", async ({
    page,
  }) => {
    await page.goto("/mates");
    // TODO(구현 후 보완): 목록의 첫 번째 모집중 글에 참가 신청. 실제 목록 아이템의
    // 접근 가능 이름 규칙이 확정되면 정확한 role/name으로 교체한다.
    await page.getByRole("link").first().click();
    await page.getByRole("button", { name: "참가 요청 보내기" }).click();
    await page.getByLabel("메시지").fill("E2E-007 테스트 참가 요청입니다.");
    await page.getByRole("button", { name: "요청 보내기" }).click();
    await expect(
      page.getByText(/요청을 보냈습니다|접수되었습니다/),
    ).toBeVisible();

    // 계정 화면(SCR-005) 내 활동 탭에서 보낸 참가 요청을 확인한다.
    await page.goto("/account");
    await page.getByRole("tab", { name: "내 활동" }).click();
    await expect(
      page.getByRole("tab", { name: "보낸 참가 요청" }),
    ).toBeVisible();
  });
});
