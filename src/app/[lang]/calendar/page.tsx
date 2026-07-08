import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { CalendarView } from "@/components/sections/CalendarView";
import { getEventsSorted } from "@/data/calendar";
import { getDict, hasLang } from "@/i18n";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDict(hasLang(lang) ? lang : "el");
  return {
    title: `${dict.calendarPage.title1} ${dict.calendarPage.titleAccent}`,
    description: dict.calendarPage.text,
    openGraph: {
      title: `${dict.calendarPage.title1} ${dict.calendarPage.titleAccent} | PYRGOS AFC`,
      description: dict.calendarPage.text,
    },
  };
}

export default async function CalendarPage({ params }: PageProps) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();

  const dict = getDict(lang);
  const events = getEventsSorted();

  return (
    <>
      <section className="noise relative overflow-hidden bg-night pb-16 pt-40 sm:pb-24">
        <div className="stadium-lights" aria-hidden="true" />
        <Container className="relative">
          <AnimatedReveal>
            <p className="font-display text-xs font-bold uppercase tracking-[0.32em] text-crimson-bright">
              {dict.calendarPage.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-6xl">
              {dict.calendarPage.title1}{" "}
              <span className="text-gradient-crimson">{dict.calendarPage.titleAccent}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              {dict.calendarPage.text}
            </p>
          </AnimatedReveal>
        </Container>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <Container>
          <AnimatedReveal>
            <CalendarView
              events={events}
              lang={lang}
              labels={{
                all: dict.common.allEvents,
                types: dict.eventTypes,
                filterAria: dict.calendarPage.filterAria,
                noEvents: dict.common.noEvents,
                events: dict.common.events,
                event: dict.common.event,
              }}
            />
          </AnimatedReveal>
        </Container>
      </section>
    </>
  );
}
