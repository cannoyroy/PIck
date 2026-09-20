import { expect, test } from "@playwright/test";
import { unlockDeployment } from "./helpers";

test.beforeEach(async ({ context, baseURL }) => {
  await unlockDeployment(context, baseURL);
});

test("首页与注册登录入口可访问", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "找导师，从这里开始。" })).toBeVisible();
  await page.getByRole("link", { name: "登录", exact: true }).click();
  await expect(page.getByRole("heading", { name: "登录 PIck" })).toBeVisible();
  await page.getByRole("link", { name: "去注册" }).click();
  await expect(page.getByRole("heading", { name: "创建测试账号" })).toBeVisible();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    await expect(page.getByRole("status")).toContainText("服务尚未配置");
    await expect(page.getByRole("button", { name: "注册", exact: true })).toBeDisabled();
  }
});

test("未登录不能访问私有页面", async ({ page }) => {
  await page.goto("/protected");
  await expect(page).toHaveURL(/\/auth\/login$/);
  await expect(page.getByRole("heading", { name: "我的测试记录" })).toHaveCount(0);
});
