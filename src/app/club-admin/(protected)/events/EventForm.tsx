"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { createEventAction, updateEventAction } from "@/lib/club-admin/actions";

export interface EventEditData {
  id?: string;
  title?: string;
  titleEn?: string;
  type?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  locationEn?: string;
  description?: string;
  descriptionEn?: string;
  status?: string;
}

const TYPE_OPTIONS = [
  { value: "training", label: "Προπόνηση" },
  { value: "recovery", label: "Αποκατάσταση" },
  { value: "media", label: "Μέσα Ενημέρωσης" },
  { value: "community", label: "Κοινότητα" },
  { value: "academy", label: "Ακαδημία" },
  { value: "match", label: "Αγώνας (μόνο αν δεν υπάρχει στους Αγώνες)" },
];

const STATUS_OPTIONS = [
  { value: "published", label: "Δημοσιευμένο" },
  { value: "draft", label: "Κρυφό" },
];

/** Shared by /club-admin/events/new and /club-admin/events/[id]. */
export function EventForm({ event = {} }: { event?: EventEditData }) {
  const router = useRouter();
  const isEdit = Boolean(event.id);
  const [state, formAction, isPending] = useActionState(isEdit ? updateEventAction : createEventAction, null);
  useEffect(() => { if (state?.success) router.push("/club-admin/events"); }, [state, router]);

  return (
    <div className="max-w-2xl">
      <Link href="/club-admin/events" className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Πίσω στο πρόγραμμα
      </Link>
      <h1 className="mb-2 text-2xl font-bold text-white">{isEdit ? `Επεξεργασία — ${event.title}` : "Νέα Εκδήλωση"}</h1>
      <p className="mb-8 text-sm text-gray-400">
        Οι αγώνες από την ενότητα «Αγώνες» εμφανίζονται αυτόματα στο πρόγραμμα — δεν χρειάζεται να καταχωρηθούν εδώ.
      </p>
      {state?.error && (
        <div className="mb-6 rounded-lg border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-400">{state.error}</div>
      )}

      <form action={formAction} className="space-y-5">
        {isEdit && <input type="hidden" name="id" value={event.id} />}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Τίτλος (ελλ.) *" name="title" required defaultValue={event.title} />
          <FormField label="Τίτλος (αγγλ.)" name="titleEn" defaultValue={event.titleEn} />
        </div>
        <FormField label="Τύπος *" name="type" type="select" required defaultValue={event.type ?? "training"} options={TYPE_OPTIONS} />
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Ημερομηνία *" name="date" type="date" required defaultValue={event.date} />
          <FormField label="Ώρα έναρξης" name="startTime" placeholder="π.χ. 18:00" defaultValue={event.startTime} />
          <FormField label="Ώρα λήξης" name="endTime" placeholder="π.χ. 20:00" defaultValue={event.endTime} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Τοποθεσία (ελλ.)" name="location" defaultValue={event.location} />
          <FormField label="Τοποθεσία (αγγλ.)" name="locationEn" defaultValue={event.locationEn} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Περιγραφή (ελλ.)" name="description" type="textarea" defaultValue={event.description} />
          <FormField label="Περιγραφή (αγγλ.)" name="descriptionEn" type="textarea" defaultValue={event.descriptionEn} />
        </div>
        <FormField label="Κατάσταση" name="status" type="select" defaultValue={event.status ?? "published"} options={STATUS_OPTIONS} />
        <p className="-mt-3 text-xs text-gray-500">«Κρυφό» αφαιρεί την εκδήλωση από τον ιστότοπο χωρίς να τη διαγράψει (π.χ. αν ακυρωθεί).</p>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isPending} className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
            {isPending ? "Αποθήκευση…" : "Αποθήκευση"}
          </button>
          <Link href="/club-admin/events" className="rounded-lg border border-white/10 px-6 py-2.5 text-sm text-gray-300 hover:bg-white/5">Ακύρωση</Link>
        </div>
      </form>
    </div>
  );
}
