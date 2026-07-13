import type { CollectionConfig } from "payload";
import { isSuperAdminOrClubAdmin } from "@/lib/access";

export const Rosters: CollectionConfig = {
  slug: "rosters",
  admin: {
    useAsTitle: "id",
    defaultColumns: ["player", "team", "season", "shirtNumber", "status"],
    group: "Ποδοσφαιριστές & Ρόστερ",
    description:
      "Κάθε εγγραφή αντιπροσωπεύει τη συμμετοχή ενός παίκτη σε μια ομάδα κατά τη διάρκεια μιας σεζόν. Ποτέ μην διαγράφετε ιστορικές εγγραφές.",
  },
  access: {
    read: () => true,
    create: isSuperAdminOrClubAdmin,
    update: isSuperAdminOrClubAdmin,
    delete: isSuperAdminOrClubAdmin,
  },
  fields: [
    {
      name: "season",
      label: "Σεζόν",
      type: "relationship",
      relationTo: "seasons",
      required: true,
    },
    {
      name: "team",
      label: "Ομάδα",
      type: "relationship",
      relationTo: "teams",
      required: true,
    },
    {
      name: "player",
      label: "Παίκτης",
      type: "relationship",
      relationTo: "players",
      required: true,
    },
    {
      name: "league",
      label: "Διοργάνωση (προαιρετικό)",
      type: "relationship",
      relationTo: "leagues",
    },
    {
      type: "row",
      fields: [
        {
          name: "shirtNumber",
          label: "Νούμερο φανέλας",
          type: "number",
          min: 1,
          max: 99,
        },
        {
          name: "position",
          label: "Θέση (σε αυτή τη σεζόν)",
          type: "select",
          options: [
            { label: "Τερματοφύλακας", value: "goalkeeper" },
            { label: "Αμυντικός", value: "defender" },
            { label: "Μέσος", value: "midfielder" },
            { label: "Επιθετικός", value: "forward" },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "isCaptain",
          label: "Αρχηγός",
          type: "checkbox",
          defaultValue: false,
        },
        {
          name: "isViceCaptain",
          label: "Αντιαρχηγός",
          type: "checkbox",
          defaultValue: false,
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "joinedDate", label: "Ημερομηνία εγγραφής", type: "date" },
        { name: "leftDate", label: "Ημερομηνία αποχώρησης", type: "date" },
      ],
    },
    {
      name: "status",
      label: "Κατάσταση",
      type: "select",
      options: [
        { label: "Ενεργός", value: "active" },
        { label: "Δανεισμός", value: "loaned" },
        { label: "Μεταγραφή", value: "transferred" },
        { label: "Τραυματίας", value: "injured" },
        { label: "Ανενεργός", value: "inactive" },
      ],
      defaultValue: "active",
      required: true,
    },
    {
      name: "stats",
      label: "Στατιστικά σεζόν",
      type: "group",
      admin: {
        description: "Στατιστικά του παίκτη σε αυτή την ομάδα, για αυτή τη σεζόν.",
      },
      fields: [
        {
          type: "row",
          fields: [
            { name: "appearances", label: "Συμμετοχές", type: "number", min: 0, defaultValue: 0 },
            { name: "goals", label: "Γκολ", type: "number", min: 0, defaultValue: 0 },
            { name: "assists", label: "Ασίστ", type: "number", min: 0, defaultValue: 0 },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "yellowCards", label: "Κίτρινες κάρτες", type: "number", min: 0, defaultValue: 0 },
            { name: "redCards", label: "Κόκκινες κάρτες", type: "number", min: 0, defaultValue: 0 },
            { name: "minutesPlayed", label: "Λεπτά συμμετοχής", type: "number", min: 0, defaultValue: 0 },
          ],
        },
        {
          name: "cleanSheets",
          label: "Καθαρά μηδενικά (τερματοφύλακες)",
          type: "number",
          min: 0,
          admin: { description: "Αφήστε κενό αν ο παίκτης δεν είναι τερματοφύλακας." },
        },
      ],
    },
    { name: "notes", label: "Σημειώσεις", type: "textarea" },
    { name: "sortOrder", label: "Σειρά εμφάνισης", type: "number", defaultValue: 0 },
  ],
  timestamps: true,
};
