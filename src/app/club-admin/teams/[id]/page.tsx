import { requireClubAdmin } from "@/lib/club-admin/auth";
import { EditInPayload } from "@/components/club-admin/EditInPayload";
import { notFound } from "next/navigation";

export default async function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  await requireClubAdmin();
  const { id } = await params;
  if (!id) notFound();
  return <EditInPayload collection="teams" id={id} backHref="/club-admin/teams" backLabel="Πίσω στις ομάδες" entityLabel="Ομάδα" />;
}
