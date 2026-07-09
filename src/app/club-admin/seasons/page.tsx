import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { AdminTable } from "@/components/club-admin/AdminTable";
import { StatusBadge } from "@/components/club-admin/StatusBadge";

export const metadata: Metadata = { title: "Σεζόν" };

export default async function SeasonsPage() {
  const { payload } = await requireClubAdmin();

  const res = await payload.find({
    collection: "seasons",
    sort: "-startYear",
    limit: 100,
  });

  type SeasonDoc = {
    id: string;
    title: string;
    status: string;
    isCurrent: boolean;
    startYear: number;
    endYear: number;
  };

  const rows = res.docs as SeasonDoc[];

  return (
    <AdminTable
      title="Σεζόν"
      rows={rows}
      newHref="/club-admin/seasons/new"
      editHref={(row) => `/club-admin/seasons/${row.id}`}
      columns={[
        { key: "title", label: "Τίτλος" },
        {
          key: "status",
          label: "Κατάσταση",
          render: (row) => <StatusBadge value={row.status} />,
        },
        {
          key: "isCurrent",
          label: "Τρέχουσα",
          render: (row) =>
            row.isCurrent ? (
              <span className="text-green-400">✓ Ναι</span>
            ) : (
              <span className="text-gray-600">—</span>
            ),
        },
        {
          key: "startYear",
          label: "Έτη",
          render: (row) => `${row.startYear}–${row.endYear}`,
        },
      ]}
      emptyMessage="Δεν βρέθηκαν σεζόν. Δημιουργήστε την πρώτη σεζόν."
    />
  );
}
