"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { MediaUpload } from "@/components/club-admin/MediaUpload";
import { createClubAction } from "@/lib/club-admin/actions";

export default function NewClubPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createClubAction, null);
  useEffect(() => {
    if (state?.success) router.push("/club-admin/clubs");
  }, [state, router]);

  return (
    <div className="max-w-2xl">
      <Link href="/club-admin/clubs" className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Πίσω
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-white">Νέος Σύλλογος</h1>
      {state?.error && (
        <div className="mb-6 rounded-lg border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}
      <form action={formAction} className="space-y-5">
        <FormField label="Όνομα (ελλ.)" name="name" required />
        <FormField label="Όνομα (αγγλικά)" name="nameEn" />
        <MediaUpload name="logo" label="Λογότυπο / Έμβλημα" />
        <FormField
          label="Κατάσταση"
          name="status"
          type="select"
          defaultValue="active"
          options={[
            { value: "active", label: "Ενεργός" },
            { value: "archived", label: "Αρχειοθετημένος" },
          ]}
        />
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Αποθήκευση…" : "Αποθήκευση"}
          </button>
          <Link href="/club-admin/clubs" className="rounded-lg border border-white/10 px-6 py-2.5 text-sm text-gray-300 hover:bg-white/5">
            Ακύρωση
          </Link>
        </div>
      </form>
    </div>
  );
}
