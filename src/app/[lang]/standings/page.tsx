import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Badge } from "@/components/ui/Badge";
import { getCmsStandings } from "@/lib/cms-data";
import { getDict, hasLang } from "@/i18n";
import { buildAlternates, cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const resolvedLang = hasLang(lang) ? lang : "el";
  const dict = getDict(resolvedLang);
  return {
    title: `${dict.standings.title1} ${dict.standings.titleAccent}`,
    description: dict.standings.text,
    alternates: buildAlternates(resolvedLang, "/standings"),
    openGraph: {
      title: `${dict.standings.title1} ${dict.standings.titleAccent} | PYRGOS AFC`,
      description: dict.standings.text,
    },
  };
}

export default async function StandingsPage({ params }: PageProps) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();

  const dict = getDict(lang);
  const leagues = await getCmsStandings();

  return (
    <>
      <section className="noise relative overflow-hidden bg-night pb-16 pt-40 sm:pb-24">
        <div className="stadium-lights" aria-hidden="true" />
        <Container className="relative">
          <AnimatedReveal>
            <p className="font-display text-xs font-bold uppercase tracking-[0.32em] text-crimson-bright">
              {dict.standings.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-6xl">
              {dict.standings.title1}{" "}
              <span className="text-gradient-crimson">{dict.standings.titleAccent}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              {dict.standings.text}
            </p>
          </AnimatedReveal>
        </Container>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <Container>
          {leagues.length === 0 ? (
            <AnimatedReveal>
              <p className="glass rounded-2xl p-8 text-center text-mist">{dict.standings.empty}</p>
            </AnimatedReveal>
          ) : (
            <div className="space-y-16">
              {leagues.map((league, index) => (
                <AnimatedReveal key={league.leagueSlug} delay={index * 0.1}>
                  <h2 className="mb-6 font-display text-xl font-extrabold uppercase tracking-wide text-white">
                    {league.leagueName[lang]}
                  </h2>
                  <div className="glass overflow-x-auto rounded-2xl shadow-card">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-line text-[0.65rem] uppercase tracking-widest text-mist">
                          <th className="px-4 py-3 font-semibold">{dict.standings.position}</th>
                          <th className="px-4 py-3 font-semibold">{dict.standings.team}</th>
                          <th className="px-3 py-3 text-center font-semibold">{dict.standings.played}</th>
                          <th className="px-3 py-3 text-center font-semibold">{dict.standings.won}</th>
                          <th className="px-3 py-3 text-center font-semibold">{dict.standings.drawn}</th>
                          <th className="px-3 py-3 text-center font-semibold">{dict.standings.lost}</th>
                          <th className="px-3 py-3 text-center font-semibold">{dict.standings.goalsFor}</th>
                          <th className="px-3 py-3 text-center font-semibold">{dict.standings.goalsAgainst}</th>
                          <th className="px-3 py-3 text-center font-semibold">{dict.standings.goalDifference}</th>
                          <th className="px-4 py-3 text-center font-semibold">{dict.standings.points}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {league.rows.map((row) => (
                          <tr
                            key={`${league.leagueSlug}-${row.position}-${row.teamName.el}`}
                            className={cn(
                              "border-b border-line/60 last:border-0",
                              row.isPyrgos && "bg-crimson/10"
                            )}
                          >
                            <td className="px-4 py-3 tabular-nums text-white/85">{row.position}</td>
                            <td className="px-4 py-3 font-semibold text-white">
                              <span className="flex items-center gap-2">
                                {row.teamName[lang]}
                                {row.isPyrgos && <Badge variant="crimson">PAFC</Badge>}
                              </span>
                              {row.notes && (
                                <span className="mt-0.5 block text-xs text-mist">{row.notes}</span>
                              )}
                            </td>
                            <td className="px-3 py-3 text-center tabular-nums text-white/75">{row.played}</td>
                            <td className="px-3 py-3 text-center tabular-nums text-white/75">{row.won}</td>
                            <td className="px-3 py-3 text-center tabular-nums text-white/75">{row.drawn}</td>
                            <td className="px-3 py-3 text-center tabular-nums text-white/75">{row.lost}</td>
                            <td className="px-3 py-3 text-center tabular-nums text-white/75">{row.goalsFor}</td>
                            <td className="px-3 py-3 text-center tabular-nums text-white/75">{row.goalsAgainst}</td>
                            <td className="px-3 py-3 text-center tabular-nums text-white/75">
                              {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                            </td>
                            <td className="px-4 py-3 text-center font-display text-base font-extrabold tabular-nums text-crimson-bright">
                              {row.points}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </AnimatedReveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
