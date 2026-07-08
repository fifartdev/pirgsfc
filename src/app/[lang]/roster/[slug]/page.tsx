import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { players, getPlayerBySlug, getRelatedPlayers } from "@/data/players";
import { DEPARTMENT_PATHS } from "@/lib/constants";
import { getDict, hasLang } from "@/i18n";
import { formatDateLong, initialsOf } from "@/lib/utils";

interface PlayerPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export function generateStaticParams() {
  return players.map((player) => ({ slug: player.slug }));
}

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  const { lang: langParam, slug } = await params;
  const lang = hasLang(langParam) ? langParam : "el";
  const dict = getDict(lang);
  const player = getPlayerBySlug(slug);
  if (!player) return { title: "Not Found" };
  const fullName = `${player.firstName[lang]} ${player.lastName[lang]}`;
  return {
    title: `${fullName} — #${player.number}`,
    description: `${fullName} · ${dict.positions[player.position]} · PYRGOS AFC`,
    openGraph: {
      title: `${fullName} | PYRGOS AFC`,
      description: `${dict.positions[player.position]} · #${player.number} · PYRGOS AFC`,
    },
  };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { lang, slug } = await params;
  if (!hasLang(lang)) notFound();

  const dict = getDict(lang);
  const player = getPlayerBySlug(slug);

  if (!player) {
    notFound();
  }

  const related = getRelatedPlayers(slug, 3);
  const teamHref = `/${lang}${DEPARTMENT_PATHS[player.department]}`;

  const statItems = [
    { label: dict.common.appearances, value: player.stats.appearances },
    { label: dict.common.goals, value: player.stats.goals },
    { label: dict.common.assists, value: player.stats.assists },
    { label: dict.common.yellowCards, value: player.stats.yellowCards },
    { label: dict.common.redCards, value: player.stats.redCards },
    { label: dict.common.minutesPlayed, value: player.stats.minutesPlayed },
    ...(player.stats.cleanSheets !== undefined
      ? [{ label: dict.common.cleanSheets, value: player.stats.cleanSheets }]
      : []),
  ];

  return (
    <>
      {/* Hero profile */}
      <section className="noise relative overflow-hidden bg-night pb-20 pt-40 sm:pb-28">
        <div className="stadium-lights" aria-hidden="true" />
        <span
          className="pointer-events-none absolute -right-8 top-24 select-none font-display text-[24rem] font-extrabold leading-none text-white/[0.03]"
          aria-hidden="true"
        >
          {player.number}
        </span>

        <Container className="relative">
          <AnimatedReveal>
            <Link
              href={teamHref}
              className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-mist transition-colors hover:text-crimson-bright"
            >
              ← {dict.common.backToTeam}
            </Link>
          </AnimatedReveal>

          <div className="mt-10 grid gap-12 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-16">
            <AnimatedReveal>
              <div
                className="gradient-border relative mx-auto flex h-64 w-64 items-center justify-center rounded-full shadow-glow-crimson"
                aria-hidden="true"
              >
                <span className="absolute inset-4 rounded-full border border-crimson/20" />
                <span className="font-display text-7xl font-extrabold text-smoke-bright">
                  {initialsOf(player.firstName, player.lastName, lang)}
                </span>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-crimson px-5 py-1.5 font-display text-lg font-extrabold text-white shadow-glow-crimson">
                  #{player.number}
                </span>
              </div>
            </AnimatedReveal>

            <AnimatedReveal delay={0.15}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="crimson">{dict.positions[player.position]}</Badge>
                <Badge variant="neutral">{dict.departments[player.department]}</Badge>
                <Badge variant="outline">{player.nationality[lang]}</Badge>
                {player.captain && <Badge variant="smoke">{dict.common.captain}</Badge>}
              </div>
              <h1 className="mt-5 font-display uppercase leading-none tracking-tight text-white">
                <span className="block text-2xl font-semibold text-mist sm:text-3xl">
                  {player.firstName[lang]}
                </span>
                <span className="mt-1 block text-5xl font-extrabold sm:text-7xl">
                  {player.lastName[lang]}
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
                {player.bio[lang]}
              </p>

              <dl className="mt-8 grid max-w-xl grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
                <div>
                  <dt className="text-xs uppercase tracking-widest text-mist">
                    {dict.common.age}
                  </dt>
                  <dd className="mt-1 font-display text-xl font-bold text-white">
                    {player.age}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-mist">
                    {dict.common.height}
                  </dt>
                  <dd className="mt-1 font-display text-xl font-bold text-white">
                    {player.heightCm} cm
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-mist">
                    {dict.common.weight}
                  </dt>
                  <dd className="mt-1 font-display text-xl font-bold text-white">
                    {player.weightKg} kg
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-mist">
                    {dict.common.foot}
                  </dt>
                  <dd className="mt-1 font-display text-xl font-bold text-white">
                    {dict.feet[player.preferredFoot]}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs uppercase tracking-widest text-mist">
                    {dict.common.joined}
                  </dt>
                  <dd className="mt-1 font-display text-xl font-bold text-white">
                    {formatDateLong(player.joined, lang)}
                  </dd>
                </div>
              </dl>
            </AnimatedReveal>
          </div>
        </Container>
      </section>

      {/* Season stats */}
      <section className="clip-diagonal relative bg-ash-950 py-24 sm:py-32">
        <Container>
          <AnimatedReveal>
            <SectionHeading
              eyebrow={dict.common.season}
              title={dict.common.seasonStats}
            />
          </AnimatedReveal>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
            {statItems.map((stat, index) => (
              <AnimatedReveal key={stat.label} delay={index * 0.06}>
                <div className="glass rounded-2xl p-5 text-center shadow-card">
                  <p className="text-gradient-crimson font-display text-3xl font-extrabold tabular-nums sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-mist">
                    {stat.label}
                  </p>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Related players */}
      <section className="relative py-24 sm:py-32">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <AnimatedReveal>
              <SectionHeading
                eyebrow={dict.common.squad}
                title={dict.common.relatedPlayers}
              />
            </AnimatedReveal>
            <AnimatedReveal delay={0.1}>
              <Button href={teamHref} variant="outline">
                {dict.common.fullSquad}
              </Button>
            </AnimatedReveal>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((relatedPlayer, index) => (
              <AnimatedReveal key={relatedPlayer.slug} delay={index * 0.1}>
                <PlayerCard player={relatedPlayer} lang={lang} />
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
