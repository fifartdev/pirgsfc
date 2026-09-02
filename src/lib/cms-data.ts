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

/**
 * Team-name → crest URL, built from the current season's league-table rows
 * (the only place a rival club's logo is ever stored — see LeagueTables.ts).
 * Keyed by both the Greek and English name so `mapMatch`'s homeTeamName/
 * homeTeamNameEn (free text, no relationship to a club record) can look
 * either one up regardless of which locale created the match.
 */
async function getCurrentSeasonLogoMap(
  payload: NonNullable<Awaited<ReturnType<typeof getPayloadClient>>>,
  seasonId: unknown
): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  const [tablesRes, ownLogoUrl] = await Promise.all([
    payload.find({
      collection: "league-tables",
      where: { season: { equals: seasonId } },
      limit: 20,
      depth: 1,
    }),
    getCmsTeamLogoUrl("pyrgos-afc-men"),
  ]);
  // Every department's own-side matches use the literal name "PYRGOS AFC"
  // (see seed data / club-admin convention) regardless of which Teams record
  // the match belongs to, so the men's team's crest doubles as the club's
  // one shared badge here — there's no separate logo entry for Pyrgos in
  // LeagueTables.rows (that array only holds rival clubs).
  if (ownLogoUrl) map["PYRGOS AFC"] = ownLogoUrl;
  for (const doc of tablesRes.docs as PayloadDoc[]) {
    const rows = Array.isArray(doc.rows) ? (doc.rows as PayloadDoc[]) : [];
    for (const row of rows) {
      const url = mediaUrl(row.logo);
      if (!url) continue;
      if (typeof row.teamName === "string") map[row.teamName] = url;
      if (typeof row.teamNameEn === "string") map[row.teamNameEn] = url;
    }
  }
  return map;
}

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
    // Scoped to the current season only — matches otherwise cross seasons: an
    // old season's match left as status "scheduled" would sort ahead of the
    // current season's real fixtures and wrongly win as "next match" (see
    // getCmsStandings/getCurrentSeasonRosterMap for the same isCurrent lookup).
    const seasonRes = await payload.find({
      collection: "seasons",
      where: { isCurrent: { equals: true } },
      limit: 1,
    });
    const seasonId = (seasonRes.docs[0] as PayloadDoc | undefined)?.id;
    if (seasonId == null) throw new Error("no current season");
    const [res, logoMap] = await Promise.all([
      payload.find({
        collection: "matches",
        where: { and: [{ status: { not_equals: "draft" } }, { season: { equals: seasonId } }] },
        sort: "matchDate",
        limit: 200,
        depth: 1,
      }),
      getCurrentSeasonLogoMap(payload, seasonId),
    ]);
    if (!res.docs.length) throw new Error("empty");
    const all = (res.docs as PayloadDoc[]).map((doc) => {
      const match = mapMatch(doc);
      return {
        ...match,
        homeTeamLogoUrl: logoMap[match.homeTeam.el] ?? logoMap[match.homeTeam.en],
        awayTeamLogoUrl: logoMap[match.awayTeam.el] ?? logoMap[match.awayTeam.en],
      };
    });
    return department ? all.filter((m) => m.department === department) : all;
  } catch {
    return department
      ? [...getUpcomingMatches(department), ...getCompletedMatches(department)]
      : staticMatches;
  }
}

export async function getCmsUpcomingMatches(department?: Department): Promise<Match[]> {
  const all = await getCmsMatches(department);
  const today = new Date().toISOString().slice(0, 10);
  // Guards against a past match left as status "scheduled" (never marked
  // completed/postponed) permanently squatting as "next match" — see
  // getCmsMatches' season-scoping fix above for the other half of this bug.
  return all.filter((m) => m.status === "upcoming" && m.date >= today);
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
  bilingualEnabled: boolean;
  googleAnalyticsId?: string;
  cookieBannerEnabled: boolean;
  announcementBar?: string;
  announcementBarEnabled: boolean;
}

