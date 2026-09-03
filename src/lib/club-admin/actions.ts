"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";
import { LANGS } from "@/i18n";

function parseRichText(formData: FormData, key: string): unknown {
  const raw = formData.get(key);
  if (typeof raw !== "string" || !raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function statNumber(formData: FormData, key: string): number | undefined {
  const raw = formData.get(key);
  if (typeof raw !== "string" || raw.trim() === "") return undefined;
  const n = parseInt(raw, 10);
  return Number.isNaN(n) ? undefined : n;
}

function parseRosterStats(formData: FormData) {
  return {
    appearances: statNumber(formData, "statsAppearances") ?? 0,
    goals: statNumber(formData, "statsGoals") ?? 0,
    assists: statNumber(formData, "statsAssists") ?? 0,
    yellowCards: statNumber(formData, "statsYellowCards") ?? 0,
    redCards: statNumber(formData, "statsRedCards") ?? 0,
    minutesPlayed: statNumber(formData, "statsMinutesPlayed") ?? 0,
    cleanSheets: statNumber(formData, "statsCleanSheets"),
  };
}

// ─── Public site revalidation ──────────────────────────────────────────────
// Payload's local API writes bypass Next's fetch/route cache entirely, so a
// mutation here is invisible on the public site until something explicitly
// calls revalidatePath on the public route that renders it. Every collection
// gets an entry below, even ones with no public page today, so wiring up a
// new public consumer later can't silently reintroduce this bug.
const PUBLIC_PATHS = {
  seasons: [],
  teams: ["/men", "/women", "/futsal"],
  clubs: ["/matches", "/standings", "/men", "/women", "/futsal"],
  leagues: [],
  players: ["/men", "/women", "/futsal"],
  venues: ["/matches", "/men", "/women", "/futsal"],
  matches: ["/matches", "/men", "/women", "/futsal"],
  news: ["", "/news"],
  staff: ["/staff"],
  rosters: ["/men", "/women", "/futsal"],
  "league-tables": ["/standings"],
} satisfies Record<string, string[]>;

function revalidatePublic(
  collection: keyof typeof PUBLIC_PATHS,
  extraPaths: (string | undefined)[] = []
) {
  const paths = [...PUBLIC_PATHS[collection], ...extraPaths.filter((p): p is string => Boolean(p))];
  for (const lang of LANGS) {
    for (const path of paths) revalidatePath(`/${lang}${path}`);
  }
}

async function getAuthenticatedPayload() {
  const payload = await getPayloadClient();
  if (!payload) throw new Error("Service unavailable");

  const requestHeaders = await headers();
  const result = await payload.auth({
    headers: requestHeaders as unknown as Headers,
  });

  const user = result.user as { role?: string } | null;
  if (!user) throw new Error("Unauthorized");
  if (user.role !== "superadmin" && user.role !== "club_admin") {
    throw new Error("Forbidden");
  }

  return { payload, user };
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

export async function loginAction(_prev: unknown, formData: FormData) {
  const email = (formData.get("email") as string) ?? "";
  const password = (formData.get("password") as string) ?? "";

  if (!email || !password) {
    return { error: "Συμπληρώστε email και κωδικό πρόσβασης." };
  }

  const payload = await getPayloadClient();
  if (!payload) return { error: "Η υπηρεσία δεν είναι διαθέσιμη." };

  try {
    const result = await payload.login({
      collection: "users",
      data: { email, password },
    });

    if (!result.user || !result.token) {
      return { error: "Λανθασμένο email ή κωδικός πρόσβασης." };
    }

    const role = (result.user as { role?: string }).role;
    if (role !== "superadmin" && role !== "club_admin") {
      return { error: "Δεν έχετε δικαίωμα πρόσβασης στο admin panel." };
    }

    const cookieStore = await cookies();
    cookieStore.set("payload-token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true };
  } catch {
    return { error: "Λανθασμένο email ή κωδικός πρόσβασης." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("payload-token");
  redirect("/club-admin/login");
}

// ─── SEASONS ─────────────────────────────────────────────────────────────────

export async function createSeasonAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const title = (formData.get("title") as string)?.trim();
    const startYear = parseInt(formData.get("startYear") as string);
    const endYear = parseInt(formData.get("endYear") as string);
    const isCurrent = formData.get("isCurrent") === "on";
    const status = (formData.get("status") as string) || "draft";
    const description = (formData.get("description") as string)?.trim();

    if (!title) return { error: "Ο τίτλος είναι υποχρεωτικός." };
    if (!startYear || !endYear) return { error: "Τα έτη έναρξης και λήξης είναι υποχρεωτικά." };
    if (endYear <= startYear) return { error: "Το έτος λήξης πρέπει να είναι μεγαλύτερο από το έτος έναρξης." };

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    await payload.create({
      collection: "seasons",
      data: { title, slug, startYear, endYear, isCurrent, status, description },
    });

    revalidatePath("/club-admin/seasons");
    revalidatePublic("seasons");
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Σφάλμα αποθήκευσης.";
    return { error: msg };
  }
}

export async function updateSeasonAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const id = formData.get("id") as string;
    const title = (formData.get("title") as string)?.trim();
    const startYear = parseInt(formData.get("startYear") as string);
    const endYear = parseInt(formData.get("endYear") as string);
    const isCurrent = formData.get("isCurrent") === "on";
    const status = (formData.get("status") as string) || "draft";
    const description = (formData.get("description") as string)?.trim();

    if (!id) return { error: "Δεν βρέθηκε αναγνωριστικό." };
    if (!title) return { error: "Ο τίτλος είναι υποχρεωτικός." };
    if (endYear <= startYear) return { error: "Το έτος λήξης πρέπει να είναι μεγαλύτερο." };

    await payload.update({
      collection: "seasons",
      id,
      data: { title, startYear, endYear, isCurrent, status, description },
    });

    revalidatePath("/club-admin/seasons");
    revalidatePublic("seasons");
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Σφάλμα ενημέρωσης.";
    return { error: msg };
  }
}

export async function deleteSeasonAction(id: string) {
  try {
    const { payload, user } = await getAuthenticatedPayload();
    // Manual (docs/CLUB_ADMIN_MANUAL.md §15): deletion is reserved for
    // superadmin. club_admin passes the general auth check above but must be
    // rejected here — never delete on their behalf.
    if (user.role !== "superadmin") throw new Error("Forbidden");
    await payload.delete({ collection: "seasons", id });
    revalidatePath("/club-admin/seasons");
    revalidatePublic("seasons");
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Σφάλμα διαγραφής.";
    return { error: msg };
  }
}

/**
 * Dedicated (not the generic deleteDocumentAction below) because that
 * helper revalidates `/club-admin/${collection}`, but this collection's
 * club-admin route is `/club-admin/standings`, not `/club-admin/league-tables`.
 */
export async function deleteLeagueTableAction(id: string) {
  try {
    const { payload, user } = await getAuthenticatedPayload();
    if (user.role !== "superadmin") throw new Error("Forbidden");
    await payload.delete({ collection: "league-tables", id });
    revalidatePath("/club-admin/standings");
    revalidatePublic("league-tables");
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Σφάλμα διαγραφής.";
    return { error: msg };
  }
}

// ─── GENERIC DELETE ───────────────────────────────────────────────────────────

export async function deleteDocumentAction(
  collection: "seasons" | "teams" | "leagues" | "players" | "venues" | "matches" | "news" | "staff",
  id: string
) {
  try {
    const { payload, user } = await getAuthenticatedPayload();
    // Manual (docs/CLUB_ADMIN_MANUAL.md §15): deletion is reserved for
    // superadmin. club_admin passes the general auth check above but must be
    // rejected here — never delete on their behalf.
    if (user.role !== "superadmin") throw new Error("Forbidden");
    await payload.delete({ collection, id });
    revalidatePath(`/club-admin/${collection}`);
    revalidatePublic(collection);
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Σφάλμα διαγραφής.";
    return { error: msg };
  }
}

// ─── TEAMS ───────────────────────────────────────────────────────────────────

export async function createTeamAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const name = (formData.get("name") as string)?.trim();
    if (!name) return { error: "Το όνομα είναι υποχρεωτικό." };

    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    await payload.create({
      collection: "teams",
      data: {
        name,
        nameEn: formData.get("nameEn") as string,
        slug,
        category: formData.get("category") as string,
        ageGroup: formData.get("ageGroup") as string,
        status: (formData.get("status") as string) || "active",
      },
    });
    revalidatePath("/club-admin/teams");
    revalidatePublic("teams");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

export async function updateTeamAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const id = formData.get("id") as string;
    const name = (formData.get("name") as string)?.trim();
    if (!id) return { error: "Δεν βρέθηκε αναγνωριστικό." };
    if (!name) return { error: "Το όνομα είναι υποχρεωτικό." };

    await payload.update({
      collection: "teams",
      id,
      data: {
        name,
        nameEn: formData.get("nameEn") as string,
        category: formData.get("category") as string,
        ageGroup: formData.get("ageGroup") as string,
        status: (formData.get("status") as string) || "active",
        description: parseRichText(formData, "description"),
      },
    });
    revalidatePath("/club-admin/teams");
    revalidatePath(`/club-admin/teams/${id}`);
    revalidatePublic("teams");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

// ─── LEAGUES ─────────────────────────────────────────────────────────────────

export async function createLeagueAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const name = (formData.get("name") as string)?.trim();
    if (!name) return { error: "Το όνομα είναι υποχρεωτικό." };

    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    await payload.create({
      collection: "leagues",
      data: {
        name,
        nameEn: formData.get("nameEn") as string,
        slug,
        type: (formData.get("type") as string) || "league",
        category: formData.get("category") as string,
        organizer: formData.get("organizer") as string,
        country: (formData.get("country") as string) || "Ελλάδα",
        region: formData.get("region") as string,
      },
    });
    revalidatePath("/club-admin/leagues");
    revalidatePublic("leagues");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

export async function updateLeagueAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const id = formData.get("id") as string;
    const name = (formData.get("name") as string)?.trim();
    if (!id) return { error: "Δεν βρέθηκε αναγνωριστικό." };
    if (!name) return { error: "Το όνομα είναι υποχρεωτικό." };

    await payload.update({
      collection: "leagues",
      id,
      data: {
        name,
        nameEn: formData.get("nameEn") as string,
        type: (formData.get("type") as string) || "league",
        category: formData.get("category") as string,
        organizer: formData.get("organizer") as string,
        country: (formData.get("country") as string) || "Ελλάδα",
        region: formData.get("region") as string,
      },
    });
    revalidatePath("/club-admin/leagues");
    revalidatePath(`/club-admin/leagues/${id}`);
    revalidatePublic("leagues");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

// ─── CLUBS ───────────────────────────────────────────────────────────────────
// Rival clubs: created once here, then selected by relationship from Matches
// (opponentClub) and Standings (rows.club) for any season — see Clubs.ts.

export async function createClubAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const name = (formData.get("name") as string)?.trim();
    if (!name) return { error: "Το όνομα είναι υποχρεωτικό." };

    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const logoIdRaw = (formData.get("logo") as string)?.trim();

    const club = await payload.create({
      collection: "clubs",
      data: {
        name,
        nameEn: formData.get("nameEn") as string,
        slug,
        logo: logoIdRaw ? Number(logoIdRaw) : undefined,
        status: (formData.get("status") as string) || "active",
      },
    });
    revalidatePath("/club-admin/clubs");
    revalidatePublic("clubs");
    return { success: true, id: club.id };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

export async function updateClubAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const id = formData.get("id") as string;
    const name = (formData.get("name") as string)?.trim();
    if (!id) return { error: "Δεν βρέθηκε αναγνωριστικό." };
    if (!name) return { error: "Το όνομα είναι υποχρεωτικό." };

    const logoIdRaw = (formData.get("logo") as string)?.trim();

    await payload.update({
      collection: "clubs",
      id,
      data: {
        name,
        nameEn: formData.get("nameEn") as string,
        logo: logoIdRaw ? Number(logoIdRaw) : null,
        status: (formData.get("status") as string) || "active",
      },
    });
    revalidatePath("/club-admin/clubs");
    revalidatePath(`/club-admin/clubs/${id}`);
    revalidatePublic("clubs");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

// ─── PLAYERS ─────────────────────────────────────────────────────────────────

export async function createPlayerAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const firstName = (formData.get("firstName") as string)?.trim();
    const lastName = (formData.get("lastName") as string)?.trim();
    if (!firstName || !lastName) return { error: "Το όνομα και το επώνυμο είναι υποχρεωτικά." };

    const firstNameEn = (formData.get("firstNameEn") as string)?.trim() || firstName;
    const lastNameEn = (formData.get("lastNameEn") as string)?.trim() || lastName;

    const slug = `${firstNameEn}-${lastNameEn}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    await payload.create({
      collection: "players",
      data: {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        firstNameEn,
        lastNameEn,
        slug,
        position: formData.get("position") as string,
        nationality: (formData.get("nationality") as string) || "Ελληνική",
        nationalityEn: (formData.get("nationalityEn") as string) || "Greek",
        status: (formData.get("status") as string) || "active",
        preferredFoot: formData.get("preferredFoot") as string,
      },
    });
    revalidatePath("/club-admin/players");
    revalidatePublic("players", [`/roster/${slug}`]);
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

// ─── VENUES ──────────────────────────────────────────────────────────────────

export async function createVenueAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const name = (formData.get("name") as string)?.trim();
    if (!name) return { error: "Το όνομα είναι υποχρεωτικό." };

    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    await payload.create({
      collection: "venues",
      data: {
        name,
        nameEn: formData.get("nameEn") as string,
        slug,
        type: (formData.get("type") as string) || "stadium",
        city: (formData.get("city") as string) || "Πύργος",
        country: (formData.get("country") as string) || "Ελλάδα",
        address: formData.get("address") as string,
        capacity: parseInt(formData.get("capacity") as string) || undefined,
      },
    });
    revalidatePath("/club-admin/venues");
    revalidatePublic("venues");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

export async function updateVenueAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const id = formData.get("id") as string;
    const name = (formData.get("name") as string)?.trim();
    if (!id) return { error: "Δεν βρέθηκε αναγνωριστικό." };
    if (!name) return { error: "Το όνομα είναι υποχρεωτικό." };

    await payload.update({
      collection: "venues",
      id,
      data: {
        name,
        nameEn: formData.get("nameEn") as string,
        type: (formData.get("type") as string) || "stadium",
        city: (formData.get("city") as string) || "Πύργος",
        country: (formData.get("country") as string) || "Ελλάδα",
        address: formData.get("address") as string,
        capacity: parseInt(formData.get("capacity") as string) || undefined,
        description: parseRichText(formData, "description"),
      },
    });
    revalidatePath("/club-admin/venues");
    revalidatePath(`/club-admin/venues/${id}`);
    revalidatePublic("venues");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

// ─── MATCHES ─────────────────────────────────────────────────────────────────

// Every match is PYRGOS AFC vs one opponent — never club vs club — so exactly
// one of the two side selects must be "PYRGOS"; the other is either a
// registered Clubs record (its name is derived by a beforeValidate hook on
// Matches — see Clubs.ts/Matches.ts) or manual text for a one-off opponent
// outside the registry.
function deriveMatchSides(
  formData: FormData
):
  | { error: string }
  | { isHomeMatch: boolean; opponentClub: number | null; homeTeamName?: string; awayTeamName?: string } {
  const homeSelect = formData.get("homeSelect") as string;
  const awaySelect = formData.get("awaySelect") as string;
  const homeManual = (formData.get("homeManual") as string)?.trim();
  const awayManual = (formData.get("awayManual") as string)?.trim();

  if (!homeSelect || !awaySelect) {
    return { error: "Επιλέξτε γηπεδούχο και φιλοξενούμενο." };
  }
  const homeIsPyrgos = homeSelect === "PYRGOS";
  const awayIsPyrgos = awaySelect === "PYRGOS";
  if (homeIsPyrgos === awayIsPyrgos) {
    return { error: "Ακριβώς μία από τις δύο ομάδες πρέπει να είναι ο PYRGOS AFC." };
  }
  const isHomeMatch = homeIsPyrgos;
  const opponentSelect = isHomeMatch ? awaySelect : homeSelect;
  const opponentManual = isHomeMatch ? awayManual : homeManual;

  if (opponentSelect === "__manual__") {
    if (!opponentManual) return { error: "Συμπληρώστε το όνομα της αντίπαλης ομάδας." };
    return {
      isHomeMatch,
      opponentClub: null,
      homeTeamName: isHomeMatch ? "PYRGOS AFC" : opponentManual,
      awayTeamName: isHomeMatch ? opponentManual : "PYRGOS AFC",
    };
  }
  return { isHomeMatch, opponentClub: Number(opponentSelect) };
}

export async function createMatchAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const matchDate = formData.get("matchDate") as string;
    const seasonRaw = formData.get("season") as string;
    const teamRaw = formData.get("team") as string;
    const leagueRaw = formData.get("league") as string;
    const venueRaw = (formData.get("venue") as string)?.trim();

    if (!matchDate || !seasonRaw || !teamRaw || !leagueRaw) {
      return { error: "Συμπληρώστε όλα τα υποχρεωτικά πεδία." };
    }
    const sides = deriveMatchSides(formData);
    if ("error" in sides) return { error: sides.error };

    await payload.create({
      collection: "matches",
      data: {
        ...sides,
        matchDate,
        season: Number(seasonRaw),
        team: Number(teamRaw),
        league: Number(leagueRaw),
        venue: venueRaw ? Number(venueRaw) : undefined,
        matchType: (formData.get("matchType") as string) || "league",
        kickoffTime: formData.get("kickoffTime") as string,
        matchweek: formData.get("matchweek") as string,
        status: (formData.get("status") as string) || "scheduled",
      },
    });
    revalidatePath("/club-admin/matches");
    revalidatePublic("matches");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

export async function updateMatchAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const id = formData.get("id") as string;
    const matchDate = formData.get("matchDate") as string;
    const seasonRaw = formData.get("season") as string;
    const teamRaw = formData.get("team") as string;
    const leagueRaw = formData.get("league") as string;
    const venueRaw = (formData.get("venue") as string)?.trim();

    if (!id) return { error: "Δεν βρέθηκε αναγνωριστικό." };
    if (!matchDate || !seasonRaw || !teamRaw || !leagueRaw) {
      return { error: "Συμπληρώστε όλα τα υποχρεωτικά πεδία." };
    }
    const sides = deriveMatchSides(formData);
    if ("error" in sides) return { error: sides.error };

    const homeScoreRaw = parseInt(formData.get("homeScore") as string);
    const awayScoreRaw = parseInt(formData.get("awayScore") as string);

    await payload.update({
      collection: "matches",
      id,
      data: {
        ...sides,
        matchDate,
        season: Number(seasonRaw),
        team: Number(teamRaw),
        league: Number(leagueRaw),
        venue: venueRaw ? Number(venueRaw) : null,
        matchType: (formData.get("matchType") as string) || "league",
        kickoffTime: formData.get("kickoffTime") as string,
        matchweek: formData.get("matchweek") as string,
        status: (formData.get("status") as string) || "scheduled",
        homeScore: isNaN(homeScoreRaw) ? undefined : homeScoreRaw,
        awayScore: isNaN(awayScoreRaw) ? undefined : awayScoreRaw,
      },
    });
    revalidatePath("/club-admin/matches");
    revalidatePath(`/club-admin/matches/${id}`);
    revalidatePublic("matches");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

// ─── NEWS ─────────────────────────────────────────────────────────────────────

export async function createNewsAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const title = (formData.get("title") as string)?.trim();
    if (!title) return { error: "Ο τίτλος είναι υποχρεωτικός." };

    const titleEn = (formData.get("titleEn") as string)?.trim();
    const slug = (titleEn || title)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      + `-${Date.now()}`;

    const featuredImageIdRaw = (formData.get("featuredImage") as string)?.trim();
    const featuredImageId = featuredImageIdRaw ? Number(featuredImageIdRaw) : undefined;

    await payload.create({
      collection: "news",
      data: {
        title,
        titleEn,
        slug,
        excerpt: formData.get("excerpt") as string,
        excerptEn: formData.get("excerptEn") as string,
        content: parseRichText(formData, "content"),
        contentEn: parseRichText(formData, "contentEn"),
        author: (formData.get("author") as string) || "Ομάδα Επικοινωνίας",
        authorEn: (formData.get("authorEn") as string) || "Club Media Team",
        status: (formData.get("status") as string) || "draft",
        publishedDate: formData.get("publishedDate") as string || undefined,
        featuredImage: featuredImageId,
        featured: formData.get("featured") === "on",
      },
    });
    revalidatePath("/club-admin/news");
    revalidatePublic("news", [`/news/${slug}`]);
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

// ─── STAFF ───────────────────────────────────────────────────────────────────

export async function createStaffAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const firstName = (formData.get("firstName") as string)?.trim();
    const lastName = (formData.get("lastName") as string)?.trim();
    if (!firstName || !lastName) return { error: "Το όνομα και το επώνυμο είναι υποχρεωτικά." };

    const firstNameEn = (formData.get("firstNameEn") as string)?.trim() || firstName;
    const lastNameEn = (formData.get("lastNameEn") as string)?.trim() || lastName;

    const slug = `${firstNameEn}-${lastNameEn}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    await payload.create({
      collection: "staff",
      data: {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        firstNameEn,
        lastNameEn,
        slug,
        roleTitle: formData.get("roleTitle") as string,
        roleTitleEn: formData.get("roleTitleEn") as string,
        status: (formData.get("status") as string) || "active",
      },
    });
    revalidatePath("/club-admin/staff");
    revalidatePublic("staff");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

export async function updateStaffAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const id = (formData.get("id") as string)?.trim();
    const firstName = (formData.get("firstName") as string)?.trim();
    const lastName = (formData.get("lastName") as string)?.trim();
    if (!id) return { error: "Δεν βρέθηκε αναγνωριστικό." };
    if (!firstName || !lastName) return { error: "Το όνομα και το επώνυμο είναι υποχρεωτικά." };

    await payload.update({
      collection: "staff",
      id,
      data: {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        firstNameEn: (formData.get("firstNameEn") as string)?.trim() || undefined,
        lastNameEn: (formData.get("lastNameEn") as string)?.trim() || undefined,
        roleTitle: formData.get("roleTitle") as string,
        roleTitleEn: formData.get("roleTitleEn") as string,
        status: (formData.get("status") as string) || "active",
        biography: parseRichText(formData, "biography"),
        biographyEn: parseRichText(formData, "biographyEn"),
      },
    });
    revalidatePath("/club-admin/staff");
    revalidatePath(`/club-admin/staff/${id}`);
    revalidatePublic("staff");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

// ─── ROSTERS ─────────────────────────────────────────────────────────────────

export async function createRosterAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const season = formData.get("season") as string;
    const team = formData.get("team") as string;
    const player = formData.get("player") as string;

    if (!season || !team || !player) {
      return { error: "Η σεζόν, η ομάδα και ο παίκτης είναι υποχρεωτικά." };
    }

    await payload.create({
      collection: "rosters",
      data: {
        season,
        team,
        player,
        shirtNumber: parseInt(formData.get("shirtNumber") as string) || undefined,
        status: (formData.get("status") as string) || "active",
        isCaptain: formData.get("isCaptain") === "on",
        isViceCaptain: formData.get("isViceCaptain") === "on",
        joinedDate: formData.get("joinedDate") as string || undefined,
        stats: parseRosterStats(formData),
      },
    });
    revalidatePath("/club-admin/rosters");
    revalidatePublic("rosters");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

export async function updateRosterAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const id = formData.get("id") as string;
    const season = formData.get("season") as string;
    const team = formData.get("team") as string;
    const player = formData.get("player") as string;

    if (!id) return { error: "Δεν βρέθηκε αναγνωριστικό." };
    if (!season || !team || !player) {
      return { error: "Η σεζόν, η ομάδα και ο παίκτης είναι υποχρεωτικά." };
    }

    await payload.update({
      collection: "rosters",
      id,
      data: {
        season,
        team,
        player,
        shirtNumber: parseInt(formData.get("shirtNumber") as string) || undefined,
        status: (formData.get("status") as string) || "active",
        isCaptain: formData.get("isCaptain") === "on",
        isViceCaptain: formData.get("isViceCaptain") === "on",
        joinedDate: (formData.get("joinedDate") as string) || undefined,
        stats: parseRosterStats(formData),
      },
    });
    revalidatePath("/club-admin/rosters");
    revalidatePath(`/club-admin/rosters/${id}`);
    revalidatePublic("rosters");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

// ─── NEWS STATUS ──────────────────────────────────────────────────────────────

export async function publishNewsAction(id: string, publish: boolean) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const doc = await payload.update({
      collection: "news",
      id,
      data: { status: publish ? "published" : "draft" },
    });
    revalidatePath("/club-admin/news");
    revalidatePublic("news", [typeof doc.slug === "string" ? `/news/${doc.slug}` : undefined]);
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Σφάλμα.";
    return { error: msg };
  }
}

