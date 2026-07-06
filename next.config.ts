import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SITE_URL: "https://nusantaraeats.com",
  },
};

export default nextConfig;
