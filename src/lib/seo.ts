import { CLUB, SITE_URL } from "@/lib/constants";

/** JSON-LD for the Organisation / SportsTeam at club level */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: CLUB.name,
    alternateName: CLUB.shortName,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    foundingDate: String(CLUB.founded),
    sport: "Football",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Λεωφόρος Πύργου 1",
      addressLocality: "Πύργος",
      addressCountry: "GR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: CLUB.contact.email,
      telephone: CLUB.contact.phone,
      contactType: "customer service",
    },
    sameAs: [
      "https://instagram.com/pyrgosafc",
      "https://x.com/pyrgosafc",
      "https://facebook.com/pyrgosafc",
    ],
  };
}

/** JSON-LD for the home stadium */
export function stadiumJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "StadiumOrArena",
    "@id": `${SITE_URL}/#stadium`,
    name: CLUB.stadium.name.el,
    alternateName: CLUB.stadium.name.en,
    sport: "Football",
    maximumAttendeeCapacity: parseInt(CLUB.stadium.capacity.replace(/[^0-9]/g, "")),
    openingDate: String(CLUB.stadium.opened),
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
    eventStatus:
      params.status === "upcoming"
        ? "https://schema.org/EventScheduled"
        : params.status === "live"
        ? "https://schema.org/EventMovedOnline"
        : "https://schema.org/EventPostponed",
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
