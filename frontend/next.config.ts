import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 restricts allowed quality values to [75] by default; allow the
    // higher quality used across content images so photos stay crisp.
    qualities: [75, 92, 100],
  },
};

export default nextConfig;
