import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { EditClubInfoForm, type ClubInfoEditData } from "./EditClubInfoForm";

export const metadata: Metadata = { title: "Πληροφορίες Συλλόγου" };

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

export default async function ClubInfoSettingsPage() {
  const { payload } = await requireClubAdmin();
  const doc = (await payload.findGlobal({ slug: "club-info", depth: 1 })) as Record<string, unknown>;

  const stadium = (doc.stadium as Record<string, unknown>) ?? {};
  const contact = (doc.contact as Record<string, unknown>) ?? {};
  const colors = (doc.colors as Record<string, unknown>) ?? {};
  const socialMedia = (doc.socialMedia as Record<string, unknown>) ?? {};
  const values = Array.isArray(doc.values) ? (doc.values as Record<string, unknown>[]) : [];
  const sponsors = Array.isArray(doc.sponsors) ? (doc.sponsors as Record<string, unknown>[]) : [];

  const data: ClubInfoEditData = {
    name: (doc.name as string) ?? "",
    nameEn: (doc.nameEn as string) ?? "",
    shortName: (doc.shortName as string) ?? "",
    founded: (doc.founded as number) ?? undefined,
    logoId: mediaId(doc.logo),
    logoUrl: mediaUrl(doc.logo),
    colorsPrimary: (colors.primary as string) ?? "",
    colorsSecondary: (colors.secondary as string) ?? "",
    colorsAccent: (colors.accent as string) ?? "",
    stadiumName: (stadium.name as string) ?? "",
    stadiumNameEn: (stadium.nameEn as string) ?? "",
    stadiumCapacity: (stadium.capacity as string) ?? "",
    stadiumOpened: (stadium.opened as number) ?? undefined,
    contactEmail: (contact.email as string) ?? "",
    contactPhone: (contact.phone as string) ?? "",
    contactAddress: (contact.address as string) ?? "",
    contactAddressEn: (contact.addressEn as string) ?? "",
    contactCity: (contact.city as string) ?? "",
    contactPostalCode: (contact.postalCode as string) ?? "",
    socialInstagram: (socialMedia.instagram as string) ?? "",
    socialTwitter: (socialMedia.twitter as string) ?? "",
    socialFacebook: (socialMedia.facebook as string) ?? "",
    socialYoutube: (socialMedia.youtube as string) ?? "",
    socialTiktok: (socialMedia.tiktok as string) ?? "",
    about: doc.about,
    aboutEn: doc.aboutEn,
    values: values.map((v) => ({
      title: (v.title as string) ?? "",
      titleEn: (v.titleEn as string) ?? "",
      description: (v.description as string) ?? "",
      descriptionEn: (v.descriptionEn as string) ?? "",
    })),
    sponsors: sponsors.map((s) => ({
      name: (s.name as string) ?? "",
      tier: (s.tier as string) ?? "partner",
      tagline: (s.tagline as string) ?? "",
      taglineEn: (s.taglineEn as string) ?? "",
      url: (s.url as string) ?? "",
      logoId: mediaId(s.logo),
      logoUrl: mediaUrl(s.logo),
    })),
  };

  return <EditClubInfoForm data={data} />;
}
