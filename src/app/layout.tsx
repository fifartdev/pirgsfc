import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CLUB, SITE_URL } from "@/lib/constants";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PYRGOS FC | Official Football Club Website",
    template: "%s | PYRGOS FC",
  },
  description:
    "The official digital home of PYRGOS FC. Discover fixtures, results, roster, news, staff, and the story of the club.",
  openGraph: {
    title: "PYRGOS FC | Official Football Club Website",
    description:
      "The official digital home of PYRGOS FC. Built on Passion. Driven by Glory.",
    url: SITE_URL,
    siteName: CLUB.name,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PYRGOS FC | Official Football Club Website",
    description:
      "The official digital home of PYRGOS FC. Built on Passion. Driven by Glory.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-night">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
