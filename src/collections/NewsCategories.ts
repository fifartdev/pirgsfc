import type { CollectionConfig } from "payload";
import { isSuperAdminOrClubAdmin } from "@/lib/access";

export const NewsCategories: CollectionConfig = {
  slug: "news-categories",
  admin: {
    useAsTitle: "name",
    group: "Νέα",
  },
  access: {
    read: () => true,
    create: isSuperAdminOrClubAdmin,
    update: isSuperAdminOrClubAdmin,
    delete: isSuperAdminOrClubAdmin,
  },
  fields: [
    { name: "name", label: "Όνομα κατηγορίας", type: "text", required: true },
    { name: "nameEn", label: "Όνομα (αγγλικά)", type: "text" },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.nameEn) {
              return (data.nameEn as string)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            }
            return value;
          },
        ],
      },
    },
    { name: "color", label: "Χρώμα (hex)", type: "text" },
  ],
  timestamps: true,
};
