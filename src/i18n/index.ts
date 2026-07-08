import type { Lang } from "@/types";
import { el, type Dictionary } from "./el";
import { en } from "./en";

export type { Dictionary };

export const LANGS: Lang[] = ["el", "en"];
export const DEFAULT_LANG: Lang = "el";

const dictionaries: Record<Lang, Dictionary> = { el, en };

export function hasLang(value: string): value is Lang {
  return LANGS.includes(value as Lang);
}

export function getDict(lang: Lang): Dictionary {
  return dictionaries[lang];
}

/** Locale used for date formatting. */
export function dateLocale(lang: Lang): string {
  return lang === "el" ? "el-GR" : "en-GB";
}
