import { requireClubAdmin } from "@/lib/club-admin/auth";
import { notFound } from "next/navigation";
import { EditSeasonForm, type SeasonEditData } from "./EditSeasonForm";

export default async function EditSeasonPage({ params }: { params: Promise<{ id: string }> }) {
  const { payload } = await requireClubAdmin();
  const { id } = await params;
  if (!id) notFound();

  let season: SeasonEditData;
  try {
    const doc = await payload.findByID({ collection: "seasons", id });
    season = {
      id: String(doc.id),
      title: (doc.title as string) ?? "",
      startYear: (doc.startYear as number | undefined) ?? undefined,
      endYear: (doc.endYear as number | undefined) ?? undefined,
      status: (doc.status as string | undefined) ?? "draft",
      isCurrent: Boolean(doc.isCurrent),
      description: (doc.description as string | undefined) ?? undefined,
    };
  } catch {
    notFound();
  }

  return <EditSeasonForm season={season} />;
}
