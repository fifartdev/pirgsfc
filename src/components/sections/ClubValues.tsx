import { Flame, Shield, Users, Rocket } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { getDict } from "@/i18n";
import { getCmsClubInfo } from "@/lib/cms-data";
import type { Lang } from "@/types";

interface ClubValuesProps {
  lang: Lang;
}

// Values are a variable-length CMS array with no icon field of their own —
// cycle through this fixed set so a 5th admin-added value still gets an icon
// instead of breaking.
const VALUE_ICONS = [Flame, Shield, Users, Rocket];

export async function ClubValues({ lang }: ClubValuesProps) {
  const dict = getDict(lang);
  const clubInfo = await getCmsClubInfo();

  const values = clubInfo.values.map((value, index) => ({
    icon: VALUE_ICONS[index % VALUE_ICONS.length],
    title: value.title[lang],
    text: value.description[lang],
  }));

  return (
    <section
      className="clip-diagonal relative bg-ash-950 py-24 sm:py-32"
      aria-labelledby="club-values-heading"
    >
      <Container>
        <AnimatedReveal>
          <SectionHeading
            eyebrow={dict.home.valuesEyebrow}
            title={dict.home.valuesTitle}
            description={dict.home.valuesText}
            align="center"
          />
        </AnimatedReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <AnimatedReveal key={value.title} delay={index * 0.1}>
              <article className="glass group h-full rounded-2xl p-7 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-crimson/30">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-crimson/30 bg-crimson/10 text-crimson-bright transition-all duration-300 group-hover:bg-crimson group-hover:text-white">
                  <value.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-xl font-extrabold uppercase tracking-wide text-white">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{value.text}</p>
              </article>
            </AnimatedReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
