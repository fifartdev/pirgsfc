import type { CollectionConfig } from "payload";
import { isSuperAdminOrClubAdmin, activeOnlyOrAuthenticated } from "@/lib/access";

export const Players: CollectionConfig = {
  slug: "players",
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "position", "nationality", "status"],
    group: "Ποδοσφαιριστές & Ρόστερ",
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
        { name: "firstNameEn", label: "Όνομα (αγγλικά)", type: "text" },
        { name: "lastNameEn", label: "Επώνυμο (αγγλικά)", type: "text" },
      ],
    },
    {
      name: "fullName",
      label: "Πλήρες όνομα",
      type: "text",
      admin: { readOnly: true },
      hooks: {
        beforeChange: [
          ({ data }) => {
            return `${data?.firstName ?? ""} ${data?.lastName ?? ""}`.trim();
          },
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
    {
      name: "displayName",
      label: "Εμφανιζόμενο όνομα (προαιρετικό)",
      type: "text",
    },
    {
      name: "dateOfBirth",
      label: "Ημερομηνία γέννησης",
      type: "date",
    },
    {
      type: "row",
      fields: [
        { name: "nationality", label: "Εθνικότητα", type: "text", defaultValue: "Ελληνική" },
        { name: "nationalityEn", label: "Εθνικότητα (αγγλικά)", type: "text", defaultValue: "Greek" },
      ],
    },
    {
      name: "position",
      label: "Θέση",
      type: "select",
      options: [
        { label: "Τερματοφύλακας", value: "goalkeeper" },
        { label: "Αμυντικός", value: "defender" },
        { label: "Μέσος", value: "midfielder" },
        { label: "Επιθετικός", value: "forward" },
      ],
      required: true,
    },
    {
      name: "preferredFoot",
      label: "Προτιμώμενο πόδι",
      type: "select",
      options: [
        { label: "Δεξί", value: "right" },
        { label: "Αριστερό", value: "left" },
        { label: "Αμφίπλευρος", value: "both" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "heightCm", label: "Ύψος (cm)", type: "number", min: 100, max: 230 },
        { name: "weightKg", label: "Βάρος (kg)", type: "number", min: 40, max: 150 },
      ],
    },
    {
      name: "defaultShirtNumber",
      label: "Αριθμός φανέλας (προεπιλογή)",
      type: "number",
      min: 1,
      max: 99,
    },
    {
      name: "biography",
      label: "Βιογραφικό",
      type: "richText",
    },
    {
      name: "biographyEn",
      label: "Βιογραφικό (αγγλικά)",
      type: "richText",
    },
    {
      name: "profileImage",
      label: "Φωτογραφία",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "gallery",
      label: "Γκαλερί",
      type: "array",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        { name: "caption", type: "text", label: "Λεζάντα" },
      ],
    },
    {
      name: "socialLinks",
      label: "Μέσα κοινωνικής δικτύωσης",
      type: "group",
      fields: [
        { name: "instagram", label: "Instagram", type: "text" },
        { name: "twitter", label: "X / Twitter", type: "text" },
        { name: "facebook", label: "Facebook", type: "text" },
      ],
    },
    {
      name: "status",
      label: "Κατάσταση",
      type: "select",
      options: [
        { label: "Ενεργός", value: "active" },
        { label: "Ανενεργός", value: "inactive" },
        { label: "Μεταγραφή", value: "transferred" },
        { label: "Απόσυρση", value: "retired" },
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
