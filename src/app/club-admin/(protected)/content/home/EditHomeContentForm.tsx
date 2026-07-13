"use client";

import { useActionState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { updateHomeContentAction } from "@/lib/club-admin/actions";

export interface HomeContentEditData {
  heroEyebrow: string;
  heroEyebrowEn: string;
  heroTitle1: string;
  heroTitle1En: string;
  heroTitleAccent: string;
  heroTitleAccentEn: string;
  heroTitle2: string;
  heroTitle2En: string;
  heroText: string;
  heroTextEn: string;
}

export function EditHomeContentForm({ data }: { data: HomeContentEditData }) {
  const [state, formAction, isPending] = useActionState(updateHomeContentAction, null);

  useEffect(() => {
    if (state?.success) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state]);

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold text-white">Περιεχόμενο Αρχικής</h1>
      <p className="mb-8 text-sm text-gray-400">
        Το κείμενο του hero στην αρχική σελίδα. Οι υπόλοιπες ενότητες (επόμενος αγώνας, αποτελέσματα, τμήματα,
        παίκτες, αξίες, νέα, χορηγοί) είναι δεδομένα ή κοινό περιεχόμενο και δεν επεξεργάζονται εδώ.
      </p>

      {state?.success && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-600/30 bg-green-600/10 px-4 py-3 text-sm text-green-400">
          <CheckCircle className="h-4 w-4 shrink-0" />
          Οι αλλαγές αποθηκεύτηκαν επιτυχώς.
        </div>
      )}
      {state?.error && (
        <div className="mb-6 rounded-lg border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Υπότιτλος (ελλ.)" name="heroEyebrow" defaultValue={data.heroEyebrow} />
          <FormField label="Υπότιτλος (αγγλ.)" name="heroEyebrowEn" defaultValue={data.heroEyebrowEn} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Τίτλος μέρος 1 (ελλ.)" name="heroTitle1" defaultValue={data.heroTitle1} />
          <FormField label="Τίτλος μέρος 1 (αγγλ.)" name="heroTitle1En" defaultValue={data.heroTitle1En} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Τίτλος έμφαση (ελλ.)" name="heroTitleAccent" defaultValue={data.heroTitleAccent} />
          <FormField label="Τίτλος έμφαση (αγγλ.)" name="heroTitleAccentEn" defaultValue={data.heroTitleAccentEn} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Τίτλος μέρος 2 (ελλ.)" name="heroTitle2" defaultValue={data.heroTitle2} />
          <FormField label="Τίτλος μέρος 2 (αγγλ.)" name="heroTitle2En" defaultValue={data.heroTitle2En} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Κείμενο (ελλ.)" name="heroText" type="textarea" defaultValue={data.heroText} />
          <FormField label="Κείμενο (αγγλ.)" name="heroTextEn" type="textarea" defaultValue={data.heroTextEn} />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Αποθήκευση…" : "Αποθήκευση αλλαγών"}
          </button>
        </div>
      </form>
    </div>
  );
}
