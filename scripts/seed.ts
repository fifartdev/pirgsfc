/**
 * Seed script — PYRGOS AFC
 *
 * Migrates the static frontend data into Payload CMS collections.
 * Idempotent: checks by slug before creating to avoid duplicates.
 *
 * Run:  npm run seed
 */

import { getPayload, type Where } from "payload";
import config from "../payload.config";
import { players } from "../src/data/players";
import { staff } from "../src/data/staff";
import { matches } from "../src/data/matches";
import { newsArticles } from "../src/data/news";

async function findOrCreate<T extends { id: string | number }>(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: Parameters<typeof payload.find>[0]["collection"],
  where: Where,
  data: Record<string, unknown>
): Promise<T> {
  const existing = await payload.find({ collection, where, limit: 1 });
  if (existing.docs.length > 0) return existing.docs[0] as T;
  return (await payload.create({ collection, data })) as T;
}

async function seed() {
  console.log("🌱  Connecting to Payload CMS…");
  const payload = await getPayload({ config });
  console.log("✅  Connected.\n");

  // ─── SUPERADMIN ────────────────────────────────────────────────────────────
  console.log("👤  Creating superadmin user…");
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@pyrgosafc.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const existingAdmin = await payload.find({
    collection: "users",
    where: { email: { equals: adminEmail } },
    limit: 1,
  });

  if (existingAdmin.docs.length === 0) {
    await payload.create({
      collection: "users",
      data: {
        email: adminEmail,
        password: adminPassword,
        firstName: "Admin",
        lastName: "PYRGOS AFC",
        role: "superadmin",
      },
    });
    console.log(`   ✓ Superadmin created: ${adminEmail}`);
  } else {
    console.log(`   ○ Superadmin already exists: ${adminEmail}`);
  }

  // Demo club admin
  const clubAdminEmail = process.env.SEED_CLUB_ADMIN_EMAIL ?? "club@pyrgosafc.com";
  const existingClubAdmin = await payload.find({
    collection: "users",
    where: { email: { equals: clubAdminEmail } },
    limit: 1,
  });
  if (existingClubAdmin.docs.length === 0) {
    await payload.create({
      collection: "users",
      data: {
        email: clubAdminEmail,
        password: process.env.SEED_CLUB_ADMIN_PASSWORD ?? "ClubAdmin123!",
        firstName: "Club",
        lastName: "Admin",
        role: "club_admin",
      },
    });
    console.log(`   ✓ Club admin created: ${clubAdminEmail}`);
  } else {
    console.log(`   ○ Club admin already exists: ${clubAdminEmail}`);
  }

  // ─── SEASON ────────────────────────────────────────────────────────────────
  console.log("\n📅  Seeding current season…");
  const season = await findOrCreate(payload, "seasons", { slug: { equals: "2025-2026" } }, {
    title: "2025-2026",
    slug: "2025-2026",
    startYear: 2025,
    endYear: 2026,
    startDate: "2025-09-01",
    endDate: "2026-05-31",
    isCurrent: true,
    status: "active",
    description: "Πρώτη επαγγελματική σεζόν του PYRGOS AFC.",
  });
  console.log(`   ✓ Season: ${(season as unknown as { title: string }).title}`);

  // ─── VENUE ─────────────────────────────────────────────────────────────────
  console.log("\n🏟️   Seeding venues…");
  const stadiumVenue = await findOrCreate(payload, "venues", { slug: { equals: "stadio-pyrgou" } }, {
    name: "Στάδιο Πύργου",
    nameEn: "Pyrgos Stadium",
    slug: "stadio-pyrgou",
    type: "stadium",
    city: "Πύργος",
    country: "Ελλάδα",
    capacity: 12500,
    surface: "natural_grass",
  });
  console.log(`   ✓ Venue: ${(stadiumVenue as unknown as { name: string }).name}`);

  const hallVenue = await findOrCreate(payload, "venues", { slug: { equals: "kleisto-pyrgou" } }, {
    name: "Κλειστό Πύργου",
    nameEn: "Pyrgos Indoor Hall",
    slug: "kleisto-pyrgou",
    type: "indoor",
    city: "Πύργος",
    country: "Ελλάδα",
    surface: "parquet",
  });
  console.log(`   ✓ Venue: ${(hallVenue as unknown as { name: string }).name}`);

  // ─── TEAMS ─────────────────────────────────────────────────────────────────
  console.log("\n⚽  Seeding teams…");
  const teamDefs = [
    { name: "PYRGOS AFC Άντρες", nameEn: "PYRGOS AFC Men", slug: "pyrgos-afc-men", category: "men", sortOrder: 1 },
    { name: "PYRGOS AFC Γυναίκες", nameEn: "PYRGOS AFC Women", slug: "pyrgos-afc-women", category: "women", sortOrder: 2 },
    { name: "PYRGOS AFC Futsal", nameEn: "PYRGOS AFC Futsal", slug: "pyrgos-afc-futsal", category: "futsal", sortOrder: 3 },
    { name: "PYRGOS AFC Κ19", nameEn: "PYRGOS AFC U19", slug: "pyrgos-afc-u19", category: "youth", ageGroup: "U19", sortOrder: 4 },
    { name: "PYRGOS AFC Κ17", nameEn: "PYRGOS AFC U17", slug: "pyrgos-afc-u17", category: "youth", ageGroup: "U17", sortOrder: 5 },
    { name: "PYRGOS AFC Κ15", nameEn: "PYRGOS AFC U15", slug: "pyrgos-afc-u15", category: "youth", ageGroup: "U15", sortOrder: 6 },
    { name: "PYRGOS AFC Κ12", nameEn: "PYRGOS AFC U12", slug: "pyrgos-afc-u12", category: "academy", ageGroup: "U12", sortOrder: 7 },
    { name: "PYRGOS AFC Κ10", nameEn: "PYRGOS AFC U10", slug: "pyrgos-afc-u10", category: "academy", ageGroup: "U10", sortOrder: 8 },
  ];

  const teams: Record<string, { id: string | number }> = {};
  for (const t of teamDefs) {
    const team = await findOrCreate(payload, "teams", { slug: { equals: t.slug } }, { ...t, status: "active" });
    teams[t.slug] = team as { id: string | number };
    console.log(`   ✓ Team: ${t.name}`);
  }

  // ─── LEAGUES ───────────────────────────────────────────────────────────────
  console.log("\n🏆  Seeding leagues…");
  const leagueDefs = [
    { name: "Περιφερειακό Πρωτάθλημα Άντρων", nameEn: "Regional Men's League", slug: "perifereiako-andron", type: "league", category: "men", country: "Ελλάδα" },
    { name: "Κύπελλο Ανδρών", nameEn: "Men's Cup", slug: "kypello-andron", type: "cup", category: "men", country: "Ελλάδα" },
    { name: "Πρωτάθλημα Γυναικών", nameEn: "Women's League", slug: "protathliema-gynaikon", type: "league", category: "women", country: "Ελλάδα" },
    { name: "Πρωτάθλημα Futsal", nameEn: "Futsal League", slug: "protathliema-futsal", type: "league", category: "futsal", country: "Ελλάδα" },
  ];

  const leagues: Record<string, { id: string | number }> = {};
  for (const l of leagueDefs) {
    const league = await findOrCreate(payload, "leagues", { slug: { equals: l.slug } }, l);
    leagues[l.slug] = league as { id: string | number };
    console.log(`   ✓ League: ${l.name}`);
  }

  // ─── PLAYERS ───────────────────────────────────────────────────────────────
  console.log("\n👕  Seeding players from static data…");

  // players imported statically at top

  const createdPlayers: Record<string, { id: string | number }> = {};
  for (const p of players) {
    const player = await findOrCreate(
      payload,
      "players",
      { slug: { equals: p.slug } },
      {
        firstName: p.firstName.el,
        lastName: p.lastName.el,
        fullName: `${p.firstName.el} ${p.lastName.el}`,
        firstNameEn: p.firstName.en,
        lastNameEn: p.lastName.en,
        slug: p.slug,
        position:
          p.position === "Goalkeeper"
            ? "goalkeeper"
            : p.position === "Defender"
            ? "defender"
            : p.position === "Midfielder"
            ? "midfielder"
            : "forward",
        nationality: p.nationality.el,
        nationalityEn: p.nationality.en,
        preferredFoot: p.preferredFoot.toLowerCase() as "right" | "left" | "both",
        defaultShirtNumber: p.number,
        status: "active",
      }
    );
    createdPlayers[p.slug] = player as { id: string | number };
  }
  console.log(`   ✓ ${Object.keys(createdPlayers).length} players seeded.`);

  // ─── STAFF ─────────────────────────────────────────────────────────────────
  console.log("\n🧑‍💼  Seeding staff from static data…");

  // staff imported statically at top

  const createdStaff: Record<string, { id: string | number }> = {};
  for (const s of staff) {
    const staffMember = await findOrCreate(
      payload,
      "staff",
      { slug: { equals: s.slug } },
      {
        firstName: s.name.el.split(" ")[0],
        lastName: s.name.el.split(" ").slice(1).join(" "),
        fullName: s.name.el,
        firstNameEn: s.name.en.split(" ")[0],
        lastNameEn: s.name.en.split(" ").slice(1).join(" "),
        slug: s.slug,
        roleTitle: s.role.el,
        roleTitleEn: s.role.en,
        specialty: s.specialty.el,
        specialtyEn: s.specialty.en,
        yearsOfExperience: s.yearsOfExperience,
        status: "active",
      }
    );
    createdStaff[s.slug] = staffMember as { id: string | number };
  }
  console.log(`   ✓ ${Object.keys(createdStaff).length} staff members seeded.`);

  // ─── ROSTERS ───────────────────────────────────────────────────────────────
  console.log("\n📋  Seeding rosters…");

  const menTeamId = teams["pyrgos-afc-men"]?.id;
  const womenTeamId = teams["pyrgos-afc-women"]?.id;
  const futsalTeamId = teams["pyrgos-afc-futsal"]?.id;
  const seasonId = (season as { id: string | number }).id;

  let rosterCount = 0;
  for (const p of players) {
    const teamId =
      p.department === "men"
        ? menTeamId
        : p.department === "women"
        ? womenTeamId
        : futsalTeamId;
    if (!teamId || !createdPlayers[p.slug]) continue;

    const existing = await payload.find({
      collection: "rosters",
      where: {
        and: [
          { player: { equals: createdPlayers[p.slug].id } },
          { season: { equals: seasonId } },
          { team: { equals: teamId } },
        ],
      },
      limit: 1,
    });
    if (existing.docs.length === 0) {
      await payload.create({
        collection: "rosters",
        data: {
          season: seasonId,
          team: teamId,
          player: createdPlayers[p.slug].id,
          shirtNumber: p.number,
          status: "active",
          isCaptain: Boolean(p.captain),
        },
      });
      rosterCount++;
    }
  }
  console.log(`   ✓ ${rosterCount} roster entries created.`);

  // ─── MATCHES ───────────────────────────────────────────────────────────────
  console.log("\n📆  Seeding matches from static data…");

  // matches imported statically at top
  const leagueMap: Record<string, { id: string | number }> = {
    league: leagues["perifereiako-andron"] ?? leagues["protathliema-gynaikon"] ?? leagues["protathliema-futsal"],
    cup: leagues["kypello-andron"],
    friendly: leagues["perifereiako-andron"],
  };
  const womenLeague = leagues["protathliema-gynaikon"];
  const futsalLeague = leagues["protathliema-futsal"];

  let matchCount = 0;
  for (const m of matches) {
    const existing = await payload.find({
      collection: "matches",
      where: { and: [{ matchDate: { equals: m.date } }, { homeTeamName: { equals: m.homeTeam.el } }] },
      limit: 1,
    });
    if (existing.docs.length > 0) continue;

    const teamId =
      m.department === "men"
        ? menTeamId
        : m.department === "women"
        ? womenTeamId
        : futsalTeamId;

    const leagueId =
      m.department === "women"
        ? womenLeague?.id
        : m.department === "futsal"
        ? futsalLeague?.id
        : leagueMap[m.competition]?.id ?? leagues["perifereiako-andron"]?.id;

    if (!teamId || !leagueId) continue;

    await payload.create({
      collection: "matches",
      data: {
        season: seasonId,
        team: teamId,
        league: leagueId,
        venue: m.homeIsPyrgos
          ? m.department === "futsal"
            ? hallVenue.id
            : stadiumVenue.id
          : undefined,
        matchType: m.competition,
        homeTeamName: m.homeTeam.el,
        homeTeamNameEn: m.homeTeam.en,
        awayTeamName: m.awayTeam.el,
        awayTeamNameEn: m.awayTeam.en,
        isHomeMatch: m.homeIsPyrgos,
        homeScore: m.homeScore ?? undefined,
        awayScore: m.awayScore ?? undefined,
        matchDate: m.date,
        kickoffTime: m.time,
        matchweek: m.matchweek?.el,
        matchweekEn: m.matchweek?.en,
        status: m.status === "upcoming" ? "scheduled" : m.status,
      },
    });
    matchCount++;
  }
  console.log(`   ✓ ${matchCount} matches created.`);

  // ─── NEWS ──────────────────────────────────────────────────────────────────
  console.log("\n📰  Seeding news articles from static data…");

  // newsArticles imported statically at top

  let newsCount = 0;
  for (const article of newsArticles) {
    const existing = await payload.find({
      collection: "news",
      where: { slug: { equals: article.slug } },
      limit: 1,
    });
    if (existing.docs.length > 0) continue;

    await payload.create({
      collection: "news",
      data: {
        title: article.title.el,
        titleEn: article.title.en,
        slug: article.slug,
        excerpt: article.excerpt.el,
        excerptEn: article.excerpt.en,
        author: article.author.el,
        authorEn: article.author.en,
        publishedDate: article.date,
        readingTime: article.readingTime,
        status: "published",
      },
    });
    newsCount++;
  }
  console.log(`   ✓ ${newsCount} news articles created.`);

  // ─── STAFF ASSIGNMENTS ─────────────────────────────────────────────────────
  console.log("\n📌  Seeding staff assignments…");
  let assignCount = 0;
  for (const s of staff) {
    const staffMember = createdStaff[s.slug];
    if (!staffMember || !menTeamId) continue;

    const existing = await payload.find({
      collection: "staff-assignments",
      where: {
        and: [
          { staff: { equals: staffMember.id } },
          { season: { equals: seasonId } },
        ],
      },
      limit: 1,
    });
    if (existing.docs.length > 0) continue;

    await payload.create({
      collection: "staff-assignments",
      data: {
        staff: staffMember.id,
        team: menTeamId,
        season: seasonId,
        roleForSeason: s.role.el,
        roleForSeasonEn: s.role.en,
        status: "active",
      },
    });
    assignCount++;
  }
  console.log(`   ✓ ${assignCount} staff assignments created.`);

  console.log("\n🎉  Seed completed successfully!\n");
  console.log("   Next steps:");
  console.log(`   • Superadmin login: ${adminEmail} / ${adminPassword}`);
  console.log(`   • Club admin login: ${clubAdminEmail}`);
  console.log("   • Change passwords immediately in production!\n");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
