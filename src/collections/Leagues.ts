import type { CollectionConfig } from "payload";
import { isSuperAdminOrClubAdmin } from "@/lib/access";

export const Leagues: CollectionConfig = {
  slug: "leagues",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "type", "category", "country"],
    group: "Σύλλογος",
  },
  access: {
    read: () => true,
    create: isSuperAdminOrClubAdmin,
    update: isSuperAdminOrClubAdmin,
    delete: isSuperAdminOrClubAdmin,
  },
  fields: [
    {
      name: "name",
      label: "Όνομα διοργάνωσης",
      type: "text",
      required: true,
    },
    {
      name: "nameEn",
      label: "Όνομα (αγγλικά)",
      type: "text",
    },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return (data.name as string)
                .toLowerCase()
                .normalize("NFD")
                .replace(/[̀-ͯ]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            }
            return value;
          },
        ],
      },
    },
    {
      name: "type",
      label: "Τύπος",
      type: "select",
      options: [
        { label: "Πρωτάθλημα", value: "league" },
        { label: "Κύπελλο", value: "cup" },
        { label: "Φιλικό", value: "friendly" },
        { label: "Τουρνουά", value: "tournament" },
        { label: "Άλλο", value: "other" },
      ],
      required: true,
      defaultValue: "league",
    },
    {
      name: "category",
      label: "Κατηγορία",
      type: "select",
      options: [
        { label: "Άντρες", value: "men" },
        { label: "Γυναίκες", value: "women" },
        { label: "Futsal", value: "futsal" },
        { label: "Νέοι", value: "youth" },
        { label: "Μεικτή", value: "mixed" },
        { label: "Άλλο", value: "other" },
      ],
      required: true,
    },
    {
      name: "organizer",
      label: "Διοργανωτής",
      type: "text",
    },
    {
      type: "row",
      fields: [
        { name: "country", label: "Χώρα", type: "text", defaultValue: "Ελλάδα" },
        { name: "region", label: "Περιφέρεια", type: "text" },
        { name: "level", label: "Επίπεδο / Βαθμίδα", type: "text" },
      ],
    },
    {
      name: "logo",
      label: "Λογότυπο",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "websiteUrl",
      label: "Ιστοσελίδα",
      type: "text",
    },
    {
      name: "description",
      label: "Περιγραφή",
      type: "textarea",
    },
    {
      name: "meta",
      label: "SEO",
      type: "group",
      fields: [
        { name: "title", label: "SEO Τίτλος", type: "text" },
        { name: "description", label: "SEO Περιγραφή", type: "textarea" },
      ],
    },
  ],
  timestamps: true,
};
