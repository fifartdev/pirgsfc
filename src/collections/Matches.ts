import type { CollectionConfig } from "payload";
import { isSuperAdminOrClubAdmin, nonDraftOrAuthenticated } from "@/lib/access";

export const Matches: CollectionConfig = {
  slug: "matches",
  admin: {
    useAsTitle: "id",
    defaultColumns: ["homeTeamName", "awayTeamName", "matchDate", "status", "team"],
    group: "Αγώνες & Εγκαταστάσεις",
  },
  access: {
    read: nonDraftOrAuthenticated,
    create: isSuperAdminOrClubAdmin,
    update: isSuperAdminOrClubAdmin,
    delete: isSuperAdminOrClubAdmin,
  },
  fields: [
    // Relationships
    {
      name: "season",
      label: "Σεζόν",
      type: "relationship",
      relationTo: "seasons",
      required: true,
    },
    {
      name: "team",
      label: "Ομάδα PYRGOS AFC",
      type: "relationship",
      relationTo: "teams",
      required: true,
    },
    {
      name: "league",
      label: "Διοργάνωση",
      type: "relationship",
      relationTo: "leagues",
      required: true,
    },
    {
      name: "venue",
      label: "Γήπεδο",
      type: "relationship",
      relationTo: "venues",
    },

    // Match type
    {
      name: "matchType",
      label: "Τύπος αγώνα",
      type: "select",
      options: [
        { label: "Πρωτάθλημα", value: "league" },
        { label: "Κύπελλο", value: "cup" },
        { label: "Φιλικό", value: "friendly" },
        { label: "Τουρνουά", value: "tournament" },
        { label: "Play-off", value: "playoff" },
        { label: "Άλλο", value: "other" },
      ],
      defaultValue: "league",
      required: true,
    },

    // Teams
    {
      type: "row",
      fields: [
        { name: "homeTeamName", label: "Γηπεδούχος (ελλ.)", type: "text", required: true },
        { name: "awayTeamName", label: "Φιλοξενούμενος (ελλ.)", type: "text", required: true },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "homeTeamNameEn", label: "Γηπεδούχος (αγγλ.)", type: "text" },
        { name: "awayTeamNameEn", label: "Φιλοξενούμενος (αγγλ.)", type: "text" },
      ],
    },
    {
      name: "homeTeamInternal",
      label: "Γηπεδούχος (εσωτερική ομάδα)",
      type: "relationship",
      relationTo: "teams",
    },
    {
      name: "awayTeamInternal",
      label: "Φιλοξενούμενος (εσωτερική ομάδα)",
      type: "relationship",
      relationTo: "teams",
    },
    {
      name: "isHomeMatch",
      label: "Εντός έδρας",
      type: "checkbox",
      defaultValue: true,
    },

    // Score
    {
      type: "row",
      fields: [
        { name: "homeScore", label: "Γκολ γηπεδούχου", type: "number", min: 0 },
        { name: "awayScore", label: "Γκολ φιλοξενούμενου", type: "number", min: 0 },
      ],
    },

    // Date / Time
    {
      type: "row",
      fields: [
        { name: "matchDate", label: "Ημερομηνία", type: "date", required: true },
        { name: "kickoffTime", label: "Ώρα έναρξης", type: "text" },
      ],
    },

    // Competition info
    {
      type: "row",
      fields: [
        { name: "matchweek", label: "Αγωνιστική / Φάση", type: "text" },
        { name: "matchweekEn", label: "Αγωνιστική / Φάση (αγγλ.)", type: "text" },
      ],
    },

    // Status
    {
      name: "status",
      label: "Κατάσταση",
      type: "select",
      options: [
        { label: "Προγραμματισμένος", value: "scheduled" },
        { label: "Σε εξέλιξη", value: "live" },
        { label: "Ολοκληρώθηκε", value: "completed" },
        { label: "Αναβλήθηκε", value: "postponed" },
        { label: "Ακυρώθηκε", value: "cancelled" },
        { label: "Πρόχειρο", value: "draft" },
        { label: "Δημοσιευμένο", value: "published" },
      ],
      defaultValue: "scheduled",
      required: true,
    },

    // Links
    {
      type: "row",
      fields: [
        { name: "ticketUrl", label: "Σύνδεσμος εισιτηρίων", type: "text" },
        { name: "livestreamUrl", label: "Σύνδεσμος livestream", type: "text" },
      ],
    },

    // Content
    {
      name: "matchPreview",
      label: "Προεπισκόπηση αγώνα",
      type: "richText",
    },
    {
      name: "matchReport",
      label: "Ρεπορτάζ αγώνα",
      type: "richText",
    },
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

    // Match details
    {
      type: "row",
      fields: [
        { name: "referee", label: "Διαιτητής", type: "text" },
        { name: "attendance", label: "Παρακολούθηση κοινού", type: "number", min: 0 },
        { name: "weatherNotes", label: "Καιρικές συνθήκες", type: "text" },
      ],
    },

    // Lineup (simplified array)
    {
      name: "startingLineup",
      label: "Βασική ενδεκάδα",
      type: "array",
      fields: [
        {
          name: "player",
          label: "Παίκτης",
          type: "relationship",
          relationTo: "players",
          required: true,
        },
        { name: "shirtNumber", label: "Νούμερο", type: "number" },
        { name: "position", label: "Θέση", type: "text" },
      ],
    },
    {
      name: "bench",
      label: "Πάγκος",
      type: "array",
      fields: [
        { name: "player", label: "Παίκτης", type: "relationship", relationTo: "players", required: true },
        { name: "shirtNumber", label: "Νούμερο", type: "number" },
      ],
    },
    {
      name: "playerOfTheMatch",
      label: "MVP αγώνα",
      type: "relationship",
      relationTo: "players",
    },

    // Match events
    {
      name: "events",
      label: "Γεγονότα αγώνα",
      type: "array",
      fields: [
        {
          name: "type",
          label: "Τύπος",
          type: "select",
          options: [
            { label: "Γκολ", value: "goal" },
            { label: "Κίτρινη κάρτα", value: "yellow_card" },
            { label: "Κόκκινη κάρτα", value: "red_card" },
            { label: "Αλλαγή", value: "substitution" },
            { label: "Ατυχημένο γκολ (αυτογκόλ)", value: "own_goal" },
            { label: "Πέναλτι (σωσμένο)", value: "penalty_saved" },
          ],
          required: true,
        },
        { name: "minute", label: "Λεπτό", type: "number", min: 1, max: 120 },
        {
          name: "player",
          label: "Παίκτης",
          type: "relationship",
          relationTo: "players",
        },
        {
          name: "playerOut",
          label: "Παίκτης (έξω — για αλλαγές)",
          type: "relationship",
          relationTo: "players",
        },
        { name: "notes", label: "Σημειώσεις", type: "text" },
      ],
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
