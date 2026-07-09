import { requireClubAdmin } from "@/lib/club-admin/auth";
import { EditInPayload } from "@/components/club-admin/EditInPayload";
import { notFound } from "next/navigation";

export default async function EditRosterPage({ params }: { params: Promise<{ id: string }> }) {
  await requireClubAdmin();
  const { id } = await params;
  if (!id) notFound();
  return <EditInPayload collection="rosters" id={id} backHref="/club-admin/rosters" backLabel="Πίσω στο ρόστερ" entityLabel="Εγγραφή ρόστερ" />;
}
