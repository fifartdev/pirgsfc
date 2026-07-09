import { requireClubAdmin } from "@/lib/club-admin/auth";
import { notFound } from "next/navigation";
import { EditPlayerForm, type PlayerEditData } from "./EditPlayerForm";

export default async function EditPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { payload } = await requireClubAdmin();
  const { id } = await params;
  if (!id) notFound();

  let player: PlayerEditData;
  try {
    const doc = await payload.findByID({
      collection: "players",
      id,
      depth: 1,
    });

    const img = doc.profileImage as { id?: string | number; url?: string } | null | undefined;

    player = {
      id: String(doc.id),
      firstName: (doc.firstName as string) ?? "",
      lastName: (doc.lastName as string) ?? "",
      firstNameEn: (doc.firstNameEn as string | undefined) ?? undefined,
      lastNameEn: (doc.lastNameEn as string | undefined) ?? undefined,
      fullName: (doc.fullName as string | undefined) ?? undefined,
      position: (doc.position as string | undefined) ?? undefined,
      nationality: (doc.nationality as string | undefined) ?? undefined,
      nationalityEn: (doc.nationalityEn as string | undefined) ?? undefined,
      preferredFoot: (doc.preferredFoot as string | undefined) ?? undefined,
      status: (doc.status as string | undefined) ?? "active",
      defaultShirtNumber: (doc.defaultShirtNumber as number | undefined) ?? undefined,
      heightCm: (doc.heightCm as number | undefined) ?? undefined,
      weightKg: (doc.weightKg as number | undefined) ?? undefined,
      profileImageId: img?.id != null ? String(img.id) : undefined,
      profileImageUrl: img?.url ?? undefined,
    };
  } catch {
    notFound();
  }

  return <EditPlayerForm player={player} />;
}
