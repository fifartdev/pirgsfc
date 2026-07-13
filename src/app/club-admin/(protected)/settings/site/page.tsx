import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { EditSiteSettingsForm, type SiteSettingsEditData } from "./EditSiteSettingsForm";

export const metadata: Metadata = { title: "Ρυθμίσεις Ιστότοπου" };

function mediaUrl(field: unknown): string | undefined {
  if (!field || typeof field !== "object") return undefined;
  const m = field as { url?: string };
  return typeof m.url === "string" ? m.url : undefined;
}

function mediaId(field: unknown): string | undefined {
  if (field == null) return undefined;
  if (typeof field === "object") return String((field as { id?: string | number }).id ?? "") || undefined;
  return String(field);
}

export default async function SiteSettingsPage() {
  const { payload, user } = await requireClubAdmin();

  if (user.role !== "superadmin") {
    return (
      <div className="flex max-w-lg items-start gap-3 rounded-xl border border-yellow-600/30 bg-yellow-600/10 p-6 text-sm text-yellow-200">
        <ShieldAlert className="h-5 w-5 shrink-0" />
        <div>
          <p className="font-semibold">Περιορισμένη πρόσβαση</p>
          <p className="mt-1 text-yellow-200/80">
            Οι σελίδα αφορά ρυθμίσεις που επηρεάζουν όλο τον ιστότοπο (λειτουργία συντήρησης, δίγλωσση λειτουργία)
            και είναι διαθέσιμη μόνο σε λογαριασμούς superadmin.
          </p>
        </div>
      </div>
    );
  }

  const doc = (await payload.findGlobal({ slug: "site-settings", depth: 1 })) as Record<string, unknown>;
  const nav = (doc.nav as Record<string, unknown>) ?? {};

  const data: SiteSettingsEditData = {
    siteName: (doc.siteName as string) ?? "",
    siteUrl: (doc.siteUrl as string) ?? "",
    maintenanceMode: Boolean(doc.maintenanceMode),
    bilingualEnabled: doc.bilingualEnabled !== false,
    defaultSeoTitle: (doc.defaultSeoTitle as string) ?? "",
    defaultSeoDescription: (doc.defaultSeoDescription as string) ?? "",
    defaultOgImageId: mediaId(doc.defaultOgImage),
    defaultOgImageUrl: mediaUrl(doc.defaultOgImage),
    googleAnalyticsId: (doc.googleAnalyticsId as string) ?? "",
    cookieBannerEnabled: Boolean(doc.cookieBannerEnabled),
    announcementBar: (nav.announcementBar as string) ?? "",
    announcementBarEnabled: Boolean(nav.announcementBarEnabled),
  };

  return <EditSiteSettingsForm data={data} />;
}
