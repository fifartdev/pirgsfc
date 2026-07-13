"use client";

import { useActionState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { MediaUpload } from "@/components/club-admin/MediaUpload";
import { updateSiteSettingsAction } from "@/lib/club-admin/actions";

export interface SiteSettingsEditData {
  siteName: string;
  siteUrl: string;
  maintenanceMode: boolean;
  bilingualEnabled: boolean;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  defaultOgImageId?: string;
  defaultOgImageUrl?: string;
  googleAnalyticsId: string;
  cookieBannerEnabled: boolean;
  announcementBar: string;
  announcementBarEnabled: boolean;
}

const SECTION = "rounded-xl border border-white/10 bg-white/[0.02] p-6";
const SECTION_TITLE = "mb-5 text-sm font-semibold uppercase tracking-wide text-gray-400";

export function EditSiteSettingsForm({ data }: { data: SiteSettingsEditData }) {
  const [state, formAction, isPending] = useActionState(updateSiteSettingsAction, null);

  useEffect(() => {
    if (state?.success) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state]);

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold text-white">Ρυθμίσεις Ιστότοπου</h1>
      <p className="mb-8 text-sm text-gray-400">
        Λειτουργίες που επηρεάζουν όλο τον ιστότοπο — προσοχή στη λειτουργία συντήρησης και τη δίγλωσση λειτουργία.
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
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Όνομα ιστοτόπου" name="siteName" defaultValue={data.siteName} />
            <FormField label="URL ιστοτόπου" name="siteUrl" defaultValue={data.siteUrl} />
          </div>
        </div>

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Λειτουργίες (sitewide)</h2>
          <div className="space-y-3">
            <FormField
              label="Λειτουργία συντήρησης"
              name="maintenanceMode"
              type="checkbox"
              defaultValue={data.maintenanceMode}
              hint="Εμφανίζει σελίδα συντήρησης σε όλους τους επισκέπτες."
            />
            <FormField
              label="Ενεργοποίηση αγγλικής γλώσσας"
              name="bilingualEnabled"
              type="checkbox"
              defaultValue={data.bilingualEnabled}
              hint="Όταν είναι απενεργοποιημένο, οι αγγλικές σελίδες ανακατευθύνονται στην ελληνική έκδοση, εξαιρούνται από το sitemap και ο επιλογέας γλώσσας κρύβεται."
            />
            <FormField
              label="Εμφάνιση banner cookies"
              name="cookieBannerEnabled"
              type="checkbox"
              defaultValue={data.cookieBannerEnabled}
            />
          </div>
        </div>

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>SEO & Analytics</h2>
          <FormField label="Προεπιλεγμένος SEO τίτλος" name="defaultSeoTitle" defaultValue={data.defaultSeoTitle} />
          <div className="mt-4">
            <FormField
              label="Προεπιλεγμένη SEO περιγραφή"
              name="defaultSeoDescription"
              type="textarea"
              defaultValue={data.defaultSeoDescription}
            />
          </div>
          <div className="mt-4">
            <MediaUpload
              name="defaultOgImage"
              label="Προεπιλεγμένη Open Graph εικόνα"
              currentId={data.defaultOgImageId}
              currentUrl={data.defaultOgImageUrl}
            />
          </div>
          <div className="mt-4">
            <FormField label="Google Analytics ID" name="googleAnalyticsId" defaultValue={data.googleAnalyticsId} />
          </div>
        </div>

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Μπάρα ανακοίνωσης</h2>
          <FormField
            label="Ενεργοποίηση μπάρας ανακοίνωσης"
            name="announcementBarEnabled"
            type="checkbox"
            defaultValue={data.announcementBarEnabled}
          />
          <div className="mt-4">
            <FormField label="Κείμενο μπάρας ανακοίνωσης" name="announcementBar" defaultValue={data.announcementBar} />
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
