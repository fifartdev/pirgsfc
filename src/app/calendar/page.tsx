import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { CalendarView } from "@/components/sections/CalendarView";
import { getEventsSorted } from "@/data/calendar";

export const metadata: Metadata = {
  title: "Team Calendar",
  description:
    "The PYRGOS FC team calendar — training sessions, matchdays, recovery, media days, community events, and academy programmes.",
  openGraph: {
    title: "Team Calendar | PYRGOS FC",
    description:
      "Training sessions, matchdays, media days, community and academy events.",
  },
};

export default function CalendarPage() {
  const events = getEventsSorted();

  return (
    <>
      <section className="noise relative overflow-hidden bg-night pb-16 pt-40 sm:pb-24">
        <div className="stadium-lights" aria-hidden="true" />
        <Container className="relative">
          <AnimatedReveal>
            <p className="font-display text-xs font-bold uppercase tracking-[0.32em] text-gold">
              The Schedule
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-6xl">
              Team <span className="text-gradient-gold">Calendar</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              Every training session is a step forward. Follow everything
              happening at the club — from matchdays and training to community
              events and academy programmes.
            </p>
          </AnimatedReveal>
        </Container>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <Container>
          <AnimatedReveal>
            <CalendarView events={events} />
          </AnimatedReveal>
        </Container>
      </section>
    </>
  );
}