// ─── PLAYER UPDATE ────────────────────────────────────────────────────────────

export async function updatePlayerAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const id = (formData.get("id") as string)?.trim();
    if (!id) return { error: "Δεν βρέθηκε αναγνωριστικό." };

    const firstName = (formData.get("firstName") as string)?.trim();
    const lastName = (formData.get("lastName") as string)?.trim();
    if (!firstName || !lastName) return { error: "Το όνομα και το επώνυμο είναι υποχρεωτικά." };

    const profileImageIdRaw = (formData.get("profileImage") as string)?.trim();
    const profileImageId = profileImageIdRaw ? Number(profileImageIdRaw) : null;
    const heightRaw = parseInt(formData.get("heightCm") as string);
    const weightRaw = parseInt(formData.get("weightKg") as string);
    const shirtRaw = parseInt(formData.get("defaultShirtNumber") as string);

    const updated = await payload.update({
      collection: "players",
      id,
      data: {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        firstNameEn: (formData.get("firstNameEn") as string)?.trim() || undefined,
        lastNameEn: (formData.get("lastNameEn") as string)?.trim() || undefined,
        position: formData.get("position") as string,
        nationality: (formData.get("nationality") as string) || "Ελληνική",
        nationalityEn: (formData.get("nationalityEn") as string) || "Greek",
        preferredFoot: (formData.get("preferredFoot") as string) || null,
        status: (formData.get("status") as string) || "active",
        defaultShirtNumber: isNaN(shirtRaw) ? undefined : shirtRaw,
        heightCm: isNaN(heightRaw) ? undefined : heightRaw,
        weightKg: isNaN(weightRaw) ? undefined : weightRaw,
        profileImage: profileImageId,
        biography: parseRichText(formData, "biography"),
        biographyEn: parseRichText(formData, "biographyEn"),
      },
    });

    revalidatePath("/club-admin/players");
    revalidatePath(`/club-admin/players/${id}`);
    const updatedSlug = typeof updated?.slug === "string" ? updated.slug : undefined;
    revalidatePublic("players", [updatedSlug && `/roster/${updatedSlug}`]);
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

