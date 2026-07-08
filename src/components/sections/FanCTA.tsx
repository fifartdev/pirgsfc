import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Button } from "@/components/ui/Button";
import { Crest } from "@/components/ui/Crest";
import { getDict } from "@/i18n";
import type { Lang } from "@/types";

interface FanCTAProps {
  lang: Lang;
}

export function FanCTA({ lang }: FanCTAProps) {
  const dict = getDict(lang);

  return (
    <section
      className="noise relative overflow-hidden py-24 sm:py-32"
      aria-labelledby="fan-cta-heading"
    >
      <div className="stadium-lights" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson/15 blur-[120px]"
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
            {dict.home.ctaTitle1}{" "}
            <span className="text-gradient-crimson">{dict.home.ctaTitleAccent}</span>
          </h2>
        </AnimatedReveal>
        <AnimatedReveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
            {dict.home.ctaText}
          </p>
        </AnimatedReveal>
        <AnimatedReveal delay={0.3}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href={`/${lang}/contact`} variant="crimson" size="lg">
              {dict.home.ctaJoin}
            </Button>
            <Button href={`/${lang}/about`} variant="outline" size="lg">
              {dict.common.ourStory}
            </Button>
          </div>
        </AnimatedReveal>
      </Container>
    </section>
  );
}
