import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { sponsors } from "@/data/sponsors";

export function SponsorsStrip() {
  return (
    <section
      className="relative border-y border-line bg-navy-950/60 py-14"
      aria-labelledby="sponsors-heading"
    >
      <Container>
        <AnimatedReveal>
          <h2
            id="sponsors-heading"
            className="text-center font-display text-xs font-bold uppercase tracking-[0.32em] text-mist"
          >
            Proudly Supported By
          </h2>
        </AnimatedReveal>

        <AnimatedReveal delay={0.1}>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {sponsors.map((sponsor) => (
              <li key={sponsor.id} className="group text-center">
                <p className="font-display text-lg font-extrabold uppercase tracking-wide text-white/45 transition-colors duration-300 group-hover:text-gold-bright sm:text-xl">
                  {sponsor.name}
                </p>
                <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-mist/60">
                  {sponsor.tagline}
                </p>
              </li>
            ))}
          </ul>
        </AnimatedReveal>
      </Container>
    </section>
  );
}