// ─── NEWS UPDATE ──────────────────────────────────────────────────────────────

export async function updateNewsAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const id = (formData.get("id") as string)?.trim();
    if (!id) return { error: "Δεν βρέθηκε αναγνωριστικό." };

    const title = (formData.get("title") as string)?.trim();
    if (!title) return { error: "Ο τίτλος είναι υποχρεωτικός." };

    const featuredImageIdRaw = (formData.get("featuredImage") as string)?.trim();
    const featuredImageId = featuredImageIdRaw ? Number(featuredImageIdRaw) : null;
    const readingTimeRaw = parseInt(formData.get("readingTime") as string);
    const publishedDate = (formData.get("publishedDate") as string)?.trim() || undefined;

    const doc = await payload.update({
      collection: "news",
      id,
      data: {
        title,
        titleEn: (formData.get("titleEn") as string)?.trim() || undefined,
        excerpt: (formData.get("excerpt") as string)?.trim() || undefined,
        excerptEn: (formData.get("excerptEn") as string)?.trim() || undefined,
        content: parseRichText(formData, "content"),
        contentEn: parseRichText(formData, "contentEn"),
        author: (formData.get("author") as string)?.trim() || "Ομάδα Επικοινωνίας",
        authorEn: (formData.get("authorEn") as string)?.trim() || "Club Media Team",
        status: (formData.get("status") as string) || "draft",
        publishedDate,
        readingTime: isNaN(readingTimeRaw) ? 3 : readingTimeRaw,
        featuredImage: featuredImageId,
        featured: formData.get("featured") === "on",
      },
    });

    revalidatePath("/club-admin/news");
    revalidatePath(`/club-admin/news/${id}`);
    revalidatePublic("news", [typeof doc.slug === "string" ? `/news/${doc.slug}` : undefined]);
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

