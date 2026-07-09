import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { AdminTable } from "@/components/club-admin/AdminTable";
import { StatusBadge } from "@/components/club-admin/StatusBadge";

export const metadata: Metadata = { title: "Ομάδες" };

export default async function TeamsPage() {
  const { payload } = await requireClubAdmin();
  const res = await payload.find({ collection: "teams", sort: "sortOrder", limit: 100 });

  type TeamDoc = { id: string; name: string; category: string; status: string; sortOrder: number };

  return (
    <AdminTable
      title="Ομάδες"
      rows={res.docs as TeamDoc[]}
      newHref="/club-admin/teams/new"
      editHref={(r) => `/club-admin/teams/${r.id}`}
      columns={[
        { key: "name", label: "Ομάδα" },
        { key: "category", label: "Κατηγορία", render: (r) => <StatusBadge value={r.category} /> },
        { key: "status", label: "Κατάσταση", render: (r) => <StatusBadge value={r.status} /> },
      ]}
      emptyMessage="Δεν βρέθηκαν ομάδες."
    />
  );
}
