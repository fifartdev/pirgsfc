"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { createMatchAction } from "@/lib/club-admin/actions";

interface NewMatchFormProps {
  seasonOptions: { value: string; label: string }[];
  teamOptions: { value: string; label: string }[];
  leagueOptions: { value: string; label: string }[];
  venueOptions: { value: string; label: string }[];
}

export function NewMatchForm({ seasonOptions, teamOptions, leagueOptions, venueOptions }: NewMatchFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createMatchAction, null);
  useEffect(() => { if (state?.success) router.push("/club-admin/matches"); }, [state, router]);

  return (
    <div className="max-w-2xl">
      <Link href="/club-admin/matches" className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Πίσω</Link>
      <h1 className="mb-8 text-2xl font-bold text-white">Νέος Αγώνας</h1>
      {state?.error && <div className="mb-6 rounded-lg border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-400">{state.error}</div>}
      <form action={formAction} className="space-y-5">
        <FormField label="Σεζόν *" name="season" type="select" required options={seasonOptions} />
        <FormField label="Ομάδα PYRGOS AFC *" name="team" type="select" required options={teamOptions} />
        <FormField label="Διοργάνωση *" name="league" type="select" required options={leagueOptions} />
        <FormField label="Γήπεδο" name="venue" type="select" options={[{ value: "", label: "— Χωρίς γήπεδο —" }, ...venueOptions]} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Γηπεδούχος *" name="homeTeamName" required placeholder="π.χ. PYRGOS AFC" />
          <FormField label="Φιλοξενούμενος *" name="awayTeamName" required placeholder="π.χ. Olympia United" />
        </div>
        <FormField label="Τύπος αγώνα" name="matchType" type="select" defaultValue="league" options={[
          { value: "league", label: "Πρωτάθλημα" },
          { value: "cup", label: "Κύπελλο" },
          { value: "friendly", label: "Φιλικό" },
          { value: "tournament", label: "Τουρνουά" },
          { value: "playoff", label: "Play-off" },
        ]} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Ημερομηνία *" name="matchDate" type="date" required />
          <FormField label="Ώρα έναρξης" name="kickoffTime" placeholder="π.χ. 19:30" />
        </div>
        <FormField label="Αγωνιστική / Φάση" name="matchweek" placeholder="π.χ. 16η Αγωνιστική" />
        <FormField label="Εντός έδρας" name="isHomeMatch" type="checkbox" defaultValue={true} />
        <FormField label="Κατάσταση" name="status" type="select" defaultValue="scheduled" options={[
          { value: "scheduled", label: "Προγραμματισμένος" },
          { value: "completed", label: "Ολοκληρώθηκε" },
          { value: "postponed", label: "Αναβλήθηκε" },
          { value: "cancelled", label: "Ακυρώθηκε" },
        ]} />
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isPending} className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">{isPending ? "Αποθήκευση…" : "Αποθήκευση"}</button>
          <Link href="/club-admin/matches" className="rounded-lg border border-white/10 px-6 py-2.5 text-sm text-gray-300 hover:bg-white/5">Ακύρωση</Link>
        </div>
      </form>
    </div>
  );
}
