import { requireClubAdmin } from "@/lib/club-admin/auth";
import { notFound } from "next/navigation";
import { EditClubForm, type ClubEditData } from "./EditClubForm";

export default async function EditClubPage({ params }: { params: Promise<{ id: string }> }) {
  const { payload } = await requireClubAdmin();
  const { id } = await params;
  if (!id) notFound();

  let club: ClubEditData;
  try {
    const doc = await payload.findByID({ collection: "clubs", id, depth: 1 });
    const logo = doc.logo as { id?: string | number; url?: string } | number | null | undefined;
    club = {
      id: String(doc.id),
      name: (doc.name as string) ?? "",
      nameEn: (doc.nameEn as string | undefined) ?? undefined,
      status: (doc.status as string | undefined) ?? "active",
      logoId: logo && typeof logo === "object" ? String(logo.id ?? "") : logo ? String(logo) : undefined,
      logoUrl: logo && typeof logo === "object" ? logo.url : undefined,
    };
  } catch {
    notFound();
  }

  return <EditClubForm club={club} />;
}
