import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { AdminTable } from "@/components/club-admin/AdminTable";

export const metadata: Metadata = { title: "Βαθμολογία" };

export default async function StandingsPage() {
  const { payload } = await requireClubAdmin();
  const res = await payload.find({
    collection: "standings",
    sort: "position",
    limit: 200,
    depth: 1,
  });

  type StandingDoc = {
    id: string;
    teamName: string;
    isPyrgos?: boolean;
    position: number;
    points: number;
    season?: { title?: string } | number | null;
    league?: { name?: string } | number | null;
  };

  return (
    <AdminTable
      title="Βαθμολογία"
      rows={res.docs as StandingDoc[]}
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
        { key: "position", label: "Θέση" },
        {
          key: "teamName",
          label: "Ομάδα",
          render: (r) => (r.isPyrgos ? `${r.teamName} (PYRGOS AFC)` : r.teamName),
        },
        { key: "points", label: "Βαθμοί" },
      ]}
      emptyMessage="Δεν βρέθηκαν εγγραφές βαθμολογίας."
    />
  );
}
