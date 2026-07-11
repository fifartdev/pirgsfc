"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";

function parseRichText(formData: FormData, key: string): unknown {
  const raw = formData.get(key);
  if (typeof raw !== "string" || !raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
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
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Σφάλμα ενημέρωσης.";
    return { error: msg };
  }
}

export async function deleteSeasonAction(id: string) {
  try {
    const { payload } = await getAuthenticatedPayload();
    await payload.delete({ collection: "seasons", id });
    revalidatePath("/club-admin/seasons");
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
    const { payload } = await getAuthenticatedPayload();
    await payload.delete({ collection, id });
    revalidatePath(`/club-admin/${collection}`);
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
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

// ─── MATCHES ─────────────────────────────────────────────────────────────────

export async function createMatchAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const homeTeamName = (formData.get("homeTeamName") as string)?.trim();
    const awayTeamName = (formData.get("awayTeamName") as string)?.trim();
    const matchDate = formData.get("matchDate") as string;
    const season = formData.get("season") as string;
    const team = formData.get("team") as string;
    const league = formData.get("league") as string;
    const venue = (formData.get("venue") as string)?.trim() || undefined;

    if (!homeTeamName || !awayTeamName || !matchDate || !season || !team || !league) {
      return { error: "Συμπληρώστε όλα τα υποχρεωτικά πεδία." };
    }

    await payload.create({
      collection: "matches",
      data: {
        homeTeamName,
        awayTeamName,
        matchDate,
        season,
        team,
        league,
        venue,
        matchType: (formData.get("matchType") as string) || "league",
        kickoffTime: formData.get("kickoffTime") as string,
        matchweek: formData.get("matchweek") as string,
        isHomeMatch: formData.get("isHomeMatch") === "on",
        status: (formData.get("status") as string) || "scheduled",
      },
    });
    revalidatePath("/club-admin/matches");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

export async function updateMatchAction(_prev: unknown, formData: FormData) {
  try {
    const { payload } = await getAuthenticatedPayload();
    const id = formData.get("id") as string;
    const homeTeamName = (formData.get("homeTeamName") as string)?.trim();
    const awayTeamName = (formData.get("awayTeamName") as string)?.trim();
    const matchDate = formData.get("matchDate") as string;
    const season = formData.get("season") as string;
    const team = formData.get("team") as string;
    const league = formData.get("league") as string;
    const venue = (formData.get("venue") as string)?.trim() || undefined;

    if (!id) return { error: "Δεν βρέθηκε αναγνωριστικό." };
    if (!homeTeamName || !awayTeamName || !matchDate || !season || !team || !league) {
      return { error: "Συμπληρώστε όλα τα υποχρεωτικά πεδία." };
    }

    const homeScoreRaw = parseInt(formData.get("homeScore") as string);
    const awayScoreRaw = parseInt(formData.get("awayScore") as string);

    await payload.update({
      collection: "matches",
      id,
      data: {
        homeTeamName,
        awayTeamName,
        matchDate,
        season,
        team,
        league,
        venue,
        matchType: (formData.get("matchType") as string) || "league",
        kickoffTime: formData.get("kickoffTime") as string,
        matchweek: formData.get("matchweek") as string,
        isHomeMatch: formData.get("isHomeMatch") === "on",
        status: (formData.get("status") as string) || "scheduled",
        homeScore: isNaN(homeScoreRaw) ? undefined : homeScoreRaw,
        awayScore: isNaN(awayScoreRaw) ? undefined : awayScoreRaw,
      },
    });
    revalidatePath("/club-admin/matches");
    revalidatePath(`/club-admin/matches/${id}`);
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

    const featuredImageId = (formData.get("featuredImage") as string)?.trim() || undefined;

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
      },
    });
    revalidatePath("/club-admin/news");
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
      },
    });
    revalidatePath("/club-admin/rosters");
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
      },
    });
    revalidatePath("/club-admin/rosters");
    revalidatePath(`/club-admin/rosters/${id}`);
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}

// ─── NEWS STATUS ──────────────────────────────────────────────────────────────

export async function publishNewsAction(id: string, publish: boolean) {
  try {
    const { payload } = await getAuthenticatedPayload();
    await payload.update({
      collection: "news",
      id,
      data: { status: publish ? "published" : "draft" },
    });
    revalidatePath("/club-admin/news");
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

    const profileImageId = (formData.get("profileImage") as string)?.trim() || null;
    const heightRaw = parseInt(formData.get("heightCm") as string);
    const weightRaw = parseInt(formData.get("weightKg") as string);
    const shirtRaw = parseInt(formData.get("defaultShirtNumber") as string);

    await payload.update({
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

    const featuredImageId = (formData.get("featuredImage") as string)?.trim() || null;
    const readingTimeRaw = parseInt(formData.get("readingTime") as string);
    const publishedDate = (formData.get("publishedDate") as string)?.trim() || undefined;

    await payload.update({
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
      },
    });

    revalidatePath("/club-admin/news");
    revalidatePath(`/club-admin/news/${id}`);
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Σφάλμα αποθήκευσης." };
  }
}
