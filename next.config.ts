import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    optimizeFonts: true,
    experimental: {
        optimizeCss: true,
    },
};

export default nextConfig;
