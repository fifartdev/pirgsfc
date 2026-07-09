import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { AdminTable } from "@/components/club-admin/AdminTable";
import { StatusBadge } from "@/components/club-admin/StatusBadge";

export const metadata: Metadata = { title: "Αγώνες" };

export default async function MatchesPage() {
  const { payload } = await requireClubAdmin();
  const res = await payload.find({
    collection: "matches",
    sort: "-matchDate",
    limit: 100,
    depth: 1,
  });

  type MatchDoc = {
    id: string;
    homeTeamName: string;
    awayTeamName: string;
    matchDate: string;
    status: string;
    homeScore: number | null;
    awayScore: number | null;
    team: { name?: string } | null;
  };

  const rows = res.docs as MatchDoc[];

  return (
    <AdminTable
      title="Αγώνες"
      rows={rows}
      newHref="/club-admin/matches/new"
      editHref={(r) => `/club-admin/matches/${r.id}`}
      columns={[
        {
          key: "matchDate",
          label: "Ημερομηνία",
          render: (r) =>
            r.matchDate
              ? new Date(r.matchDate).toLocaleDateString("el-GR")
              : "—",
        },
        {
          key: "homeTeamName",
          label: "Αγώνας",
          render: (r) =>
            `${r.homeTeamName ?? "?"} — ${r.awayTeamName ?? "?"}`,
        },
        {
          key: "homeScore",
          label: "Σκορ",
          render: (r) =>
            r.homeScore != null && r.awayScore != null
              ? `${r.homeScore}–${r.awayScore}`
              : "—",
        },
        {
          key: "team",
          label: "Ομάδα",
          render: (r) => r.team?.name ?? "—",
        },
        {
          key: "status",
          label: "Κατάσταση",
          render: (r) => <StatusBadge value={r.status} />,
        },
      ]}
      emptyMessage="Δεν βρέθηκαν αγώνες."
    />
  );
}
