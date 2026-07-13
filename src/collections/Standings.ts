import type { CollectionConfig } from "payload";
import { isSuperAdminOrClubAdmin } from "@/lib/access";

/**
 * One row = one team's position in one league, for one season. Manually
 * maintained: the site only records PYRGOS AFC's own matches (see
 * Matches.ts), not every fixture between rival clubs, so a full multi-team
 * table can't be computed automatically — an admin enters it from the
 * official league standings when they update.
 */
export const Standings: CollectionConfig = {
  slug: "standings",
  admin: {
    useAsTitle: "teamName",
    defaultColumns: ["league", "season", "position", "teamName", "points"],
    group: "Αγώνες & Εγκαταστάσεις",
    description:
      "Μία εγγραφή = μία ομάδα στον πίνακα βαθμολογίας μιας διοργάνωσης, για μία σεζόν. Ενημερώνεται χειροκίνητα.",
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
      type: "row",
      fields: [
        { name: "teamName", label: "Ομάδα (ελλ.)", type: "text", required: true },
        { name: "teamNameEn", label: "Ομάδα (αγγλ.)", type: "text" },
      ],
    },
    {
      name: "isPyrgos",
      label: "Ο PYRGOS AFC",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Επισημαίνεται ξεχωριστά στον δημόσιο πίνακα βαθμολογίας.",
      },
    },
    {
      name: "position",
      label: "Θέση",
      type: "number",
      min: 1,
      required: true,
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
  timestamps: true,
};
