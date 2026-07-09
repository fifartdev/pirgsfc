import type { CollectionConfig } from "payload";
import { isSuperAdminOrClubAdmin, activeOnlyOrAuthenticated } from "@/lib/access";

export const Staff: CollectionConfig = {
  slug: "staff",
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "roleTitle", "status"],
    group: "Προσωπικό",
  },
  access: {
    read: activeOnlyOrAuthenticated,
    create: isSuperAdminOrClubAdmin,
    update: isSuperAdminOrClubAdmin,
    delete: isSuperAdminOrClubAdmin,
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "firstName", label: "Όνομα", type: "text", required: true },
        { name: "lastName", label: "Επώνυμο", type: "text", required: true },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "firstNameEn", label: "Όνομα (αγγλ.)", type: "text" },
        { name: "lastNameEn", label: "Επώνυμο (αγγλ.)", type: "text" },
      ],
    },
    {
      name: "fullName",
      label: "Πλήρες όνομα",
      type: "text",
      admin: { readOnly: true },
      hooks: {
        beforeChange: [
          ({ data }) => `${data?.firstName ?? ""} ${data?.lastName ?? ""}`.trim(),
        ],
      },
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
            if (!value && data?.firstNameEn && data?.lastNameEn) {
              return `${data.firstNameEn}-${data.lastNameEn}`
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            }
            return value;
          },
        ],
      },
    },
    { name: "roleTitle", label: "Τίτλος ρόλου (ελλ.)", type: "text" },
    { name: "roleTitleEn", label: "Τίτλος ρόλου (αγγλ.)", type: "text" },
    {
      name: "specialty",
      label: "Ειδικότητα (ελλ.)",
      type: "text",
    },
    {
      name: "specialtyEn",
      label: "Ειδικότητα (αγγλ.)",
      type: "text",
    },
    { name: "yearsOfExperience", label: "Χρόνια εμπειρίας", type: "number", min: 0 },
    { name: "biography", label: "Βιογραφικό (ελλ.)", type: "richText" },
    { name: "biographyEn", label: "Βιογραφικό (αγγλ.)", type: "richText" },
    {
      name: "profileImage",
      label: "Φωτογραφία",
      type: "upload",
      relationTo: "media",
    },
    {
      type: "row",
      fields: [
        { name: "email", label: "Email", type: "email" },
        { name: "phone", label: "Τηλέφωνο", type: "text" },
      ],
    },
    {
      name: "socialLinks",
      label: "Μέσα κοινωνικής δικτύωσης",
      type: "group",
      fields: [
        { name: "linkedin", label: "LinkedIn", type: "text" },
        { name: "twitter", label: "X / Twitter", type: "text" },
        { name: "instagram", label: "Instagram", type: "text" },
      ],
    },
    {
      name: "status",
      label: "Κατάσταση",
      type: "select",
      options: [
        { label: "Ενεργός", value: "active" },
        { label: "Ανενεργός", value: "inactive" },
        { label: "Αρχείο", value: "archived" },
      ],
      defaultValue: "active",
      required: true,
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
