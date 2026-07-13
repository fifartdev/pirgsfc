"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { updateRosterAction } from "@/lib/club-admin/actions";

export interface RosterEditData {
  id: string;
  season?: string;
  team?: string;
  player?: string;
  playerLabel?: string;
  shirtNumber?: number;
  status?: string;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  joinedDate?: string;
  statsAppearances?: number;
  statsGoals?: number;
  statsAssists?: number;
  statsYellowCards?: number;
  statsRedCards?: number;
  statsMinutesPlayed?: number;
  statsCleanSheets?: number;
}

interface Props {
  roster: RosterEditData;
  seasonOptions: { value: string; label: string }[];
  teamOptions: { value: string; label: string }[];
  playerOptions: { value: string; label: string }[];
}

export function EditRosterForm({ roster, seasonOptions, teamOptions, playerOptions }: Props) {
  const [state, formAction, isPending] = useActionState(updateRosterAction, null);

  return (
    <div className="max-w-2xl">
      <Link
        href="/club-admin/rosters"
        className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Πίσω στο ρόστερ
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-white">
        Επεξεργασία — {roster.playerLabel ?? "Εγγραφή ρόστερ"}
      </h1>

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
        <input type="hidden" name="id" value={roster.id} />

        <FormField label="Σεζόν *" name="season" type="select" required defaultValue={roster.season} options={seasonOptions} />
        <FormField label="Ομάδα *" name="team" type="select" required defaultValue={roster.team} options={teamOptions} />
        <FormField label="Παίκτης *" name="player" type="select" required defaultValue={roster.player} options={playerOptions} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Νούμερο φανέλας" name="shirtNumber" type="number" min={1} max={99} defaultValue={roster.shirtNumber} />
          <FormField label="Ημ. εγγραφής" name="joinedDate" type="date" defaultValue={roster.joinedDate} />
        </div>
        <div className="flex gap-4">
          <FormField label="Αρχηγός" name="isCaptain" type="checkbox" defaultValue={roster.isCaptain} />
          <FormField label="Αντιαρχηγός" name="isViceCaptain" type="checkbox" defaultValue={roster.isViceCaptain} />
        </div>
        <FormField
          label="Κατάσταση"
          name="status"
          type="select"
          defaultValue={roster.status ?? "active"}
          options={[
            { value: "active", label: "Ενεργός" },
            { value: "loaned", label: "Δανεισμός" },
            { value: "transferred", label: "Μεταγραφή" },
            { value: "injured", label: "Τραυματίας" },
            { value: "inactive", label: "Ανενεργός" },
          ]}
        />

        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-300">Στατιστικά σεζόν</h2>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Συμμετοχές" name="statsAppearances" type="number" min={0} defaultValue={roster.statsAppearances} />
            <FormField label="Γκολ" name="statsGoals" type="number" min={0} defaultValue={roster.statsGoals} />
            <FormField label="Ασίστ" name="statsAssists" type="number" min={0} defaultValue={roster.statsAssists} />
            <FormField label="Κίτρινες κάρτες" name="statsYellowCards" type="number" min={0} defaultValue={roster.statsYellowCards} />
            <FormField label="Κόκκινες κάρτες" name="statsRedCards" type="number" min={0} defaultValue={roster.statsRedCards} />
            <FormField label="Λεπτά συμμετοχής" name="statsMinutesPlayed" type="number" min={0} defaultValue={roster.statsMinutesPlayed} />
          </div>
          <div className="mt-4">
            <FormField
              label="Καθαρά μηδενικά (τερματοφύλακες)"
              name="statsCleanSheets"
              type="number"
              min={0}
              defaultValue={roster.statsCleanSheets}
            />
          </div>
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
            href="/club-admin/rosters"
            className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Ακύρωση
          </Link>
        </div>
      </form>
    </div>
  );
}
