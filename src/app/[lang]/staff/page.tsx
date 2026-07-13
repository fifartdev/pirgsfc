import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaffCard } from "@/components/cards/StaffCard";
import { getCmsStaff } from "@/lib/cms-data";
import { getDict, hasLang } from "@/i18n";
import { buildAlternates } from "@/lib/utils";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const resolvedLang = hasLang(lang) ? lang : "el";
  const dict = getDict(resolvedLang);
  return {
    title: `${dict.staffPage.title1} ${dict.staffPage.titleAccent}`,
    description: dict.staffPage.text,
    alternates: buildAlternates(resolvedLang, "/staff"),
    openGraph: {
      title: `${dict.staffPage.title1} ${dict.staffPage.titleAccent} | PYRGOS AFC`,
      description: dict.staffPage.text,
    },
  };
}

export default async function StaffPage({ params }: PageProps) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();

  const dict = getDict(lang);
  const staff = await getCmsStaff();

  return (
    <>
      <section className="noise relative overflow-hidden bg-night pb-16 pt-40 sm:pb-24">
        <div className="stadium-lights" aria-hidden="true" />
        <Container className="relative">
          <AnimatedReveal>
            <p className="font-display text-xs font-bold uppercase tracking-[0.32em] text-crimson-bright">
              {dict.staffPage.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-6xl">
              {dict.staffPage.title1}{" "}
              <span className="text-gradient-crimson">{dict.staffPage.titleAccent}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              {dict.staffPage.text}
            </p>
          </AnimatedReveal>
        </Container>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {staff.map((member, index) => (
              <AnimatedReveal key={member.slug} delay={(index % 2) * 0.1}>
                <StaffCard member={member} lang={lang} />
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="clip-diagonal relative bg-ash-950 py-24">
        <Container>
          <AnimatedReveal>
            <SectionHeading
              eyebrow={dict.staffPage.standardEyebrow}
              title={dict.staffPage.standardTitle}
              description={dict.staffPage.standardText}
              align="center"
            />
          </AnimatedReveal>
        </Container>
      </section>
    </>
  );
}
