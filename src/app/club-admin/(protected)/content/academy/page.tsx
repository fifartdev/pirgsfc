import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { getCmsAcademyContent } from "@/lib/cms-data";
import { ACADEMY_GROUP_FIELDS, ACADEMY_TEXT_KEYS } from "@/lib/academy-fields";
import { EditAcademyContentForm } from "./EditAcademyContentForm";

export const metadata: Metadata = { title: "Περιεχόμενο — Υποδομές" };

export default async function AcademyContentPage() {
  await requireClubAdmin();
  // Prefilled with the *effective* content (CMS if saved, otherwise the
  // built-in copy and age groups) so the admin edits what's actually live.
  const { texts, groups } = await getCmsAcademyContent();

  const textValues: Record<string, string> = {};
  for (const key of ACADEMY_TEXT_KEYS) {
    textValues[key] = texts[key].el;
    textValues[`${key}En`] = texts[key].en;
  }

  const groupValues = groups.map((g) =>
    Object.fromEntries(ACADEMY_GROUP_FIELDS.flatMap(({ key }) => [[key, g[key].el], [`${key}En`, g[key].en]]))
  );

  return <EditAcademyContentForm texts={textValues} groups={groupValues} />;
}
