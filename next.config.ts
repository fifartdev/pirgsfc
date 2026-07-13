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
      // `headers()` is unsupported (and unnecessary) under `output: "export"`,
      // so this only applies to the normal server build. No CSP here — the
      // site relies on inline JSON-LD <script> tags (src/app/[lang]/layout.tsx)
      // and a strict script-src would need per-request nonces to keep those
      // working; that's a larger, riskier change than this baseline hardening.
      async headers() {
        return [
          {
            source: "/:path*",
            headers: [
              { key: "X-Content-Type-Options", value: "nosniff" },
              { key: "X-Frame-Options", value: "DENY" },
              { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
              { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
              { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
            ],
          },
        ];
      },
    };

// Skip Payload integration when building a static export (no database needed)
export default isStaticExport ? nextConfig : withPayload(nextConfig);
