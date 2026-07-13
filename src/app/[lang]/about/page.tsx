import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Crest } from "@/components/ui/Crest";
import { StatCard } from "@/components/cards/StatCard";
import { ClubValues } from "@/components/sections/ClubValues";
import { getCmsClubInfo, getCmsAboutContent } from "@/lib/cms-data";
import { getDict, hasLang } from "@/i18n";
import { localeHref, buildAlternates } from "@/lib/utils";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const resolvedLang = hasLang(lang) ? lang : "el";
  const dict = getDict(resolvedLang);
  const content = await getCmsAboutContent();
  const description = content.heroText[resolvedLang];
  return {
    title: dict.nav.club,
    description,
    alternates: buildAlternates(resolvedLang, "/about"),
    openGraph: { title: `${dict.nav.club} | PYRGOS AFC`, description },
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();

  const dict = getDict(lang);
  const [clubInfo, content] = await Promise.all([getCmsClubInfo(), getCmsAboutContent()]);

  return (
    <>
      {/* Page hero */}
      <section className="noise relative overflow-hidden bg-night pb-20 pt-40 sm:pb-28">
        <div className="stadium-lights" aria-hidden="true" />
        <Container className="relative">
          <AnimatedReveal>
            <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-14">
              <Crest size="lg" />
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-[0.32em] text-crimson-bright">
                  {content.eyebrow[lang]}
                </p>
                <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-6xl">
                  {content.title1[lang]}{" "}
                  <span className="text-gradient-crimson">{content.titleAccent[lang]}</span>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
                  {content.heroText[lang]}
                </p>
              </div>
            </div>
          </AnimatedReveal>
        </Container>
      </section>

      {/* Mission */}
      <section className="clip-diagonal relative bg-ash-950 py-24 sm:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <AnimatedReveal>
              <SectionHeading
                eyebrow={content.missionEyebrow[lang]}
                title={content.missionTitle[lang]}
              />
              <div className="mt-6 space-y-5 text-base leading-relaxed text-mist">
                <p>{content.mission1[lang]}</p>
                <p>{content.mission2[lang]}</p>
                <p>{content.mission3[lang]}</p>
              </div>
              <div className="mt-8">
                <Button href={localeHref(lang, "/men")} variant="crimson">
                  {dict.common.meetTheTeam}
                </Button>
              </div>
            </AnimatedReveal>

            <AnimatedReveal delay={0.15}>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <StatCard value={content.statFounded} label={dict.about.statsFounded} accent="crimson" />
                <StatCard value={content.statPlayers} label={dict.about.statsPlayers} accent="smoke" />
                <StatCard value={content.statGroups} label={dict.about.statsGroups} accent="smoke" />
                <StatCard value={content.statCapacity} label={dict.about.statsCapacity} accent="crimson" />
              </div>
            </AnimatedReveal>
          </div>
        </Container>
      </section>

      {/* Club-admin editable "about" text (ClubInfo.about/aboutEn), shown only
          when a superadmin/club_admin has actually written something there —
          this section doesn't exist in the static/dict content, it's purely
          additive so club-admin content editors have somewhere to publish
          long-form updates without a code change. */}
      {clubInfo.about[lang] && (
        <section className="relative pb-24 sm:pb-0">
          <Container className="max-w-3xl">
            <AnimatedReveal>
              <p className="whitespace-pre-line text-base leading-relaxed text-mist">
                {clubInfo.about[lang]}
              </p>
            </AnimatedReveal>
          </Container>
        </section>
      )}

      {/* History timeline */}
      <section className="relative py-24 sm:py-32">
        <Container>
          <AnimatedReveal>
            <SectionHeading
              eyebrow={content.storyEyebrow[lang]}
              title={content.storyTitle[lang]}
              description={content.storyText[lang]}
              align="center"
            />
          </AnimatedReveal>

          <ol className="relative mx-auto mt-16 max-w-3xl space-y-10 border-l border-line pl-8 sm:pl-12">
            {content.timeline.map((item, index) => (
              <AnimatedReveal key={`${item.year}-${item.title[lang]}`} delay={index * 0.1}>
                <li className="relative">
                  <span
                    className="absolute -left-[2.55rem] top-1 flex h-5 w-5 items-center justify-center rounded-full border border-crimson bg-night sm:-left-[3.55rem]"
                    aria-hidden="true"
                  >
                    <span className="h-2 w-2 rounded-full bg-crimson" />
                  </span>
                  <Badge variant="crimson">{item.year}</Badge>
                  <h3 className="mt-3 font-display text-xl font-bold uppercase tracking-wide text-white">
                    {item.title[lang]}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{item.text[lang]}</p>
                </li>
              </AnimatedReveal>
            ))}
          </ol>
        </Container>
      </section>

      <ClubValues lang={lang} />

      {/* Stadium */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <Container>
          <div className="gradient-border noise relative overflow-hidden rounded-3xl p-8 shadow-card sm:p-14">
            <div className="stadium-lights opacity-70" aria-hidden="true" />
            <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
              <AnimatedReveal>
                <SectionHeading
                  eyebrow={content.stadiumEyebrow[lang]}
                  title={content.stadiumTitle[lang]}
                  description={content.stadiumText[lang]}
                />
                <dl className="mt-8 grid grid-cols-2 gap-6">
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-mist">
                      {dict.about.capacity}
                    </dt>
                    <dd className="mt-1 font-display text-2xl font-extrabold text-crimson-bright">
                      {clubInfo.stadiumCapacity}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-mist">
                      {dict.about.opened}
                    </dt>
                    <dd className="mt-1 font-display text-2xl font-extrabold text-crimson-bright">
                      {clubInfo.stadiumOpened}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs uppercase tracking-widest text-mist">
                      {dict.about.address}
                    </dt>
                    <dd className="mt-1 text-sm text-white/85">
                      {clubInfo.contactAddress[lang]}
                    </dd>
                  </div>
                </dl>
                <div className="mt-8">
                  <Button href={localeHref(lang, "/matches")} variant="crimson">
                    {dict.about.seeMatchday}
                  </Button>
                </div>
              </AnimatedReveal>

              {/* CSS stadium illustration */}
              <AnimatedReveal delay={0.15}>
                <div className="relative mx-auto aspect-[4/3] w-full max-w-md" aria-hidden="true">
                  <div className="absolute inset-x-6 bottom-6 top-16 rounded-[50%] border border-crimson/40 bg-ash-800/60" />
                  <div className="absolute inset-x-14 bottom-12 top-24 rounded-[50%] border border-smoke/30 bg-ash-900" />
                  <div className="absolute inset-x-24 bottom-[4.5rem] top-32 rounded-[50%] border border-emerald-500/40 bg-emerald-900/30" />
                  <div className="absolute left-1/2 top-1/2 h-px w-24 -translate-x-1/2 bg-emerald-400/40" />
                  <div className="absolute left-1/2 top-[58%] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/40" />
                  <span className="absolute left-6 top-6 h-16 w-1 rotate-12 rounded bg-gradient-to-b from-crimson-bright/80 to-transparent" />
                  <span className="absolute right-6 top-6 h-16 w-1 -rotate-12 rounded bg-gradient-to-b from-crimson-bright/80 to-transparent" />
                  <span className="absolute left-4 top-3 h-3 w-6 rounded-full bg-crimson-bright/90 blur-[2px]" />
                  <span className="absolute right-4 top-3 h-3 w-6 rounded-full bg-crimson-bright/90 blur-[2px]" />
                </div>
              </AnimatedReveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Fans / community */}
      <section className="clip-diagonal relative bg-ash-950 py-24 sm:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <AnimatedReveal>
              <SectionHeading
                eyebrow={content.fansEyebrow[lang]}
                title={content.fansTitle[lang]}
                description={content.fansText[lang]}
              />
              <div className="mt-6 space-y-5 text-base leading-relaxed text-mist">
                <p>{content.fans1[lang]}</p>
                <p>{content.fans2[lang]}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href={localeHref(lang, "/contact")} variant="crimson">
                  {dict.common.getInvolved}
                </Button>
                <Button href={localeHref(lang, "/calendar")} variant="outline">
                  {dict.about.communityEvents}
                </Button>
              </div>
            </AnimatedReveal>

            <AnimatedReveal delay={0.15}>
              <blockquote className="glass relative rounded-3xl p-8 shadow-card sm:p-10">
                <span
                  className="absolute -top-5 left-8 font-display text-7xl font-extrabold leading-none text-crimson/50"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <p className="text-lg leading-relaxed text-white/90">{content.quote[lang]}</p>
                <footer className="mt-6 border-t border-line pt-5">
                  <p className="font-display text-sm font-bold uppercase tracking-wide text-crimson-bright">
                    {content.quoteName[lang]}
                  </p>
                  <p className="text-xs text-mist">{content.quoteRole[lang]}</p>
                </footer>
              </blockquote>
            </AnimatedReveal>
          </div>
        </Container>
      </section>
    </>
  );
}