// ─── LEAGUE TABLES (standings) ─────────────────────────────────────────────
// One document = one whole table for a league+season; `rows` is a repeatable
// array edited together in the club-admin UI (see EditLeagueTableForm), sent
// here serialized as JSON in a single hidden field since FormData has no
// native way to carry an array of objects.

interface LeagueTableRowInput {
  club?: number;
  isPyrgos: boolean;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  notes?: string;
}

function parseLeagueTableRows(formData: FormData): LeagueTableRowInput[] | null {
  const raw = formData.get("rowsJson");
  if (typeof raw !== "string") return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map((r) => ({
      club: r.club ? Number(r.club) : undefined,
      isPyrgos: Boolean(r.isPyrgos),
      played: Number(r.played) || 0,
      won: Number(r.won) || 0,
      drawn: Number(r.drawn) || 0,
      lost: Number(r.lost) || 0,
      goalsFor: Number(r.goalsFor) || 0,
      goalsAgainst: Number(r.goalsAgainst) || 0,
      points: Number(r.points) || 0,
      notes: r.notes ? String(r.notes).trim() : undefined,
    }));
  } catch {
    return null;
  }
}

export async function createLeagueTableAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const seasonRaw = formData.get("season") as string;
    const leagueRaw = formData.get("league") as string;
    if (!seasonRaw || !leagueRaw) {
      return { error: "Η σεζόν και η διοργάνωση είναι υποχρεωτικές." };
    }

    // Relationship fields require a number, not the string FormData always
    // gives us — Payload's numeric-ID validator rejects "42" as invalid.
    const created = await payload.create({
      collection: "league-tables",
      data: { season: Number(seasonRaw), league: Number(leagueRaw), rows: [] },
    });
    revalidatePath("/club-admin/standings");
    revalidatePublic("league-tables");
    return { success: true, id: String(created.id) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

export async function updateLeagueTableAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const id = formData.get("id") as string;
    if (!id) return { error: "Δεν βρέθηκε αναγνωριστικό." };
    const seasonRaw = formData.get("season") as string;
    const leagueRaw = formData.get("league") as string;
    if (!seasonRaw || !leagueRaw) {
      return { error: "Η σεζόν και η διοργάνωση είναι υποχρεωτικές." };
    }
    const rows = parseLeagueTableRows(formData);
    if (rows === null) return { error: "Μη έγκυρα δεδομένα ομάδων." };
    if (rows.some((r) => !r.isPyrgos && !r.club)) {
      return { error: "Κάθε ομάδα (εκτός του PYRGOS AFC) πρέπει να έχει επιλεγμένο σύλλογο." };
    }

    await payload.update({
      collection: "league-tables",
      id,
      data: { season: Number(seasonRaw), league: Number(leagueRaw), rows },
    });
    revalidatePath("/club-admin/standings");
    revalidatePath(`/club-admin/standings/${id}`);
    revalidatePublic("league-tables");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

// ─── SETTINGS GLOBALS (ClubInfo / SeoDefaults / SiteSettings) ──────────────
// These are Payload "globals" — one document each, edited in place, never
// created/deleted. They back nearly every public page (Footer, About,
// Contact, JSON-LD, sitewide toggles), so a save revalidates every page
// under each locale's root layout rather than a hand-picked path list.

function revalidateEverything() {
  for (const lang of LANGS) revalidatePath(`/${lang}`, "layout");
}

function parseJsonArray<T>(formData: FormData, key: string): T[] | null {
  const raw = formData.get(key);
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : null;
  } catch {
    return null;
  }
}

