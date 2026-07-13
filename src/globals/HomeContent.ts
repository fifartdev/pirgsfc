import type { GlobalConfig } from "payload";
import { isSuperAdminOrClubAdmin } from "@/lib/access";

/**
 * Narrative copy for the homepage hero only — the rest of the homepage
 * (next match, results, departments, players, values, news, sponsors, CTA)
 * is either data-driven or shared "chrome" text edited elsewhere, per the
 * "fixed fields per page, narrative content only" scope for page-content
 * editing. Empty fields fall back to the static i18n dictionary
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
  ],
};
