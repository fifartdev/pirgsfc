"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { RichTextEditor } from "@/components/club-admin/RichTextEditor";
import { updateTeamAction } from "@/lib/club-admin/actions";

export interface TeamEditData {
  id: string;
  name: string;
  nameEn?: string;
  category?: string;
  ageGroup?: string;
  status?: string;
  description?: unknown;
}

export function EditTeamForm({ team }: { team: TeamEditData }) {
  const [state, formAction, isPending] = useActionState(updateTeamAction, null);

  return (
    <div className="max-w-2xl">
      <Link
        href="/club-admin/teams"
        className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Πίσω στις ομάδες
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-white">Επεξεργασία — {team.name}</h1>

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
        <input type="hidden" name="id" value={team.id} />

        <FormField label="Όνομα ομάδας" name="name" required defaultValue={team.name} />
        <FormField label="Όνομα (αγγλικά)" name="nameEn" defaultValue={team.nameEn} />
        <FormField
          label="Κατηγορία"
          name="category"
          type="select"
          required
          defaultValue={team.category}
          options={[
            { value: "men", label: "Άντρες" },
            { value: "women", label: "Γυναίκες" },
            { value: "futsal", label: "Futsal" },
            { value: "youth", label: "Νέοι" },
            { value: "academy", label: "Υποδομές" },
            { value: "veterans", label: "Βετεράνοι" },
            { value: "other", label: "Άλλο" },
          ]}
        />
        <FormField label="Ηλικιακή κατηγορία (π.χ. U19)" name="ageGroup" defaultValue={team.ageGroup} />
        <FormField
          label="Κατάσταση"
          name="status"
          type="select"
          defaultValue={team.status ?? "active"}
          options={[
            { value: "active", label: "Ενεργή" },
            { value: "inactive", label: "Ανενεργή" },
            { value: "archived", label: "Αρχειοθετημένη" },
          ]}
        />

        <RichTextEditor name="description" label="Περιγραφή" defaultValue={team.description} />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Αποθήκευση…" : "Αποθήκευση αλλαγών"}
          </button>
          <Link
            href="/club-admin/teams"
            className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Ακύρωση
          </Link>
        </div>
      </form>
    </div>
  );
}
