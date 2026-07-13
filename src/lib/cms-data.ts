import "server-only";
import { cache } from "react";
import { getPayloadClient } from "@/lib/payload";
import type { Department, Match, MatchStatus, Competition, NewsArticle, Player, StaffMember, PlayerStats, LocalizedText, Sponsor } from "@/types";
import { CLUB, SOCIAL_LINKS } from "@/lib/constants";
import { sponsors as staticSponsors } from "@/data/sponsors";
import { el as elDict } from "@/i18n/el";
import { en as enDict } from "@/i18n/en";
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
  players as staticPlayers,
  getPlayerBySlug as staticGetPlayerBySlug,
  getPlayersByDepartment as staticGetPlayersByDepartment,
  getFeaturedPlayers as staticGetFeaturedPlayers,
  getRelatedPlayers as staticGetRelatedPlayers,
} from "@/data/players";
import { staff as staticStaff } from "@/data/staff";

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
    leagueName:
      doc.league && typeof doc.league === "object"
        ? {
            el: String((doc.league as PayloadDoc).name ?? ""),
            en: String((doc.league as PayloadDoc).nameEn ?? (doc.league as PayloadDoc).name ?? ""),
          }
        : undefined,
  };
}

// ─── News mapping ─────────────────────────────────────────────────────────
function mediaUrl(field: unknown): string | undefined {
  if (!field || typeof field !== "object") return undefined;
  const m = field as PayloadDoc;
  return typeof m.url === "string" ? m.url : undefined;
}

// News.category (src/collections/News.ts) is a relationship to the free-form
// "news-categories" collection, populated as a full object at depth:1 — not a
// plain string. NewsArticle["category"] is a fixed union (dict.categories key),
// so we resolve the populated doc's slug and fall back when it's unset or
// doesn't match a known translation key, instead of casting the object itself
// (which would key dict.categories with "[object Object]" and render blank).
function categorySlug(field: unknown): NewsArticle["category"] {
  if (field && typeof field === "object" && typeof (field as PayloadDoc).slug === "string") {
    return (field as PayloadDoc).slug as NewsArticle["category"];
  }
  return "club";
}

