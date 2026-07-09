import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { MatchesTabs } from "@/components/sections/MatchesTabs";
import { getCmsUpcomingMatches, getCmsCompletedMatches, getCmsNextMatch } from "@/lib/cms-data";
import { getDict, hasLang } from "@/i18n";
import { formatDateLong } from "@/lib/utils";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDict(hasLang(lang) ? lang : "el");
  return {
    title: `${dict.matches.title1} ${dict.matches.titleAccent}`,
    description: dict.matches.text,
    openGraph: {
      title: `${dict.matches.title1} ${dict.matches.titleAccent} | PYRGOS AFC`,
      description: dict.matches.text,
    },
  };
}

export default async function MatchesPage({ params }: PageProps) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();

  const dict = getDict(lang);
  const [upcoming, completed, nextMatch] = await Promise.all([
    getCmsUpcomingMatches(),
    getCmsCompletedMatches(),
    getCmsNextMatch(),
  ]);

  return (
    <>
      <section className="noise relative overflow-hidden bg-night pb-16 pt-40 sm:pb-24">
        <div className="stadium-lights" aria-hidden="true" />
        <Container className="relative">
          <AnimatedReveal>
            <p className="font-display text-xs font-bold uppercase tracking-[0.32em] text-crimson-bright">
              {dict.matches.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-6xl">
              {dict.matches.title1}{" "}
              <span className="text-gradient-crimson">{dict.matches.titleAccent}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              {dict.matches.text}
            </p>
          </AnimatedReveal>

          {nextMatch && (
            <AnimatedReveal delay={0.15}>
              <div className="glass mt-10 inline-flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl px-6 py-4">
                <Badge variant="crimson">{dict.matches.nextUp}</Badge>
                <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
                  {nextMatch.homeTeam[lang]} — {nextMatch.awayTeam[lang]}
                </p>
                <p className="text-sm text-mist">
                  {formatDateLong(nextMatch.date, lang)} · {nextMatch.time} ·{" "}
                  {nextMatch.venue[lang]}
                </p>
              </div>
            </AnimatedReveal>
          )}
        </Container>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <Container>
          <AnimatedReveal>
            <MatchesTabs
              upcoming={upcoming}
              completed={completed}
              lang={lang}
              labels={{
                all: dict.matches.tabAll,
                upcoming: dict.matches.tabUpcoming,
                results: dict.matches.tabResults,
                filterAria: dict.matches.filterAria,
              }}
            />
          </AnimatedReveal>
        </Container>
      </section>

      <section className="clip-diagonal relative bg-ash-950 py-24">
        <Container>
          <AnimatedReveal>
            <SectionHeading
              eyebrow={dict.matches.experienceEyebrow}
              title={dict.matches.experienceTitle}
              description={dict.matches.experienceText}
              align="center"
            />
          </AnimatedReveal>
        </Container>
      </section>
    </>
  );
}
