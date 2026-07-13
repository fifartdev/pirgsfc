import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getPayloadClient } from "@/lib/payload";
import { getCmsSiteSettings } from "@/lib/cms-data";
import { newsArticles } from "@/data/news";
import { localeHref } from "@/lib/utils";
import { LANGS } from "@/i18n";
import type { Lang } from "@/types";

function localisedUrls(
  activeLangs: Lang[],
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly"
): MetadataRoute.Sitemap {
  return activeLangs.map((lang) => ({
    url: `${SITE_URL}${localeHref(lang, path)}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // English disabled via SiteSettings.bilingualEnabled: drop every /en/* URL
  // from the sitemap so it isn't offered for (re-)indexing. The live pages
  // themselves 308-redirect (src/app/[lang]/layout.tsx), which is what
  // actually de-indexes anything Google already crawled — this just stops
  // new discovery.
  const siteSettings = await getCmsSiteSettings();
  const activeLangs: Lang[] = siteSettings.bilingualEnabled ? LANGS : ["el"];

  const staticUrls: MetadataRoute.Sitemap = [
    ...localisedUrls(activeLangs, "/", 1.0, "daily"),
    ...localisedUrls(activeLangs, "/news", 0.9, "daily"),
    ...localisedUrls(activeLangs, "/men", 0.8, "weekly"),
    ...localisedUrls(activeLangs, "/women", 0.8, "weekly"),
    ...localisedUrls(activeLangs, "/futsal", 0.8, "weekly"),
    ...localisedUrls(activeLangs, "/academy", 0.7, "weekly"),
    ...localisedUrls(activeLangs, "/matches", 0.8, "daily"),
    ...localisedUrls(activeLangs, "/standings", 0.7, "weekly"),
    ...localisedUrls(activeLangs, "/calendar", 0.7, "daily"),
    ...localisedUrls(activeLangs, "/staff", 0.6, "monthly"),
    ...localisedUrls(activeLangs, "/about", 0.6, "monthly"),
    ...localisedUrls(activeLangs, "/contact", 0.5, "yearly"),
  ];

  // News articles from static data (fallback)
  const staticNewsUrls: MetadataRoute.Sitemap = newsArticles.flatMap((article) =>
    activeLangs.map((lang) => ({
      url: `${SITE_URL}${localeHref(lang, `/news/${article.slug}`)}`,
      lastModified: new Date(article.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  // Try to add CMS-driven URLs if Payload is available
  let cmsNewsUrls: MetadataRoute.Sitemap = [];
  let cmsRosterUrls: MetadataRoute.Sitemap = [];

  try {
    const payload = await getPayloadClient();
    if (payload) {
      const [newsRes, rostersRes] = await Promise.allSettled([
        payload.find({
          collection: "news",
          where: { status: { equals: "published" } },
          limit: 500,
          select: { slug: true, updatedAt: true },
        }),
        payload.find({
          collection: "players",
          where: { status: { equals: "active" } },
          limit: 500,
          select: { slug: true, updatedAt: true },
        }),
      ]);

      if (newsRes.status === "fulfilled") {
        cmsNewsUrls = newsRes.value.docs.flatMap((doc) => {
          const d = doc as { slug?: string; updatedAt?: string };
          if (!d.slug) return [];
          return activeLangs.map((lang) => ({
            url: `${SITE_URL}${localeHref(lang, `/news/${d.slug}`)}`,
            lastModified: d.updatedAt ? new Date(d.updatedAt) : new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.7,
          }));
        });
      }

      if (rostersRes.status === "fulfilled") {
        cmsRosterUrls = rostersRes.value.docs.flatMap((doc) => {
          const d = doc as { slug?: string; updatedAt?: string };
          if (!d.slug) return [];
          return activeLangs.map((lang) => ({
            url: `${SITE_URL}${localeHref(lang, `/roster/${d.slug}`)}`,
            lastModified: d.updatedAt ? new Date(d.updatedAt) : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.75,
          }));
        });
      }
    }
  } catch {
    // Payload not available — use static data only
  }

  // Merge: prefer CMS URLs if available, fall back to static
  const newsUrls = cmsNewsUrls.length > 0 ? cmsNewsUrls : staticNewsUrls;

  return [...staticUrls, ...newsUrls, ...cmsRosterUrls];
}