/** Site-operational toggles (maintenance mode, bilingual on/off, analytics, cookie banner, announcement bar) from Payload. */
export const getCmsSiteSettings = cache(async (): Promise<SiteSettingsData> => {
  const fallback: SiteSettingsData = {
    maintenanceMode: false,
    bilingualEnabled: true,
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
      bilingualEnabled: doc.bilingualEnabled !== false,
      googleAnalyticsId: typeof doc.googleAnalyticsId === "string" && doc.googleAnalyticsId ? doc.googleAnalyticsId : undefined,
      cookieBannerEnabled: Boolean(doc.cookieBannerEnabled),
      announcementBar: typeof nav.announcementBar === "string" && nav.announcementBar ? nav.announcementBar : undefined,
      announcementBarEnabled: Boolean(nav.announcementBarEnabled),
    };
  } catch {
    return fallback;
  }
});

// ─── Standings ─────────────────────────────────────────────────────────────
// Manually maintained (src/collections/LeagueTables.ts) — this site only
// records PYRGOS AFC's own fixtures (see mapMatch above), not every match
// between rival clubs, so a full multi-team table can't be computed from
// Matches. Each LeagueTables document holds one competition/season's whole
// table as a repeatable `rows` array; row order IS the standing position.
// No static fallback: there's no precedent demo data for this, so an empty
// result is the correct "nothing entered yet" state, not an error.

export interface StandingRow {
  teamName: LocalizedText;
  isPyrgos: boolean;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  notes?: string;
  logoUrl?: string;
}

export interface LeagueStandings {
  leagueName: LocalizedText;
  leagueSlug: string;
  rows: StandingRow[];
}

/** Multi-team league tables for the current season, grouped by league, each sorted by row order. */
export async function getCmsStandings(): Promise<LeagueStandings[]> {
  if (process.env.STATIC_EXPORT === "1") return [];
  try {
    const payload = await getPayloadClient();
    if (!payload) return [];
    const seasonRes = await payload.find({
      collection: "seasons",
      where: { isCurrent: { equals: true } },
      limit: 1,
    });
    const seasonId = (seasonRes.docs[0] as PayloadDoc | undefined)?.id;
    if (seasonId == null) return [];

    const res = await payload.find({
      collection: "league-tables",
      where: { season: { equals: seasonId } },
      limit: 100,
      depth: 1,
    });

    type TableRow = {
      teamName?: string;
      teamNameEn?: string;
      isPyrgos?: boolean;
      played?: number;
      won?: number;
      drawn?: number;
      lost?: number;
      goalsFor?: number;
      goalsAgainst?: number;
      points?: number;
      notes?: string;
      logo?: unknown;
    };

    // LeagueTables.rows has no logo entry for Pyrgos itself (that array only
    // holds rival clubs) — reuse the men's team's own crest for that row,
    // same fallback as getCurrentSeasonLogoMap above.
    const ownLogoUrl = await getCmsTeamLogoUrl("pyrgos-afc-men");

    const tables: LeagueStandings[] = [];
    for (const doc of res.docs as PayloadDoc[]) {
      const league = doc.league;
      if (!league || typeof league !== "object") continue;
      const l = league as PayloadDoc;
      const rows = (Array.isArray(doc.rows) ? (doc.rows as TableRow[]) : []).map(
        (row, index): StandingRow => {
          const goalsFor = Number(row.goalsFor ?? 0);
          const goalsAgainst = Number(row.goalsAgainst ?? 0);
          return {
            teamName: { el: String(row.teamName ?? ""), en: String(row.teamNameEn ?? row.teamName ?? "") },
            isPyrgos: Boolean(row.isPyrgos),
            position: index + 1,
            played: Number(row.played ?? 0),
            won: Number(row.won ?? 0),
            drawn: Number(row.drawn ?? 0),
            lost: Number(row.lost ?? 0),
            goalsFor,
            goalsAgainst,
            goalDifference: goalsFor - goalsAgainst,
            points: Number(row.points ?? 0),
            notes: typeof row.notes === "string" && row.notes ? row.notes : undefined,
            logoUrl: row.isPyrgos ? ownLogoUrl : mediaUrl(row.logo),
          };
        }
      );
      tables.push({
        leagueName: { el: String(l.name ?? ""), en: String(l.nameEn ?? l.name ?? "") },
        leagueSlug: String(l.slug ?? l.id ?? ""),
        rows,
      });
    }
    return tables;
  } catch {
    return [];
  }
}

