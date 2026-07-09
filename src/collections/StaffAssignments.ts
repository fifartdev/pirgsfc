import type { CollectionConfig } from "payload";
import { isSuperAdminOrClubAdmin } from "@/lib/access";

export const StaffAssignments: CollectionConfig = {
  slug: "staff-assignments",
  admin: {
    useAsTitle: "id",
    defaultColumns: ["staff", "team", "season", "roleForSeason", "status"],
    group: "Προσωπικό",
    description:
      "Ιστορικό καθηκόντων προσωπικού ανά ομάδα και σεζόν. Ποτέ μην διαγράφετε παλιές εγγραφές.",
  },
  access: {
    read: () => true,
    create: isSuperAdminOrClubAdmin,
    update: isSuperAdminOrClubAdmin,
    delete: isSuperAdminOrClubAdmin,
  },
  fields: [
    {
      name: "staff",
      label: "Μέλος προσωπικού",
      type: "relationship",
      relationTo: "staff",
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
      name: "season",
      label: "Σεζόν",
      type: "relationship",
      relationTo: "seasons",
      required: true,
    },
    { name: "roleForSeason", label: "Ρόλος κατά τη σεζόν (ελλ.)", type: "text" },
    { name: "roleForSeasonEn", label: "Ρόλος κατά τη σεζόν (αγγλ.)", type: "text" },
    {
      type: "row",
      fields: [
        { name: "startDate", label: "Ημ. ανάληψης", type: "date" },
        { name: "endDate", label: "Ημ. αποχώρησης", type: "date" },
      ],
    },
    {
      name: "status",
      label: "Κατάσταση",
      type: "select",
      options: [
        { label: "Ενεργός", value: "active" },
        { label: "Ολοκληρώθηκε", value: "completed" },
        { label: "Ανενεργός", value: "inactive" },
      ],
      defaultValue: "active",
      required: true,
    },
    { name: "sortOrder", label: "Σειρά εμφάνισης", type: "number", defaultValue: 0 },
    { name: "notes", label: "Σημειώσεις", type: "textarea" },
  ],
  timestamps: true,
};
