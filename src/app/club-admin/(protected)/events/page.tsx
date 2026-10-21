import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { AdminTable } from "@/components/club-admin/AdminTable";

export const metadata: Metadata = { title: "Πρόγραμμα" };

const TYPE_LABELS: Record<string, string> = {
  training: "Προπόνηση",
  recovery: "Αποκατάσταση",
  media: "Μέσα Ενημέρωσης",
  community: "Κοινότητα",
  academy: "Ακαδημία",
  match: "Αγώνας",
};

export default async function EventsPage() {
  const { payload } = await requireClubAdmin();
  const res = await payload.find({ collection: "events", sort: "-date", limit: 500, depth: 0 });

  type EventDoc = { id: string; title: string; type: string; date?: string; startTime?: string; status: string };

  return (
    <AdminTable
      title="Πρόγραμμα (εκδηλώσεις)"
      rows={res.docs as EventDoc[]}
      newHref="/club-admin/events/new"
      editHref={(r) => `/club-admin/events/${r.id}`}
      columns={[
        {
          key: "date",
          label: "Ημερομηνία",
          render: (r) =>
            r.date ? `${new Date(r.date).toLocaleDateString("el-GR", { timeZone: "UTC" })}${r.startTime ? ` ${r.startTime}` : ""}` : "—",
        },
        { key: "title", label: "Τίτλος" },
        { key: "type", label: "Τύπος", render: (r) => TYPE_LABELS[r.type] ?? r.type },
        { key: "status", label: "Κατάσταση", render: (r) => (r.status === "draft" ? "Κρυφό" : "Δημοσιευμένο") },
      ]}
      emptyMessage="Δεν υπάρχουν εκδηλώσεις ακόμα. Οι αγώνες εμφανίζονται αυτόματα στο πρόγραμμα του ιστότοπου."
    />
  );
}
