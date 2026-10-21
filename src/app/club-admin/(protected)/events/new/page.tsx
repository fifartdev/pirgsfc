import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { EventForm } from "../EventForm";

export const metadata: Metadata = { title: "Νέα Εκδήλωση" };

export default async function NewEventPage() {
  await requireClubAdmin();
  return <EventForm />;
}
