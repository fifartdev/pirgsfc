import type { CollectionConfig } from "payload";
import { isSuperAdminOrClubAdmin } from "@/lib/access";

/**
 * One document = one full league table for one competition, in one season.
 * `rows` is a repeatable array — one entry per team — edited together as a
 * single table (add/remove/reorder rows) rather than one document per team.
 * Manually maintained: the site only records PYRGOS AFC's own fixtures (see
 * Matches.ts), not every match between rival clubs, so a full multi-team
 * table can't be computed automatically — an admin enters/updates it from
 * the official league standings.
 *
 * Row order IS the standing position (1st row = 1st place) — there's no
 * separate `position` number to keep in sync; reordering rows in the admin
 * UI reorders the table.
 */
export const LeagueTables: CollectionConfig = {
  slug: "league-tables",
  admin: {
    useAsTitle: "id",
    defaultColumns: ["league", "season", "updatedAt"],
    group: "Αγώνες & Εγκαταστάσεις",
    description:
      "Ένας πίνακας βαθμολογίας ανά διοργάνωση/σεζόν. Οι ομάδες είναι σειρές μέσα στον ίδιο πίνακα — η σειρά τους καθορίζει τη θέση.",
  },
  access: {
    read: () => true,
    create: isSuperAdminOrClubAdmin,
    update: isSuperAdminOrClubAdmin,
    delete: isSuperAdminOrClubAdmin,
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "season",
          label: "Σεζόν",
          type: "relationship",
          relationTo: "seasons",
          required: true,
        },
        {
          name: "league",
          label: "Διοργάνωση",
          type: "relationship",
          relationTo: "leagues",
          required: true,
        },
      ],
    },
    {
      name: "rows",
      label: "Ομάδες",
      labels: { singular: "Ομάδα", plural: "Ομάδες" },
      type: "array",
      fields: [
        {
          name: "isPyrgos",
          label: "Ο PYRGOS AFC",
          type: "checkbox",
          defaultValue: false,
        },
        {
          name: "club",
          label: "Σύλλογος",
          type: "relationship",
          relationTo: "clubs",
          admin: {
            description: "Υποχρεωτικό εκτός αν η σειρά αντιστοιχεί στον PYRGOS AFC.",
            condition: (_, siblingData) => !siblingData?.isPyrgos,
          },
        },
        {
          type: "row",
          fields: [
            { name: "played", label: "Αγώνες", type: "number", min: 0, defaultValue: 0 },
            { name: "won", label: "Νίκες", type: "number", min: 0, defaultValue: 0 },
            { name: "drawn", label: "Ισοπαλίες", type: "number", min: 0, defaultValue: 0 },
            { name: "lost", label: "Ήττες", type: "number", min: 0, defaultValue: 0 },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "goalsFor", label: "Γκολ υπέρ", type: "number", min: 0, defaultValue: 0 },
            { name: "goalsAgainst", label: "Γκολ κατά", type: "number", min: 0, defaultValue: 0 },
            { name: "points", label: "Βαθμοί", type: "number", min: 0, defaultValue: 0 },
          ],
        },
        {
          name: "notes",
          label: "Σημειώσεις",
          type: "text",
          admin: { description: 'Π.χ. "-3 βαθμοί (ποινή)" — εμφανίζεται δίπλα στην ομάδα.' },
        },
      ],
    },
  ],
  timestamps: true,
};
