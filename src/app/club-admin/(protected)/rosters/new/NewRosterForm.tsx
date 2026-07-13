"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { createRosterAction } from "@/lib/club-admin/actions";

interface Props {
  seasonOptions: { value: string; label: string }[];
  teamOptions: { value: string; label: string }[];
  playerOptions: { value: string; label: string }[];
}

export function NewRosterForm({ seasonOptions, teamOptions, playerOptions }: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createRosterAction, null);
  useEffect(() => { if (state?.success) router.push("/club-admin/rosters"); }, [state, router]);

  return (
    <div className="max-w-2xl">
      <Link href="/club-admin/rosters" className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Πίσω</Link>
      <h1 className="mb-8 text-2xl font-bold text-white">Νέα Εγγραφή Ρόστερ</h1>
      {state?.error && <div className="mb-6 rounded-lg border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-400">{state.error}</div>}
      <form action={formAction} className="space-y-5">
        <FormField label="Σεζόν *" name="season" type="select" required options={seasonOptions} />
        <FormField label="Ομάδα *" name="team" type="select" required options={teamOptions} />
        <FormField label="Παίκτης *" name="player" type="select" required options={playerOptions} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Νούμερο φανέλας" name="shirtNumber" type="number" min={1} max={99} />
          <FormField label="Ημ. εγγραφής" name="joinedDate" type="date" />
        </div>
        <div className="flex gap-4">
          <FormField label="Αρχηγός" name="isCaptain" type="checkbox" />
          <FormField label="Β' Αρχηγός" name="isViceCaptain" type="checkbox" />
        </div>
        <FormField label="Κατάσταση" name="status" type="select" defaultValue="active" options={[
          { value: "active", label: "Ενεργός" },
          { value: "loaned", label: "Δανεισμός" },
          { value: "transferred", label: "Μεταγραφή" },
          { value: "injured", label: "Τραυματίας" },
          { value: "inactive", label: "Ανενεργός" },
        ]} />
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-300">Στατιστικά σεζόν</h2>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Συμμετοχές" name="statsAppearances" type="number" min={0} />
            <FormField label="Γκολ" name="statsGoals" type="number" min={0} />
            <FormField label="Ασίστ" name="statsAssists" type="number" min={0} />
            <FormField label="Κίτρινες κάρτες" name="statsYellowCards" type="number" min={0} />
            <FormField label="Κόκκινες κάρτες" name="statsRedCards" type="number" min={0} />
            <FormField label="Λεπτά συμμετοχής" name="statsMinutesPlayed" type="number" min={0} />
          </div>
          <div className="mt-4">
            <FormField
              label="Καθαρά μηδενικά (τερματοφύλακες)"
              name="statsCleanSheets"
              type="number"
              min={0}
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isPending} className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">{isPending ? "Αποθήκευση…" : "Αποθήκευση"}</button>
          <Link href="/club-admin/rosters" className="rounded-lg border border-white/10 px-6 py-2.5 text-sm text-gray-300 hover:bg-white/5">Ακύρωση</Link>
        </div>
      </form>
    </div>
  );
}
