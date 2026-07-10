"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { createTeamAction } from "@/lib/club-admin/actions";

export default function NewTeamPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createTeamAction, null);

  useEffect(() => {
    if (state?.success) router.push("/club-admin/teams");
  }, [state, router]);

  return (
    <div className="max-w-2xl">
      <Link href="/club-admin/teams" className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Πίσω στις ομάδες
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-white">Νέα Ομάδα</h1>
      {state?.error && (
        <div className="mb-6 rounded-lg border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}
      <form action={formAction} className="space-y-5">
        <FormField label="Όνομα ομάδας" name="name" required />
        <FormField label="Όνομα (αγγλικά)" name="nameEn" />
        <FormField
          label="Κατηγορία"
          name="category"
          type="select"
          required
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
        <FormField label="Ηλικιακή κατηγορία (π.χ. U19)" name="ageGroup" />
        <FormField
          label="Κατάσταση"
          name="status"
          type="select"
          defaultValue="active"
          options={[
            { value: "active", label: "Ενεργή" },
            { value: "inactive", label: "Ανενεργή" },
            { value: "archived", label: "Αρχειοθετημένη" },
          ]}
        />
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isPending} className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60">
            {isPending ? "Αποθήκευση…" : "Αποθήκευση"}
          </button>
          <Link href="/club-admin/teams" className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5">
            Ακύρωση
          </Link>
        </div>
      </form>
    </div>
  );
}
