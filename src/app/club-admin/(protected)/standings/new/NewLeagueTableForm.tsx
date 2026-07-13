"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { createLeagueTableAction } from "@/lib/club-admin/actions";

interface Props {
  seasonOptions: { value: string; label: string }[];
  leagueOptions: { value: string; label: string }[];
}

export function NewLeagueTableForm({ seasonOptions, leagueOptions }: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createLeagueTableAction, null);
  useEffect(() => {
    if (state?.success && state.id) router.push(`/club-admin/standings/${state.id}`);
  }, [state, router]);

  return (
    <div className="max-w-lg">
      <Link
        href="/club-admin/standings"
        className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Πίσω
      </Link>
      <h1 className="mb-2 text-2xl font-bold text-white">Νέος Πίνακας Βαθμολογίας</h1>
      <p className="mb-8 text-sm text-gray-400">
        Επίλεξε σεζόν και διοργάνωση. Οι ομάδες προστίθενται στην επόμενη οθόνη.
      </p>
      {state?.error && (
        <div className="mb-6 rounded-lg border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}
      <form action={formAction} className="space-y-5">
        <FormField label="Σεζόν *" name="season" type="select" required options={seasonOptions} />
        <FormField label="Διοργάνωση *" name="league" type="select" required options={leagueOptions} />
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Δημιουργία…" : "Δημιουργία & συνέχεια"}
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
