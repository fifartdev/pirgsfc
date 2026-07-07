import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { StatCard } from "@/components/cards/StatCard";

const highlights = [
  { value: "24", label: "Players", accent: "gold" as const },
  { value: "8", label: "Wins This Season", accent: "royal" as const },
  { value: "3", label: "Clean Sheets", accent: "gold" as const },
  { value: "42", label: "Goals Scored", accent: "royal" as const },
];

export function TeamHighlights() {
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
