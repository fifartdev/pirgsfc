import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Button } from "@/components/ui/Button";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { getDict } from "@/i18n";
import type { Lang, Player } from "@/types";

interface FeaturedPlayersProps {
  players: Player[];
  lang: Lang;
}

export function FeaturedPlayers({ players, lang }: FeaturedPlayersProps) {
  const dict = getDict(lang);

  return (
    <section
      className="noise relative overflow-hidden py-20 sm:py-28"
      aria-labelledby="featured-players-heading"
    >
      <span
        className="pointer-events-none absolute right-0 top-10 select-none font-display text-[16vw] font-extrabold uppercase leading-none text-white/[0.02]"
        aria-hidden="true"
      >
        Squad
      </span>
      <Container className="relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <AnimatedReveal>
            <SectionHeading
              eyebrow={dict.home.playersEyebrow}
              title={dict.home.playersTitle}
              description={dict.home.playersText}
            />
          </AnimatedReveal>
          <AnimatedReveal delay={0.1}>
            <Button href={`/${lang}/men`} variant="outline">
              {dict.common.fullSquad}
            </Button>
          </AnimatedReveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {players.slice(0, 4).map((player, index) => (
            <AnimatedReveal key={player.slug} delay={index * 0.1}>
              <PlayerCard player={player} lang={lang} />
            </AnimatedReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
