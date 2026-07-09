import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

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
  : {
      images: {
        remotePatterns: [
          // Payload media served from the same origin in dev and production
          { protocol: "http", hostname: "localhost" },
          { protocol: "https", hostname: "**" },
        ],
      },
    };

// Skip Payload integration when building a static export (no database needed)
export default isStaticExport ? nextConfig : withPayload(nextConfig);
