import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Button } from "@/components/ui/Button";
import { NewsCard } from "@/components/cards/NewsCard";
import { getDict } from "@/i18n";
import type { Lang, NewsArticle } from "@/types";

interface LatestNewsProps {
  articles: NewsArticle[];
  lang: Lang;
}

export function LatestNews({ articles, lang }: LatestNewsProps) {
  const dict = getDict(lang);

  return (
    <section className="relative py-20 sm:py-28" aria-labelledby="latest-news-heading">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <AnimatedReveal>
            <SectionHeading
              eyebrow={dict.home.newsEyebrow}
              title={dict.home.newsTitle}
              description={dict.home.newsText}
            />
          </AnimatedReveal>
          <AnimatedReveal delay={0.1}>
            <Button href={`/${lang}/news`} variant="outline">
              {dict.home.allNews}
            </Button>
          </AnimatedReveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {articles.slice(0, 3).map((article, index) => (
            <AnimatedReveal key={article.slug} delay={index * 0.1}>
              <NewsCard article={article} lang={lang} />
            </AnimatedReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
