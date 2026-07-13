import type { CollectionConfig, PayloadRequest } from "payload";
import { isSuperAdmin } from "@/lib/access";

const adminPanelAccess = ({ req }: { req: PayloadRequest }): boolean =>
  (req.user as { role?: string } | null)?.role === "superadmin";

export const Users: CollectionConfig = {
  slug: "users",
  // Matches the secure/sameSite flags the hand-rolled club-admin login already
  // sets on this same "payload-token" cookie (src/lib/club-admin/actions.ts) —
  // without this override Payload's own /admin login falls back to `secure:
  // false`, so the superadmin session cookie wouldn't be marked HTTPS-only.
  auth: {
    cookies: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    },
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "firstName", "lastName", "role"],
    group: "Διαχείριση",
  },
  access: {
    read: isSuperAdmin,
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
    admin: adminPanelAccess,
  },
  fields: [
    {
      name: "firstName",
      label: "Όνομα",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      label: "Επώνυμο",
      type: "text",
      required: true,
    },
    {
      name: "role",
      label: "Ρόλος",
      type: "select",
      options: [
        { label: "Superadmin", value: "superadmin" },
        { label: "Club Admin (Διαχειριστής Συλλόγου)", value: "club_admin" },
      ],
      required: true,
      defaultValue: "club_admin",
      admin: {
        description:
          "Superadmin: πρόσβαση στο Payload admin panel. Club Admin: πρόσβαση μόνο στο ελληνικό admin panel.",
      },
    },
  ],
  timestamps: true,
};
