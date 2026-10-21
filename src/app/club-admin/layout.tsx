import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClubLogoProvider } from "@/components/ui/Crest";
import { getCmsClubInfo } from "@/lib/cms-data";
import { SITE_URL } from "@/lib/constants";
import "../globals.css";

const inter = Inter({ subsets: ["latin", "greek"], variable: "--font-inter" });

export async function generateMetadata(): Promise<Metadata> {
  const { logoUrl } = await getCmsClubInfo();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Πίνακας Διαχείρισης | PYRGOS AFC",
      template: "%s | PYRGOS AFC Admin",
    },
    robots: { index: false, follow: false },
    icons: { icon: logoUrl ?? "/icon.svg" },
  };
}

// Only the <html>/<body> shell lives here. Auth-gated pages (everything
// except /login) get their own nested layout in (protected)/ so that
// layout mounts fresh — with the post-login session — the first time a
// client-side navigation enters that route group. A single layout shared
// with /login would keep rendering with the pre-login (no user) output
// across client-side transitions, since Next.js does not re-run a layout
// that stays mounted across a navigation.
export default async function ClubAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logoUrl } = await getCmsClubInfo();
  return (
    <html lang="el" className={inter.variable}>
      <body className="h-screen overflow-hidden bg-[#0a0a0a] text-white antialiased">
        <ClubLogoProvider logoUrl={logoUrl}>{children}</ClubLogoProvider>
      </body>
    </html>
  );
}
