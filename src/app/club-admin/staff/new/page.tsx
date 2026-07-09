"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { createStaffAction } from "@/lib/club-admin/actions";

export default function NewStaffPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createStaffAction, null);
  useEffect(() => { if (state?.success) router.push("/club-admin/staff"); }, [state, router]);

  return (
    <div className="max-w-2xl">
      <Link href="/club-admin/staff" className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Πίσω</Link>
      <h1 className="mb-8 text-2xl font-bold text-white">Νέο Μέλος Προσωπικού</h1>
      {state?.error && <div className="mb-6 rounded-lg border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-400">{state.error}</div>}
      <form action={formAction} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Όνομα *" name="firstName" required />
          <FormField label="Επώνυμο *" name="lastName" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Όνομα (αγγλ.)" name="firstNameEn" />
          <FormField label="Επώνυμο (αγγλ.)" name="lastNameEn" />
        </div>
        <FormField label="Τίτλος ρόλου (ελλ.)" name="roleTitle" placeholder="π.χ. Προπονητής" />
        <FormField label="Role title (EN)" name="roleTitleEn" placeholder="e.g. Head Coach" />
        <FormField label="Κατάσταση" name="status" type="select" defaultValue="active" options={[
          { value: "active", label: "Ενεργός" },
          { value: "inactive", label: "Ανενεργός" },
          { value: "archived", label: "Αρχείο" },
        ]} />
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isPending} className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">{isPending ? "Αποθήκευση…" : "Αποθήκευση"}</button>
          <Link href="/club-admin/staff" className="rounded-lg border border-white/10 px-6 py-2.5 text-sm text-gray-300 hover:bg-white/5">Ακύρωση</Link>
        </div>
      </form>
    </div>
  );
}
