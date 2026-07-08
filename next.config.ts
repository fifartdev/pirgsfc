import type { NextConfig } from "next";

// When STATIC_EXPORT=1, build a fully static HTML/CSS/JS bundle into `out/`.
// The default build stays a normal server build (keeps the /api/contact route
// and the locale proxy working on Vercel/Node hosting).
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = isStaticExport
  ? {
      output: "export",
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
