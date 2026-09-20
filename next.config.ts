import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the user-owned collaboration entry under explicit project control.
  agentRules: false,
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
};

export default nextConfig;
