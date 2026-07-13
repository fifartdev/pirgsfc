import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { getCmsAboutContent } from "@/lib/cms-data";
import { EditAboutContentForm, type AboutContentEditData } from "./EditAboutContentForm";

export const metadata: Metadata = { title: "Περιεχόμενο — Σχετικά" };

export default async function AboutContentPage() {
  await requireClubAdmin();
  const content = await getCmsAboutContent();

  const data: AboutContentEditData = {
    heroEyebrow: content.eyebrow.el,
    heroEyebrowEn: content.eyebrow.en,
    heroTitle1: content.title1.el,
    heroTitle1En: content.title1.en,
    heroTitleAccent: content.titleAccent.el,
    heroTitleAccentEn: content.titleAccent.en,
    heroText: content.heroText.el,
    heroTextEn: content.heroText.en,
    missionEyebrow: content.missionEyebrow.el,
    missionEyebrowEn: content.missionEyebrow.en,
    missionTitle: content.missionTitle.el,
    missionTitleEn: content.missionTitle.en,
    mission1: content.mission1.el,
    mission1En: content.mission1.en,
    mission2: content.mission2.el,
    mission2En: content.mission2.en,
    mission3: content.mission3.el,
    mission3En: content.mission3.en,
    statFounded: content.statFounded,
    statPlayers: content.statPlayers,
    statGroups: content.statGroups,
    statCapacity: content.statCapacity,
    storyEyebrow: content.storyEyebrow.el,
    storyEyebrowEn: content.storyEyebrow.en,
    storyTitle: content.storyTitle.el,
    storyTitleEn: content.storyTitle.en,
    storyText: content.storyText.el,
    storyTextEn: content.storyText.en,
    timeline: content.timeline.map((t) => ({
      year: t.year,
      title: t.title.el,
      titleEn: t.title.en,
      text: t.text.el,
      textEn: t.text.en,
    })),
    stadiumEyebrow: content.stadiumEyebrow.el,
    stadiumEyebrowEn: content.stadiumEyebrow.en,
    stadiumTitle: content.stadiumTitle.el,
    stadiumTitleEn: content.stadiumTitle.en,
    stadiumText: content.stadiumText.el,
    stadiumTextEn: content.stadiumText.en,
    fansEyebrow: content.fansEyebrow.el,
    fansEyebrowEn: content.fansEyebrow.en,
    fansTitle: content.fansTitle.el,
    fansTitleEn: content.fansTitle.en,
    fansText: content.fansText.el,
    fansTextEn: content.fansText.en,
    fans1: content.fans1.el,
    fans1En: content.fans1.en,
    fans2: content.fans2.el,
    fans2En: content.fans2.en,
    quoteText: content.quote.el,
    quoteTextEn: content.quote.en,
    quoteName: content.quoteName.el,
    quoteNameEn: content.quoteName.en,
    quoteRole: content.quoteRole.el,
    quoteRoleEn: content.quoteRole.en,
  };

  return <EditAboutContentForm data={data} />;
}
