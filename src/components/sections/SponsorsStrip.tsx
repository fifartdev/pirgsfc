import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { getDict } from "@/i18n";
import { getCmsClubInfo } from "@/lib/cms-data";
import type { Lang } from "@/types";

interface SponsorsStripProps {
  lang: Lang;
}

export async function SponsorsStrip({ lang }: SponsorsStripProps) {
  const dict = getDict(lang);
  const { sponsors } = await getCmsClubInfo();

  return (
    <section
      className="relative border-y border-line bg-ash-950/60 py-14"
      aria-labelledby="sponsors-heading"
    >
      <Container>
        <AnimatedReveal>
          <h2
            id="sponsors-heading"
            className="text-center font-display text-xs font-bold uppercase tracking-[0.32em] text-mist"
          >
            {dict.home.sponsorsTitle}
          </h2>
        </AnimatedReveal>

        <AnimatedReveal delay={0.1}>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {sponsors.map((sponsor) => (
              <li key={sponsor.id} className="group text-center">
                <p className="font-display text-lg font-extrabold uppercase tracking-wide text-white/45 transition-colors duration-300 group-hover:text-crimson-bright sm:text-xl">
                  {sponsor.name}
                </p>
                <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-mist/60">
                  {sponsor.tagline[lang]}
                </p>
              </li>
            ))}
          </ul>
        </AnimatedReveal>
      </Container>
    </section>
  );
}
