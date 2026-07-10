import type { Lang, LocalizedText } from "@/types";
import { localeHref } from "@/lib/utils";

export const CLUB = {
  name: "PYRGOS AFC",
  shortName: "PAFC",
  founded: 2026,
  stadium: {
    name: { el: "Στάδιο Πύργου", en: "Pyrgos Stadium" } satisfies LocalizedText,
    capacity: "12.500",
    opened: 2026,
  },
  contact: {
    email: "hello@pyrgosafc.com",
    phone: "+30 26210 00000",
    address: {
      el: "Λεωφόρος Πύργου 1, Πύργος",
      en: "1 Tower Hill Avenue, Pyrgos, Greece",
    } satisfies LocalizedText,
  },
} as const;

/** Primary navigation: the five club sections plus supporting pages. */
export const NAV_ITEMS = [
  { key: "home", path: "/" },
  { key: "news", path: "/news" },
  { key: "men", path: "/men" },
  { key: "women", path: "/women" },
  { key: "futsal", path: "/futsal" },
  { key: "academy", path: "/academy" },
  { key: "club", path: "/about" },
  { key: "contact", path: "/contact" },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];

export const FOOTER_EXTRA_PATHS = [
  { key: "fixtures", path: "/matches" },
  { key: "calendar", path: "/calendar" },
  { key: "staff", path: "/staff" },
] as const;

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com", handle: "@pyrgosafc" },
  { label: "X / Twitter", href: "https://x.com", handle: "@pyrgosafc" },
  { label: "YouTube", href: "https://youtube.com", handle: "PYRGOS AFC TV" },
  { label: "Facebook", href: "https://facebook.com", handle: "PYRGOS AFC" },
] as const;

export const SITE_URL = "https://pyrgosafc.example.com";

export const DEPARTMENT_PATHS: Record<"men" | "women" | "futsal", string> = {
  men: "/men",
  women: "/women",
  futsal: "/futsal",
};

export function departmentPath(department: "men" | "women" | "futsal", lang: Lang): string {
  return localeHref(lang, DEPARTMENT_PATHS[department]);
}
