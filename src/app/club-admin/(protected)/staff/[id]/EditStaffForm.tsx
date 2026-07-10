"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { RichTextEditor } from "@/components/club-admin/RichTextEditor";
import { updateStaffAction } from "@/lib/club-admin/actions";

export interface StaffEditData {
  id: string;
  firstName: string;
  lastName: string;
  firstNameEn?: string;
  lastNameEn?: string;
  fullName?: string;
  roleTitle?: string;
  roleTitleEn?: string;
  status?: string;
  biography?: unknown;
  biographyEn?: unknown;
}

export function EditStaffForm({ staff }: { staff: StaffEditData }) {
  const [state, formAction, isPending] = useActionState(updateStaffAction, null);

  return (
    <div className="max-w-2xl">
      <Link
        href="/club-admin/staff"
        className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Πίσω στο προσωπικό
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-white">
        Επεξεργασία — {staff.fullName ?? `${staff.firstName} ${staff.lastName}`}
      </h1>

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
        <input type="hidden" name="id" value={staff.id} />

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Όνομα *" name="firstName" required defaultValue={staff.firstName} />
          <FormField label="Επώνυμο *" name="lastName" required defaultValue={staff.lastName} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Όνομα (αγγλ.)" name="firstNameEn" defaultValue={staff.firstNameEn} />
          <FormField label="Επώνυμο (αγγλ.)" name="lastNameEn" defaultValue={staff.lastNameEn} />
        </div>
        <FormField label="Τίτλος ρόλου (ελλ.)" name="roleTitle" placeholder="π.χ. Προπονητής" defaultValue={staff.roleTitle} />
        <FormField label="Role title (EN)" name="roleTitleEn" placeholder="e.g. Head Coach" defaultValue={staff.roleTitleEn} />
        <FormField
          label="Κατάσταση"
          name="status"
          type="select"
          defaultValue={staff.status ?? "active"}
          options={[
            { value: "active", label: "Ενεργός" },
            { value: "inactive", label: "Ανενεργός" },
            { value: "archived", label: "Αρχείο" },
          ]}
        />

        <RichTextEditor name="biography" label="Βιογραφικό (ελλ.)" defaultValue={staff.biography} />
        <RichTextEditor name="biographyEn" label="Βιογραφικό (αγγλ.)" defaultValue={staff.biographyEn} />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Αποθήκευση…" : "Αποθήκευση αλλαγών"}
          </button>
          <Link
            href="/club-admin/staff"
            className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Ακύρωση
          </Link>
        </div>
      </form>
    </div>
  );
}
