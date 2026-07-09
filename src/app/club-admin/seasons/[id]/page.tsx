"use client";

import { useActionState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { updateSeasonAction } from "@/lib/club-admin/actions";
import { FormField } from "@/components/club-admin/FormField";
import { ArrowLeft } from "lucide-react";

// This is a client component that fetches data via the Payload REST API
// so we can keep it editable from the browser.
export default function EditSeasonPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updateSeasonAction, null);

  useEffect(() => {
    if (state?.success) router.push("/club-admin/seasons");
  }, [state, router]);

  return (
    <div className="max-w-2xl">
      <Link
        href="/club-admin/seasons"
        className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Πίσω στις σεζόν
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-white">Επεξεργασία Σεζόν</h1>

      {state?.error && (
        <div className="mb-6 rounded-lg border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="id" value={params.id} />

        <p className="rounded-lg border border-yellow-600/30 bg-yellow-600/10 px-4 py-3 text-sm text-yellow-400">
          Φορτώστε τα δεδομένα από τη λίστα και επεξεργαστείτε παρακάτω.
          Εναλλακτικά, χρησιμοποιήστε το{" "}
          <Link href="/admin" className="underline">
            Payload admin panel
          </Link>{" "}
          για πλήρη επεξεργασία.
        </p>

        <FormField label="Τίτλος" name="title" required placeholder="π.χ. 2025-2026" />

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Έτος έναρξης" name="startYear" type="number" required min={1900} max={2100} />
          <FormField label="Έτος λήξης" name="endYear" type="number" required min={1900} max={2100} />
        </div>

        <FormField
          label="Κατάσταση"
          name="status"
          type="select"
          options={[
            { value: "draft", label: "Πρόχειρο" },
            { value: "active", label: "Ενεργή" },
            { value: "archived", label: "Αρχειοθετημένη" },
          ]}
        />

        <FormField label="Τρέχουσα σεζόν" name="isCurrent" type="checkbox" />
        <FormField label="Περιγραφή" name="description" type="textarea" />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Αποθήκευση…" : "Αποθήκευση αλλαγών"}
          </button>
          <Link
            href="/club-admin/seasons"
            className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Ακύρωση
          </Link>
        </div>
      </form>
    </div>
  );
}
