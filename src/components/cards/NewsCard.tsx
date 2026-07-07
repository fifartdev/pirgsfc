import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { NewsArticle } from "@/types";

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
    >
      <article className="glass flex h-full flex-col overflow-hidden rounded-2xl shadow-card transition-all duration-300 group-hover:-translate-y-1 group-hover:border-gold/30">
        <div
          className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-navy-700 via-navy-900 to-night"
          aria-hidden="true"
        >
          <span className="absolute h-32 w-32 rounded-full bg-royal/20 blur-3xl" />
          <span className="select-none font-display text-5xl font-extrabold uppercase text-white/8 transition-transform duration-500 group-hover:scale-110">
            PFC
          </span>
          <span className="absolute left-4 top-4">
            <Badge variant="gold">{article.category}</Badge>
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs text-mist">
            {formatDate(article.date)} · {article.readingTime} min read
          </p>
          <h3 className="mt-2 font-display text-lg font-bold leading-snug text-white transition-colors group-hover:text-gold-bright">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-mist">
            {article.excerpt}
          </p>
          <p className="mt-4 font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold/80 transition-colors group-hover:text-gold">
            Read Article →
          </p>
        </div>
      </article>
    </Link>
  );
}
