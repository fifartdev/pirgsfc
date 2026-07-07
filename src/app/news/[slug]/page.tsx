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
import { formatDateLong } from "@/lib/utils";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} | PYRGOS FC`,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
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
              href="/news"
              className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-mist transition-colors hover:text-gold"
            >
              ← Back to News
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Badge variant="gold">{article.category}</Badge>
              <span className="text-sm text-mist">
                {article.readingTime} min read
              </span>
            </div>
            <h1 className="mt-6 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-mist sm:text-lg">
              {article.excerpt}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-6 text-sm text-mist">
              <p>
                <span className="font-semibold text-white/85">{article.author}</span>
              </p>
              <p>{formatDateLong(article.date)}</p>
            </div>
          </AnimatedReveal>
        </Container>
      </section>

      {/* Article body */}
      <section className="relative pb-20">
        <Container className="max-w-3xl">
          <AnimatedReveal>
            <div className="space-y-6">
              {article.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base leading-relaxed text-white/80 first:text-lg first:leading-relaxed first:text-white/90"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
              <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-gold/80">
                Built on Passion. Driven by Glory.
              </p>
              <Button href="/news" variant="outline" size="sm">
                Back to News
              </Button>
            </div>
          </AnimatedReveal>
        </Container>
      </section>

      {/* Related posts */}
      <section className="clip-diagonal relative bg-navy-950 py-24 sm:py-28">
        <Container>
          <AnimatedReveal>
            <SectionHeading eyebrow="Keep Reading" title="Related Stories" />
          </AnimatedReveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {related.map((relatedArticle, index) => (
              <AnimatedReveal key={relatedArticle.slug} delay={index * 0.1}>
                <NewsCard article={relatedArticle} />
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
