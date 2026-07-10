import { requireClubAdmin } from "@/lib/club-admin/auth";
import { notFound } from "next/navigation";
import { EditTeamForm, type TeamEditData } from "./EditTeamForm";

export default async function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { payload } = await requireClubAdmin();
  const { id } = await params;
  if (!id) notFound();

  let team: TeamEditData;
  try {
    const doc = await payload.findByID({ collection: "teams", id });
    team = {
      id: String(doc.id),
      name: (doc.name as string) ?? "",
      nameEn: (doc.nameEn as string | undefined) ?? undefined,
      category: (doc.category as string | undefined) ?? undefined,
      ageGroup: (doc.ageGroup as string | undefined) ?? undefined,
      status: (doc.status as string | undefined) ?? "active",
      description: doc.description ?? undefined,
    };
  } catch {
    notFound();
  }

  return <EditTeamForm team={team} />;
}
