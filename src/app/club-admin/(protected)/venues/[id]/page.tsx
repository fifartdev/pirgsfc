import { requireClubAdmin } from "@/lib/club-admin/auth";
import { notFound } from "next/navigation";
import { EditVenueForm, type VenueEditData } from "./EditVenueForm";

export default async function EditVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { payload } = await requireClubAdmin();
  const { id } = await params;
  if (!id) notFound();

  let venue: VenueEditData;
  try {
    const doc = await payload.findByID({ collection: "venues", id });
    venue = {
      id: String(doc.id),
      name: (doc.name as string) ?? "",
      nameEn: (doc.nameEn as string | undefined) ?? undefined,
      type: (doc.type as string | undefined) ?? undefined,
      city: (doc.city as string | undefined) ?? undefined,
      country: (doc.country as string | undefined) ?? undefined,
      address: (doc.address as string | undefined) ?? undefined,
      capacity: (doc.capacity as number | undefined) ?? undefined,
      description: doc.description ?? undefined,
    };
  } catch {
    notFound();
  }

  return <EditVenueForm venue={venue} />;
}
