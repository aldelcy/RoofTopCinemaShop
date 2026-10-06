import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Leave basePath and assetPrefix unset. Webflow Cloud writes them at build
  // time from the environment mount path and overwrites values committed here.
};

export default nextConfig;
