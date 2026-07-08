import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { NewsCard } from "@/components/cards/NewsCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { newsArticles, getArticleBySlug, getRelatedArticles } from "@/data/news";
import { getDict, hasLang } from "@/i18n";
import { formatDateLong } from "@/lib/utils";

interface ArticlePageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { lang: langParam, slug } = await params;
  const lang = hasLang(langParam) ? langParam : "el";
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Not Found" };
  return {
    title: article.title[lang],
    description: article.excerpt[lang],
    openGraph: {
      title: `${article.title[lang]} | PYRGOS AFC`,
      description: article.excerpt[lang],
      type: "article",
      publishedTime: article.date,
      authors: [article.author[lang]],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { lang, slug } = await params;
  if (!hasLang(lang)) notFound();

  const dict = getDict(lang);
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = getRelatedArticles(slug, 3);

  return (
    <>
      {/* Article hero */}
      <section className="noise relative overflow-hidden bg-night pb-16 pt-40 sm:pb-20">
        <div className="stadium-lights" aria-hidden="true" />
        <Container className="relative max-w-4xl">
          <AnimatedReveal>
            <Link
              href={`/${lang}/news`}
              className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-mist transition-colors hover:text-crimson-bright"
            >
              ← {dict.common.backToNews}
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Badge variant="crimson">{dict.categories[article.category]}</Badge>
              <span className="text-sm text-mist">
                {article.readingTime} {dict.common.minRead}
              </span>
            </div>
            <h1 className="mt-6 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-5xl">
              {article.title[lang]}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-mist sm:text-lg">
              {article.excerpt[lang]}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-6 text-sm text-mist">
              <p>
                <span className="font-semibold text-white/85">{article.author[lang]}</span>
              </p>
              <p>{formatDateLong(article.date, lang)}</p>
            </div>
          </AnimatedReveal>
        </Container>
      </section>

      {/* Article body */}
      <section className="relative pb-20">
        <Container className="max-w-3xl">
          <AnimatedReveal>
            <div className="space-y-6">
              {article.content[lang].map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base leading-relaxed text-white/80 first:text-lg first:leading-relaxed first:text-white/90"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
              <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-crimson-bright/90">
                {dict.news.articleFooter}
              </p>
              <Button href={`/${lang}/news`} variant="outline" size="sm">
                {dict.common.backToNews}
              </Button>
            </div>
          </AnimatedReveal>
        </Container>
      </section>

      {/* Related posts */}
      <section className="clip-diagonal relative bg-ash-950 py-24 sm:py-28">
        <Container>
          <AnimatedReveal>
            <SectionHeading
              eyebrow={dict.news.relatedEyebrow}
              title={dict.news.relatedTitle}
            />
          </AnimatedReveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {related.map((relatedArticle, index) => (
              <AnimatedReveal key={relatedArticle.slug} delay={index * 0.1}>
                <NewsCard article={relatedArticle} lang={lang} />
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
