import { requireClubAdmin } from "@/lib/club-admin/auth";
import { EditInPayload } from "@/components/club-admin/EditInPayload";
import { notFound } from "next/navigation";

export default async function EditVenuePage({ params }: { params: Promise<{ id: string }> }) {
  await requireClubAdmin();
  const { id } = await params;
  if (!id) notFound();
  return <EditInPayload collection="venues" id={id} backHref="/club-admin/venues" backLabel="Πίσω στα γήπεδα" entityLabel="Γήπεδο" />;
}
