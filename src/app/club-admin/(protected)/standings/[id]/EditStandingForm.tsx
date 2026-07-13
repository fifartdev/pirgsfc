"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { updateStandingAction } from "@/lib/club-admin/actions";

export interface StandingEditData {
  id: string;
  season?: string;
  league?: string;
  teamName: string;
  teamNameEn?: string;
  isPyrgos?: boolean;
  position?: number;
  played?: number;
  won?: number;
  drawn?: number;
  lost?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  points?: number;
  notes?: string;
}

interface Props {
  standing: StandingEditData;
  seasonOptions: { value: string; label: string }[];
  leagueOptions: { value: string; label: string }[];
}

export function EditStandingForm({ standing, seasonOptions, leagueOptions }: Props) {
  const [state, formAction, isPending] = useActionState(updateStandingAction, null);

  return (
    <div className="max-w-2xl">
      <Link
        href="/club-admin/standings"
        className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Πίσω στη βαθμολογία
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-white">Επεξεργασία — {standing.teamName}</h1>

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
        <input type="hidden" name="id" value={standing.id} />

        <FormField label="Σεζόν *" name="season" type="select" required defaultValue={standing.season} options={seasonOptions} />
        <FormField label="Διοργάνωση *" name="league" type="select" required defaultValue={standing.league} options={leagueOptions} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Ομάδα (ελλ.) *" name="teamName" required defaultValue={standing.teamName} />
          <FormField label="Ομάδα (αγγλ.)" name="teamNameEn" defaultValue={standing.teamNameEn} />
        </div>
        <FormField
          label="Ο PYRGOS AFC"
          name="isPyrgos"
          type="checkbox"
          defaultValue={standing.isPyrgos}
          hint="Επισημαίνεται στον δημόσιο πίνακα."
        />
        <FormField label="Θέση *" name="position" type="number" min={1} required defaultValue={standing.position} />
        <div className="grid grid-cols-4 gap-4">
          <FormField label="Αγώνες" name="played" type="number" min={0} defaultValue={standing.played} />
          <FormField label="Νίκες" name="won" type="number" min={0} defaultValue={standing.won} />
          <FormField label="Ισοπαλίες" name="drawn" type="number" min={0} defaultValue={standing.drawn} />
          <FormField label="Ήττες" name="lost" type="number" min={0} defaultValue={standing.lost} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Γκολ υπέρ" name="goalsFor" type="number" min={0} defaultValue={standing.goalsFor} />
          <FormField label="Γκολ κατά" name="goalsAgainst" type="number" min={0} defaultValue={standing.goalsAgainst} />
          <FormField label="Βαθμοί" name="points" type="number" min={0} defaultValue={standing.points} />
        </div>
        <FormField label="Σημειώσεις" name="notes" defaultValue={standing.notes} />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Αποθήκευση…" : "Αποθήκευση αλλαγών"}
          </button>
          <Link
            href="/club-admin/standings"
            className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Ακύρωση
          </Link>
        </div>
      </form>
    </div>
  );
}
