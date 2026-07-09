import type { CollectionConfig } from "payload";
import { isSuperAdminOrClubAdmin } from "@/lib/access";

export const Venues: CollectionConfig = {
  slug: "venues",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "type", "city", "capacity"],
    group: "Αγώνες & Εγκαταστάσεις",
  },
  access: {
    read: () => true,
    create: isSuperAdminOrClubAdmin,
    update: isSuperAdminOrClubAdmin,
    delete: isSuperAdminOrClubAdmin,
  },
  fields: [
    { name: "name", label: "Όνομα γηπέδου", type: "text", required: true },
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
      name: "type",
      label: "Τύπος",
      type: "select",
      options: [
        { label: "Γήπεδο", value: "stadium" },
        { label: "Προπονητικό κέντρο", value: "training_ground" },
        { label: "Κλειστό γυμναστήριο", value: "indoor" },
        { label: "Άλλο", value: "other" },
      ],
      defaultValue: "stadium",
      required: true,
    },
    {
      type: "row",
      fields: [
        { name: "address", label: "Διεύθυνση", type: "text" },
        { name: "city", label: "Πόλη", type: "text", defaultValue: "Πύργος" },
        { name: "region", label: "Νομός / Περιφέρεια", type: "text" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "country", label: "Χώρα", type: "text", defaultValue: "Ελλάδα" },
        { name: "postalCode", label: "Ταχ. κώδικας", type: "text" },
      ],
    },
    {
      name: "googleMapsUrl",
      label: "Google Maps URL",
      type: "text",
    },
    {
      type: "row",
      fields: [
        { name: "latitude", label: "Latitude", type: "number" },
        { name: "longitude", label: "Longitude", type: "number" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "capacity", label: "Χωρητικότητα", type: "number", min: 0 },
        {
          name: "surface",
          label: "Επιφάνεια",
          type: "select",
          options: [
            { label: "Φυσικό γρασίδι", value: "natural_grass" },
            { label: "Συνθετικό χλοοτάπητα", value: "artificial_turf" },
            { label: "Παρκέ", value: "parquet" },
            { label: "Σκυρόδεμα", value: "concrete" },
            { label: "Άλλο", value: "other" },
          ],
        },
      ],
    },
    { name: "description", label: "Περιγραφή", type: "richText" },
    {
      name: "mainImage",
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
    {
      name: "meta",
      label: "SEO",
      type: "group",
      fields: [
        { name: "title", label: "SEO Τίτλος", type: "text" },
        { name: "description", label: "SEO Περιγραφή", type: "textarea" },
      ],
    },
  ],
  timestamps: true,
};
