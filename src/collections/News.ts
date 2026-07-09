import type { CollectionConfig } from "payload";
import { isSuperAdminOrClubAdmin, publishedOnlyOrAuthenticated } from "@/lib/access";

export const News: CollectionConfig = {
  slug: "news",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "publishedDate", "category"],
    group: "Νέα",
  },
  access: {
    read: publishedOnlyOrAuthenticated,
    create: isSuperAdminOrClubAdmin,
    update: isSuperAdminOrClubAdmin,
    delete: isSuperAdminOrClubAdmin,
  },
  versions: {
    drafts: true,
  },
  fields: [
    // Title / slug
    { name: "title", label: "Τίτλος (ελλ.)", type: "text", required: true },
    { name: "titleEn", label: "Τίτλος (αγγλ.)", type: "text" },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.titleEn) {
              return (data.titleEn as string)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            }
            return value;
          },
        ],
      },
    },

    // Excerpt
    { name: "excerpt", label: "Περίληψη (ελλ.)", type: "textarea" },
    { name: "excerptEn", label: "Περίληψη (αγγλ.)", type: "textarea" },

    // Content
    { name: "content", label: "Περιεχόμενο (ελλ.)", type: "richText" },
    { name: "contentEn", label: "Περιεχόμενο (αγγλ.)", type: "richText" },

    // Media
    {
      name: "featuredImage",
      label: "Κύρια εικόνα",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "gallery",
      label: "Γκαλερί",
      type: "array",
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "caption", type: "text", label: "Λεζάντα" },
      ],
    },

    // Taxonomy
    {
      name: "category",
      label: "Κατηγορία",
      type: "relationship",
      relationTo: "news-categories",
    },
    {
      name: "tags",
      label: "Ετικέτες",
      type: "array",
      fields: [{ name: "tag", type: "text", required: true }],
    },

    // Author
    { name: "author", label: "Συγγραφέας (ελλ.)", type: "text", defaultValue: "Ομάδα Επικοινωνίας" },
    { name: "authorEn", label: "Συγγραφέας (αγγλ.)", type: "text", defaultValue: "Club Media Team" },

    // Date / Status
    { name: "publishedDate", label: "Ημερομηνία δημοσίευσης", type: "date" },
    {
      name: "status",
      label: "Κατάσταση",
      type: "select",
      options: [
        { label: "Πρόχειρο", value: "draft" },
        { label: "Δημοσιευμένο", value: "published" },
        { label: "Αρχειοθετημένο", value: "archived" },
      ],
      defaultValue: "draft",
      required: true,
    },
    { name: "readingTime", label: "Χρόνος ανάγνωσης (λεπτά)", type: "number", defaultValue: 3, min: 1 },

    // Relations
    {
      name: "relatedTeam",
      label: "Σχετική ομάδα",
      type: "relationship",
      relationTo: "teams",
    },
    {
      name: "relatedSeason",
      label: "Σχετική σεζόν",
      type: "relationship",
      relationTo: "seasons",
    },
    {
      name: "relatedMatch",
      label: "Σχετικός αγώνας",
      type: "relationship",
      relationTo: "matches",
    },
    {
      name: "relatedPlayers",
      label: "Σχετικοί παίκτες",
      type: "relationship",
      relationTo: "players",
      hasMany: true,
    },

    // SEO
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
        { name: "canonicalUrl", label: "Canonical URL", type: "text" },
        {
          name: "noIndex",
          label: "Χωρίς ευρετηρίαση (noindex)",
          type: "checkbox",
          defaultValue: false,
        },
      ],
    },
  ],
  timestamps: true,
};