// ─── Auto-computed team stats ─────────────────────────────────────────────
// Distinct from Standings above: this is PYRGOS AFC's own record, rolled up
// from its own completed Matches — always accurate, no admin data entry.

export interface TeamStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

/** PYRGOS AFC's own played/won/drawn/lost/goals/points for a department, computed from completed Matches. */
export async function getCmsTeamStats(department?: Department): Promise<TeamStats> {
  const completed = await getCmsCompletedMatches(department);
  let played = 0;
  let won = 0;
  let drawn = 0;
  let lost = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;

  for (const match of completed) {
    if (match.homeScore === undefined || match.awayScore === undefined) continue;
    played++;
    const pyrgosScore = match.homeIsPyrgos ? match.homeScore : match.awayScore;
    const opponentScore = match.homeIsPyrgos ? match.awayScore : match.homeScore;
    goalsFor += pyrgosScore;
    goalsAgainst += opponentScore;
    if (pyrgosScore > opponentScore) won++;
    else if (pyrgosScore < opponentScore) lost++;
    else drawn++;
  }

  return {
    played,
    won,
    drawn,
    lost,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
    points: won * 3 + drawn,
  };
}

// ─── Page content globals (Home / About / Contact) ────────────────────────
// Narrative copy only — the fixed hero/mission/story/etc. text these three
// pages own directly, per the "fixed fields per page, narrative content
// only" scope. Shared UI chrome (nav labels, button text, section headings
// owned by reusable components like ClubValues) stays in the static i18n
// dictionary. Every field falls back independently to the dictionary's
// current copy when the CMS field is empty, so an unedited global renders
// identically to today's static page.

function localizedField(cmsEl: unknown, cmsEn: unknown, fallback: LocalizedText): LocalizedText {
  return {
    el: typeof cmsEl === "string" && cmsEl ? cmsEl : fallback.el,
    en: typeof cmsEn === "string" && cmsEn ? cmsEn : fallback.en,
  };
}

export interface HomeContentData {
  heroEyebrow: LocalizedText;
  heroTitle1: LocalizedText;
  heroTitleAccent: LocalizedText;
  heroTitle2: LocalizedText;
  heroText: LocalizedText;
}

function staticHomeContent(): HomeContentData {
  return {
    heroEyebrow: { el: elDict.home.heroEyebrow, en: enDict.home.heroEyebrow },
    heroTitle1: { el: elDict.home.heroTitle1, en: enDict.home.heroTitle1 },
    heroTitleAccent: { el: elDict.home.heroTitleAccent, en: enDict.home.heroTitleAccent },
    heroTitle2: { el: elDict.home.heroTitle2, en: enDict.home.heroTitle2 },
    heroText: { el: elDict.home.heroText, en: enDict.home.heroText },
  };
}

/** Homepage hero copy from Payload's HomeContent global. */
export const getCmsHomeContent = cache(async (): Promise<HomeContentData> => {
  const fallback = staticHomeContent();
  if (process.env.STATIC_EXPORT === "1") return fallback;
  try {
    const payload = await getPayloadClient();
    if (!payload) return fallback;
    const doc = (await payload.findGlobal({ slug: "home-content", depth: 0 })) as PayloadDoc;
    return {
      heroEyebrow: localizedField(doc.heroEyebrow, doc.heroEyebrowEn, fallback.heroEyebrow),
      heroTitle1: localizedField(doc.heroTitle1, doc.heroTitle1En, fallback.heroTitle1),
      heroTitleAccent: localizedField(doc.heroTitleAccent, doc.heroTitleAccentEn, fallback.heroTitleAccent),
      heroTitle2: localizedField(doc.heroTitle2, doc.heroTitle2En, fallback.heroTitle2),
      heroText: localizedField(doc.heroText, doc.heroTextEn, fallback.heroText),
    };
  } catch {
    return fallback;
  }
});

export interface AboutTimelineItem {
  year: string;
  title: LocalizedText;
  text: LocalizedText;
}

