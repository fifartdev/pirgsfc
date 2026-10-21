import type { Field, GlobalConfig } from "payload";
import { isSuperAdminOrClubAdmin } from "@/lib/access";
import { ACADEMY_GROUP_FIELDS, ACADEMY_TEXT_SECTIONS } from "@/lib/academy-fields";

const input = (name: string, label: string, textarea?: boolean): Field =>
  textarea ? { name, label, type: "textarea" } : { name, label, type: "text" };

const bilingual = (key: string, label: string, textarea?: boolean): Field => ({
  type: "row",
  fields: [input(key, `${label} (ελλ.)`, textarea), input(`${key}En`, `${label} (αγγλ.)`, textarea)],
});

/**
 * Copy and age groups for the /academy (Υποδομές) page. Empty text fields
 * fall back to the i18n dictionary and an empty `groups` list falls back to
 * src/data/academy.ts (see getCmsAcademyContent in src/lib/cms-data.ts).
 */
export const AcademyContent: GlobalConfig = {
  slug: "academy-content",
  label: "Περιεχόμενο — Υποδομές",
  admin: { group: "Περιεχόμενο Σελίδων" },
  access: {
    read: () => true,
    update: isSuperAdminOrClubAdmin,
  },
  fields: [
    ...ACADEMY_TEXT_SECTIONS.flatMap((section) =>
      section.fields.map((f) => bilingual(f.key, `${section.title} — ${f.label}`, "textarea" in f))
    ),
    {
      name: "groups",
      label: "Τμήματα υποδομών",
      labels: { singular: "Τμήμα", plural: "Τμήματα" },
      type: "array",
      fields: ACADEMY_GROUP_FIELDS.map((f) => bilingual(f.key, f.label, "textarea" in f)),
    },
  ],
};
