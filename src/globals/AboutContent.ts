import type { GlobalConfig } from "payload";
import { isSuperAdminOrClubAdmin } from "@/lib/access";

function bilingualText(name: string, label: string) {
  return {
    type: "row" as const,
    fields: [
      { name, label: `${label} (ελλ.)`, type: "text" as const },
      { name: `${name}En`, label: `${label} (αγγλ.)`, type: "text" as const },
    ],
  };
}

function bilingualTextarea(name: string, label: string) {
  return {
    type: "row" as const,
    fields: [
      { name, label: `${label} (ελλ.)`, type: "textarea" as const },
      { name: `${name}En`, label: `${label} (αγγλ.)`, type: "textarea" as const },
    ],
  };
}

/**
 * Narrative copy for the About page — hero, mission, headline stats, story
 * timeline, stadium blurb, fans/community blurb, and the closing quote.
 * Section headings shared with reusable UI (e.g. ClubValues) stay in the
 * static i18n dictionary; only this page's own prose is here. Empty fields
 * fall back to the static dictionary (see getCmsAboutContent in
 * src/lib/cms-data.ts).
 */
export const AboutContent: GlobalConfig = {
  slug: "about-content",
  label: "Περιεχόμενο — Σχετικά",
  admin: { group: "Περιεχόμενο Σελίδων" },
  access: {
    read: () => true,
    update: isSuperAdminOrClubAdmin,
  },
  fields: [
    {
      name: "hero",
      label: "Hero",
      type: "group",
      fields: [
        bilingualText("eyebrow", "Υπότιτλος"),
        bilingualText("title1", "Τίτλος μέρος 1"),
        bilingualText("titleAccent", "Τίτλος έμφαση"),
        bilingualTextarea("heroText", "Κείμενο"),
      ],
    },
    {
      name: "mission",
      label: "Αποστολή",
      type: "group",
      fields: [
        bilingualText("missionEyebrow", "Υπότιτλος"),
        bilingualText("missionTitle", "Τίτλος"),
        bilingualTextarea("mission1", "Παράγραφος 1"),
        bilingualTextarea("mission2", "Παράγραφος 2"),
        bilingualTextarea("mission3", "Παράγραφος 3"),
      ],
    },
    {
      name: "stats",
      label: "Στατιστικά (τιμές — ίδιες και στις δύο γλώσσες)",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            { name: "founded", label: "Έτος ίδρυσης", type: "text" },
            { name: "players", label: "Παίκτες", type: "text" },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "groups", label: "Ηλικιακά τμήματα", type: "text" },
            { name: "capacity", label: "Χωρητικότητα", type: "text" },
          ],
        },
      ],
    },
    {
      name: "story",
      label: "Ιστορία",
      type: "group",
      fields: [
        bilingualText("storyEyebrow", "Υπότιτλος"),
        bilingualText("storyTitle", "Τίτλος"),
        bilingualText("storyText", "Κείμενο"),
        {
          name: "timeline",
          label: "Χρονολόγιο",
          type: "array",
          labels: { singular: "Γεγονός", plural: "Γεγονότα" },
          fields: [
            { name: "year", label: "Έτος", type: "text", required: true },
            bilingualText("title", "Τίτλος"),
            bilingualTextarea("text", "Κείμενο"),
          ],
        },
      ],
    },
    {
      name: "stadium",
      label: "Γήπεδο",
      type: "group",
      fields: [
        bilingualText("stadiumEyebrow", "Υπότιτλος"),
        bilingualText("stadiumTitle", "Τίτλος"),
        bilingualTextarea("stadiumText", "Κείμενο"),
      ],
    },
    {
      name: "fans",
      label: "Φίλαθλοι & Κοινότητα",
      type: "group",
      fields: [
        bilingualText("fansEyebrow", "Υπότιτλος"),
        bilingualText("fansTitle", "Τίτλος"),
        bilingualText("fansText", "Κείμενο"),
        bilingualTextarea("fans1", "Παράγραφος 1"),
        bilingualTextarea("fans2", "Παράγραφος 2"),
      ],
    },
    {
      name: "quote",
      label: "Απόφθεγμα",
      type: "group",
      fields: [
        bilingualTextarea("text", "Κείμενο"),
        bilingualText("name", "Όνομα"),
        bilingualText("role", "Ιδιότητα"),
      ],
    },
  ],
};
