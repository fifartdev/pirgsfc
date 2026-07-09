import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/club-admin/Sidebar";
import { getCurrentUser } from "@/lib/club-admin/auth";
import "../globals.css";

const inter = Inter({ subsets: ["latin", "greek"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Πίνακας Διαχείρισης | PYRGOS AFC",
    template: "%s | PYRGOS AFC Admin",
  },
  robots: { index: false, follow: false },
};

export default async function ClubAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="el" className={inter.variable}>
      <body className="flex h-screen overflow-hidden bg-[#0a0a0a] text-white antialiased">
        {user && (
          <Sidebar
            userName={
              user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.email
            }
          />
        )}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
