import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { MatchesTabs } from "@/components/sections/MatchesTabs";
import { getUpcomingMatches, getCompletedMatches, getNextMatch } from "@/data/matches";
import { formatDateLong } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Matches",
  description:
    "Fixtures and results for PYRGOS FC. Upcoming matches, previous results, competitions, venues, and kick-off times — the complete match centre.",
  openGraph: {
    title: "Matches | PYRGOS FC",
    description: "Fixtures and results for PYRGOS FC — the complete match centre.",
  },
};

export default function MatchesPage() {
  const upcoming = getUpcomingMatches();
  const completed = getCompletedMatches();
  const nextMatch = getNextMatch();

  return (
    <>
      <section className="noise relative overflow-hidden bg-night pb-16 pt-40 sm:pb-24">
        <div className="stadium-lights" aria-hidden="true" />
        <Container className="relative">
          <AnimatedReveal>
            <p className="font-display text-xs font-bold uppercase tracking-[0.32em] text-gold">
              Match Centre
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-6xl">
              Fixtures <span className="text-gradient-gold">&amp; Results</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              Every match is a promise. Follow every fixture, every result, and
              every step of the PYRGOS FC journey.
            </p>
          </AnimatedReveal>

          {nextMatch && (
            <AnimatedReveal delay={0.15}>
              <div className="glass mt-10 inline-flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl px-6 py-4">
                <Badge variant="gold">Next Up</Badge>
                <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
                  {nextMatch.homeTeam} vs {nextMatch.awayTeam}
                </p>
                <p className="text-sm text-mist">
                  {formatDateLong(nextMatch.date)} · {nextMatch.time} · {nextMatch.venue}
                </p>
              </div>
            </AnimatedReveal>
          )}
        </Container>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <Container>
          <AnimatedReveal>
            <MatchesTabs upcoming={upcoming} completed={completed} />
          </AnimatedReveal>
        </Container>
      </section>

      <section className="clip-diagonal relative bg-navy-950 py-24">
        <Container>
          <AnimatedReveal>
            <SectionHeading
              eyebrow="Matchday Experience"
              title="Be There When It Matters"
              description="Gates open two hours before kick-off. Arrive early, find your voice, and be part of the twelfth player. Under the lights at Pyrgos Stadium, everything is possible."
              align="center"
            />
          </AnimatedReveal>
        </Container>
      </section>
    </>
  );
}
