import "server-only";
import { getPayloadClient } from "@/lib/payload";
import type { Department, Match, MatchStatus, Competition, NewsArticle, Player } from "@/types";
import {
  matches as staticMatches,
  getUpcomingMatches,
  getCompletedMatches,
  getNextMatch as staticGetNextMatch,
} from "@/data/matches";
import {
  newsArticles as staticNews,
  getArticleBySlug as staticGetArticle,
  getFeaturedArticle as staticGetFeatured,
} from "@/data/news";
import {
  getPlayerBySlug as staticGetPlayerBySlug,
  getPlayersByDepartment as staticGetPlayersByDepartment,
  getFeaturedPlayers as staticGetFeaturedPlayers,
  getRelatedPlayers as staticGetRelatedPlayers,
} from "@/data/players";

// ─── Lexical → string[] ───────────────────────────────────────────────────
type LexNode = { type?: string; text?: string; children?: LexNode[] };

function extractParagraphs(root: unknown): string[] {
  const out: string[] = [];
  function walk(n: LexNode) {
    if (n.type === "paragraph" || n.type === "heading") {
      const t = (n.children ?? []).map((c) => c.text ?? "").join("").trim();
      if (t) out.push(t);
    } else {
      (n.children ?? []).forEach(walk);
    }
  }
  if (root && typeof root === "object") {
    const r = (root as { root?: LexNode }).root;
    if (r) walk(r);
  }
  return out;
}

// ─── Match mapping ────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, MatchStatus> = {
  scheduled: "upcoming",
  completed: "completed",
  live: "live",
  cancelled: "upcoming",
  postponed: "upcoming",
};

const TEAM_DEPT: Record<string, Department> = {
  "pyrgos-afc-men": "men",
  "pyrgos-afc-women": "women",
  "pyrgos-afc-futsal": "futsal",
};

type PayloadDoc = Record<string, unknown>;

function deptFromTeam(team: unknown): Department {
  if (!team || typeof team !== "object") return "men";
  return TEAM_DEPT[String((team as PayloadDoc).slug ?? "")] ?? "men";
}

function mapMatch(doc: PayloadDoc): Match {
  return {
    id: String(doc.id ?? ""),
    department: deptFromTeam(doc.team),
    competition: (String(doc.matchType ?? "friendly")) as Competition,
    homeTeam: {
      el: String(doc.homeTeamName ?? ""),
      en: String(doc.homeTeamNameEn ?? doc.homeTeamName ?? ""),
    },
    awayTeam: {
      el: String(doc.awayTeamName ?? ""),
      en: String(doc.awayTeamNameEn ?? doc.awayTeamName ?? ""),
    },
    homeIsPyrgos: Boolean(doc.isHomeMatch),
    homeScore: doc.homeScore != null ? Number(doc.homeScore) : undefined,
    awayScore: doc.awayScore != null ? Number(doc.awayScore) : undefined,
    date: String(doc.matchDate ?? "").slice(0, 10),
    time: String(doc.kickoffTime ?? ""),
    venue:
      doc.venue && typeof doc.venue === "object"
        ? {
            el: String((doc.venue as PayloadDoc).name ?? ""),
            en: String((doc.venue as PayloadDoc).nameEn ?? (doc.venue as PayloadDoc).name ?? ""),
          }
        : { el: "", en: "" },
    status: STATUS_MAP[String(doc.status ?? "scheduled")] ?? "upcoming",
    matchweek: doc.matchweek
      ? { el: String(doc.matchweek), en: String(doc.matchweekEn ?? doc.matchweek) }
      : undefined,
  };
}

// ─── News mapping ─────────────────────────────────────────────────────────
function mediaUrl(field: unknown): string | undefined {
  if (!field || typeof field !== "object") return undefined;
  const m = field as PayloadDoc;
  return typeof m.url === "string" ? m.url : undefined;
}

