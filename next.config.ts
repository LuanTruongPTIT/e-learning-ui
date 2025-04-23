import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.pexels.com" },
      { hostname: "uploadthing.com" },
      { hostname: "utfs.io" },
      { hostname: "usth.edu.vn" },
      { hostname: "images.unsplash.com" },
      {hostname: "randomuser.me"}
    ],
  },
};

export default nextConfig;
