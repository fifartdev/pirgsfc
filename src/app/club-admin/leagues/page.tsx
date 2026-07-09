import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { AdminTable } from "@/components/club-admin/AdminTable";
import { StatusBadge } from "@/components/club-admin/StatusBadge";

export const metadata: Metadata = { title: "Διοργανώσεις" };

export default async function LeaguesPage() {
  const { payload } = await requireClubAdmin();
  const res = await payload.find({ collection: "leagues", sort: "name", limit: 100 });

  type LeagueDoc = { id: string; name: string; type: string; category: string; country: string };

  return (
    <AdminTable
      title="Διοργανώσεις"
      rows={res.docs as LeagueDoc[]}
      newHref="/club-admin/leagues/new"
      editHref={(r) => `/club-admin/leagues/${r.id}`}
      columns={[
        { key: "name", label: "Διοργάνωση" },
        { key: "type", label: "Τύπος" },
        { key: "category", label: "Κατηγορία", render: (r) => <StatusBadge value={r.category} /> },
        { key: "country", label: "Χώρα" },
      ]}
      emptyMessage="Δεν βρέθηκαν διοργανώσεις."
    />
  );
}
