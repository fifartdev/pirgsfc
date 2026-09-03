"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { MediaUpload } from "@/components/club-admin/MediaUpload";
import { updateClubAction } from "@/lib/club-admin/actions";

export interface ClubEditData {
  id: string;
  name: string;
  nameEn?: string;
  status: string;
  logoId?: string;
  logoUrl?: string;
}

export function EditClubForm({ club }: { club: ClubEditData }) {
  const [state, formAction, isPending] = useActionState(updateClubAction, null);

  return (
    <div className="max-w-2xl">
      <Link href="/club-admin/clubs" className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Πίσω στους συλλόγους
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-white">Επεξεργασία — {club.name}</h1>

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
        <input type="hidden" name="id" value={club.id} />

        <FormField label="Όνομα (ελλ.)" name="name" required defaultValue={club.name} />
        <FormField label="Όνομα (αγγλικά)" name="nameEn" defaultValue={club.nameEn} />
        <MediaUpload name="logo" label="Λογότυπο / Έμβλημα" currentId={club.logoId} currentUrl={club.logoUrl} />
        <FormField
          label="Κατάσταση"
          name="status"
          type="select"
          defaultValue={club.status}
          options={[
            { value: "active", label: "Ενεργός" },
            { value: "archived", label: "Αρχειοθετημένος" },
          ]}
        />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Αποθήκευση…" : "Αποθήκευση αλλαγών"}
          </button>
          <Link
            href="/club-admin/clubs"
            className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Ακύρωση
          </Link>
        </div>
      </form>
    </div>
  );
}
