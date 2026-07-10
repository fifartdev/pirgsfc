import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { AdminTable } from "@/components/club-admin/AdminTable";
import { StatusBadge } from "@/components/club-admin/StatusBadge";

export const metadata: Metadata = { title: "Νέα" };

export default async function NewsAdminPage() {
  const { payload } = await requireClubAdmin();
  const res = await payload.find({
    collection: "news",
    sort: "-publishedDate",
    limit: 100,
  });

  type NewsDoc = {
    id: string;
    title: string;
    status: string;
    publishedDate: string | null;
    author: string;
  };

  return (
    <AdminTable
      title="Νέα & Άρθρα"
      rows={res.docs as NewsDoc[]}
      newHref="/club-admin/news/new"
      editHref={(r) => `/club-admin/news/${r.id}`}
      columns={[
        { key: "title", label: "Τίτλος" },
        {
          key: "status",
          label: "Κατάσταση",
          render: (r) => <StatusBadge value={r.status} />,
        },
        {
          key: "publishedDate",
          label: "Ημ. δημοσίευσης",
          render: (r) =>
            r.publishedDate
              ? new Date(r.publishedDate).toLocaleDateString("el-GR")
              : "—",
        },
        { key: "author", label: "Συγγραφέας" },
      ]}
      emptyMessage="Δεν βρέθηκαν άρθρα."
    />
  );
}
