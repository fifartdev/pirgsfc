import { requireClubAdmin } from "@/lib/club-admin/auth";
import { notFound } from "next/navigation";
import { EditStaffForm, type StaffEditData } from "./EditStaffForm";

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { payload } = await requireClubAdmin();
  const { id } = await params;
  if (!id) notFound();

  let staff: StaffEditData;
  try {
    const doc = await payload.findByID({ collection: "staff", id });
    staff = {
      id: String(doc.id),
      firstName: (doc.firstName as string) ?? "",
      lastName: (doc.lastName as string) ?? "",
      firstNameEn: (doc.firstNameEn as string | undefined) ?? undefined,
      lastNameEn: (doc.lastNameEn as string | undefined) ?? undefined,
      fullName: (doc.fullName as string | undefined) ?? undefined,
      roleTitle: (doc.roleTitle as string | undefined) ?? undefined,
      roleTitleEn: (doc.roleTitleEn as string | undefined) ?? undefined,
      status: (doc.status as string | undefined) ?? "active",
      biography: doc.biography ?? undefined,
      biographyEn: doc.biographyEn ?? undefined,
    };
  } catch {
    notFound();
  }

  return <EditStaffForm staff={staff} />;
}
