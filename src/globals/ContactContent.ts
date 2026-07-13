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

function department(name: string, label: string) {
  return {
    name,
    label,
    type: "group" as const,
    fields: [bilingualText("title", "Τίτλος"), bilingualText("text", "Κείμενο"), { name: "email", label: "Email", type: "email" as const }],
  };
}

/**
 * Narrative copy for the Contact page — hero, the four fixed department
 * blurbs (general/media/sponsorships/academy — always this shape, so a
 * fixed group each rather than a generic array), and the form/details
 * section headings. Contact values themselves (address, phone, main email,
 * social links) come from ClubInfo, not here. Empty fields fall back to the
 * static dictionary (see getCmsContactContent in src/lib/cms-data.ts).
 */
export const ContactContent: GlobalConfig = {
  slug: "contact-content",
  label: "Περιεχόμενο — Επικοινωνία",
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
        bilingualTextarea("text", "Κείμενο"),
      ],
    },
    {
      name: "departments",
      label: "Τμήματα Επικοινωνίας",
      type: "group",
      fields: [
        department("general", "Γενικές Πληροφορίες"),
        department("media", "Μέσα Ενημέρωσης"),
        department("sponsorships", "Χορηγίες"),
        department("academy", "Υποδομές"),
      ],
    },
    {
      name: "form",
      label: "Φόρμα επικοινωνίας",
      type: "group",
      fields: [
        bilingualText("formEyebrow", "Υπότιτλος"),
        bilingualText("formTitle", "Τίτλος"),
        bilingualTextarea("formText", "Κείμενο"),
      ],
    },
    {
      name: "details",
      label: "Στοιχεία συλλόγου",
      type: "group",
      fields: [bilingualText("detailsEyebrow", "Υπότιτλος"), bilingualText("detailsTitle", "Τίτλος")],
    },
  ],
};
