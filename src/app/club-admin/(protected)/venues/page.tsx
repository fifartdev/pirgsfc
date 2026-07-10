import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { AdminTable } from "@/components/club-admin/AdminTable";

export const metadata: Metadata = { title: "Γήπεδα" };

export default async function VenuesPage() {
  const { payload } = await requireClubAdmin();
  const res = await payload.find({ collection: "venues", sort: "name", limit: 100 });

  type VenueDoc = { id: string; name: string; type: string; city: string; capacity: number };

  return (
    <AdminTable
      title="Γήπεδα & Εγκαταστάσεις"
      rows={res.docs as VenueDoc[]}
      newHref="/club-admin/venues/new"
      editHref={(r) => `/club-admin/venues/${r.id}`}
      columns={[
        { key: "name", label: "Γήπεδο" },
        { key: "type", label: "Τύπος" },
        { key: "city", label: "Πόλη" },
        {
          key: "capacity",
          label: "Χωρητικότητα",
          render: (r) => (r.capacity ? r.capacity.toLocaleString("el-GR") : "—"),
        },
      ]}
      emptyMessage="Δεν βρέθηκαν γήπεδα."
    />
  );
}
