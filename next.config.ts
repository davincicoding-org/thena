import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
  reactStrictMode: true,
  eslint: {
    dirs: ["app", "core", "ui"],
  },
};

export default nextConfig;
