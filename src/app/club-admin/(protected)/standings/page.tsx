import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { AdminTable } from "@/components/club-admin/AdminTable";

export const metadata: Metadata = { title: "Βαθμολογία" };

export default async function StandingsPage() {
  const { payload } = await requireClubAdmin();
  const res = await payload.find({
    collection: "league-tables",
    sort: "-updatedAt",
    limit: 200,
    depth: 1,
  });

  type LeagueTableDoc = {
    id: string;
    rows?: unknown[];
    updatedAt?: string;
    season?: { title?: string } | number | null;
    league?: { name?: string } | number | null;
  };

  return (
    <AdminTable
      title="Βαθμολογία"
      rows={res.docs as LeagueTableDoc[]}
      newHref="/club-admin/standings/new"
      editHref={(r) => `/club-admin/standings/${r.id}`}
      columns={[
        {
          key: "league",
          label: "Διοργάνωση",
          render: (r) => (typeof r.league === "object" ? r.league?.name ?? "—" : "—"),
        },
        {
          key: "season",
          label: "Σεζόν",
          render: (r) => (typeof r.season === "object" ? r.season?.title ?? "—" : "—"),
        },
        {
          key: "rows",
          label: "Ομάδες",
          render: (r) => String(r.rows?.length ?? 0),
        },
        {
          key: "updatedAt",
          label: "Ενημερώθηκε",
          render: (r) => (r.updatedAt ? new Date(r.updatedAt).toLocaleDateString("el-GR") : "—"),
        },
      ]}
      emptyMessage="Δεν βρέθηκαν πίνακες βαθμολογίας."
    />
  );
}
