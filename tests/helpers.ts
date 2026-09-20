import type { BrowserContext, Page } from "@playwright/test";

export async function unlockDeployment(context: BrowserContext, baseURL?: string) {
  if (!process.env.TEST_BASE_URL) return;
  const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  if (!secret || !baseURL) throw new Error("BLOCKED: hosted tests require VERCEL_AUTOMATION_BYPASS_SECRET.");
  // One request to the deployment origin only. Never send bypass headers to Supabase.
  const response = await context.request.get(baseURL, {
    headers: {
      "x-vercel-protection-bypass": secret,
      "x-vercel-set-bypass-cookie": "true",
    },
  });
  if (!response.ok()) throw new Error(`Deployment bypass failed (${response.status()}).`);
}

export async function login(page: Page, email: string, password: string) {
  await page.goto("/auth/login");
  await page.getByLabel("邮箱", { exact: true }).fill(email);
  await page.getByLabel("密码", { exact: true }).fill(password);
  await page.getByRole("button", { name: "登录", exact: true }).click();
}
