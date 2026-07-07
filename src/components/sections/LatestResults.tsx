import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Button } from "@/components/ui/Button";
import { MatchCard } from "@/components/cards/MatchCard";
import type { Match } from "@/types";

interface LatestResultsProps {
  matches: Match[];
}

export function LatestResults({ matches }: LatestResultsProps) {
  return (
    <section
      className="clip-diagonal relative bg-navy-950 py-24 sm:py-32"
      aria-labelledby="latest-results-heading"
    >
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <AnimatedReveal>
            <SectionHeading
              eyebrow="Full Time"
              title="Latest Results"
              description="Every performance tells the story of a team on the rise."
            />
          </AnimatedReveal>
          <AnimatedReveal delay={0.1}>
            <Button href="/matches" variant="outline">
              All Fixtures & Results
            </Button>
          </AnimatedReveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match, index) => (
            <AnimatedReveal key={match.id} delay={index * 0.1}>
              <MatchCard match={match} />
            </AnimatedReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
