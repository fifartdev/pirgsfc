"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { createLeagueAction } from "@/lib/club-admin/actions";

export default function NewLeaguePage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createLeagueAction, null);
  useEffect(() => { if (state?.success) router.push("/club-admin/leagues"); }, [state, router]);

  return (
    <div className="max-w-2xl">
      <Link href="/club-admin/leagues" className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Πίσω</Link>
      <h1 className="mb-8 text-2xl font-bold text-white">Νέα Διοργάνωση</h1>
      {state?.error && <div className="mb-6 rounded-lg border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-400">{state.error}</div>}
      <form action={formAction} className="space-y-5">
        <FormField label="Όνομα" name="name" required />
        <FormField label="Όνομα (αγγλικά)" name="nameEn" />
        <FormField label="Τύπος" name="type" type="select" defaultValue="league" options={[
          { value: "league", label: "Πρωτάθλημα" },
          { value: "cup", label: "Κύπελλο" },
          { value: "friendly", label: "Φιλικό" },
          { value: "tournament", label: "Τουρνουά" },
          { value: "other", label: "Άλλο" },
        ]} />
        <FormField label="Κατηγορία" name="category" type="select" required options={[
          { value: "men", label: "Άντρες" },
          { value: "women", label: "Γυναίκες" },
          { value: "futsal", label: "Futsal" },
          { value: "youth", label: "Νέοι" },
          { value: "mixed", label: "Μεικτή" },
        ]} />
        <FormField label="Διοργανωτής" name="organizer" />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Χώρα" name="country" defaultValue="Ελλάδα" />
          <FormField label="Νομός / Περιφέρεια" name="region" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isPending} className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">{isPending ? "Αποθήκευση…" : "Αποθήκευση"}</button>
          <Link href="/club-admin/leagues" className="rounded-lg border border-white/10 px-6 py-2.5 text-sm text-gray-300 hover:bg-white/5">Ακύρωση</Link>
        </div>
      </form>
    </div>
  );
}
