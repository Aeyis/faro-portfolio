import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ["gsap", "matter-js", "lenis"],
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },
};

export default nextConfig;
