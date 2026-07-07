import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Badge } from "@/components/ui/Badge";
import { NewsCard } from "@/components/cards/NewsCard";
import { newsArticles, getFeaturedArticle } from "@/data/news";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "News",
  description:
    "Official PYRGOS FC news — club announcements, match previews and reports, academy updates, transfers, and community stories.",
  openGraph: {
    title: "News | PYRGOS FC",
    description:
      "Official PYRGOS FC news — announcements, previews, reports, and stories from inside the club.",
  },
};

export default function NewsPage() {
  const featured = getFeaturedArticle();
  const rest = [...newsArticles]
    .filter((a) => a.slug !== featured.slug)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <section className="noise relative overflow-hidden bg-night pb-16 pt-40 sm:pb-24">
        <div className="stadium-lights" aria-hidden="true" />
        <Container className="relative">
          <AnimatedReveal>
            <p className="font-display text-xs font-bold uppercase tracking-[0.32em] text-gold">
              Club Media
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-6xl">
              News <span className="text-gradient-gold">&amp; Stories</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              From the dressing room to the community — every story that matters
              from inside PYRGOS FC.
            </p>
          </AnimatedReveal>
        </Container>
      </section>

      {/* Featured article */}
      <section className="relative pb-8">
        <Container>
          <AnimatedReveal>
            <Link
              href={`/news/${featured.slug}`}
              className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <article className="gradient-border noise relative overflow-hidden rounded-3xl shadow-card transition-transform duration-300 group-hover:-translate-y-1">
                <div className="stadium-lights opacity-50" aria-hidden="true" />
                <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="gold">Featured</Badge>
                      <Badge variant="royal">{featured.category}</Badge>
                    </div>
                    <h2 className="mt-6 max-w-3xl font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-white transition-colors group-hover:text-gold-bright sm:text-5xl">
                      {featured.title}
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist">
                      {featured.excerpt}
                    </p>
                    <p className="mt-6 text-sm text-mist">
                      {featured.author} · {formatDate(featured.date)} ·{" "}
                      {featured.readingTime} min read
                    </p>
                  </div>
                  <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-gold">
                    Read the Story →
                  </p>
                </div>
              </article>
            </Link>
          </AnimatedReveal>
        </Container>
      </section>

      {/* Article grid */}
      <section className="relative py-16 pb-24 sm:pb-32">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((article, index) => (
              <AnimatedReveal key={article.slug} delay={(index % 3) * 0.1}>
                <NewsCard article={article} />
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
