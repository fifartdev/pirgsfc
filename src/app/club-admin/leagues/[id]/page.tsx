import { requireClubAdmin } from "@/lib/club-admin/auth";
import { EditInPayload } from "@/components/club-admin/EditInPayload";
import { notFound } from "next/navigation";

export default async function EditLeaguePage({ params }: { params: Promise<{ id: string }> }) {
  await requireClubAdmin();
  const { id } = await params;
  if (!id) notFound();
  return <EditInPayload collection="leagues" id={id} backHref="/club-admin/leagues" backLabel="Πίσω στις διοργανώσεις" entityLabel="Διοργάνωση" />;
}
