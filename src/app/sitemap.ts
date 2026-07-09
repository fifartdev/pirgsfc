import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getPayloadClient } from "@/lib/payload";
import { newsArticles } from "@/data/news";

const LANGS = ["el", "en"];

function localisedUrls(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly"): MetadataRoute.Sitemap {
  return LANGS.map((lang) => ({
    url: `${SITE_URL}/${lang}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    ...localisedUrls("/", 1.0, "daily"),
    ...localisedUrls("/news", 0.9, "daily"),
    ...localisedUrls("/men", 0.8, "weekly"),
    ...localisedUrls("/women", 0.8, "weekly"),
    ...localisedUrls("/futsal", 0.8, "weekly"),
    ...localisedUrls("/academy", 0.7, "weekly"),
    ...localisedUrls("/matches", 0.8, "daily"),
    ...localisedUrls("/calendar", 0.7, "daily"),
    ...localisedUrls("/staff", 0.6, "monthly"),
    ...localisedUrls("/about", 0.6, "monthly"),
    ...localisedUrls("/contact", 0.5, "yearly"),
  ];

  // News articles from static data (fallback)
  const staticNewsUrls: MetadataRoute.Sitemap = newsArticles.flatMap((article) =>
    LANGS.map((lang) => ({
      url: `${SITE_URL}/${lang}/news/${article.slug}`,
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
          collection: "teams",
          where: { status: { equals: "active" } },
          limit: 50,
          select: { slug: true, updatedAt: true },
        }),
      ]);

      if (newsRes.status === "fulfilled") {
        cmsNewsUrls = newsRes.value.docs.flatMap((doc) => {
          const d = doc as { slug?: string; updatedAt?: string };
          if (!d.slug) return [];
          return LANGS.map((lang) => ({
            url: `${SITE_URL}/${lang}/news/${d.slug}`,
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
          return LANGS.map((lang) => ({
            url: `${SITE_URL}/${lang}/roster/${d.slug}`,
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
