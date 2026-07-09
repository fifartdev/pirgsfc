import { requireClubAdmin } from "@/lib/club-admin/auth";
import { EditInPayload } from "@/components/club-admin/EditInPayload";
import { notFound } from "next/navigation";

export default async function EditMatchPage({ params }: { params: Promise<{ id: string }> }) {
  await requireClubAdmin();
  const { id } = await params;
  if (!id) notFound();
  return <EditInPayload collection="matches" id={id} backHref="/club-admin/matches" backLabel="Πίσω στους αγώνες" entityLabel="Αγώνας" />;
}
