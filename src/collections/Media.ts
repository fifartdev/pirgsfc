import type { CollectionConfig } from "payload";
import { isSuperAdminOrClubAdmin } from "@/lib/access";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "filename",
    group: "Πολυμέσα",
  },
  access: {
    read: () => true,
    create: isSuperAdminOrClubAdmin,
    update: isSuperAdminOrClubAdmin,
    delete: isSuperAdminOrClubAdmin,
  },
  upload: {
    staticDir: "public/media",
    mimeTypes: ["image/*", "video/*", "application/pdf"],
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, fit: "cover" },
      { name: "card", width: 800, height: 600, fit: "cover" },
      { name: "hero", width: 1920, height: 1080, fit: "cover" },
    ],
    adminThumbnail: "thumbnail",
  },
  fields: [
    {
      name: "alt",
      label: "Εναλλακτικό κείμενο",
      type: "text",
    },
    {
      name: "caption",
      label: "Λεζάντα",
      type: "text",
    },
  ],
};
