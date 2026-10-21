import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GraduationCap, BookOpen, CalendarDays } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCmsAcademyContent } from "@/lib/cms-data";
import { getDict, hasLang } from "@/i18n";
import { localeHref, buildAlternates } from "@/lib/utils";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const resolvedLang = hasLang(lang) ? lang : "el";
  const { texts } = await getCmsAcademyContent();
  const title = texts.title[resolvedLang];
  const description = texts.heroText[resolvedLang];
  return {
    title,
    description,
    alternates: buildAlternates(resolvedLang, "/academy"),
    openGraph: {
      title: `${title} | PYRGOS AFC`,
      description,
    },
  };
}

export default async function AcademyPage({ params }: PageProps) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();
  const dict = getDict(lang);
  const { texts, groups } = await getCmsAcademyContent();
  const t = (key: keyof typeof texts) => texts[key][lang];

  return (
    <>
      {/* Hero */}
      <section className="noise relative overflow-hidden bg-night pb-16 pt-40 sm:pb-24">
        <div className="stadium-lights" aria-hidden="true" />
        <Container className="relative">
          <AnimatedReveal>
            <p className="font-display text-xs font-bold uppercase tracking-[0.32em] text-crimson-bright">
              {t("eyebrow")}
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-6xl">
              <span className="text-gradient-crimson">{t("title")}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              {t("heroText")}
            </p>
          </AnimatedReveal>
        </Container>
      </section>

      {/* Philosophy */}
      <section className="relative pb-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <AnimatedReveal>
              <SectionHeading
                eyebrow={t("philosophyEyebrow")}
                title={t("philosophyTitle")}
              />
              <div className="mt-6 space-y-5 text-base leading-relaxed text-mist">
                <p>{t("philosophy1")}</p>
                <p>{t("philosophy2")}</p>
              </div>
            </AnimatedReveal>
            <AnimatedReveal delay={0.15}>
              <div className="gradient-border noise relative overflow-hidden rounded-3xl p-8 shadow-card sm:p-10">
                <div className="stadium-lights opacity-60" aria-hidden="true" />
                <div className="relative">
                  <p className="font-display text-xs font-bold uppercase tracking-[0.28em] text-crimson-bright">
                    {t("graduatesEyebrow")}
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight text-white">
                    {t("graduatesTitle")}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-mist">
                    {t("graduatesText")}
                  </p>
                  <div className="mt-6">
                    <Button href={localeHref(lang, "/men")} variant="outline" size="sm">
                      {dict.common.meetTheTeam}
                    </Button>
                  </div>
                </div>
              </div>
            </AnimatedReveal>
          </div>
        </Container>
      </section>

      {/* Age groups */}
      <section className="clip-diagonal relative bg-ash-950 py-24 sm:py-28">
        <Container>
          <AnimatedReveal>
            <SectionHeading
              eyebrow={t("title")}
              title={t("groupsTitle")}
              description={t("groupsText")}
            />
          </AnimatedReveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group, index) => (
              <AnimatedReveal key={group.id} delay={index * 0.08}>
                <article className="glass group h-full rounded-2xl p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-crimson/30">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-2xl border border-crimson/30 bg-crimson/10 font-display text-lg font-extrabold text-crimson-bright"
                      aria-hidden="true"
                    >
                      {group.name[lang]}
                    </span>
                    <Badge variant="outline">{group.ages[lang]}</Badge>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-mist">
                    {group.description[lang]}
                  </p>
                  <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
                    <div className="flex items-center gap-2 text-white/85">
                      <GraduationCap className="h-4 w-4 text-crimson-bright" aria-hidden="true" />
                      <dt className="sr-only">{dict.academy.coachLabel}</dt>
                      <dd>
                        <span className="text-mist">{dict.academy.coachLabel}: </span>
                        {group.coach[lang]}
                      </dd>
                    </div>
                    <div className="flex items-center gap-2 text-white/85">
                      <CalendarDays className="h-4 w-4 text-crimson-bright" aria-hidden="true" />
                      <dt className="sr-only">{dict.academy.trainingLabel}</dt>
                      <dd>
                        <span className="text-mist">{dict.academy.trainingLabel}: </span>
                        {group.trainingDays[lang]}
                      </dd>
                    </div>
                  </dl>
                </article>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Trials CTA */}
      <section className="relative py-24 sm:py-28">
        <Container className="text-center">
          <AnimatedReveal>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-crimson/30 bg-crimson/10 text-crimson-bright">
              <BookOpen className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-4xl">
              {t("trialsTitle")}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-mist">
              {t("trialsText")}
            </p>
            <div className="mt-9">
              <Button href={localeHref(lang, "/contact")} variant="crimson" size="lg">
                {t("trialsCta")}
              </Button>
            </div>
          </AnimatedReveal>
        </Container>
      </section>
    </>
  );
}
