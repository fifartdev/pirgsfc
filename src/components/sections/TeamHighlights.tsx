import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { StatCard } from "@/components/cards/StatCard";
import { getDict } from "@/i18n";
import type { Lang } from "@/types";

interface TeamHighlightsProps {
  lang: Lang;
}

export function TeamHighlights({ lang }: TeamHighlightsProps) {
  const dict = getDict(lang);

  const highlights = [
    { value: "39", label: dict.home.stats.players, accent: "crimson" as const },
    { value: "14", label: dict.home.stats.wins, accent: "smoke" as const },
    { value: "8", label: dict.home.stats.cleanSheets, accent: "crimson" as const },
    { value: "61", label: dict.home.stats.goals, accent: "smoke" as const },
  ];

  return (
    <section className="relative py-16 sm:py-20" aria-label="Team highlights">
      <Container>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {highlights.map((stat, index) => (
            <AnimatedReveal key={stat.label} delay={index * 0.08}>
              <StatCard value={stat.value} label={stat.label} accent={stat.accent} />
            </AnimatedReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
