import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { getCmsHomeContent } from "@/lib/cms-data";
import { EditHomeContentForm, type HomeContentEditData } from "./EditHomeContentForm";

export const metadata: Metadata = { title: "Περιεχόμενο Αρχικής" };

export default async function HomeContentPage() {
  await requireClubAdmin();
  // Prefilled with the *effective* text (CMS override if saved, otherwise
  // today's dictionary copy) so the admin edits what's actually live, not a
  // blank form that would otherwise misleadingly suggest nothing exists yet.
  const content = await getCmsHomeContent();

  const data: HomeContentEditData = {
    heroEyebrow: content.heroEyebrow.el,
    heroEyebrowEn: content.heroEyebrow.en,
    heroTitle1: content.heroTitle1.el,
    heroTitle1En: content.heroTitle1.en,
    heroTitleAccent: content.heroTitleAccent.el,
    heroTitleAccentEn: content.heroTitleAccent.en,
    heroTitle2: content.heroTitle2.el,
    heroTitle2En: content.heroTitle2.en,
    heroText: content.heroText.el,
    heroTextEn: content.heroText.en,
  };

  return <EditHomeContentForm data={data} />;
}
