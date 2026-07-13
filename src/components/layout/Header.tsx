"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crest } from "@/components/ui/Crest";
import { MobileNav } from "@/components/layout/MobileNav";
import { cn, localeHref } from "@/lib/utils";
import { DEFAULT_LANG } from "@/i18n";
import type { Lang } from "@/types";

export interface NavEntry {
  href: string;
  label: string;
}

interface HeaderProps {
  lang: Lang;
  navEntries: NavEntry[];
  matchdayLabel: string;
  estLabel: string;
  tagline: string;
  menuOpenLabel: string;
  menuCloseLabel: string;
  languageLabel: string;
  /** SiteSettings.nav.announcementBar, shown only when announcementBarEnabled is on. */
  announcement?: string;
  /** SiteSettings.bilingualEnabled — hides the language switcher entirely when English is disabled. */
  showLanguageSwitch?: boolean;
}

export function Header({
  lang,
  navEntries,
  matchdayLabel,
  estLabel,
  tagline,
  menuOpenLabel,
  menuCloseLabel,
  languageLabel,
  announcement,
  showLanguageSwitch = true,
}: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const homeHref = localeHref(lang, "/");
  const isActive = (href: string) =>
    href === homeHref ? pathname === homeHref : pathname.startsWith(href);

  // Swap the locale while keeping the rest of the path. The default
  // language (Greek) has no prefix, so only strip it for non-default langs.
  const otherLang: Lang = lang === "el" ? "en" : "el";
  const rawPath =
    lang === DEFAULT_LANG ? pathname : pathname.replace(new RegExp(`^/${lang}(?=/|$)`), "") || "/";
  const switchHref = localeHref(otherLang, rawPath);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass shadow-card"
          : "border-b border-transparent bg-gradient-to-b from-night/90 to-transparent"
      )}
    >
      <nav
        className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          href={homeHref}
          className="group flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson"
        >
          <Crest size="sm" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-extrabold uppercase tracking-wide text-white transition-colors group-hover:text-crimson-bright">
              Pyrgos AFC
            </span>
            <span className="mt-0.5 font-display text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-crimson-bright/90">
              {estLabel}
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-0.5 xl:flex">
          {navEntries.map((entry) => (
            <li key={entry.href}>
              <Link
                href={entry.href}
                className={cn(
                  "relative rounded-full px-3 py-2 font-display text-[0.78rem] font-semibold uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson",
                  isActive(entry.href) ? "text-crimson-bright" : "text-white/75 hover:text-white"
                )}
                aria-current={isActive(entry.href) ? "page" : undefined}
              >
                {entry.label}
                {isActive(entry.href) && (
                  <span
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-crimson"
                    aria-hidden="true"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 xl:flex">
          {announcement && (
            <span
              className="hidden max-w-[220px] truncate rounded-full border border-crimson/40 bg-crimson/10 px-3 py-1.5 font-display text-[0.65rem] font-semibold uppercase tracking-widest text-crimson-bright lg:inline-flex"
              title={announcement}
            >
              {announcement}
            </span>
          )}
          {showLanguageSwitch && (
            <Link
              href={switchHref}
              className="inline-flex items-center rounded-full border border-line px-3.5 py-2 font-display text-xs font-bold uppercase tracking-widest text-white/80 transition-colors hover:border-crimson/60 hover:text-crimson-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
              aria-label={`${languageLabel}: ${otherLang === "el" ? "Ελληνικά" : "English"}`}
            >
              {otherLang.toUpperCase()}
            </Link>
          )}
          <Link
            href={localeHref(lang, "/matches")}
            className="inline-flex items-center rounded-full bg-crimson px-5 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-crimson-bright hover:shadow-glow-crimson focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
          >
            {matchdayLabel}
          </Link>
        </div>

        <MobileNav
          pathname={pathname}
          lang={lang}
          navEntries={navEntries}
          matchdayLabel={matchdayLabel}
          tagline={tagline}
          switchHref={switchHref}
          otherLangLabel={otherLang === "el" ? "Ελληνικά" : "English"}
          menuOpenLabel={menuOpenLabel}
          menuCloseLabel={menuCloseLabel}
          showLanguageSwitch={showLanguageSwitch}
        />
      </nav>
    </header>
  );
}
