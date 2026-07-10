"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { RichTextEditor } from "@/components/club-admin/RichTextEditor";
import { updateVenueAction } from "@/lib/club-admin/actions";

export interface VenueEditData {
  id: string;
  name: string;
  nameEn?: string;
  type?: string;
  city?: string;
  country?: string;
  address?: string;
  capacity?: number;
  description?: unknown;
}

export function EditVenueForm({ venue }: { venue: VenueEditData }) {
  const [state, formAction, isPending] = useActionState(updateVenueAction, null);

  return (
    <div className="max-w-2xl">
      <Link
        href="/club-admin/venues"
        className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Πίσω στα γήπεδα
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-white">Επεξεργασία — {venue.name}</h1>

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
        <input type="hidden" name="id" value={venue.id} />

        <FormField label="Όνομα γηπέδου" name="name" required defaultValue={venue.name} />
        <FormField label="Όνομα (αγγλικά)" name="nameEn" defaultValue={venue.nameEn} />
        <FormField
          label="Τύπος"
          name="type"
          type="select"
          defaultValue={venue.type ?? "stadium"}
          options={[
            { value: "stadium", label: "Γήπεδο" },
            { value: "training_ground", label: "Προπονητικό κέντρο" },
            { value: "indoor", label: "Κλειστό γυμναστήριο" },
            { value: "other", label: "Άλλο" },
          ]}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Πόλη" name="city" defaultValue={venue.city ?? "Πύργος"} />
          <FormField label="Χώρα" name="country" defaultValue={venue.country ?? "Ελλάδα"} />
        </div>
        <FormField label="Διεύθυνση" name="address" defaultValue={venue.address} />
        <FormField label="Χωρητικότητα" name="capacity" type="number" min={0} defaultValue={venue.capacity} />

        <RichTextEditor name="description" label="Περιγραφή" defaultValue={venue.description} />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Αποθήκευση…" : "Αποθήκευση αλλαγών"}
          </button>
          <Link
            href="/club-admin/venues"
            className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Ακύρωση
          </Link>
        </div>
      </form>
    </div>
  );
}
