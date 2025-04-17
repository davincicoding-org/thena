import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
};

export default withNextVideo(nextConfig, { folder: 'public/videos' });