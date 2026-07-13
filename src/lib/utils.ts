import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Lang, LocalizedText } from "@/types";
import { dateLocale, DEFAULT_LANG } from "@/i18n";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Per-page `generateMetadata` `alternates` block: a self-referencing
 * canonical for the current locale, plus correct hreflang links to the *same*
 * page in the other locale. `path` is the locale-agnostic route (e.g. "/news"
 * or "/news/some-slug", "/" for home) — do not pass an already-prefixed path.
 * The root layout previously set one hardcoded `alternates.languages` for
 * every page (always pointing at the homepage); every page-level
 * `generateMetadata` should call this instead.
 */
export function buildAlternates(lang: Lang, path: string) {
  return {
    canonical: localeHref(lang, path),
    languages: {
      el: localeHref("el", path),
      en: localeHref("en", path),
    },
  };
}

export function formatDate(dateString: string, lang: Lang): string {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(dateLocale(lang), {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateLong(dateString: string, lang: Lang): string {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(dateLocale(lang), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function dayOfMonth(dateString: string): string {
  return dateString.slice(8, 10);
}

export function monthShort(dateString: string, lang: Lang): string {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(dateLocale(lang), { month: "short" });
}

export function weekdayShort(dateString: string, lang: Lang): string {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(dateLocale(lang), { weekday: "short" });
}

export function monthTitle(dateString: string, lang: Lang): string {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(dateLocale(lang), { month: "long", year: "numeric" });
}

export function initialsOf(firstName: LocalizedText, lastName: LocalizedText, lang: Lang): string {
  return `${firstName[lang].charAt(0)}${lastName[lang].charAt(0)}`.toUpperCase();
}

/** Prefix an internal path with the active language. The default language (Greek) is unprefixed. */
export function localeHref(lang: Lang, path: string): string {
  if (lang === DEFAULT_LANG) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}
