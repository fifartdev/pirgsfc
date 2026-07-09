import type { GlobalConfig } from "payload";
import { isSuperAdminOrClubAdmin } from "@/lib/access";

export const ClubInfo: GlobalConfig = {
  slug: "club-info",
  label: "Πληροφορίες Συλλόγου",
  admin: {
    group: "Ρυθμίσεις",
  },
  access: {
    read: () => true,
    update: isSuperAdminOrClubAdmin,
  },
  fields: [
    { name: "name", label: "Επίσημο όνομα (ελλ.)", type: "text", defaultValue: "PYRGOS AFC" },
    { name: "nameEn", label: "Επίσημο όνομα (αγγλ.)", type: "text", defaultValue: "PYRGOS AFC" },
    { name: "shortName", label: "Σύντομο όνομα", type: "text", defaultValue: "PAFC" },
    { name: "founded", label: "Ίδρυση (έτος)", type: "number", defaultValue: 2026 },
    {
      name: "logo",
      label: "Λογότυπο / Έμβλημα",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "colors",
      label: "Χρώματα συλλόγου",
      type: "group",
      fields: [
        { name: "primary", label: "Κύριο χρώμα (hex)", type: "text", defaultValue: "#dc2626" },
        { name: "secondary", label: "Δευτερεύον χρώμα (hex)", type: "text", defaultValue: "#0a0a0a" },
        { name: "accent", label: "Χρώμα έμφασης (hex)", type: "text", defaultValue: "#ffffff" },
      ],
    },
    {
      name: "stadium",
      label: "Γήπεδο έδρας",
      type: "group",
      fields: [
        { name: "name", label: "Όνομα γηπέδου (ελλ.)", type: "text", defaultValue: "Στάδιο Πύργου" },
        { name: "nameEn", label: "Όνομα γηπέδου (αγγλ.)", type: "text", defaultValue: "Pyrgos Stadium" },
        { name: "capacity", label: "Χωρητικότητα", type: "text", defaultValue: "12.500" },
        { name: "opened", label: "Έτος κατασκευής", type: "number", defaultValue: 2026 },
      ],
    },
    {
      name: "contact",
      label: "Στοιχεία επικοινωνίας",
      type: "group",
      fields: [
        { name: "email", label: "Email", type: "email", defaultValue: "hello@pyrgosafc.com" },
        { name: "phone", label: "Τηλέφωνο", type: "text", defaultValue: "+30 26210 00000" },
        { name: "address", label: "Διεύθυνση (ελλ.)", type: "text", defaultValue: "Λεωφόρος Πύργου 1, Πύργος" },
        { name: "addressEn", label: "Διεύθυνση (αγγλ.)", type: "text", defaultValue: "1 Tower Hill Avenue, Pyrgos, Greece" },
        { name: "city", label: "Πόλη", type: "text", defaultValue: "Πύργος" },
        { name: "postalCode", label: "ΤΚ", type: "text" },
      ],
    },
    {
      name: "socialMedia",
      label: "Μέσα κοινωνικής δικτύωσης",
      type: "group",
      fields: [
        { name: "instagram", label: "Instagram URL", type: "text" },
        { name: "twitter", label: "X / Twitter URL", type: "text" },
        { name: "facebook", label: "Facebook URL", type: "text" },
        { name: "youtube", label: "YouTube URL", type: "text" },
        { name: "tiktok", label: "TikTok URL", type: "text" },
      ],
    },
    {
      name: "about",
      label: "Σχετικά με τον σύλλογο (ελλ.)",
      type: "richText",
    },
    {
      name: "aboutEn",
      label: "Σχετικά με τον σύλλογο (αγγλ.)",
      type: "richText",
    },
    {
      name: "values",
      label: "Αξίες συλλόγου",
      type: "array",
      fields: [
        { name: "title", label: "Τίτλος (ελλ.)", type: "text", required: true },
        { name: "titleEn", label: "Τίτλος (αγγλ.)", type: "text" },
        { name: "description", label: "Περιγραφή (ελλ.)", type: "textarea" },
        { name: "descriptionEn", label: "Περιγραφή (αγγλ.)", type: "textarea" },
      ],
    },
    {
      name: "sponsors",
      label: "Χορηγοί",
      type: "array",
      fields: [
        { name: "name", label: "Όνομα χορηγού", type: "text", required: true },
        {
          name: "tier",
          label: "Επίπεδο",
          type: "select",
          options: [
            { label: "Κύριος χορηγός", value: "principal" },
            { label: "Επίσημος χορηγός", value: "official" },
            { label: "Συνεργάτης", value: "partner" },
          ],
          required: true,
        },
        { name: "tagline", label: "Tagline (ελλ.)", type: "text" },
        { name: "taglineEn", label: "Tagline (αγγλ.)", type: "text" },
        { name: "url", label: "Σύνδεσμος", type: "text" },
        { name: "logo", label: "Λογότυπο", type: "upload", relationTo: "media" },
      ],
    },
  ],
};
