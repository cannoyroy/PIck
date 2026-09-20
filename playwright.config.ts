import { defineConfig, devices } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());
const remote = process.env.TEST_BASE_URL?.trim();
const baseURL = remote || "http://localhost:3100";
if (remote && !remote.startsWith("https://")) {
  throw new Error("TEST_BASE_URL must use HTTPS for hosted tests.");
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: {
    baseURL,
    ...devices["Desktop Chrome"],
    // Auth traces could include credentials and session tokens. Do not save them.
    trace: "off",
    screenshot: "off",
    video: "off",
  },
  webServer: remote ? undefined : {
    command: "node node_modules/next/dist/bin/next dev --port 3100",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    { name: "smoke", testMatch: /smoke\.spec\.ts/ },
    { name: "authenticated", testMatch: /auth\.spec\.ts/ },
  ],
});
