import type { CollectionConfig } from "payload";
import { isSuperAdminOrClubAdmin } from "@/lib/access";

/**
 * Rival football clubs — created once here, then referenced by relationship
 * from Matches (opponentClub) and LeagueTables (rows.club) for any season.
 * Never PYRGOS AFC itself — our own squads live in Teams; a club-tables row
 * or match for our own side is identified by isPyrgos/isHomeMatch instead.
 */
export const Clubs: CollectionConfig = {
  slug: "clubs",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "status"],
    group: "Αγώνες & Εγκαταστάσεις",
    description: "Αντίπαλοι σύλλογοι — δημιουργούνται μία φορά εδώ, μετά επιλέγονται σε αγώνες και πίνακες βαθμολογίας.",
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
      label: "Όνομα (ελλ.)",
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
      name: "logo",
      label: "Λογότυπο / Έμβλημα",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "status",
      label: "Κατάσταση",
      type: "select",
      options: [
        { label: "Ενεργός", value: "active" },
        { label: "Αρχειοθετημένος", value: "archived" },
      ],
      defaultValue: "active",
      required: true,
    },
  ],
  timestamps: true,
};
