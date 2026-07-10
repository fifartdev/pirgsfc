"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { updateLeagueAction } from "@/lib/club-admin/actions";

export interface LeagueEditData {
  id: string;
  name: string;
  nameEn?: string;
  type?: string;
  category?: string;
  organizer?: string;
  country?: string;
  region?: string;
}

export function EditLeagueForm({ league }: { league: LeagueEditData }) {
  const [state, formAction, isPending] = useActionState(updateLeagueAction, null);

  return (
    <div className="max-w-2xl">
      <Link
        href="/club-admin/leagues"
        className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Πίσω στις διοργανώσεις
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-white">Επεξεργασία — {league.name}</h1>

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
        <input type="hidden" name="id" value={league.id} />

        <FormField label="Όνομα" name="name" required defaultValue={league.name} />
        <FormField label="Όνομα (αγγλικά)" name="nameEn" defaultValue={league.nameEn} />
        <FormField
          label="Τύπος"
          name="type"
          type="select"
          defaultValue={league.type ?? "league"}
          options={[
            { value: "league", label: "Πρωτάθλημα" },
            { value: "cup", label: "Κύπελλο" },
            { value: "friendly", label: "Φιλικό" },
            { value: "tournament", label: "Τουρνουά" },
            { value: "other", label: "Άλλο" },
          ]}
        />
        <FormField
          label="Κατηγορία"
          name="category"
          type="select"
          required
          defaultValue={league.category}
          options={[
            { value: "men", label: "Άντρες" },
            { value: "women", label: "Γυναίκες" },
            { value: "futsal", label: "Futsal" },
            { value: "youth", label: "Νέοι" },
            { value: "mixed", label: "Μεικτή" },
          ]}
        />
        <FormField label="Διοργανωτής" name="organizer" defaultValue={league.organizer} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Χώρα" name="country" defaultValue={league.country ?? "Ελλάδα"} />
          <FormField label="Νομός / Περιφέρεια" name="region" defaultValue={league.region} />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Αποθήκευση…" : "Αποθήκευση αλλαγών"}
          </button>
          <Link
            href="/club-admin/leagues"
            className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Ακύρωση
          </Link>
        </div>
      </form>
    </div>
  );
}
