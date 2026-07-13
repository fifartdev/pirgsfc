import { Sidebar } from "@/components/club-admin/Sidebar";
import { requireClubAdmin } from "@/lib/club-admin/auth";

export default async function ProtectedClubAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireClubAdmin();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        userName={
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.email
        }
        role={user.role}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
