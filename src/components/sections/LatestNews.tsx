import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Button } from "@/components/ui/Button";
import { NewsCard } from "@/components/cards/NewsCard";
import type { NewsArticle } from "@/types";

interface LatestNewsProps {
  articles: NewsArticle[];
}

export function LatestNews({ articles }: LatestNewsProps) {
  return (
    <section className="relative py-20 sm:py-28" aria-labelledby="latest-news-heading">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <AnimatedReveal>
            <SectionHeading
              eyebrow="From Inside the Club"
              title="Latest News"
              description="Stories, previews, and reports from the heart of PYRGOS FC."
            />
          </AnimatedReveal>
          <AnimatedReveal delay={0.1}>
            <Button href="/news" variant="outline">
              All News
            </Button>
          </AnimatedReveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {articles.slice(0, 3).map((article, index) => (
            <AnimatedReveal key={article.slug} delay={index * 0.1}>
              <NewsCard article={article} />
            </AnimatedReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
