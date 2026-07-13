import { cache } from "react";
import { CLUB, SITE_URL } from "@/lib/constants";
import { getPayloadClient } from "@/lib/payload";
import { getCmsClubInfo } from "@/lib/cms-data";

interface SeoDefaultsDoc {
  defaultOgImage?: { url?: string } | number | null;
  twitterHandle?: string;
  robots?: { index?: boolean; follow?: boolean; additionalDirectives?: string };
  structuredData?: {
    organizationName?: string;
    foundingYear?: number;
    sport?: string;
    location?: string;
  };
}

/**
 * Reads the editable `seo-defaults` global. Only non-URL editorial fields are
 * pulled from here (organization name/founding year/sport, Twitter handle,
 * robots directives, OG image) — `structuredData.organizationUrl` and
 * `SiteSettings.siteUrl` are deliberately NOT used anywhere as a URL source.
 * Both fields carry the same hardcoded `https://pyrgosafc.example.com`
 * placeholder as their Payload `defaultValue`, which Payload returns as the
 * field's value for any global that's never been explicitly edited — using
 * either would silently reintroduce the wrong-domain bug that `SITE_URL` was
 * fixed for (see src/lib/constants.ts). `SITE_URL` stays the single source of
 * truth for every URL/@id field.
 */
export const getSeoDefaults = cache(async (): Promise<SeoDefaultsDoc | null> => {
  try {
    const payload = await getPayloadClient();
    if (!payload) return null;
    return (await payload.findGlobal({ slug: "seo-defaults", depth: 1 })) as SeoDefaultsDoc;
  } catch {
    return null;
  }
});

export function ogImageUrl(field: SeoDefaultsDoc["defaultOgImage"]): string | undefined {
  return field && typeof field === "object" && typeof field.url === "string" ? field.url : undefined;
}

/** JSON-LD for the Organisation / SportsTeam at club level */
export async function organizationJsonLd() {
  const [defaults, clubInfo] = await Promise.all([getSeoDefaults(), getCmsClubInfo()]);
  const sd = defaults?.structuredData;
  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: sd?.organizationName || clubInfo.name.el || CLUB.name,
    alternateName: clubInfo.shortName || CLUB.shortName,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    foundingDate: String(sd?.foundingYear || clubInfo.founded || CLUB.founded),
    sport: sd?.sport || "Football",
    address: {
      "@type": "PostalAddress",
      streetAddress: clubInfo.contactAddress.el,
      addressLocality: "Πύργος",
      addressCountry: "GR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: clubInfo.contactEmail,
      telephone: clubInfo.contactPhone,
      contactType: "customer service",
    },
    sameAs: clubInfo.socialLinks.map((s) => s.href),
  };
}

/** JSON-LD for the home stadium */
export async function stadiumJsonLd() {
  const clubInfo = await getCmsClubInfo();
  return {
    "@context": "https://schema.org",
    "@type": "StadiumOrArena",
    "@id": `${SITE_URL}/#stadium`,
    name: clubInfo.stadiumName.el,
    alternateName: clubInfo.stadiumName.en,
    sport: "Football",
    maximumAttendeeCapacity: parseInt(clubInfo.stadiumCapacity.replace(/[^0-9]/g, "")) || undefined,
    openingDate: String(clubInfo.stadiumOpened),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Πύργος",
      addressCountry: "GR",
    },
  };
}

/** JSON-LD for a news article */
export function articleJsonLd(params: {
  title: string;
  excerpt: string;
  slug: string;
  author: string;
  publishedDate: string;
  lang: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: params.title,
    description: params.excerpt,
    url: `${SITE_URL}/${params.lang}/news/${params.slug}`,
    datePublished: params.publishedDate,
    inLanguage: params.lang === "el" ? "el-GR" : "en-GB",
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: CLUB.name,
    },
    author: {
      "@type": "Person",
      name: params.author,
    },
  };
}

/** JSON-LD for a sports event (match) */
export function matchJsonLd(params: {
  homeTeam: string;
  awayTeam: string;
  date: string;
  venue?: string;
  homeScore?: number;
  awayScore?: number;
  status: "upcoming" | "completed" | "live";
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${params.homeTeam} vs ${params.awayTeam}`,
    startDate: params.date,
    location: params.venue
      ? { "@type": "Place", name: params.venue }
      : undefined,
    competitor: [
      { "@type": "SportsTeam", name: params.homeTeam },
      { "@type": "SportsTeam", name: params.awayTeam },
    ],
    // schema.org's eventStatus vocabulary has no "completed"/"in-progress"
    // value distinct from a normal scheduled event that already occurred —
    // EventScheduled is correct for upcoming, live, and completed alike here.
    // (This app's postponed/cancelled matches are already collapsed into
    // "upcoming" upstream in cms-data.ts's STATUS_MAP, so there's nothing to
    // map to EventPostponed/EventCancelled at this layer.)
    eventStatus: "https://schema.org/EventScheduled",
    ...(params.homeScore != null && params.awayScore != null
      ? {
          result: {
            "@type": "GameResult",
            description: `${params.homeScore}–${params.awayScore}`,
          },
        }
      : {}),
  };
}

/** JSON-LD for a person (player/staff) */
export function personJsonLd(params: {
  name: string;
  url: string;
  jobTitle?: string;
  nationality?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: params.name,
    url: params.url,
    jobTitle: params.jobTitle,
    nationality: params.nationality,
    memberOf: {
      "@type": "SportsOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: CLUB.name,
    },
  };
}

/** BreadcrumbList JSON-LD */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
