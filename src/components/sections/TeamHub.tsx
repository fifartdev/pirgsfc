import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { RosterGrid } from "@/components/sections/RosterGrid";
import { MatchCard } from "@/components/cards/MatchCard";
import Image from "next/image";
import { getPlayersByDepartment } from "@/data/players";
import { getUpcomingMatches, getCompletedMatches } from "@/data/matches";
import { getDict } from "@/i18n";
import type { Department, Lang, Match, Player } from "@/types";

interface TeamHubProps {
  lang: Lang;
  department: Department;
  eyebrow: string;
  title: string;
  titleAccent: string;
  text: string;
  /** Pre-fetched matches from CMS; falls back to static data when omitted. */
  matches?: Match[];
  /** Team logo URL from CMS media. */
  logoUrl?: string;
  /** Pre-fetched squad from CMS (with profile photos); falls back to static data when omitted. */
  players?: Player[];
}

/** Shared page body for the men's, women's, and futsal team sections. */
export function TeamHub({ lang, department, eyebrow, title, titleAccent, text, matches, logoUrl, players }: TeamHubProps) {
  const dict = getDict(lang);
  const squad = players ?? getPlayersByDepartment(department);
  const deptMatches = matches ?? [
    ...getUpcomingMatches(department),
    ...getCompletedMatches(department).slice(0, 2),
  ];

  return (
    <>
      <section className="noise relative overflow-hidden bg-night pb-16 pt-40 sm:pb-24">
        <div className="stadium-lights" aria-hidden="true" />
        <span
          className="pointer-events-none absolute -bottom-6 right-0 select-none font-display text-[18vw] font-extrabold uppercase leading-none text-white/[0.02]"
          aria-hidden="true"
        >
          PAFC
        </span>
        <Container className="relative">
          <AnimatedReveal>
            <div className="flex items-center gap-5">
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt={`${title} ${titleAccent} logo`}
                  width={72}
                  height={72}
                  className="shrink-0 drop-shadow-lg"
                />
              )}
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-[0.32em] text-crimson-bright">
                  {eyebrow}
                </p>
                <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-6xl">
                  {title} <span className="text-gradient-crimson">{titleAccent}</span>
                </h1>
              </div>
            </div>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              {text}
            </p>
          </AnimatedReveal>
        </Container>
      </section>

      <section className="relative pb-20" aria-label={dict.teams.squadTitle}>
        <Container>
          <AnimatedReveal>
            <RosterGrid
              players={squad}
              lang={lang}
              labels={{
                all: dict.teams.allPlayers,
                positions: dict.positionsPlural,
                filterAria: dict.teams.filterLabel,
              }}
            />
          </AnimatedReveal>
        </Container>
      </section>

      <section className="clip-diagonal relative bg-ash-950 py-24 sm:py-28">
        <Container>
          <AnimatedReveal>
            <SectionHeading
              eyebrow={dict.common.fixtures}
              title={dict.teams.fixturesTitle}
              description={dict.teams.fixturesText}
            />
          </AnimatedReveal>
          {deptMatches.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {deptMatches.map((match, index) => (
                <AnimatedReveal key={match.id} delay={index * 0.1}>
                  <MatchCard match={match} lang={lang} />
                </AnimatedReveal>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-mist">{dict.teams.noMatches}</p>
          )}
        </Container>
      </section>
    </>
  );
}
