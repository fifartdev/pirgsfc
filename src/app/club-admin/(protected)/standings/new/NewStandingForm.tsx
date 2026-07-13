"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { createStandingAction } from "@/lib/club-admin/actions";

interface Props {
  seasonOptions: { value: string; label: string }[];
  leagueOptions: { value: string; label: string }[];
}

export function NewStandingForm({ seasonOptions, leagueOptions }: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createStandingAction, null);
  useEffect(() => {
    if (state?.success) router.push("/club-admin/standings");
  }, [state, router]);

  return (
    <div className="max-w-2xl">
      <Link
        href="/club-admin/standings"
        className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Πίσω
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-white">Νέα Εγγραφή Βαθμολογίας</h1>
      {state?.error && (
        <div className="mb-6 rounded-lg border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}
      <form action={formAction} className="space-y-5">
        <FormField label="Σεζόν *" name="season" type="select" required options={seasonOptions} />
        <FormField label="Διοργάνωση *" name="league" type="select" required options={leagueOptions} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Ομάδα (ελλ.) *" name="teamName" required />
          <FormField label="Ομάδα (αγγλ.)" name="teamNameEn" />
        </div>
        <FormField label="Ο PYRGOS AFC" name="isPyrgos" type="checkbox" hint="Επισημαίνεται στον δημόσιο πίνακα." />
        <FormField label="Θέση *" name="position" type="number" min={1} required />
        <div className="grid grid-cols-4 gap-4">
          <FormField label="Αγώνες" name="played" type="number" min={0} />
          <FormField label="Νίκες" name="won" type="number" min={0} />
          <FormField label="Ισοπαλίες" name="drawn" type="number" min={0} />
          <FormField label="Ήττες" name="lost" type="number" min={0} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Γκολ υπέρ" name="goalsFor" type="number" min={0} />
          <FormField label="Γκολ κατά" name="goalsAgainst" type="number" min={0} />
          <FormField label="Βαθμοί" name="points" type="number" min={0} />
        </div>
        <FormField label="Σημειώσεις" name="notes" />
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Αποθήκευση…" : "Αποθήκευση"}
          </button>
          <Link
            href="/club-admin/standings"
            className="rounded-lg border border-white/10 px-6 py-2.5 text-sm text-gray-300 hover:bg-white/5"
          >
            Ακύρωση
          </Link>
        </div>
      </form>
    </div>
  );
}
