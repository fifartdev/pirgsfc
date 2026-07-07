import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { RosterGrid } from "@/components/sections/RosterGrid";
import { players } from "@/data/players";

export const metadata: Metadata = {
  title: "Roster",
  description:
    "The full PYRGOS FC first-team squad — goalkeepers, defenders, midfielders, and forwards. Numbers, positions, stats, and player profiles.",
  openGraph: {
    title: "Roster | PYRGOS FC",
    description: "The full PYRGOS FC first-team squad and player profiles.",
  },
};

export default function RosterPage() {
  return (
    <>
      <section className="noise relative overflow-hidden bg-night pb-16 pt-40 sm:pb-24">
        <div className="stadium-lights" aria-hidden="true" />
        <span
          className="pointer-events-none absolute -bottom-6 right-0 select-none font-display text-[18vw] font-extrabold uppercase leading-none text-white/[0.02]"
          aria-hidden="true"
        >
          Squad
        </span>
        <Container className="relative">
          <AnimatedReveal>
            <p className="font-display text-xs font-bold uppercase tracking-[0.32em] text-gold">
              First Team · 2026 Season
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-6xl">
              The <span className="text-gradient-gold">Squad</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              Twenty players. One badge. Every one of them carries the hopes of
              the city onto the pitch. Meet the men who wear the shirt.
            </p>
          </AnimatedReveal>
        </Container>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <Container>
          <AnimatedReveal>
            <RosterGrid players={players} />
          </AnimatedReveal>
        </Container>
      </section>
    </>
  );
}
