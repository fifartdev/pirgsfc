"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Match } from "@/types";

interface HeroProps {
  nextMatch?: Match;
}

const ease = [0.21, 0.47, 0.32, 0.98] as const;

export function Hero({ nextMatch }: HeroProps) {
  const reducedMotion = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: reducedMotion ? 0 : 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section
      className="noise relative flex min-h-svh items-center overflow-hidden bg-night pitch-pattern"
      aria-label="PYRGOS FC introduction"
    >
      {/* Stadium light glow */}
      <div className="stadium-lights" aria-hidden="true" />

      {/* Animated glow orbs */}
      <motion.div
        className="absolute left-[8%] top-[20%] h-72 w-72 rounded-full bg-royal/25 blur-[100px]"
        animate={reducedMotion ? undefined : { y: [0, 30, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-[12%] right-[10%] h-80 w-80 rounded-full bg-gold/12 blur-[110px]"
        animate={reducedMotion ? undefined : { y: [0, -24, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      {/* Diagonal accent shapes */}
      <div
        className="absolute -right-32 top-0 h-full w-2/5 -skew-x-12 bg-gradient-to-b from-navy-800/45 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute -right-56 top-0 h-full w-1/4 -skew-x-12 border-l border-gold/10 bg-gradient-to-b from-navy-700/30 to-transparent"
        aria-hidden="true"
      />

      {/* Giant watermark */}
      <span
        className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[22vw] font-extrabold uppercase leading-none tracking-tighter text-white/[0.025]"
        aria-hidden="true"
      >
        Pyrgos
      </span>

      <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-4 pb-24 pt-36 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-10 lg:px-8">
        <div>
          <motion.p
            {...fadeUp(0.05)}
            className="flex items-center gap-3 font-display text-xs font-bold uppercase tracking-[0.32em] text-gold"
          >
            <span className="inline-block h-px w-10 bg-gold/70" aria-hidden="true" />
            Built on Passion. Driven by Glory.
          </motion.p>

          <motion.h1
            {...fadeUp(0.15)}
            className="mt-6 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Pyrgos FC —{" "}
            <span className="text-gradient-gold">The Future</span> Starts on the
            Pitch
          </motion.h1>

          <motion.p
            {...fadeUp(0.28)}
            className="mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg"
          >
            A modern football club built on passion, discipline, community, and
            the relentless pursuit of victory. One city. One team. One dream.
          </motion.p>

          <motion.div {...fadeUp(0.4)} className="mt-10 flex flex-wrap gap-4">
            <Button href="/matches" variant="gold" size="lg">
              View Matches
            </Button>
            <Button href="/roster" variant="outline" size="lg">
              Meet the Team
            </Button>
          </motion.div>
        </div>

        {nextMatch && (
          <motion.div
            initial={{ opacity: 0, y: reducedMotion ? 0 : 48, scale: reducedMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.55, ease }}
          >
            <motion.div
              animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="gradient-border rounded-3xl p-7 shadow-card"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge variant="gold">Next Match</Badge>
                <Badge variant="royal">{nextMatch.competition}</Badge>
              </div>
              <div className="mt-6 space-y-4 text-center">
                <p className="font-display text-2xl font-extrabold uppercase tracking-wide text-gold-bright">
                  {nextMatch.homeTeam}
                </p>
                <p className="font-display text-xs font-bold uppercase tracking-[0.4em] text-mist">
                  versus
                </p>
                <p className="font-display text-2xl font-extrabold uppercase tracking-wide text-white">
                  {nextMatch.awayTeam}
                </p>
              </div>
              <div className="mt-6 space-y-1 border-t border-line pt-5 text-center text-sm text-mist">
                <p>
                  {formatDate(nextMatch.date)} · {nextMatch.time}
                </p>
                <p>{nextMatch.venue}</p>
              </div>
              <Link
                href="/matches"
                className="mt-6 block rounded-full bg-white/5 py-3 text-center font-display text-xs font-bold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-night"
              >
                Match Preview →
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-night to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
