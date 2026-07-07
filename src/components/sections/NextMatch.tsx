import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateLong } from "@/lib/utils";
import type { Match } from "@/types";

interface NextMatchProps {
  match: Match;
}

export function NextMatch({ match }: NextMatchProps) {
  return (
    <section className="relative py-20 sm:py-28" aria-labelledby="next-match-heading">
      <Container>
        <AnimatedReveal>
          <SectionHeading
            eyebrow="Matchday Approaches"
            title="Next Match"
            description="The stadium is waiting. The city is ready. Be part of the noise."
          />
        </AnimatedReveal>

        <AnimatedReveal delay={0.15}>
          <div className="gradient-border noise relative mt-12 overflow-hidden rounded-3xl p-8 shadow-card sm:p-12">
            <div
              className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-royal/20 blur-[90px]"
              aria-hidden="true"
            />
            <div
              className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-gold/10 blur-[80px]"
              aria-hidden="true"
            />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr]">
              <div className="text-center lg:text-right">
                <p className="font-display text-3xl font-extrabold uppercase tracking-wide text-gold-bright sm:text-4xl">
                  {match.homeTeam}
                </p>
                <p className="mt-2 text-sm text-mist">Home</p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <span
                  className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-night/70 font-display text-xl font-extrabold text-gold shadow-glow-gold"
                  aria-hidden="true"
                >
                  VS
                </span>
                <Badge variant="royal">{match.competition}</Badge>
              </div>

              <div className="text-center lg:text-left">
                <p className="font-display text-3xl font-extrabold uppercase tracking-wide text-white sm:text-4xl">
                  {match.awayTeam}
                </p>
                <p className="mt-2 text-sm text-mist">Away</p>
              </div>
            </div>

            <div className="relative mt-10 flex flex-col items-center justify-between gap-6 border-t border-line pt-8 sm:flex-row">
              <div className="text-center sm:text-left">
                <p className="font-display text-lg font-bold text-white">
                  {formatDateLong(match.date)} · {match.time}
                </p>
                <p className="mt-1 text-sm text-mist">
                  {match.venue} · {match.matchweek}
                </p>
              </div>
              <Button href="/news/match-preview-pyrgos-fc-vs-olympia-united" variant="gold">
                Match Preview
              </Button>
            </div>
          </div>
        </AnimatedReveal>
      </Container>
    </section>
  );
}
