import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { AdminTable } from "@/components/club-admin/AdminTable";
import { StatusBadge } from "@/components/club-admin/StatusBadge";
import { RosterFilters } from "@/components/club-admin/RosterFilters";

export const metadata: Metadata = { title: "Ρόστερ" };

interface PageProps {
  searchParams: Promise<{ team?: string; season?: string }>;
}

export default async function RostersPage({ searchParams }: PageProps) {
  const { payload } = await requireClubAdmin();
  const { team, season } = await searchParams;

  // "A roster" isn't its own document — it's the implicit set of rows for a
  // given team+season pair, so filtering "to a single roster" means filtering
  // this join table by those two relationship fields.
  const where: Record<string, { equals: number }> = {};
  if (team) where.team = { equals: Number(team) };
  if (season) where.season = { equals: Number(season) };

  const [res, teamsRes, seasonsRes] = await Promise.all([
    payload.find({
      collection: "rosters",
      depth: 2,
      sort: "-createdAt",
      limit: 200,
      where: Object.keys(where).length > 0 ? where : undefined,
    }),
    payload.find({ collection: "teams", sort: "name", limit: 100 }),
    payload.find({ collection: "seasons", sort: "-startYear", limit: 50 }),
  ]);

  type RosterDoc = {
    id: string;
    player: { fullName?: string } | null;
    team: { name?: string } | null;
    season: { title?: string } | null;
    shirtNumber: number;
    status: string;
  };

  const rows = res.docs as RosterDoc[];

  const teamOptions = (teamsRes.docs as { id: string | number; name: string }[]).map((t) => ({
    value: String(t.id),
    label: t.name,
  }));
  const seasonOptions = (seasonsRes.docs as { id: string | number; title: string }[]).map((s) => ({
    value: String(s.id),
    label: s.title,
  }));

  return (
    <AdminTable
      title="Ρόστερ"
      rows={rows}
      newHref="/club-admin/rosters/new"
      editHref={(r) => `/club-admin/rosters/${r.id}`}
      filters={<RosterFilters teamOptions={teamOptions} seasonOptions={seasonOptions} />}
      columns={[
        {
          key: "player",
          label: "Παίκτης",
          render: (r) => r.player?.fullName ?? "—",
        },
        {
          key: "team",
          label: "Ομάδα",
          render: (r) => r.team?.name ?? "—",
        },
        {
          key: "season",
          label: "Σεζόν",
          render: (r) => r.season?.title ?? "—",
        },
        {
          key: "shirtNumber",
          label: "Νο.",
          render: (r) => (r.shirtNumber ? `#${r.shirtNumber}` : "—"),
        },
        { key: "status", label: "Κατάσταση", render: (r) => <StatusBadge value={r.status} /> },
      ]}
      emptyMessage={
        team || season
          ? "Δεν βρέθηκαν εγγραφές για αυτό το φίλτρο."
          : "Δεν βρέθηκαν εγγραφές ρόστερ."
      }
    />
  );
}