function mapNews(doc: PayloadDoc, withContent: boolean): NewsArticle {
  return {
    slug: String(doc.slug ?? ""),
    title: { el: String(doc.title ?? ""), en: String(doc.titleEn ?? doc.title ?? "") },
    excerpt: { el: String(doc.excerpt ?? ""), en: String(doc.excerptEn ?? doc.excerpt ?? "") },
    category: categorySlug(doc.category),
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
      where: { status: { not_equals: "draft" } },
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

/** The `count` most recent completed matches, newest first. */
export async function getCmsRecentResults(count = 3, department?: Department): Promise<Match[]> {
  const completed = await getCmsCompletedMatches(department);
  return [...completed].sort((a, b) => b.date.localeCompare(a.date)).slice(0, count);
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

// ─── Player mapping ───────────────────────────────────────────────────────
// Players are genuinely CMS-driven: club-admin's `players` docs are the
// primary source, joined against the current season's `rosters` entries for
// per-season concerns (department/team, captaincy, shirt number, join date)
// that the relational model deliberately keeps off the Player record itself
// (a player can sit on more than one department's roster). The static
// `src/data/players.ts` array is used only to (a) fall back entirely if
// Payload is unreachable/empty, matching the News/Matches pattern, and (b)
// supplement `stats` and `age`-without-a-birthdate, since Payload's schema
// has no season-stats fields yet (flagged in the production readiness audit
// as a follow-up — stats aren't editable anywhere in club-admin today).

const POSITION_MAP: Record<string, Player["position"]> = {
  goalkeeper: "Goalkeeper",
  defender: "Defender",
  midfielder: "Midfielder",
  forward: "Forward",
};

const FOOT_MAP: Record<string, Player["preferredFoot"]> = {
  right: "Right",
  left: "Left",
  both: "Both",
};

function computeAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return 0;
  const ageMs = Date.now() - dob.getTime();
  return Math.floor(ageMs / (365.25 * 24 * 60 * 60 * 1000));
}

function bioText(richText: unknown, fallback: string): string {
  const paragraphs = extractParagraphs(richText);
  return paragraphs.length ? paragraphs.join(" ") : fallback;
}

const staticPlayerBySlug = new Map(staticPlayers.map((p) => [p.slug, p]));

interface RosterInfo {
  department: Department;
  isCaptain: boolean;
  joinedDate?: string;
  shirtNumber?: number;
  position?: string;
  stats?: PlayerStats;
}

function rosterStats(field: unknown): PlayerStats | undefined {
  if (!field || typeof field !== "object") return undefined;
  const s = field as PayloadDoc;
  // A roster's stats group always round-trips from Payload (defaults to 0 for
  // most fields), so presence alone can't distinguish "never edited" from
  // "genuinely all zero." Only treat it as real CMS data once at least one
  // stat is non-zero/set — otherwise fall through to the static demo stats,
  // which is far more useful than an all-zero stat line for a freshly seeded
  // roster entry nobody has edited yet.
  const appearances = Number(s.appearances ?? 0);
  const goals = Number(s.goals ?? 0);
  const assists = Number(s.assists ?? 0);
  const yellowCards = Number(s.yellowCards ?? 0);
  const redCards = Number(s.redCards ?? 0);
  const minutesPlayed = Number(s.minutesPlayed ?? 0);
  const cleanSheets = typeof s.cleanSheets === "number" ? s.cleanSheets : undefined;
  const hasData =
    appearances || goals || assists || yellowCards || redCards || minutesPlayed || cleanSheets;
  if (!hasData) return undefined;
  return { appearances, goals, assists, yellowCards, redCards, minutesPlayed, cleanSheets };
}

/** Player-slug → this-season roster info (department, captaincy, shirt number, join date). */
async function getCurrentSeasonRosterMap(
  payload: NonNullable<Awaited<ReturnType<typeof getPayloadClient>>>
): Promise<Map<string, RosterInfo>> {
  const map = new Map<string, RosterInfo>();
  const seasonRes = await payload.find({
    collection: "seasons",
    where: { isCurrent: { equals: true } },
    limit: 1,
  });
  const seasonId = (seasonRes.docs[0] as PayloadDoc | undefined)?.id;
  if (seasonId == null) return map;

  const res = await payload.find({
    collection: "rosters",
    where: { season: { equals: seasonId } },
    limit: 500,
    depth: 1,
  });
  for (const doc of res.docs as PayloadDoc[]) {
    const player = doc.player;
    const playerSlug =
      player && typeof player === "object" ? String((player as PayloadDoc).slug ?? "") : "";
    if (!playerSlug) continue;
    map.set(playerSlug, {
      department: deptFromTeam(doc.team),
      isCaptain: Boolean(doc.isCaptain),
      joinedDate: typeof doc.joinedDate === "string" ? doc.joinedDate.slice(0, 10) : undefined,
      shirtNumber: typeof doc.shirtNumber === "number" ? doc.shirtNumber : undefined,
      position: typeof doc.position === "string" ? doc.position : undefined,
      stats: rosterStats(doc.stats),
    });
  }
  return map;
}

function mapPlayer(doc: PayloadDoc, roster: RosterInfo | undefined, department: Department): Player {
  const slug = String(doc.slug ?? "");
  const fallback = staticPlayerBySlug.get(slug);
  const dateOfBirth = typeof doc.dateOfBirth === "string" ? doc.dateOfBirth : undefined;

  return {
    slug,
    department,
    firstName: { el: String(doc.firstName ?? ""), en: String(doc.firstNameEn ?? doc.firstName ?? "") },
    lastName: { el: String(doc.lastName ?? ""), en: String(doc.lastNameEn ?? doc.lastName ?? "") },
    number: Number(roster?.shirtNumber ?? doc.defaultShirtNumber ?? fallback?.number ?? 0),
    position:
      POSITION_MAP[String(roster?.position ?? doc.position ?? "")] ?? fallback?.position ?? "Midfielder",
    nationality: {
      el: String(doc.nationality ?? fallback?.nationality.el ?? ""),
      en: String(doc.nationalityEn ?? doc.nationality ?? fallback?.nationality.en ?? ""),
    },
    age: dateOfBirth ? computeAge(dateOfBirth) : fallback?.age ?? 0,
    heightCm: typeof doc.heightCm === "number" ? doc.heightCm : fallback?.heightCm ?? 0,
    weightKg: typeof doc.weightKg === "number" ? doc.weightKg : fallback?.weightKg ?? 0,
    preferredFoot: FOOT_MAP[String(doc.preferredFoot ?? "")] ?? fallback?.preferredFoot ?? "Right",
    joined: roster?.joinedDate ?? fallback?.joined ?? "",
    bio: {
      el: bioText(doc.biography, fallback?.bio.el ?? ""),
      en: bioText(doc.biographyEn, fallback?.bio.en ?? fallback?.bio.el ?? ""),
    },
    featured: Boolean(doc.featured),
    captain: roster?.isCaptain ?? fallback?.captain,
    // Season stats live on the current-season Roster entry (a player's stats
    // are per team/season, not intrinsic to the Player record — see
    // src/collections/Rosters.ts). Falls back to the static seed's demo stats
    // when a roster entry exists but nobody has entered real stats for it yet.
    stats: roster?.stats ?? fallback?.stats ?? {
      appearances: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      minutesPlayed: 0,
    },
    photoUrl: mediaUrl(doc.profileImage),
  };
}

/** Player by slug, from Payload (falls back to static data if unreachable/not found). */
export async function getCmsPlayerBySlug(slug: string): Promise<Player | undefined> {
  if (process.env.STATIC_EXPORT === "1") return staticGetPlayerBySlug(slug);
  try {
    const payload = await getPayloadClient();
    if (!payload) throw new Error("no client");
    const res = await payload.find({
      collection: "players",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    });
    const doc = res.docs[0] as PayloadDoc | undefined;
    if (!doc) throw new Error("not found");
    const rosterMap = await getCurrentSeasonRosterMap(payload);
    const roster = rosterMap.get(slug);
    const department = roster?.department ?? staticPlayerBySlug.get(slug)?.department ?? "men";
    return mapPlayer(doc, roster, department);
  } catch {
    return staticGetPlayerBySlug(slug);
  }
}

/** Squad for a department, from Payload's current-season rosters (falls back to static data). */
export async function getCmsPlayersByDepartment(department: Department): Promise<Player[]> {
  if (process.env.STATIC_EXPORT === "1") return staticGetPlayersByDepartment(department);
  try {
    const payload = await getPayloadClient();
    if (!payload) throw new Error("no client");
    const rosterMap = await getCurrentSeasonRosterMap(payload);
    const slugs = [...rosterMap.entries()]
      .filter(([, info]) => info.department === department)
      .map(([slug]) => slug);
    if (!slugs.length) throw new Error("empty roster");
    const res = await payload.find({
      collection: "players",
      where: { slug: { in: slugs } },
      limit: 200,
      depth: 1,
    });
    if (!res.docs.length) throw new Error("empty");
    return (res.docs as PayloadDoc[]).map((doc) =>
      mapPlayer(doc, rosterMap.get(String(doc.slug ?? "")), department)
    );
  } catch {
    return staticGetPlayersByDepartment(department);
  }
}

/** Players marked "featured" in club-admin (falls back to the static featured list). */
export async function getCmsFeaturedPlayers(): Promise<Player[]> {
  if (process.env.STATIC_EXPORT === "1") return staticGetFeaturedPlayers();
  try {
    const payload = await getPayloadClient();
    if (!payload) throw new Error("no client");
    const [res, rosterMap] = await Promise.all([
      payload.find({
        collection: "players",
        where: { featured: { equals: true } },
        limit: 8,
        depth: 1,
      }),
      getCurrentSeasonRosterMap(payload),
    ]);
    if (!res.docs.length) throw new Error("empty");
    return (res.docs as PayloadDoc[]).map((doc) => {
      const slug = String(doc.slug ?? "");
      const roster = rosterMap.get(slug);
      const department = roster?.department ?? staticPlayerBySlug.get(slug)?.department ?? "men";
      return mapPlayer(doc, roster, department);
    });
  } catch {
    return staticGetFeaturedPlayers();
  }
}

/** Other players from the same department, same position first (falls back to static data). */
export async function getCmsRelatedPlayers(slug: string, count = 3): Promise<Player[]> {
  const current = await getCmsPlayerBySlug(slug);
  if (!current) return staticGetRelatedPlayers(slug, count);
  const squad = await getCmsPlayersByDepartment(current.department);
  const sameDept = squad.filter((p) => p.slug !== slug);
  const samePosition = sameDept.filter((p) => p.position === current.position);
  const others = sameDept.filter((p) => p.position !== current.position);
  return [...samePosition, ...others].slice(0, count);
}

// ─── Staff mapping ────────────────────────────────────────────────────────

const staticStaffBySlug = new Map(staticStaff.map((s) => [s.slug, s]));

function mapStaff(doc: PayloadDoc): StaffMember {
  const slug = String(doc.slug ?? "");
  const fallback = staticStaffBySlug.get(slug);
  const firstNameEl = String(doc.firstName ?? "");
  const lastNameEl = String(doc.lastName ?? "");
  const nameEl = String(doc.fullName ?? `${firstNameEl} ${lastNameEl}`.trim());
  const nameEn = `${String(doc.firstNameEn ?? doc.firstName ?? "")} ${String(doc.lastNameEn ?? doc.lastName ?? "")}`.trim();

  return {
    slug,
    name: { el: nameEl || fallback?.name.el || "", en: nameEn || fallback?.name.en || nameEl },
    role: {
      el: String(doc.roleTitle ?? fallback?.role.el ?? ""),
      en: String(doc.roleTitleEn ?? doc.roleTitle ?? fallback?.role.en ?? ""),
    },
    bio: {
      el: bioText(doc.biography, fallback?.bio.el ?? ""),
      en: bioText(doc.biographyEn, fallback?.bio.en ?? fallback?.bio.el ?? ""),
    },
    yearsOfExperience:
      typeof doc.yearsOfExperience === "number" ? doc.yearsOfExperience : fallback?.yearsOfExperience ?? 0,
    specialty: {
      el: String(doc.specialty ?? fallback?.specialty.el ?? ""),
      en: String(doc.specialtyEn ?? doc.specialty ?? fallback?.specialty.en ?? ""),
    },
    initials: (`${firstNameEl.charAt(0)}${lastNameEl.charAt(0)}`.toUpperCase() || fallback?.initials) ?? "",
  };
}

/** Active technical/support staff, from Payload (falls back to static data). */
export async function getCmsStaff(): Promise<StaffMember[]> {
  if (process.env.STATIC_EXPORT === "1") return staticStaff;
  try {
    const payload = await getPayloadClient();
    if (!payload) throw new Error("no client");
    const res = await payload.find({
      collection: "staff",
      where: { status: { equals: "active" } },
      limit: 100,
      depth: 0,
    });
    if (!res.docs.length) throw new Error("empty");
    return (res.docs as PayloadDoc[]).map(mapStaff);
  } catch {
    return staticStaff;
  }
}

// ─── ClubInfo / SiteSettings globals ──────────────────────────────────────
// Cached per-request with React's `cache()`: this global is read from several
// independent server components on the same page render (Footer, ClubValues,
// SponsorsStrip, the About/Contact pages, seo.ts's JSON-LD) — without this,
// each one would issue its own identical Payload query for the same request.

export interface ClubInfoData {
  name: LocalizedText;
  shortName: string;
  founded: number;
  stadiumName: LocalizedText;
  stadiumCapacity: string;
  stadiumOpened: number;
  contactEmail: string;
  contactPhone: string;
  contactAddress: LocalizedText;
  socialLinks: { label: string; href: string }[];
  about: LocalizedText;
  values: { title: LocalizedText; description: LocalizedText }[];
  sponsors: Sponsor[];
}

function staticClubInfo(): ClubInfoData {
  return {
    name: { el: CLUB.name, en: CLUB.name },
    shortName: CLUB.shortName,
    founded: CLUB.founded,
    stadiumName: CLUB.stadium.name,
    stadiumCapacity: CLUB.stadium.capacity,
    stadiumOpened: CLUB.stadium.opened,
    contactEmail: CLUB.contact.email,
    contactPhone: CLUB.contact.phone,
    contactAddress: CLUB.contact.address,
    socialLinks: SOCIAL_LINKS.map(({ label, href }) => ({ label, href })),
    about: { el: "", en: "" },
    values: [
      { title: { el: elDict.values.passion.title, en: enDict.values.passion.title }, description: { el: elDict.values.passion.text, en: enDict.values.passion.text } },
      { title: { el: elDict.values.discipline.title, en: enDict.values.discipline.title }, description: { el: elDict.values.discipline.text, en: enDict.values.discipline.text } },
      { title: { el: elDict.values.community.title, en: enDict.values.community.title }, description: { el: elDict.values.community.text, en: enDict.values.community.text } },
      { title: { el: elDict.values.ambition.title, en: enDict.values.ambition.title }, description: { el: elDict.values.ambition.text, en: enDict.values.ambition.text } },
    ],
    sponsors: staticSponsors,
  };
}

function socialLink(label: string, href: unknown): { label: string; href: string } | undefined {
  return typeof href === "string" && href.trim() ? { label, href: href.trim() } : undefined;
}

/** Club-wide info (contact, social links, stadium, values, sponsors) from Payload's ClubInfo global. */
export const getCmsClubInfo = cache(async (): Promise<ClubInfoData> => {
  if (process.env.STATIC_EXPORT === "1") return staticClubInfo();
  const fallback = staticClubInfo();
  try {
    const payload = await getPayloadClient();
    if (!payload) return fallback;
    const doc = (await payload.findGlobal({ slug: "club-info", depth: 1 })) as PayloadDoc;

    const stadium = (doc.stadium as PayloadDoc) ?? {};
    const contact = (doc.contact as PayloadDoc) ?? {};
    const social = (doc.socialMedia as PayloadDoc) ?? {};
    const socialLinks = [
      socialLink("Instagram", social.instagram),
      socialLink("X / Twitter", social.twitter),
      socialLink("Facebook", social.facebook),
      socialLink("YouTube", social.youtube),
      socialLink("TikTok", social.tiktok),
    ].filter((l): l is { label: string; href: string } => Boolean(l));

    const values = Array.isArray(doc.values)
      ? (doc.values as PayloadDoc[])
          .filter((v) => v.title)
          .map((v) => ({
            title: { el: String(v.title ?? ""), en: String(v.titleEn ?? v.title ?? "") },
            description: {
              el: String(v.description ?? ""),
              en: String(v.descriptionEn ?? v.description ?? ""),
            },
          }))
      : [];

    const sponsorsFromCms = Array.isArray(doc.sponsors)
      ? (doc.sponsors as PayloadDoc[])
          .filter((s) => s.name)
          .map((s, i) => ({
            id: String(s.id ?? `cms-sponsor-${i}`),
            name: String(s.name ?? ""),
            tier: (s.tier as Sponsor["tier"]) ?? "partner",
            tagline: { el: String(s.tagline ?? ""), en: String(s.taglineEn ?? s.tagline ?? "") },
            url: typeof s.url === "string" && s.url ? s.url : undefined,
            logoUrl: mediaUrl(s.logo),
          }))
      : [];

    return {
      name: {
        el: typeof doc.name === "string" && doc.name ? doc.name : fallback.name.el,
        en: typeof doc.nameEn === "string" && doc.nameEn ? doc.nameEn : fallback.name.en,
      },
      shortName: typeof doc.shortName === "string" && doc.shortName ? doc.shortName : fallback.shortName,
      founded: typeof doc.founded === "number" ? doc.founded : fallback.founded,
      stadiumName: {
        el: typeof stadium.name === "string" && stadium.name ? stadium.name : fallback.stadiumName.el,
        en: typeof stadium.nameEn === "string" && stadium.nameEn ? stadium.nameEn : fallback.stadiumName.en,
      },
      stadiumCapacity:
        typeof stadium.capacity === "string" && stadium.capacity ? stadium.capacity : fallback.stadiumCapacity,
      stadiumOpened: typeof stadium.opened === "number" ? stadium.opened : fallback.stadiumOpened,
      contactEmail: typeof contact.email === "string" && contact.email ? contact.email : fallback.contactEmail,
      contactPhone: typeof contact.phone === "string" && contact.phone ? contact.phone : fallback.contactPhone,
      contactAddress: {
        el: typeof contact.address === "string" && contact.address ? contact.address : fallback.contactAddress.el,
        en:
          typeof contact.addressEn === "string" && contact.addressEn
            ? contact.addressEn
            : fallback.contactAddress.en,
      },
      socialLinks: socialLinks.length ? socialLinks : fallback.socialLinks,
      about: { el: bioText(doc.about, ""), en: bioText(doc.aboutEn, "") },
      values: values.length ? values : fallback.values,
      sponsors: sponsorsFromCms.length ? sponsorsFromCms : fallback.sponsors,
    };
  } catch {
    return fallback;
  }
});

export interface SiteSettingsData {
  maintenanceMode: boolean;
  googleAnalyticsId?: string;
  cookieBannerEnabled: boolean;
  announcementBar?: string;
  announcementBarEnabled: boolean;
}

/** Site-operational toggles (maintenance mode, analytics, cookie banner, announcement bar) from Payload. */
export const getCmsSiteSettings = cache(async (): Promise<SiteSettingsData> => {
  const fallback: SiteSettingsData = {
    maintenanceMode: false,
    cookieBannerEnabled: false,
    announcementBarEnabled: false,
  };
  if (process.env.STATIC_EXPORT === "1") return fallback;
  try {
    const payload = await getPayloadClient();
    if (!payload) return fallback;
    const doc = (await payload.findGlobal({ slug: "site-settings", depth: 0 })) as PayloadDoc;
    const nav = (doc.nav as PayloadDoc) ?? {};
    return {
      maintenanceMode: Boolean(doc.maintenanceMode),
      googleAnalyticsId: typeof doc.googleAnalyticsId === "string" && doc.googleAnalyticsId ? doc.googleAnalyticsId : undefined,
      cookieBannerEnabled: Boolean(doc.cookieBannerEnabled),
      announcementBar: typeof nav.announcementBar === "string" && nav.announcementBar ? nav.announcementBar : undefined,
      announcementBarEnabled: Boolean(nav.announcementBarEnabled),
    };
  } catch {
    return fallback;
  }
});
