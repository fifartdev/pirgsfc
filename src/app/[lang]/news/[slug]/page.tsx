import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { NewsCard } from "@/components/cards/NewsCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { newsArticles } from "@/data/news";
import { getCmsNewsArticle, getCmsRelatedArticles } from "@/lib/cms-data";
import { getDict, hasLang } from "@/i18n";
import { formatDateLong, localeHref, buildAlternates } from "@/lib/utils";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

interface ArticlePageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { lang: langParam, slug } = await params;
  const lang = hasLang(langParam) ? langParam : "el";
  const article = await getCmsNewsArticle(slug);
  if (!article) return { title: "Not Found" };
  return {
    title: article.title[lang],
    description: article.excerpt[lang],
    alternates: buildAlternates(lang, `/news/${slug}`),
    openGraph: {
      title: `${article.title[lang]} | PYRGOS AFC`,
      description: article.excerpt[lang],
      type: "article",
      publishedTime: article.date,
      authors: [article.author[lang]],
      images: article.imageUrl
        ? [{ url: article.imageUrl, alt: article.imageAlt || article.title[lang] }]
        : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { lang, slug } = await params;
  if (!hasLang(lang)) notFound();

  const dict = getDict(lang);
  const [article, related] = await Promise.all([
    getCmsNewsArticle(slug),
    getCmsRelatedArticles(slug, 3),
  ]);

  if (!article) {
    notFound();
  }

  const articleLd = articleJsonLd({
    title: article.title[lang],
    excerpt: article.excerpt[lang],
    slug: article.slug,
    author: article.author[lang],
    publishedDate: article.date,
    lang,
  });
  const breadcrumbLd = breadcrumbJsonLd([
    { name: dict.nav.home, url: `${SITE_URL}${localeHref(lang, "/")}` },
    { name: dict.nav.news, url: `${SITE_URL}${localeHref(lang, "/news")}` },
    { name: article.title[lang], url: `${SITE_URL}${localeHref(lang, `/news/${article.slug}`)}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* Article hero */}
      <section className="noise relative overflow-hidden bg-night pb-16 pt-40 sm:pb-20">
        <div className="stadium-lights" aria-hidden="true" />
        <Container className="relative max-w-4xl">
          <AnimatedReveal>
            <Link
              href={localeHref(lang, "/news")}
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

      {/* Featured image */}
      {article.imageUrl && (
        <section className="relative pb-16">
          <Container className="max-w-4xl">
            <AnimatedReveal>
              <div className="relative aspect-video overflow-hidden rounded-3xl shadow-card">
                <Image
                  src={article.imageUrl}
                  alt={article.imageAlt ?? article.title[lang]}
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  priority
                  className="object-cover"
                />
              </div>
            </AnimatedReveal>
          </Container>
        </section>
      )}

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
              <Button href={localeHref(lang, "/news")} variant="outline" size="sm">
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
