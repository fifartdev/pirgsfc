import Link from "next/link";
import { Users, Trophy, Zap, GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { getDict } from "@/i18n";
import type { Lang } from "@/types";

interface DepartmentsSectionProps {
  lang: Lang;
}

export function DepartmentsSection({ lang }: DepartmentsSectionProps) {
  const dict = getDict(lang);

  const sections = [
    {
      icon: Trophy,
      title: dict.teams.menTitle,
      text: dict.teams.menText,
      href: `/${lang}/men`,
    },
    {
      icon: Users,
      title: dict.teams.womenTitle,
      text: dict.teams.womenText,
      href: `/${lang}/women`,
    },
    {
      icon: Zap,
      title: dict.teams.futsalTitle,
      text: dict.teams.futsalText,
      href: `/${lang}/futsal`,
    },
    {
      icon: GraduationCap,
      title: dict.academy.title,
      text: dict.academy.heroText,
      href: `/${lang}/academy`,
    },
  ];

  return (
    <section className="relative py-20 sm:py-28" aria-labelledby="departments-heading">
      <Container>
        <AnimatedReveal>
          <SectionHeading
            eyebrow={dict.home.sectionsEyebrow}
            title={dict.home.sectionsTitle}
            description={dict.home.sectionsText}
            align="center"
          />
        </AnimatedReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((section, index) => (
            <AnimatedReveal key={section.href} delay={index * 0.1}>
              <Link
                href={section.href}
                className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson"
              >
                <article className="gradient-border relative h-full overflow-hidden rounded-2xl p-7 shadow-card transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-glow-crimson">
                  <span
                    className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-crimson/15 blur-3xl"
                    aria-hidden="true"
                  />
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-crimson/30 bg-crimson/10 text-crimson-bright transition-all duration-300 group-hover:bg-crimson group-hover:text-white">
                    <section.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="relative mt-5 font-display text-xl font-extrabold uppercase tracking-wide text-white transition-colors group-hover:text-crimson-bright">
                    {section.title}
                  </h3>
                  <p className="relative mt-3 line-clamp-3 text-sm leading-relaxed text-mist">
                    {section.text}
                  </p>
                  <p className="relative mt-5 font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-crimson-bright/90">
                    {dict.common.readMore} →
                  </p>
                </article>
              </Link>
            </AnimatedReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
