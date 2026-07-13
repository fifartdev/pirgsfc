"use client";

import { useActionState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { MediaUpload } from "@/components/club-admin/MediaUpload";
import { updateSeoDefaultsAction } from "@/lib/club-admin/actions";

export interface SeoDefaultsEditData {
  titleTemplate: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImageId?: string;
  defaultOgImageUrl?: string;
  twitterHandle: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  robotsAdditional: string;
  orgName: string;
  orgUrl: string;
  orgLogoId?: string;
  orgLogoUrl?: string;
  orgFoundingYear?: number;
  orgSport: string;
  orgLocation: string;
}

const SECTION = "rounded-xl border border-white/10 bg-white/[0.02] p-6";
const SECTION_TITLE = "mb-5 text-sm font-semibold uppercase tracking-wide text-gray-400";

export function EditSeoDefaultsForm({ data }: { data: SeoDefaultsEditData }) {
  const [state, formAction, isPending] = useActionState(updateSeoDefaultsAction, null);

  useEffect(() => {
    if (state?.success) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state]);

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold text-white">Προεπιλογές SEO</h1>
      <p className="mb-8 text-sm text-gray-400">
        Προεπιλεγμένος τίτλος/περιγραφή, εικόνα κοινοποίησης, robots και structured data — χρησιμοποιούνται όταν μια
        σελίδα δεν ορίζει τα δικά της.
      </p>

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

      <form action={formAction} className="space-y-6">
        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Γενικά</h2>
          <FormField
            label="Πρότυπο τίτλου"
            name="titleTemplate"
            defaultValue={data.titleTemplate}
            hint="Χρησιμοποιήστε %s για τον τίτλο της σελίδας"
          />
          <div className="mt-4">
            <FormField label="Προεπιλεγμένος τίτλος" name="defaultTitle" defaultValue={data.defaultTitle} />
          </div>
          <div className="mt-4">
            <FormField
              label="Προεπιλεγμένη περιγραφή"
              name="defaultDescription"
              type="textarea"
              defaultValue={data.defaultDescription}
            />
          </div>
          <div className="mt-4">
            <MediaUpload
              name="defaultOgImage"
              label="Προεπιλεγμένη OG εικόνα"
              currentId={data.defaultOgImageId}
              currentUrl={data.defaultOgImageUrl}
            />
          </div>
          <div className="mt-4">
            <FormField label="Twitter / X handle" name="twitterHandle" defaultValue={data.twitterHandle} />
          </div>
        </div>

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Ρυθμίσεις robots</h2>
          <div className="space-y-3">
            <FormField label="Επιτρέπεται ευρετηρίαση" name="robotsIndex" type="checkbox" defaultValue={data.robotsIndex} />
            <FormField label="Επιτρέπεται ακολούθηση συνδέσμων" name="robotsFollow" type="checkbox" defaultValue={data.robotsFollow} />
          </div>
          <div className="mt-4">
            <FormField
              label="Επιπλέον οδηγίες robots.txt"
              name="robotsAdditional"
              type="textarea"
              defaultValue={data.robotsAdditional}
            />
          </div>
        </div>

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Βασικά structured data</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Όνομα οργανισμού" name="orgName" defaultValue={data.orgName} />
            <FormField label="URL οργανισμού" name="orgUrl" defaultValue={data.orgUrl} />
          </div>
          <div className="mt-4">
            <MediaUpload
              name="organizationLogo"
              label="Λογότυπο για structured data"
              currentId={data.orgLogoId}
              currentUrl={data.orgLogoUrl}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <FormField label="Έτος ίδρυσης" name="orgFoundingYear" type="number" defaultValue={data.orgFoundingYear} />
            <FormField label="Άθλημα" name="orgSport" defaultValue={data.orgSport} />
            <FormField label="Τοποθεσία" name="orgLocation" defaultValue={data.orgLocation} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Αποθήκευση…" : "Αποθήκευση αλλαγών"}
          </button>
        </div>
      </form>
    </div>
  );
}
