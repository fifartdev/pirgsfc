import type { CollectionConfig } from "payload";
import { isSuperAdminOrClubAdmin, activeOnlyOrAuthenticated } from "@/lib/access";

export const Teams: CollectionConfig = {
  slug: "teams",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "status", "sortOrder"],
    group: "Σύλλογος",
  },
  access: {
    read: activeOnlyOrAuthenticated,
    create: isSuperAdminOrClubAdmin,
    update: isSuperAdminOrClubAdmin,
    delete: isSuperAdminOrClubAdmin,
  },
  fields: [
    {
      name: "name",
      label: "Όνομα ομάδας",
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
      name: "category",
      label: "Κατηγορία",
      type: "select",
      options: [
        { label: "Άντρες", value: "men" },
        { label: "Γυναίκες", value: "women" },
        { label: "Futsal", value: "futsal" },
        { label: "Νέοι", value: "youth" },
        { label: "Υποδομές", value: "academy" },
        { label: "Βετεράνοι", value: "veterans" },
        { label: "Άλλο", value: "other" },
      ],
      required: true,
    },
    {
      name: "ageGroup",
      label: "Ηλικιακή κατηγορία (π.χ. U19)",
      type: "text",
    },
    {
      name: "description",
      label: "Περιγραφή",
      type: "richText",
    },
    {
      name: "logo",
      label: "Λογότυπο / Έμβλημα",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "heroImage",
      label: "Εικόνα banner",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "status",
      label: "Κατάσταση",
      type: "select",
      options: [
        { label: "Ενεργή", value: "active" },
        { label: "Ανενεργή", value: "inactive" },
        { label: "Αρχειοθετημένη", value: "archived" },
      ],
      defaultValue: "active",
      required: true,
    },
    {
      name: "sortOrder",
      label: "Σειρά εμφάνισης",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "meta",
      label: "SEO",
      type: "group",
      fields: [
        { name: "title", label: "SEO Τίτλος", type: "text" },
        { name: "description", label: "SEO Περιγραφή", type: "textarea" },
        {
          name: "ogImage",
          label: "Open Graph εικόνα",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
  ],
  timestamps: true,
};
