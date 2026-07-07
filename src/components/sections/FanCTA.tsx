import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Button } from "@/components/ui/Button";
import { Crest } from "@/components/ui/Crest";

export function FanCTA() {
  return (
    <section
      className="noise relative overflow-hidden py-24 sm:py-32"
      aria-labelledby="fan-cta-heading"
    >
      <div className="stadium-lights" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-royal/15 blur-[120px]"
        aria-hidden="true"
      />
      <Container className="relative text-center">
        <AnimatedReveal>
          <Crest size="lg" className="mx-auto" />
        </AnimatedReveal>
        <AnimatedReveal delay={0.1}>
          <h2
            id="fan-cta-heading"
            className="mx-auto mt-8 max-w-3xl font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-5xl"
          >
            More Than a Club.{" "}
            <span className="text-gradient-gold">A Movement.</span>
          </h2>
        </AnimatedReveal>
        <AnimatedReveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
            Every supporter is part of the story. Join the PYRGOS FC community —
            follow the journey, fill the stands, and help write the next chapter
            of the city&apos;s club.
          </p>
        </AnimatedReveal>
        <AnimatedReveal delay={0.3}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/contact" variant="gold" size="lg">
              Join the Community
            </Button>
            <Button href="/about" variant="outline" size="lg">
              Our Story
            </Button>
          </div>
        </AnimatedReveal>
      </Container>
    </section>
  );
}
