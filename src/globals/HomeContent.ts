import type { GlobalConfig } from "payload";
import { isSuperAdminOrClubAdmin } from "@/lib/access";

/**
 * Narrative copy for the homepage: the hero plus the club-values and sponsors
 * section headings (the values/sponsors lists themselves are ClubInfo data).
 * Empty fields fall back to the static i18n dictionary
 * (see getCmsHomeContent in src/lib/cms-data.ts).
 */
export const HomeContent: GlobalConfig = {
  slug: "home-content",
  label: "Περιεχόμενο Αρχικής",
  admin: { group: "Περιεχόμενο Σελίδων" },
  access: {
    read: () => true,
    update: isSuperAdminOrClubAdmin,
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "heroEyebrow", label: "Hero — Υπότιτλος (ελλ.)", type: "text" },
        { name: "heroEyebrowEn", label: "Hero — Υπότιτλος (αγγλ.)", type: "text" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "heroTitle1", label: "Hero — Τίτλος μέρος 1 (ελλ.)", type: "text" },
        { name: "heroTitle1En", label: "Hero — Τίτλος μέρος 1 (αγγλ.)", type: "text" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "heroTitleAccent", label: "Hero — Τίτλος έμφαση (ελλ.)", type: "text" },
        { name: "heroTitleAccentEn", label: "Hero — Τίτλος έμφαση (αγγλ.)", type: "text" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "heroTitle2", label: "Hero — Τίτλος μέρος 2 (ελλ.)", type: "text" },
        { name: "heroTitle2En", label: "Hero — Τίτλος μέρος 2 (αγγλ.)", type: "text" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "heroText", label: "Hero — Κείμενο (ελλ.)", type: "textarea" },
        { name: "heroTextEn", label: "Hero — Κείμενο (αγγλ.)", type: "textarea" },
      ],
    },
    // Section headings only — the values/sponsors themselves live in ClubInfo.
    {
      type: "row",
      fields: [
        { name: "valuesEyebrow", label: "Αξίες — Υπότιτλος (ελλ.)", type: "text" },
        { name: "valuesEyebrowEn", label: "Αξίες — Υπότιτλος (αγγλ.)", type: "text" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "valuesTitle", label: "Αξίες — Τίτλος (ελλ.)", type: "text" },
        { name: "valuesTitleEn", label: "Αξίες — Τίτλος (αγγλ.)", type: "text" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "valuesText", label: "Αξίες — Κείμενο (ελλ.)", type: "textarea" },
        { name: "valuesTextEn", label: "Αξίες — Κείμενο (αγγλ.)", type: "textarea" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "sponsorsTitle", label: "Χορηγοί — Τίτλος (ελλ.)", type: "text" },
        { name: "sponsorsTitleEn", label: "Χορηγοί — Τίτλος (αγγλ.)", type: "text" },
      ],
    },
  ],
};
