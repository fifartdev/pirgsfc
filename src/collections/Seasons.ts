import type { CollectionConfig } from "payload";
import { isSuperAdminOrClubAdmin, activeOnlyOrAuthenticated } from "@/lib/access";

export const Seasons: CollectionConfig = {
  slug: "seasons",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "isCurrent", "startYear", "endYear"],
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
      name: "title",
      label: "Τίτλος (π.χ. 2025-2026)",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Αυτόματη παραγωγή από τον τίτλο",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return (data.title as string)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            }
            return value;
          },
        ],
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "startYear",
          label: "Έτος έναρξης",
          type: "number",
          required: true,
          min: 1900,
          max: 2100,
        },
        {
          name: "endYear",
          label: "Έτος λήξης",
          type: "number",
          required: true,
          min: 1900,
          max: 2100,
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "startDate",
          label: "Ημερομηνία έναρξης",
          type: "date",
        },
        {
          name: "endDate",
          label: "Ημερομηνία λήξης",
          type: "date",
        },
      ],
    },
    {
      name: "isCurrent",
      label: "Τρέχουσα σεζόν",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "status",
      label: "Κατάσταση",
      type: "select",
      options: [
        { label: "Πρόχειρο", value: "draft" },
        { label: "Ενεργή", value: "active" },
        { label: "Αρχειοθετημένη", value: "archived" },
      ],
      defaultValue: "draft",
      required: true,
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
