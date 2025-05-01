import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
  reactStrictMode: false,
  eslint: {
    dirs: ["app", "core", "ui"],
  },
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
