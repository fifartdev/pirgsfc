import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { EditSeoDefaultsForm, type SeoDefaultsEditData } from "./EditSeoDefaultsForm";

export const metadata: Metadata = { title: "Προεπιλογές SEO" };

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

export default async function SeoDefaultsSettingsPage() {
  const { payload } = await requireClubAdmin();
  const doc = (await payload.findGlobal({ slug: "seo-defaults", depth: 1 })) as Record<string, unknown>;

  const robots = (doc.robots as Record<string, unknown>) ?? {};
  const structuredData = (doc.structuredData as Record<string, unknown>) ?? {};

  const data: SeoDefaultsEditData = {
    titleTemplate: (doc.titleTemplate as string) ?? "",
    defaultTitle: (doc.defaultTitle as string) ?? "",
    defaultDescription: (doc.defaultDescription as string) ?? "",
    defaultOgImageId: mediaId(doc.defaultOgImage),
    defaultOgImageUrl: mediaUrl(doc.defaultOgImage),
    twitterHandle: (doc.twitterHandle as string) ?? "",
    robotsIndex: robots.index !== false,
    robotsFollow: robots.follow !== false,
    robotsAdditional: (robots.additionalDirectives as string) ?? "",
    orgName: (structuredData.organizationName as string) ?? "",
    orgUrl: (structuredData.organizationUrl as string) ?? "",
    orgLogoId: mediaId(structuredData.organizationLogo),
    orgLogoUrl: mediaUrl(structuredData.organizationLogo),
    orgFoundingYear: (structuredData.foundingYear as number) ?? undefined,
    orgSport: (structuredData.sport as string) ?? "",
    orgLocation: (structuredData.location as string) ?? "",
  };

  return <EditSeoDefaultsForm data={data} />;
}