export interface AboutContentData {
  eyebrow: LocalizedText;
  title1: LocalizedText;
  titleAccent: LocalizedText;
  heroText: LocalizedText;
  missionEyebrow: LocalizedText;
  missionTitle: LocalizedText;
  mission1: LocalizedText;
  mission2: LocalizedText;
  mission3: LocalizedText;
  statFounded: string;
  statPlayers: string;
  statGroups: string;
  statCapacity: string;
  storyEyebrow: LocalizedText;
  storyTitle: LocalizedText;
  storyText: LocalizedText;
  timeline: AboutTimelineItem[];
  stadiumEyebrow: LocalizedText;
  stadiumTitle: LocalizedText;
  stadiumText: LocalizedText;
  fansEyebrow: LocalizedText;
  fansTitle: LocalizedText;
  fansText: LocalizedText;
  fans1: LocalizedText;
  fans2: LocalizedText;
  quote: LocalizedText;
  quoteName: LocalizedText;
  quoteRole: LocalizedText;
}

function staticAboutContent(): AboutContentData {
  return {
    eyebrow: { el: elDict.about.eyebrow, en: enDict.about.eyebrow },
    title1: { el: elDict.about.title1, en: enDict.about.title1 },
    titleAccent: { el: elDict.about.titleAccent, en: enDict.about.titleAccent },
    heroText: { el: elDict.about.heroText, en: enDict.about.heroText },
    missionEyebrow: { el: elDict.about.missionEyebrow, en: enDict.about.missionEyebrow },
    missionTitle: { el: elDict.about.missionTitle, en: enDict.about.missionTitle },
    mission1: { el: elDict.about.mission1, en: enDict.about.mission1 },
    mission2: { el: elDict.about.mission2, en: enDict.about.mission2 },
    mission3: { el: elDict.about.mission3, en: enDict.about.mission3 },
    // Not sourced from the dictionary — these are currently hardcoded JSX
    // literals on the About page with no CMS backing at all.
    statFounded: "2026",
    statPlayers: "39",
    statGroups: "9",
    statCapacity: "12.5K",
    storyEyebrow: { el: elDict.about.storyEyebrow, en: enDict.about.storyEyebrow },
    storyTitle: { el: elDict.about.storyTitle, en: enDict.about.storyTitle },
    storyText: { el: elDict.about.storyText, en: enDict.about.storyText },
    timeline: elDict.about.timeline.map((item, i) => ({
      year: item.year,
      title: { el: item.title, en: enDict.about.timeline[i]?.title ?? item.title },
      text: { el: item.text, en: enDict.about.timeline[i]?.text ?? item.text },
    })),
    stadiumEyebrow: { el: elDict.about.stadiumEyebrow, en: enDict.about.stadiumEyebrow },
    stadiumTitle: { el: elDict.about.stadiumTitle, en: enDict.about.stadiumTitle },
    stadiumText: { el: elDict.about.stadiumText, en: enDict.about.stadiumText },
    fansEyebrow: { el: elDict.about.fansEyebrow, en: enDict.about.fansEyebrow },
    fansTitle: { el: elDict.about.fansTitle, en: enDict.about.fansTitle },
    fansText: { el: elDict.about.fansText, en: enDict.about.fansText },
    fans1: { el: elDict.about.fans1, en: enDict.about.fans1 },
    fans2: { el: elDict.about.fans2, en: enDict.about.fans2 },
    quote: { el: elDict.about.quote, en: enDict.about.quote },
    quoteName: { el: elDict.about.quoteName, en: enDict.about.quoteName },
    quoteRole: { el: elDict.about.quoteRole, en: enDict.about.quoteRole },
  };
}