interface ClubValueInput {
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
}

interface ClubSponsorInput {
  name: string;
  tier: string;
  tagline?: string;
  taglineEn?: string;
  url?: string;
  logo?: string;
}

export async function updateClubInfoAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();

    const values = parseJsonArray<ClubValueInput>(formData, "valuesJson");
    const sponsors = parseJsonArray<ClubSponsorInput>(formData, "sponsorsJson");
    if (values === null || sponsors === null) return { error: "Μη έγκυρα δεδομένα." };
    if (values.some((v) => !v.title?.trim())) return { error: "Κάθε αξία πρέπει να έχει τίτλο." };
    if (sponsors.some((s) => !s.name?.trim())) return { error: "Κάθε χορηγός πρέπει να έχει όνομα." };

    const logoIdRaw = (formData.get("logo") as string)?.trim();

    await payload.updateGlobal({
      slug: "club-info",
      data: {
        name: (formData.get("name") as string)?.trim(),
        nameEn: (formData.get("nameEn") as string)?.trim(),
        shortName: (formData.get("shortName") as string)?.trim(),
        founded: statNumber(formData, "founded"),
        logo: logoIdRaw ? Number(logoIdRaw) : null,
        colors: {
          primary: (formData.get("colorsPrimary") as string)?.trim(),
          secondary: (formData.get("colorsSecondary") as string)?.trim(),
          accent: (formData.get("colorsAccent") as string)?.trim(),
        },
        stadium: {
          name: (formData.get("stadiumName") as string)?.trim(),
          nameEn: (formData.get("stadiumNameEn") as string)?.trim(),
          capacity: (formData.get("stadiumCapacity") as string)?.trim(),
          opened: statNumber(formData, "stadiumOpened"),
        },
        contact: {
          email: (formData.get("contactEmail") as string)?.trim(),
          phone: (formData.get("contactPhone") as string)?.trim(),
          address: (formData.get("contactAddress") as string)?.trim(),
          addressEn: (formData.get("contactAddressEn") as string)?.trim(),
          city: (formData.get("contactCity") as string)?.trim(),
          postalCode: (formData.get("contactPostalCode") as string)?.trim(),
        },
        socialMedia: {
          instagram: (formData.get("socialInstagram") as string)?.trim(),
          twitter: (formData.get("socialTwitter") as string)?.trim(),
          facebook: (formData.get("socialFacebook") as string)?.trim(),
          youtube: (formData.get("socialYoutube") as string)?.trim(),
          tiktok: (formData.get("socialTiktok") as string)?.trim(),
        },
        about: parseRichText(formData, "about"),
        aboutEn: parseRichText(formData, "aboutEn"),
        values,
        sponsors: sponsors.map((s) => ({ ...s, logo: s.logo ? Number(s.logo) : undefined })),
      },
    });
    revalidateEverything();
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

