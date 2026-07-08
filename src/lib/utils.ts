import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Lang, LocalizedText } from "@/types";
import { dateLocale } from "@/i18n";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

/** Prefix an internal path with the active language. */
export function localeHref(lang: Lang, path: string): string {
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}
