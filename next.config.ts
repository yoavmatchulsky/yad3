import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.yad2.co.il" },
      { protocol: "https", hostname: "cdn.yad2.treedis.com" },
    ],
  },
};

export default nextConfig;