export async function updateSeoDefaultsAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const ogImageIdRaw = (formData.get("defaultOgImage") as string)?.trim();
    const orgLogoIdRaw = (formData.get("organizationLogo") as string)?.trim();

    await payload.updateGlobal({
      slug: "seo-defaults",
      data: {
        titleTemplate: (formData.get("titleTemplate") as string)?.trim(),
        defaultTitle: (formData.get("defaultTitle") as string)?.trim(),
        defaultDescription: (formData.get("defaultDescription") as string)?.trim(),
        defaultOgImage: ogImageIdRaw ? Number(ogImageIdRaw) : null,
        twitterHandle: (formData.get("twitterHandle") as string)?.trim(),
        robots: {
          index: formData.get("robotsIndex") === "on",
          follow: formData.get("robotsFollow") === "on",
          additionalDirectives: (formData.get("robotsAdditional") as string)?.trim() || undefined,
        },
        structuredData: {
          organizationName: (formData.get("orgName") as string)?.trim(),
          organizationUrl: (formData.get("orgUrl") as string)?.trim(),
          organizationLogo: orgLogoIdRaw ? Number(orgLogoIdRaw) : null,
          foundingYear: statNumber(formData, "orgFoundingYear"),
          sport: (formData.get("orgSport") as string)?.trim(),
          location: (formData.get("orgLocation") as string)?.trim(),
        },
      },
    });
    revalidateEverything();
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