function mapNews(doc: PayloadDoc, withContent: boolean): NewsArticle {
  return {
    slug: String(doc.slug ?? ""),
    title: { el: String(doc.title ?? ""), en: String(doc.titleEn ?? doc.title ?? "") },
    excerpt: { el: String(doc.excerpt ?? ""), en: String(doc.excerptEn ?? doc.excerpt ?? "") },
    category: (doc.category as NewsArticle["category"]) ?? "club",
    author: {
      el: String(doc.author ?? "Ομάδα Επικοινωνίας"),
      en: String(doc.authorEn ?? "Club Media Team"),
    },
    date: String(doc.publishedDate ?? "").slice(0, 10),
    readingTime: Number(doc.readingTime ?? 3),
    featured: Boolean(doc.featured),
    content: withContent
      ? { el: extractParagraphs(doc.content), en: extractParagraphs(doc.contentEn) }
      : { el: [], en: [] },
    imageUrl: mediaUrl(doc.featuredImage),
    imageAlt: doc.featuredImage && typeof doc.featuredImage === "object"
      ? String((doc.featuredImage as PayloadDoc).alt ?? "")
      : undefined,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────

/** All matches from Payload (or static fallback). */
export async function getCmsMatches(department?: Department): Promise<Match[]> {
  if (process.env.STATIC_EXPORT === "1") {
    return department
      ? [...getUpcomingMatches(department), ...getCompletedMatches(department)]
      : staticMatches;
  }
  try {
    const payload = await getPayloadClient();
    if (!payload) throw new Error("no client");
    const res = await payload.find({
      collection: "matches",
      sort: "matchDate",
      limit: 200,
      depth: 1,
    });
    if (!res.docs.length) throw new Error("empty");
    const all = (res.docs as PayloadDoc[]).map(mapMatch);
    return department ? all.filter((m) => m.department === department) : all;
  } catch {
    return department
      ? [...getUpcomingMatches(department), ...getCompletedMatches(department)]
      : staticMatches;
  }
}

export async function getCmsUpcomingMatches(department?: Department): Promise<Match[]> {
  const all = await getCmsMatches(department);
  return all.filter((m) => m.status === "upcoming");
}

export async function getCmsCompletedMatches(department?: Department): Promise<Match[]> {
  const all = await getCmsMatches(department);
  return all.filter((m) => m.status === "completed");
}

export async function getCmsNextMatch(department?: Department): Promise<Match | undefined> {
  const upcoming = await getCmsUpcomingMatches(department);
  return upcoming[0] ?? staticGetNextMatch(department);
}

/** All published news articles from Payload (or static fallback). */
export async function getCmsNewsArticles(): Promise<NewsArticle[]> {
  if (process.env.STATIC_EXPORT === "1")
    return [...staticNews].sort((a, b) => b.date.localeCompare(a.date));
  try {
    const payload = await getPayloadClient();
    if (!payload) throw new Error("no client");
    const res = await payload.find({
      collection: "news",
      where: { status: { equals: "published" } },
      sort: "-publishedDate",
      limit: 100,
      depth: 1,
    });
    if (!res.docs.length) throw new Error("empty");
    return (res.docs as PayloadDoc[]).map((d) => mapNews(d, false));
  } catch {
    return [...staticNews].sort((a, b) => b.date.localeCompare(a.date));
  }
}

/** The article marked "featured" in club-admin, or the most recent one if none is marked. */
export async function getCmsFeaturedArticle(): Promise<NewsArticle> {
  const articles = await getCmsNewsArticles();
  return articles.find((a) => a.featured) ?? articles[0] ?? staticGetFeatured();
}

/** The `count` most recent published articles, newest first. */
export async function getCmsLatestArticles(count = 3): Promise<NewsArticle[]> {
  const articles = await getCmsNewsArticles();
  return articles.slice(0, count);
}

export async function getCmsNewsArticle(slug: string): Promise<NewsArticle | null> {
  if (process.env.STATIC_EXPORT === "1") return staticGetArticle(slug) ?? null;
  try {
    const payload = await getPayloadClient();
    if (!payload) throw new Error("no client");
    const res = await payload.find({
      collection: "news",
      where: {
        and: [{ slug: { equals: slug } }, { status: { equals: "published" } }],
      },
      limit: 1,
      depth: 1,
    });
    if (!res.docs.length) throw new Error("not found");
    return mapNews(res.docs[0] as PayloadDoc, true);
  } catch {
    return staticGetArticle(slug) ?? null;
  }
}

export async function getCmsRelatedArticles(slug: string, count = 3): Promise<NewsArticle[]> {
  // Simple: return other recent articles excluding the current one
  const articles = await getCmsNewsArticles();
  return articles.filter((a) => a.slug !== slug).slice(0, count);
}

/** Logo URL for a team by its slug (e.g. "pyrgos-afc-men"). */
export async function getCmsTeamLogoUrl(teamSlug: string): Promise<string | undefined> {
  if (process.env.STATIC_EXPORT === "1") return undefined;
  try {
    const payload = await getPayloadClient();
    if (!payload) return undefined;
    const res = await payload.find({
      collection: "teams",
      where: { slug: { equals: teamSlug } },
      limit: 1,
      depth: 1,
    });
    const doc = res.docs[0] as PayloadDoc | undefined;
    return mediaUrl(doc?.logo);
  } catch {
    return undefined;
  }
}

/** Maps player slug → profile photo URL, from the Players collection. */
async function getCmsPlayerPhotoMap(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (process.env.STATIC_EXPORT === "1") return map;
  try {
    const payload = await getPayloadClient();
    if (!payload) return map;
    const res = await payload.find({
      collection: "players",
      limit: 200,
      depth: 1,
    });
    for (const doc of res.docs as PayloadDoc[]) {
      const url = mediaUrl(doc.profileImage);
      if (url && typeof doc.slug === "string") map.set(doc.slug, url);
    }
    return map;
  } catch {
    return map;
  }
}

function withCmsPhoto(player: Player, photos: Map<string, string>): Player {
  const photoUrl = photos.get(player.slug);
  return photoUrl ? { ...player, photoUrl } : player;
}

/** Roster player by slug, with profile photo overlaid from Payload if present. */
export async function getCmsPlayerBySlug(slug: string): Promise<Player | undefined> {
  const base = staticGetPlayerBySlug(slug);
  if (!base) return undefined;
  const photos = await getCmsPlayerPhotoMap();
  return withCmsPhoto(base, photos);
}

/** Squad for a department, with profile photos overlaid from Payload. */
export async function getCmsPlayersByDepartment(department: Department): Promise<Player[]> {
  const [base, photos] = await Promise.all([
    staticGetPlayersByDepartment(department),
    getCmsPlayerPhotoMap(),
  ]);
  return base.map((p) => withCmsPhoto(p, photos));
}

/** Featured players for the homepage, with profile photos overlaid from Payload. */
export async function getCmsFeaturedPlayers(): Promise<Player[]> {
  const [base, photos] = await Promise.all([staticGetFeaturedPlayers(), getCmsPlayerPhotoMap()]);
  return base.map((p) => withCmsPhoto(p, photos));
}

/** Related players for a roster detail page, with profile photos overlaid from Payload. */
export async function getCmsRelatedPlayers(slug: string, count = 3): Promise<Player[]> {
  const [base, photos] = await Promise.all([
    staticGetRelatedPlayers(slug, count),
    getCmsPlayerPhotoMap(),
  ]);
  return base.map((p) => withCmsPhoto(p, photos));
}
