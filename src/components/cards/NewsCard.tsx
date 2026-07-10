import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { getDict } from "@/i18n";
import { formatDate, localeHref } from "@/lib/utils";
import type { Lang, NewsArticle } from "@/types";

interface NewsCardProps {
  article: NewsArticle;
  lang: Lang;
}

export function NewsCard({ article, lang }: NewsCardProps) {
  const dict = getDict(lang);

  return (
    <Link
      href={localeHref(lang, `/news/${article.slug}`)}
      className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson"
    >
      <article className="glass flex h-full flex-col overflow-hidden rounded-2xl shadow-card transition-all duration-300 group-hover:-translate-y-1 group-hover:border-crimson/30">
        <div
          className="relative flex h-40 items-center justify-center overflow-hidden bg-linear-to-br from-ash-700 via-ash-900 to-night"
          aria-hidden={!article.imageUrl}
        >
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.imageAlt ?? article.title["el"]}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <>
              <span className="absolute h-32 w-32 rounded-full bg-crimson/20 blur-3xl" />
              <span className="select-none font-display text-5xl font-extrabold uppercase text-white/8 transition-transform duration-500 group-hover:scale-110">
                PAFC
              </span>
            </>
          )}
          <span className="absolute left-4 top-4 z-10">
            <Badge variant="crimson">{dict.categories[article.category]}</Badge>
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs text-mist">
            {formatDate(article.date, lang)} · {article.readingTime} {dict.common.minRead}
          </p>
          <h3 className="mt-2 font-display text-lg font-bold leading-snug text-white transition-colors group-hover:text-crimson-bright">
            {article.title[lang]}
          </h3>
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-mist">
            {article.excerpt[lang]}
          </p>
          <p className="mt-4 font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-crimson-bright/90 transition-colors group-hover:text-crimson-bright">
            {dict.common.readArticle} →
          </p>
        </div>
      </article>
    </Link>
  );
}
