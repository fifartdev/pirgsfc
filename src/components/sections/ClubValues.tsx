import { Flame, Shield, Users, Rocket } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

const values = [
  {
    icon: Flame,
    title: "Passion",
    description:
      "Every match is a promise. We play with fire in our hearts and the city on our shoulders — from the first whistle to the last.",
  },
  {
    icon: Shield,
    title: "Discipline",
    description:
      "Standards are not negotiable. The way we train on a rainy Tuesday is the way we perform under the brightest lights.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "A club is its people. From the academy to the stands, every supporter is part of the story we are writing together.",
  },
  {
    icon: Rocket,
    title: "Ambition",
    description:
      "We fear nobody. Every season, every match, every minute is a step towards the glory this city deserves.",
  },
];

export function ClubValues() {
  return (
    <section
      className="clip-diagonal relative bg-navy-950 py-24 sm:py-32"
      aria-labelledby="club-values-heading"
    >
      <Container>
        <AnimatedReveal>
          <SectionHeading
            eyebrow="What We Stand For"
            title="Club Values"
            description="Our badge is not just worn. It is carried — by every player, every coach, and every fan."
            align="center"
          />
        </AnimatedReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <AnimatedReveal key={value.title} delay={index * 0.1}>
              <article className="glass group h-full rounded-2xl p-7 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/30">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-night">
                  <value.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-xl font-extrabold uppercase tracking-wide text-white">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">
                  {value.description}
                </p>
              </article>
            </AnimatedReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
