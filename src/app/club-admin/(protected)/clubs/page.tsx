import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { AdminTable } from "@/components/club-admin/AdminTable";

export const metadata: Metadata = { title: "Σύλλογοι" };

export default async function ClubsPage() {
  const { payload } = await requireClubAdmin();
  const res = await payload.find({ collection: "clubs", sort: "name", limit: 200 });

  type ClubDoc = { id: string; name: string; nameEn?: string; status: string };

  return (
    <AdminTable
      title="Σύλλογοι"
      rows={res.docs as ClubDoc[]}
      newHref="/club-admin/clubs/new"
      editHref={(r) => `/club-admin/clubs/${r.id}`}
      columns={[
        { key: "name", label: "Όνομα (ελλ.)" },
        { key: "nameEn", label: "Όνομα (αγγλ.)", render: (r) => r.nameEn || "—" },
        {
          key: "status",
          label: "Κατάσταση",
          render: (r) => (r.status === "active" ? "Ενεργός" : "Αρχειοθετημένος"),
        },
      ]}
      emptyMessage="Δεν βρέθηκαν σύλλογοι."
    />
  );
}
