import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { getCmsContactContent } from "@/lib/cms-data";
import { EditContactContentForm, type ContactContentEditData } from "./EditContactContentForm";

export const metadata: Metadata = { title: "Περιεχόμενο — Επικοινωνία" };

export default async function ContactContentPage() {
  await requireClubAdmin();
  const content = await getCmsContactContent();

  const data: ContactContentEditData = {
    heroEyebrow: content.eyebrow.el,
    heroEyebrowEn: content.eyebrow.en,
    heroTitle1: content.title1.el,
    heroTitle1En: content.title1.en,
    heroTitleAccent: content.titleAccent.el,
    heroTitleAccentEn: content.titleAccent.en,
    heroText: content.text.el,
    heroTextEn: content.text.en,
    deptGeneralTitle: content.departments.general.title.el,
    deptGeneralTitleEn: content.departments.general.title.en,
    deptGeneralText: content.departments.general.text.el,
    deptGeneralTextEn: content.departments.general.text.en,
    deptGeneralEmail: content.departments.general.email,
    deptMediaTitle: content.departments.media.title.el,
    deptMediaTitleEn: content.departments.media.title.en,
    deptMediaText: content.departments.media.text.el,
    deptMediaTextEn: content.departments.media.text.en,
    deptMediaEmail: content.departments.media.email,
    deptSponsorshipsTitle: content.departments.sponsorships.title.el,
    deptSponsorshipsTitleEn: content.departments.sponsorships.title.en,
    deptSponsorshipsText: content.departments.sponsorships.text.el,
    deptSponsorshipsTextEn: content.departments.sponsorships.text.en,
    deptSponsorshipsEmail: content.departments.sponsorships.email,
    deptAcademyTitle: content.departments.academy.title.el,
    deptAcademyTitleEn: content.departments.academy.title.en,
    deptAcademyText: content.departments.academy.text.el,
    deptAcademyTextEn: content.departments.academy.text.en,
    deptAcademyEmail: content.departments.academy.email,
    formEyebrow: content.formEyebrow.el,
    formEyebrowEn: content.formEyebrow.en,
    formTitle: content.formTitle.el,
    formTitleEn: content.formTitle.en,
    formText: content.formText.el,
    formTextEn: content.formText.en,
    detailsEyebrow: content.detailsEyebrow.el,
    detailsEyebrowEn: content.detailsEyebrow.en,
    detailsTitle: content.detailsTitle.el,
    detailsTitleEn: content.detailsTitle.en,
  };

  return <EditContactContentForm data={data} />;
}