/** About page narrative copy from Payload's AboutContent global. */
export const getCmsAboutContent = cache(async (): Promise<AboutContentData> => {
  const fallback = staticAboutContent();
  if (process.env.STATIC_EXPORT === "1") return fallback;
  try {
    const payload = await getPayloadClient();
    if (!payload) return fallback;
    const doc = (await payload.findGlobal({ slug: "about-content", depth: 0 })) as PayloadDoc;
    const hero = (doc.hero as PayloadDoc) ?? {};
    const mission = (doc.mission as PayloadDoc) ?? {};
    const stats = (doc.stats as PayloadDoc) ?? {};
    const story = (doc.story as PayloadDoc) ?? {};
    const stadium = (doc.stadium as PayloadDoc) ?? {};
    const fans = (doc.fans as PayloadDoc) ?? {};
    const quote = (doc.quote as PayloadDoc) ?? {};

    const timelineDocs = Array.isArray(story.timeline) ? (story.timeline as PayloadDoc[]) : [];
    const timeline = timelineDocs.length
      ? timelineDocs
          .filter((t) => t.year)
          .map((t) => ({
            year: String(t.year ?? ""),
            title: localizedField(t.title, t.titleEn, { el: "", en: "" }),
            text: localizedField(t.text, t.textEn, { el: "", en: "" }),
          }))
      : fallback.timeline;

    return {
      eyebrow: localizedField(hero.eyebrow, hero.eyebrowEn, fallback.eyebrow),
      title1: localizedField(hero.title1, hero.title1En, fallback.title1),
      titleAccent: localizedField(hero.titleAccent, hero.titleAccentEn, fallback.titleAccent),
      heroText: localizedField(hero.heroText, hero.heroTextEn, fallback.heroText),
      missionEyebrow: localizedField(mission.missionEyebrow, mission.missionEyebrowEn, fallback.missionEyebrow),
      missionTitle: localizedField(mission.missionTitle, mission.missionTitleEn, fallback.missionTitle),
      mission1: localizedField(mission.mission1, mission.mission1En, fallback.mission1),
      mission2: localizedField(mission.mission2, mission.mission2En, fallback.mission2),
      mission3: localizedField(mission.mission3, mission.mission3En, fallback.mission3),
      statFounded: typeof stats.founded === "string" && stats.founded ? stats.founded : fallback.statFounded,
      statPlayers: typeof stats.players === "string" && stats.players ? stats.players : fallback.statPlayers,
      statGroups: typeof stats.groups === "string" && stats.groups ? stats.groups : fallback.statGroups,
      statCapacity: typeof stats.capacity === "string" && stats.capacity ? stats.capacity : fallback.statCapacity,
      storyEyebrow: localizedField(story.storyEyebrow, story.storyEyebrowEn, fallback.storyEyebrow),
      storyTitle: localizedField(story.storyTitle, story.storyTitleEn, fallback.storyTitle),
      storyText: localizedField(story.storyText, story.storyTextEn, fallback.storyText),
      timeline,
      stadiumEyebrow: localizedField(stadium.stadiumEyebrow, stadium.stadiumEyebrowEn, fallback.stadiumEyebrow),
      stadiumTitle: localizedField(stadium.stadiumTitle, stadium.stadiumTitleEn, fallback.stadiumTitle),
      stadiumText: localizedField(stadium.stadiumText, stadium.stadiumTextEn, fallback.stadiumText),
      fansEyebrow: localizedField(fans.fansEyebrow, fans.fansEyebrowEn, fallback.fansEyebrow),
      fansTitle: localizedField(fans.fansTitle, fans.fansTitleEn, fallback.fansTitle),
      fansText: localizedField(fans.fansText, fans.fansTextEn, fallback.fansText),
      fans1: localizedField(fans.fans1, fans.fans1En, fallback.fans1),
      fans2: localizedField(fans.fans2, fans.fans2En, fallback.fans2),
      quote: localizedField(quote.text, quote.textEn, fallback.quote),
      quoteName: localizedField(quote.name, quote.nameEn, fallback.quoteName),
      quoteRole: localizedField(quote.role, quote.roleEn, fallback.quoteRole),
    };
  } catch {
    return fallback;
  }
});

export interface ContactDepartmentContent {
  title: LocalizedText;
  text: LocalizedText;
  email: string;
}

export interface ContactContentData {
  eyebrow: LocalizedText;
  title1: LocalizedText;
  titleAccent: LocalizedText;
  text: LocalizedText;
  departments: {
    general: ContactDepartmentContent;
    media: ContactDepartmentContent;
    sponsorships: ContactDepartmentContent;
    academy: ContactDepartmentContent;
  };
  formEyebrow: LocalizedText;
  formTitle: LocalizedText;
  formText: LocalizedText;
  detailsEyebrow: LocalizedText;
  detailsTitle: LocalizedText;
}

