import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NAV_ITEMS, SITE_URL } from "@/lib/constants";
import { getDict, hasLang, LANGS } from "@/i18n";
import { localeHref } from "@/lib/utils";
import { organizationJsonLd, stadiumJsonLd } from "@/lib/seo";
import "../globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "greek"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "greek"],
  display: "swap",
});

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDict(hasLang(lang) ? lang : "el");
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.siteTitle,
      template: "%s | PYRGOS AFC",
    },
    description: dict.meta.siteDescription,
    alternates: {
      languages: { el: "/", en: "/en" },
    },
    openGraph: {
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
      url: SITE_URL,
      siteName: "PYRGOS AFC",
      locale: lang === "el" ? "el_GR" : "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
    },
  };
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();

  const dict = getDict(lang);
  const navEntries = NAV_ITEMS.map((item) => ({
    href: localeHref(lang, item.path),
    label: dict.nav[item.key],
  }));

  return (
    <html lang={lang} className={`${manrope.variable} ${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(stadiumJsonLd()) }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-night">
        <Header
          lang={lang}
          navEntries={navEntries}
          matchdayLabel={dict.nav.matchday}
          estLabel={dict.common.est}
          tagline={dict.common.tagline}
          menuOpenLabel={dict.nav.menuOpen}
          menuCloseLabel={dict.nav.menuClose}
          languageLabel={dict.nav.languageLabel}
        />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
