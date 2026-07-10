"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { updateSeasonAction } from "@/lib/club-admin/actions";

export interface SeasonEditData {
  id: string;
  title: string;
  startYear?: number;
  endYear?: number;
  status?: string;
  isCurrent?: boolean;
  description?: string;
}

export function EditSeasonForm({ season }: { season: SeasonEditData }) {
  const [state, formAction, isPending] = useActionState(updateSeasonAction, null);

  return (
    <div className="max-w-2xl">
      <Link
        href="/club-admin/seasons"
        className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Πίσω στις σεζόν
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-white">Επεξεργασία — {season.title}</h1>

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
        <input type="hidden" name="id" value={season.id} />

        <FormField label="Τίτλος" name="title" required placeholder="π.χ. 2025-2026" defaultValue={season.title} />

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Έτος έναρξης" name="startYear" type="number" required min={1900} max={2100} defaultValue={season.startYear} />
          <FormField label="Έτος λήξης" name="endYear" type="number" required min={1900} max={2100} defaultValue={season.endYear} />
        </div>

        <FormField
          label="Κατάσταση"
          name="status"
          type="select"
          defaultValue={season.status ?? "draft"}
          options={[
            { value: "draft", label: "Πρόχειρο" },
            { value: "active", label: "Ενεργή" },
            { value: "archived", label: "Αρχειοθετημένη" },
          ]}
        />

        <FormField label="Τρέχουσα σεζόν" name="isCurrent" type="checkbox" defaultValue={season.isCurrent} />
        <FormField label="Περιγραφή" name="description" type="textarea" defaultValue={season.description} />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Αποθήκευση…" : "Αποθήκευση αλλαγών"}
          </button>
          <Link
            href="/club-admin/seasons"
            className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Ακύρωση
          </Link>
        </div>
      </form>
    </div>
  );
}
