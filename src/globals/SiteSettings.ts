import type { GlobalConfig } from "payload";
import { isSuperAdmin } from "@/lib/access";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Ρυθμίσεις Ιστοτόπου",
  admin: {
    group: "Ρυθμίσεις",
  },
  access: {
    read: () => true,
    update: isSuperAdmin,
  },
  fields: [
    {
      name: "siteName",
      label: "Όνομα ιστοτόπου",
      type: "text",
      defaultValue: "PYRGOS AFC",
    },
    {
      name: "siteUrl",
      label: "URL ιστοτόπου",
      type: "text",
      defaultValue: "https://pyrgosafc.example.com",
    },
    {
      name: "maintenanceMode",
      label: "Λειτουργία συντήρησης",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "defaultSeoTitle",
      label: "Προεπιλεγμένος SEO τίτλος",
      type: "text",
      defaultValue: "PYRGOS AFC — Επίσημος Ιστότοπος",
    },
    {
      name: "defaultSeoDescription",
      label: "Προεπιλεγμένη SEO περιγραφή",
      type: "textarea",
      defaultValue:
        "Επίσημος ιστότοπος του PYRGOS AFC. Αγώνες, νέα, παίκτες και πολλά ακόμα.",
    },
    {
      name: "defaultOgImage",
      label: "Προεπιλεγμένη Open Graph εικόνα",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "googleAnalyticsId",
      label: "Google Analytics ID",
      type: "text",
    },
    {
      name: "cookieBannerEnabled",
      label: "Εμφάνιση banner cookies",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "nav",
      label: "Πλοήγηση",
      type: "group",
      fields: [
        {
          name: "announcementBar",
          label: "Μπάρα ανακοίνωσης",
          type: "text",
        },
        {
          name: "announcementBarEnabled",
          label: "Ενεργοποίηση μπάρας ανακοίνωσης",
          type: "checkbox",
          defaultValue: false,
        },
      ],
    },
  ],
};
