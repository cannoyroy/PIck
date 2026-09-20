import { randomBytes, randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { login, unlockDeployment } from "./helpers";

test.beforeAll(() => {
  const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "TEST_USER_A_EMAIL", "TEST_USER_A_PASSWORD", "TEST_USER_B_EMAIL", "TEST_USER_B_PASSWORD"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`BLOCKED: missing ${missing.join(", ")}. See README.md.`);
  if (process.env.TEST_USER_A_EMAIL === process.env.TEST_USER_B_EMAIL) throw new Error("Two different test accounts are required.");
});

test.beforeEach(async ({ context, baseURL }) => {
  await unlockDeployment(context, baseURL);
});

test("新账号可通过页面注册并进入受保护页", async ({ page }) => {
  // No email is sent: only run against the agreed test project with Confirm email OFF.
  // This creates one disposable Auth user; remove pick-e2e-* users manually when done.
  const password = `${randomBytes(24).toString("base64url")}aA1!`;
  await page.goto("/auth/sign-up");
  await page.getByLabel("邮箱", { exact: true }).fill(`pick-e2e-${randomUUID()}@example.com`);
  await page.getByLabel("密码", { exact: true }).fill(password);
  await page.getByLabel("确认密码", { exact: true }).fill(password);
  await page.getByRole("button", { name: "注册", exact: true }).click();
  await expect(page).toHaveURL(/\/protected$/, { timeout: 20_000 });
  await expect(page.getByRole("heading", { name: "我的测试记录" })).toBeVisible();
});

test("错误密码被拒绝", async ({ page }) => {
  await login(page, process.env.TEST_USER_A_EMAIL!, `wrong-${randomUUID()}`);
  await expect(page.getByRole("alert")).toContainText("邮箱或密码不正确");
  await expect(page).toHaveURL(/\/auth\/login$/);
});

test("伪造会话不能进入受保护页", async ({ page, context, baseURL }) => {
  const project = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split(".")[0];
  const forgedSession = { access_token: "invalid.jwt.signature", refresh_token: "invalid", expires_at: 9999999999, user: { id: randomUUID() } };
  await context.addCookies([{ name: `sb-${project}-auth-token`, value: `base64-${Buffer.from(JSON.stringify(forgedSession)).toString("base64url")}`, url: baseURL! }]);
  await page.goto("/protected");
  await expect(page).toHaveURL(/\/auth\/login$/);
});

test("保存、刷新、用户隔离、删除与退出", async ({ page, browser, baseURL }) => {
  test.setTimeout(90_000);
  const content = `browser-check-${randomUUID()}`;
  const cleanup = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
  const other = await browser.newContext({ baseURL });
  try {
    await login(page, process.env.TEST_USER_A_EMAIL!, process.env.TEST_USER_A_PASSWORD!);
    await expect(page).toHaveURL(/\/protected$/);
    await page.getByLabel("测试内容").fill(content);
    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(page.getByText(content, { exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByText(content, { exact: true })).toBeVisible();

    await unlockDeployment(other, baseURL);
    const otherPage = await other.newPage();
    await login(otherPage, process.env.TEST_USER_B_EMAIL!, process.env.TEST_USER_B_PASSWORD!);
    await expect(otherPage).toHaveURL(/\/protected$/);
    await expect(otherPage.getByRole("heading", { name: "我的测试记录" })).toBeVisible();
    await expect(otherPage.getByRole("alert")).toHaveCount(0);
    await expect(otherPage.getByText(content, { exact: true })).toHaveCount(0);

    await page.getByRole("listitem").filter({ hasText: content }).getByRole("button", { name: "删除", exact: true }).click();
    await expect(page.getByText(content, { exact: true })).toHaveCount(0);
    await page.reload();
    await expect(page.getByText(content, { exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: "退出登录", exact: true }).click();
    await expect(page).toHaveURL(/\/auth\/login$/);
    await page.goto("/protected");
    await expect(page).toHaveURL(/\/auth\/login$/);
  } finally {
    await other.close();
    const auth = await cleanup.auth.signInWithPassword({ email: process.env.TEST_USER_A_EMAIL!, password: process.env.TEST_USER_A_PASSWORD! });
    if (!auth.error) {
      const removed = await cleanup.from("foundation_checks").delete().eq("content", content).eq("user_id", auth.data.user.id);
      expect(removed.error, "cleanup of this run's record").toBeNull();
      await cleanup.auth.signOut();
    }
  }
});
