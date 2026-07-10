import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Badge } from "@/components/ui/Badge";
import { NewsCard } from "@/components/cards/NewsCard";
import { getCmsNewsArticles, getCmsFeaturedArticle } from "@/lib/cms-data";
import { getDict, hasLang } from "@/i18n";
import { formatDate, localeHref } from "@/lib/utils";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDict(hasLang(lang) ? lang : "el");
  return {
    title: `${dict.news.title1} ${dict.news.titleAccent}`,
    description: dict.news.text,
    openGraph: {
      title: `${dict.news.title1} ${dict.news.titleAccent} | PYRGOS AFC`,
      description: dict.news.text,
    },
  };
}

export default async function NewsPage({ params }: PageProps) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();

  const dict = getDict(lang);
  const [featured, articles] = await Promise.all([
    getCmsFeaturedArticle(),
    getCmsNewsArticles(),
  ]);
  const rest = articles.filter((a) => a.slug !== featured.slug);

  return (
    <>
      <section className="noise relative overflow-hidden bg-night pb-16 pt-40 sm:pb-24">
        <div className="stadium-lights" aria-hidden="true" />
        <Container className="relative">
          <AnimatedReveal>
            <p className="font-display text-xs font-bold uppercase tracking-[0.32em] text-crimson-bright">
              {dict.news.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-6xl">
              {dict.news.title1}{" "}
              <span className="text-gradient-crimson">{dict.news.titleAccent}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              {dict.news.text}
            </p>
          </AnimatedReveal>
        </Container>
      </section>

      {/* Featured article */}
      <section className="relative pb-8">
        <Container>
          <AnimatedReveal>
            <Link
              href={localeHref(lang, `/news/${featured.slug}`)}
              className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson"
            >
              <article className="gradient-border noise relative overflow-hidden rounded-3xl shadow-card transition-transform duration-300 group-hover:-translate-y-1">
                <div className="stadium-lights opacity-50" aria-hidden="true" />
                <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="crimson">{dict.news.featuredLabel}</Badge>
                      <Badge variant="smoke">{dict.categories[featured.category]}</Badge>
                    </div>
                    <h2 className="mt-6 max-w-3xl font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-white transition-colors group-hover:text-crimson-bright sm:text-5xl">
                      {featured.title[lang]}
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist">
                      {featured.excerpt[lang]}
                    </p>
                    <p className="mt-6 text-sm text-mist">
                      {featured.author[lang]} · {formatDate(featured.date, lang)} ·{" "}
                      {featured.readingTime} {dict.common.minRead}
                    </p>
                  </div>
                  <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-crimson-bright">
                    {dict.news.readStory} →
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
                <NewsCard article={article} lang={lang} />
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