export async function updateSiteSettingsAction(_prev: unknown, formData: FormData) {
  try {
    const { payload, user } = await getAuthenticatedPayload();
    // Mirrors SiteSettings.ts's Payload access.update = isSuperAdmin. These
    // are sitewide kill-switches (maintenance mode, bilingual toggle), kept
    // superadmin-only even though club_admin can reach the other settings
    // screens (ClubInfo, SeoDefaults).
    if (user.role !== "superadmin") throw new Error("Forbidden");

    const ogImageIdRaw = (formData.get("defaultOgImage") as string)?.trim();

    await payload.updateGlobal({
      slug: "site-settings",
      data: {
        siteName: (formData.get("siteName") as string)?.trim(),
        siteUrl: (formData.get("siteUrl") as string)?.trim(),
        maintenanceMode: formData.get("maintenanceMode") === "on",
        bilingualEnabled: formData.get("bilingualEnabled") === "on",
        defaultSeoTitle: (formData.get("defaultSeoTitle") as string)?.trim(),
        defaultSeoDescription: (formData.get("defaultSeoDescription") as string)?.trim(),
        defaultOgImage: ogImageIdRaw ? Number(ogImageIdRaw) : null,
        googleAnalyticsId: (formData.get("googleAnalyticsId") as string)?.trim() || undefined,
        cookieBannerEnabled: formData.get("cookieBannerEnabled") === "on",
        nav: {
          announcementBar: (formData.get("announcementBar") as string)?.trim() || undefined,
          announcementBarEnabled: formData.get("announcementBarEnabled") === "on",
        },
      },
    });
    revalidateEverything();
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

// ─── PAGE CONTENT GLOBALS (Home / About / Contact narrative copy) ─────────
// Fixed fields per page, narrative content only — see the comment atop each
// globals/*Content.ts file for exactly what's in and out of scope. Same
// empty-field-falls-back-to-dictionary behavior as everything else here.

function field(formData: FormData, key: string): string {
  return ((formData.get(key) as string) ?? "").trim();
}

export async function updateHomeContentAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    await payload.updateGlobal({
      slug: "home-content",
      data: {
        heroEyebrow: field(formData, "heroEyebrow"),
        heroEyebrowEn: field(formData, "heroEyebrowEn"),
        heroTitle1: field(formData, "heroTitle1"),
        heroTitle1En: field(formData, "heroTitle1En"),
        heroTitleAccent: field(formData, "heroTitleAccent"),
        heroTitleAccentEn: field(formData, "heroTitleAccentEn"),
        heroTitle2: field(formData, "heroTitle2"),
        heroTitle2En: field(formData, "heroTitle2En"),
        heroText: field(formData, "heroText"),
        heroTextEn: field(formData, "heroTextEn"),
      },
    });
    revalidateEverything();
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

interface AboutTimelineInput {
  year: string;
  title: string;
  titleEn?: string;
  text: string;
  textEn?: string;
}

export async function updateAboutContentAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const timeline = parseJsonArray<AboutTimelineInput>(formData, "timelineJson");
    if (timeline === null) return { error: "Μη έγκυρα δεδομένα χρονολογίου." };
    if (timeline.some((t) => !t.year?.trim() || !t.title?.trim())) {
      return { error: "Κάθε γεγονός του χρονολογίου πρέπει να έχει έτος και τίτλο." };
    }

    await payload.updateGlobal({
      slug: "about-content",
      data: {
        hero: {
          eyebrow: field(formData, "heroEyebrow"),
          eyebrowEn: field(formData, "heroEyebrowEn"),
          title1: field(formData, "heroTitle1"),
          title1En: field(formData, "heroTitle1En"),
          titleAccent: field(formData, "heroTitleAccent"),
          titleAccentEn: field(formData, "heroTitleAccentEn"),
          heroText: field(formData, "heroText"),
          heroTextEn: field(formData, "heroTextEn"),
        },
        mission: {
          missionEyebrow: field(formData, "missionEyebrow"),
          missionEyebrowEn: field(formData, "missionEyebrowEn"),
          missionTitle: field(formData, "missionTitle"),
          missionTitleEn: field(formData, "missionTitleEn"),
          mission1: field(formData, "mission1"),
          mission1En: field(formData, "mission1En"),
          mission2: field(formData, "mission2"),
          mission2En: field(formData, "mission2En"),
          mission3: field(formData, "mission3"),
          mission3En: field(formData, "mission3En"),
        },
        stats: {
          founded: field(formData, "statFounded"),
          players: field(formData, "statPlayers"),
          groups: field(formData, "statGroups"),
          capacity: field(formData, "statCapacity"),
        },
        story: {
          storyEyebrow: field(formData, "storyEyebrow"),
          storyEyebrowEn: field(formData, "storyEyebrowEn"),
          storyTitle: field(formData, "storyTitle"),
          storyTitleEn: field(formData, "storyTitleEn"),
          storyText: field(formData, "storyText"),
          storyTextEn: field(formData, "storyTextEn"),
          timeline,
        },
        stadium: {
          stadiumEyebrow: field(formData, "stadiumEyebrow"),
          stadiumEyebrowEn: field(formData, "stadiumEyebrowEn"),
          stadiumTitle: field(formData, "stadiumTitle"),
          stadiumTitleEn: field(formData, "stadiumTitleEn"),
          stadiumText: field(formData, "stadiumText"),
          stadiumTextEn: field(formData, "stadiumTextEn"),
        },
        fans: {
          fansEyebrow: field(formData, "fansEyebrow"),
          fansEyebrowEn: field(formData, "fansEyebrowEn"),
          fansTitle: field(formData, "fansTitle"),
          fansTitleEn: field(formData, "fansTitleEn"),
          fansText: field(formData, "fansText"),
          fansTextEn: field(formData, "fansTextEn"),
          fans1: field(formData, "fans1"),
          fans1En: field(formData, "fans1En"),
          fans2: field(formData, "fans2"),
          fans2En: field(formData, "fans2En"),
        },
        quote: {
          text: field(formData, "quoteText"),
          textEn: field(formData, "quoteTextEn"),
          name: field(formData, "quoteName"),
          nameEn: field(formData, "quoteNameEn"),
          role: field(formData, "quoteRole"),
          roleEn: field(formData, "quoteRoleEn"),
        },
      },
    });
    revalidateEverything();
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

function contactDepartmentData(formData: FormData, prefix: string) {
  return {
    title: field(formData, `${prefix}Title`),
    titleEn: field(formData, `${prefix}TitleEn`),
    text: field(formData, `${prefix}Text`),
    textEn: field(formData, `${prefix}TextEn`),
    email: field(formData, `${prefix}Email`),
  };
}

export async function updateContactContentAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();

    await payload.updateGlobal({
      slug: "contact-content",
      data: {
        hero: {
          eyebrow: field(formData, "heroEyebrow"),
          eyebrowEn: field(formData, "heroEyebrowEn"),
          title1: field(formData, "heroTitle1"),
          title1En: field(formData, "heroTitle1En"),
          titleAccent: field(formData, "heroTitleAccent"),
          titleAccentEn: field(formData, "heroTitleAccentEn"),
          text: field(formData, "heroText"),
          textEn: field(formData, "heroTextEn"),
        },
        departments: {
          general: contactDepartmentData(formData, "deptGeneral"),
          media: contactDepartmentData(formData, "deptMedia"),
          sponsorships: contactDepartmentData(formData, "deptSponsorships"),
          academy: contactDepartmentData(formData, "deptAcademy"),
        },
        form: {
          formEyebrow: field(formData, "formEyebrow"),
          formEyebrowEn: field(formData, "formEyebrowEn"),
          formTitle: field(formData, "formTitle"),
          formTitleEn: field(formData, "formTitleEn"),
          formText: field(formData, "formText"),
          formTextEn: field(formData, "formTextEn"),
        },
        details: {
          detailsEyebrow: field(formData, "detailsEyebrow"),
          detailsEyebrowEn: field(formData, "detailsEyebrowEn"),
          detailsTitle: field(formData, "detailsTitle"),
          detailsTitleEn: field(formData, "detailsTitleEn"),
        },
      },
    });
    revalidateEverything();
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}