function staticContactContent(): ContactContentData {
  return {
    eyebrow: { el: elDict.contact.eyebrow, en: enDict.contact.eyebrow },
    title1: { el: elDict.contact.title1, en: enDict.contact.title1 },
    titleAccent: { el: elDict.contact.titleAccent, en: enDict.contact.titleAccent },
    text: { el: elDict.contact.text, en: enDict.contact.text },
    departments: {
      general: {
        title: { el: elDict.contact.departments.general.title, en: enDict.contact.departments.general.title },
        text: { el: elDict.contact.departments.general.text, en: enDict.contact.departments.general.text },
        email: "hello@pyrgosafc.com",
      },
      media: {
        title: { el: elDict.contact.departments.media.title, en: enDict.contact.departments.media.title },
        text: { el: elDict.contact.departments.media.text, en: enDict.contact.departments.media.text },
        email: "media@pyrgosafc.com",
      },
      sponsorships: {
        title: {
          el: elDict.contact.departments.sponsorships.title,
          en: enDict.contact.departments.sponsorships.title,
        },
        text: { el: elDict.contact.departments.sponsorships.text, en: enDict.contact.departments.sponsorships.text },
        email: "partners@pyrgosafc.com",
      },
      academy: {
        title: { el: elDict.contact.departments.academy.title, en: enDict.contact.departments.academy.title },
        text: { el: elDict.contact.departments.academy.text, en: enDict.contact.departments.academy.text },
        email: "academy@pyrgosafc.com",
      },
    },
    formEyebrow: { el: elDict.contact.formEyebrow, en: enDict.contact.formEyebrow },
    formTitle: { el: elDict.contact.formTitle, en: enDict.contact.formTitle },
    formText: { el: elDict.contact.formText, en: enDict.contact.formText },
    detailsEyebrow: { el: elDict.contact.detailsEyebrow, en: enDict.contact.detailsEyebrow },
    detailsTitle: { el: elDict.contact.detailsTitle, en: enDict.contact.detailsTitle },
  };
}

function contactDepartment(
  doc: PayloadDoc | undefined,
  fallback: ContactDepartmentContent
): ContactDepartmentContent {
  const d = doc ?? {};
  return {
    title: localizedField(d.title, d.titleEn, fallback.title),
    text: localizedField(d.text, d.textEn, fallback.text),
    email: typeof d.email === "string" && d.email ? d.email : fallback.email,
  };
}

/** Contact page narrative copy from Payload's ContactContent global. */
export const getCmsContactContent = cache(async (): Promise<ContactContentData> => {
  const fallback = staticContactContent();
  if (process.env.STATIC_EXPORT === "1") return fallback;
  try {
    const payload = await getPayloadClient();
    if (!payload) return fallback;
    const doc = (await payload.findGlobal({ slug: "contact-content", depth: 0 })) as PayloadDoc;
    const hero = (doc.hero as PayloadDoc) ?? {};
    const departments = (doc.departments as PayloadDoc) ?? {};
    const form = (doc.form as PayloadDoc) ?? {};
    const details = (doc.details as PayloadDoc) ?? {};

    return {
      eyebrow: localizedField(hero.eyebrow, hero.eyebrowEn, fallback.eyebrow),
      title1: localizedField(hero.title1, hero.title1En, fallback.title1),
      titleAccent: localizedField(hero.titleAccent, hero.titleAccentEn, fallback.titleAccent),
      text: localizedField(hero.text, hero.textEn, fallback.text),
      departments: {
        general: contactDepartment(departments.general as PayloadDoc, fallback.departments.general),
        media: contactDepartment(departments.media as PayloadDoc, fallback.departments.media),
        sponsorships: contactDepartment(departments.sponsorships as PayloadDoc, fallback.departments.sponsorships),
        academy: contactDepartment(departments.academy as PayloadDoc, fallback.departments.academy),
      },
      formEyebrow: localizedField(form.formEyebrow, form.formEyebrowEn, fallback.formEyebrow),
      formTitle: localizedField(form.formTitle, form.formTitleEn, fallback.formTitle),
      formText: localizedField(form.formText, form.formTextEn, fallback.formText),
      detailsEyebrow: localizedField(details.detailsEyebrow, details.detailsEyebrowEn, fallback.detailsEyebrow),
      detailsTitle: localizedField(details.detailsTitle, details.detailsTitleEn, fallback.detailsTitle),
    };
  } catch {
    return fallback;
  }
});
