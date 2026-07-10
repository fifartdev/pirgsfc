import { requireClubAdmin } from "@/lib/club-admin/auth";
import { notFound } from "next/navigation";
import { EditLeagueForm, type LeagueEditData } from "./EditLeagueForm";

export default async function EditLeaguePage({ params }: { params: Promise<{ id: string }> }) {
  const { payload } = await requireClubAdmin();
  const { id } = await params;
  if (!id) notFound();

  let league: LeagueEditData;
  try {
    const doc = await payload.findByID({ collection: "leagues", id });
    league = {
      id: String(doc.id),
      name: (doc.name as string) ?? "",
      nameEn: (doc.nameEn as string | undefined) ?? undefined,
      type: (doc.type as string | undefined) ?? undefined,
      category: (doc.category as string | undefined) ?? undefined,
      organizer: (doc.organizer as string | undefined) ?? undefined,
      country: (doc.country as string | undefined) ?? undefined,
      region: (doc.region as string | undefined) ?? undefined,
    };
  } catch {
    notFound();
  }

  return <EditLeagueForm league={league} />;
}
