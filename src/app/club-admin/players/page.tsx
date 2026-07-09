import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { AdminTable } from "@/components/club-admin/AdminTable";
import { StatusBadge } from "@/components/club-admin/StatusBadge";

export const metadata: Metadata = { title: "Παίκτες" };

const POSITION_LABELS: Record<string, string> = {
  goalkeeper: "Τερματοφύλακας",
  defender: "Αμυντικός",
  midfielder: "Μέσος",
  forward: "Επιθετικός",
};

export default async function PlayersPage() {
  const { payload } = await requireClubAdmin();
  const res = await payload.find({ collection: "players", sort: "lastName", limit: 200 });

  type PlayerDoc = {
    id: string;
    fullName: string;
    position: string;
    nationality: string;
    status: string;
  };

  return (
    <AdminTable
      title="Παίκτες"
      rows={res.docs as PlayerDoc[]}
      newHref="/club-admin/players/new"
      editHref={(r) => `/club-admin/players/${r.id}`}
      columns={[
        { key: "fullName", label: "Όνομα" },
        {
          key: "position",
          label: "Θέση",
          render: (r) => POSITION_LABELS[r.position] ?? r.position,
        },
        { key: "nationality", label: "Εθνικότητα" },
        { key: "status", label: "Κατάσταση", render: (r) => <StatusBadge value={r.status} /> },
      ]}
      emptyMessage="Δεν βρέθηκαν παίκτες."
    />
  );
}
