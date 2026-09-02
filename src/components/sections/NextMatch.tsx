import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getDict } from "@/i18n";
import { formatDateLong, localeHref } from "@/lib/utils";
import type { Lang, Match } from "@/types";

interface NextMatchProps {
  match: Match;
  lang: Lang;
}

export function NextMatch({ match, lang }: NextMatchProps) {
  const dict = getDict(lang);

  return (
    <section className="relative py-20 sm:py-28" aria-labelledby="next-match-heading">
      <Container>
        <AnimatedReveal>
          <SectionHeading
            eyebrow={dict.home.nextMatchEyebrow}
            title={dict.home.nextMatchTitle}
            description={dict.home.nextMatchText}
          />
        </AnimatedReveal>

        <AnimatedReveal delay={0.15}>
          <div className="gradient-border noise relative mt-12 overflow-hidden rounded-3xl p-8 shadow-card sm:p-12">
            <div
              className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-crimson/20 blur-[90px]"
              aria-hidden="true"
            />
            <div
              className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-smoke/10 blur-[80px]"
              aria-hidden="true"
            />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr]">
              <div className="flex flex-col items-center gap-3 text-center lg:items-end lg:text-right">
                {match.homeTeamLogoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={match.homeTeamLogoUrl}
                    alt=""
                    className="h-14 w-14 object-contain"
                  />
                )}
                <p className="font-display text-3xl font-extrabold uppercase tracking-wide text-crimson-bright sm:text-4xl">
                  {match.homeTeam[lang]}
                </p>
                <p className="text-sm text-mist">{dict.common.home}</p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <span
                  className="flex h-20 w-20 items-center justify-center rounded-full border border-crimson/40 bg-night/70 font-display text-xl font-extrabold text-crimson-bright shadow-glow-crimson"
                  aria-hidden="true"
                >
                  VS
                </span>
                <Badge variant="smoke">
                  {match.leagueName?.[lang] || dict.competitions[match.competition]}
                </Badge>
              </div>

              <div className="flex flex-col items-center gap-3 text-center lg:items-start lg:text-left">
                {match.awayTeamLogoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={match.awayTeamLogoUrl}
                    alt=""
                    className="h-14 w-14 object-contain"
                  />
                )}
                <p className="font-display text-3xl font-extrabold uppercase tracking-wide text-white sm:text-4xl">
                  {match.awayTeam[lang]}
                </p>
                <p className="text-sm text-mist">{dict.common.away}</p>
              </div>
            </div>

            <div className="relative mt-10 flex flex-col items-center justify-between gap-6 border-t border-line pt-8 sm:flex-row">
              <div className="text-center sm:text-left">
                <p className="font-display text-lg font-bold text-white">
                  {formatDateLong(match.date, lang)} · {match.time}
                </p>
                <p className="mt-1 text-sm text-mist">
                  {match.venue[lang]}
                  {match.matchweek ? ` · ${match.matchweek[lang]}` : ""}
                </p>
              </div>
              <Button
                href={localeHref(lang, "/news/match-preview-pyrgos-afc-vs-olympia-united")}
                variant="crimson"
              >
                {dict.common.matchPreview}
              </Button>
            </div>
          </div>
        </AnimatedReveal>
      </Container>
    </section>
  );
}
