import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.yad2.co.il" },
      { protocol: "https", hostname: "cdn.yad2.treedis.com" },
    ],
  },
};

export default nextConfig;
