import type { GlobalConfig } from "payload";
import { isSuperAdminOrClubAdmin } from "@/lib/access";

export const SeoDefaults: GlobalConfig = {
  slug: "seo-defaults",
  label: "Προεπιλογές SEO",
  admin: {
    group: "Ρυθμίσεις",
  },
  access: {
    read: () => true,
    update: isSuperAdminOrClubAdmin,
  },
  fields: [
    {
      name: "titleTemplate",
      label: "Πρότυπο τίτλου",
      type: "text",
      defaultValue: "%s | PYRGOS AFC",
      admin: { description: "Χρησιμοποιήστε %s για τον τίτλο της σελίδας" },
    },
    {
      name: "defaultTitle",
      label: "Προεπιλεγμένος τίτλος",
      type: "text",
      defaultValue: "PYRGOS AFC — Επίσημος Ιστότοπος",
    },
    {
      name: "defaultDescription",
      label: "Προεπιλεγμένη περιγραφή",
      type: "textarea",
      defaultValue:
        "Επίσημος ιστότοπος του PYRGOS AFC. Αγώνες, νέα, παίκτες, ακαδημία και πολλά ακόμα.",
    },
    {
      name: "defaultOgImage",
      label: "Προεπιλεγμένη OG εικόνα",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "twitterHandle",
      label: "Twitter / X handle",
      type: "text",
      defaultValue: "@pyrgosafc",
    },
    {
      name: "robots",
      label: "Ρυθμίσεις robots",
      type: "group",
      fields: [
        {
          name: "index",
          label: "Επιτρέπεται ευρετηρίαση",
          type: "checkbox",
          defaultValue: true,
        },
        {
          name: "follow",
          label: "Επιτρέπεται ακολούθηση συνδέσμων",
          type: "checkbox",
          defaultValue: true,
        },
        {
          name: "additionalDirectives",
          label: "Επιπλέον οδηγίες robots.txt",
          type: "textarea",
        },
      ],
    },
    {
      name: "structuredData",
      label: "Βασικά structured data",
      type: "group",
      fields: [
        {
          name: "organizationName",
          label: "Όνομα οργανισμού",
          type: "text",
          defaultValue: "PYRGOS AFC",
        },
        {
          name: "organizationUrl",
          label: "URL οργανισμού",
          type: "text",
          defaultValue: "https://pyrgosafc.example.com",
        },
        {
          name: "organizationLogo",
          label: "Λογότυπο για structured data",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "foundingYear",
          label: "Έτος ίδρυσης",
          type: "number",
          defaultValue: 2026,
        },
        {
          name: "sport",
          label: "Άθλημα",
          type: "text",
          defaultValue: "Football",
        },
        {
          name: "location",
          label: "Τοποθεσία (πόλη, χώρα)",
          type: "text",
          defaultValue: "Pyrgos, Greece",
        },
      ],
    },
  ],
};
