import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { AdminTable } from "@/components/club-admin/AdminTable";
import { StatusBadge } from "@/components/club-admin/StatusBadge";

export const metadata: Metadata = { title: "Ρόστερ" };

export default async function RostersPage() {
  const { payload } = await requireClubAdmin();
  const res = await payload.find({
    collection: "rosters",
    depth: 2,
    sort: "-createdAt",
    limit: 200,
  });

  type RosterDoc = {
    id: string;
    player: { fullName?: string } | null;
    team: { name?: string } | null;
    season: { title?: string } | null;
    shirtNumber: number;
    status: string;
  };

  const rows = res.docs as RosterDoc[];

  return (
    <AdminTable
      title="Ρόστερ"
      rows={rows}
      newHref="/club-admin/rosters/new"
      editHref={(r) => `/club-admin/rosters/${r.id}`}
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
      emptyMessage="Δεν βρέθηκαν εγγραφές ρόστερ."
    />
  );
}
