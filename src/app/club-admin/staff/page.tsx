import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { AdminTable } from "@/components/club-admin/AdminTable";
import { StatusBadge } from "@/components/club-admin/StatusBadge";

export const metadata: Metadata = { title: "Προσωπικό" };

export default async function StaffPage() {
  const { payload } = await requireClubAdmin();
  const res = await payload.find({
    collection: "staff",
    sort: "lastName",
    limit: 100,
  });

  type StaffDoc = {
    id: string;
    fullName: string;
    roleTitle: string;
    status: string;
  };

  return (
    <AdminTable
      title="Προσωπικό"
      rows={res.docs as StaffDoc[]}
      newHref="/club-admin/staff/new"
      editHref={(r) => `/club-admin/staff/${r.id}`}
      columns={[
        { key: "fullName", label: "Ονοματεπώνυμο" },
        { key: "roleTitle", label: "Ρόλος" },
        {
          key: "status",
          label: "Κατάσταση",
          render: (r) => <StatusBadge value={r.status} />,
        },
      ]}
      emptyMessage="Δεν βρέθηκαν μέλη προσωπικού."
    />
  );
}
