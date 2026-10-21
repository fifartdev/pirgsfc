import type { CollectionConfig } from "payload";
import { isSuperAdminOrClubAdmin, nonDraftOrAuthenticated } from "@/lib/access";

/**
 * Club calendar entries for /calendar (training, media days, community and
 * academy events…). Fixtures don't need entering here — getCmsCalendarEvents
 * merges the current season's Matches in automatically; `match` stays
 * selectable for one-offs that aren't tracked as Matches.
 *
 * Hide an event with status "draft" (Κρυφό) rather than deleting it —
 * club_admin can't delete (see docs/CLUB_ADMIN_MANUAL.md §15).
 */
export const Events: CollectionConfig = {
  slug: "events",
  labels: { singular: "Εκδήλωση", plural: "Πρόγραμμα" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "date", "status"],
    group: "Αγώνες & Εγκαταστάσεις",
  },
  access: {
    read: nonDraftOrAuthenticated,
    create: isSuperAdminOrClubAdmin,
    update: isSuperAdminOrClubAdmin,
    delete: isSuperAdminOrClubAdmin,
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "title", label: "Τίτλος (ελλ.)", type: "text", required: true },
        { name: "titleEn", label: "Τίτλος (αγγλ.)", type: "text" },
      ],
    },
    {
      name: "type",
      label: "Τύπος",
      type: "select",
      required: true,
      defaultValue: "training",
      options: [
        { label: "Προπόνηση", value: "training" },
        { label: "Αποκατάσταση", value: "recovery" },
        { label: "Μέσα Ενημέρωσης", value: "media" },
        { label: "Κοινότητα", value: "community" },
        { label: "Ακαδημία", value: "academy" },
        { label: "Αγώνας", value: "match" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "date", label: "Ημερομηνία", type: "date", required: true },
        { name: "startTime", label: "Ώρα έναρξης", type: "text" },
        { name: "endTime", label: "Ώρα λήξης", type: "text" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "location", label: "Τοποθεσία (ελλ.)", type: "text" },
        { name: "locationEn", label: "Τοποθεσία (αγγλ.)", type: "text" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "description", label: "Περιγραφή (ελλ.)", type: "textarea" },
        { name: "descriptionEn", label: "Περιγραφή (αγγλ.)", type: "textarea" },
      ],
    },
    {
      name: "status",
      label: "Κατάσταση",
      type: "select",
      required: true,
      defaultValue: "published",
      options: [
        { label: "Δημοσιευμένο", value: "published" },
        { label: "Κρυφό", value: "draft" },
      ],
    },
  ],
  timestamps: true,
};
