import { requireClubAdmin } from "@/lib/club-admin/auth";
import { notFound } from "next/navigation";
import { EventForm, type EventEditData } from "../EventForm";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { payload } = await requireClubAdmin();
  const { id } = await params;
  if (!id) notFound();

  let event: EventEditData;
  try {
    const doc = await payload.findByID({ collection: "events", id, depth: 0 });
    const str = (v: unknown) => (typeof v === "string" ? v : undefined);
    event = {
      id: String(doc.id),
      title: str(doc.title),
      titleEn: str(doc.titleEn),
      type: str(doc.type),
      date: str(doc.date)?.slice(0, 10),
      startTime: str(doc.startTime),
      endTime: str(doc.endTime),
      location: str(doc.location),
      locationEn: str(doc.locationEn),
      description: str(doc.description),
      descriptionEn: str(doc.descriptionEn),
      status: str(doc.status),
    };
  } catch {
    notFound();
  }

  return <EventForm event={event} />;
}
