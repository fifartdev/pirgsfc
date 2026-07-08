import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Button } from "@/components/ui/Button";
import { MatchCard } from "@/components/cards/MatchCard";
import { getDict } from "@/i18n";
import type { Lang, Match } from "@/types";

interface LatestResultsProps {
  matches: Match[];
  lang: Lang;
}

export function LatestResults({ matches, lang }: LatestResultsProps) {
  const dict = getDict(lang);

  return (
    <section
      className="clip-diagonal relative bg-ash-950 py-24 sm:py-32"
      aria-labelledby="latest-results-heading"
    >
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <AnimatedReveal>
            <SectionHeading
              eyebrow={dict.home.resultsEyebrow}
              title={dict.home.resultsTitle}
              description={dict.home.resultsText}
            />
          </AnimatedReveal>
          <AnimatedReveal delay={0.1}>
            <Button href={`/${lang}/matches`} variant="outline">
              {dict.home.allFixtures}
            </Button>
          </AnimatedReveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match, index) => (
            <AnimatedReveal key={match.id} delay={index * 0.1}>
              <MatchCard match={match} lang={lang} />
            </AnimatedReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
