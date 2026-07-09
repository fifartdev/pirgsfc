import { requireClubAdmin } from "@/lib/club-admin/auth";
import { EditInPayload } from "@/components/club-admin/EditInPayload";
import { notFound } from "next/navigation";

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  await requireClubAdmin();
  const { id } = await params;
  if (!id) notFound();
  return <EditInPayload collection="staff" id={id} backHref="/club-admin/staff" backLabel="Πίσω στο προσωπικό" entityLabel="Μέλος προσωπικού" />;
}
