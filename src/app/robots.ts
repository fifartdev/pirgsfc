import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getSeoDefaults } from "@/lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seoDefaults = await getSeoDefaults();
  const disallow = ["/admin/", "/club-admin/", "/api/", "/_next/"];
  // `additionalDirectives` is free-text in club-admin (one path per line) —
  // merge it in rather than trusting it as the sole disallow list, so a typo
  // there can't accidentally un-block the admin/API surfaces above.
  if (seoDefaults?.robots?.additionalDirectives) {
    disallow.push(
      ...seoDefaults.robots.additionalDirectives
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    );
  }
  const indexingAllowed = seoDefaults?.robots?.index !== false;

  return {
    rules: [
      {
        userAgent: "*",
        allow: indexingAllowed ? "/" : [],
        disallow: indexingAllowed ? disallow : "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
