import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
const target = process.env.TEST_BASE_URL;
if (!target || !target.startsWith("https://")) {
  console.error("BLOCKED: set TEST_BASE_URL to the HTTPS Vercel test deployment.");
  process.exit(2);
}
// No session or bypass header: verify the external protection independently.
const response = await fetch(target, { redirect: "manual" });
const location = response.headers.get("location") || "";
const vercelLogin = location.startsWith("https://vercel.com/") && /(?:login|sso)/.test(location);
const body = await response.text();
const vercelChallenge = (response.status === 401 || response.status === 403)
  && /authentication required/i.test(body)
  && /vercel/i.test(body);
if (vercelChallenge || (response.status >= 300 && response.status < 400 && vercelLogin)) {
  console.log(`PASS: unauthenticated deployment access blocked (${response.status}).`);
} else {
  console.error(`FAIL: expected Vercel access protection, received ${response.status}. Check All Deployments protection.`);
  process.exitCode = 1;
}
