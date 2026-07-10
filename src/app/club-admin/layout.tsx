import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin", "greek"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Πίνακας Διαχείρισης | PYRGOS AFC",
    template: "%s | PYRGOS AFC Admin",
  },
  robots: { index: false, follow: false },
};

// Only the <html>/<body> shell lives here. Auth-gated pages (everything
// except /login) get their own nested layout in (protected)/ so that
// layout mounts fresh — with the post-login session — the first time a
// client-side navigation enters that route group. A single layout shared
// with /login would keep rendering with the pre-login (no user) output
// across client-side transitions, since Next.js does not re-run a layout
// that stays mounted across a navigation.
export default function ClubAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el" className={inter.variable}>
      <body className="h-screen overflow-hidden bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
