import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Crest } from "@/components/ui/Crest";
import { NAV_ITEMS, SITE_URL } from "@/lib/constants";
import { getDict, hasLang, LANGS } from "@/i18n";
import { localeHref } from "@/lib/utils";
import { organizationJsonLd, stadiumJsonLd, getSeoDefaults, ogImageUrl } from "@/lib/seo";
import { getCmsSiteSettings } from "@/lib/cms-data";
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
  const seoDefaults = await getSeoDefaults();
  const defaultOgImage = ogImageUrl(seoDefaults?.defaultOgImage);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.siteTitle,
      template: "%s | PYRGOS AFC",
    },
    description: dict.meta.siteDescription,
    // No `alternates` here — it was previously a single hardcoded pair
    // ("/" / "/en") applied to every page, so every article/player/team page
    // emitted hreflang links pointing at the homepage instead of itself. Each
    // page-level `generateMetadata` now calls `buildAlternates(lang, path)`
    // with its own route instead.
    robots:
      seoDefaults?.robots && (seoDefaults.robots.index === false || seoDefaults.robots.follow === false)
        ? { index: seoDefaults.robots.index !== false, follow: seoDefaults.robots.follow !== false }
        : undefined,
    openGraph: {
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
      url: SITE_URL,
      siteName: "PYRGOS AFC",
      locale: lang === "el" ? "el_GR" : "en_GB",
      type: "website",
      images: defaultOgImage ? [{ url: defaultOgImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
      site: seoDefaults?.twitterHandle || undefined,
    },
  };
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();

  const dict = getDict(lang);
  const siteSettings = await getCmsSiteSettings();

  // Maintenance mode only gates the public `[lang]` route tree — /club-admin
  // and /admin live outside this layout, so admins can always get in to turn
  // it back off.
  if (siteSettings.maintenanceMode) {
    return (
      <html lang={lang} className={`${manrope.variable} ${inter.variable} h-full antialiased`}>
        <body className="flex min-h-full flex-col items-center justify-center gap-6 bg-night px-4 text-center">
          <Crest size="lg" />
          <div>
            <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide text-white">
              {dict.maintenance.title}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-mist">{dict.maintenance.text}</p>
          </div>
        </body>
      </html>
    );
  }

  const navEntries = NAV_ITEMS.map((item) => ({
    href: localeHref(lang, item.path),
    label: dict.nav[item.key],
  }));
  const [organizationLd, stadiumLd] = await Promise.all([organizationJsonLd(), stadiumJsonLd()]);

  return (
    <html lang={lang} className={`${manrope.variable} ${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(stadiumLd) }}
        />
        {siteSettings.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${siteSettings.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${siteSettings.googleAnalyticsId}');`}
            </Script>
          </>
        )}
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
          announcement={
            siteSettings.announcementBarEnabled ? siteSettings.announcementBar : undefined
          }
        />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} />
        {siteSettings.cookieBannerEnabled && (
          <CookieBanner message={dict.cookieBanner.message} acceptLabel={dict.cookieBanner.accept} />
        )}
      </body>
    </html>
  );
}
