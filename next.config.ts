import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.google.com",
      "lh3.googleusercontent.com",
      "developers.google.com", // ✅ Add this to allow g-logo.png
    ],
  },
};

export default nextConfig;
