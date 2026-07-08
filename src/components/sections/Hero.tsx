"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Lang, Match } from "@/types";

interface HeroStrings {
  eyebrow: string;
  title1: string;
  titleAccent: string;
  title2: string;
  text: string;
  viewMatches: string;
  meetTheTeam: string;
  nextMatch: string;
  competition: string;
  versus: string;
  matchPreview: string;
}

interface HeroProps {
  lang: Lang;
  nextMatch?: Match;
  strings: HeroStrings;
}

const ease = [0.21, 0.47, 0.32, 0.98] as const;

export function Hero({ lang, nextMatch, strings }: HeroProps) {
  const reducedMotion = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: reducedMotion ? 0 : 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section
      className="noise pitch-pattern relative flex min-h-svh items-center overflow-hidden bg-night"
      aria-label="PYRGOS AFC"
    >
      {/* Stadium light glow */}
      <div className="stadium-lights" aria-hidden="true" />

      {/* Animated glow orbs */}
      <motion.div
        className="absolute left-[8%] top-[20%] h-72 w-72 rounded-full bg-crimson/25 blur-[100px]"
        animate={reducedMotion ? undefined : { y: [0, 30, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-[12%] right-[10%] h-80 w-80 rounded-full bg-smoke/10 blur-[110px]"
        animate={reducedMotion ? undefined : { y: [0, -24, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      {/* Diagonal accent shapes — the crest sash */}
      <div
        className="absolute -right-32 top-0 h-full w-2/5 -skew-x-12 bg-gradient-to-b from-ash-800/50 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute -right-56 top-0 h-full w-1/4 -skew-x-12 border-l border-crimson/15 bg-gradient-to-b from-ash-700/35 to-transparent"
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
            className="flex items-center gap-3 font-display text-xs font-bold uppercase tracking-[0.32em] text-crimson-bright"
          >
            <span className="inline-block h-px w-10 bg-crimson/70" aria-hidden="true" />
            {strings.eyebrow}
          </motion.p>

          <motion.h1
            {...fadeUp(0.15)}
            className="mt-6 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            {strings.title1}{" "}
            <span className="text-gradient-crimson">{strings.titleAccent}</span>{" "}
            {strings.title2}
          </motion.h1>

          <motion.p
            {...fadeUp(0.28)}
            className="mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg"
          >
            {strings.text}
          </motion.p>

          <motion.div {...fadeUp(0.4)} className="mt-10 flex flex-wrap gap-4">
            <Button href={`/${lang}/matches`} variant="crimson" size="lg">
              {strings.viewMatches}
            </Button>
            <Button href={`/${lang}/men`} variant="outline" size="lg">
              {strings.meetTheTeam}
            </Button>
          </motion.div>
        </div>

        {nextMatch && (
          <motion.div
            initial={{
              opacity: 0,
              y: reducedMotion ? 0 : 48,
              scale: reducedMotion ? 1 : 0.96,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.55, ease }}
          >
            <motion.div
              animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="gradient-border rounded-3xl p-7 shadow-card"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge variant="crimson">{strings.nextMatch}</Badge>
                <Badge variant="smoke">{strings.competition}</Badge>
              </div>
              <div className="mt-6 space-y-4 text-center">
                <p className="font-display text-2xl font-extrabold uppercase tracking-wide text-crimson-bright">
                  {nextMatch.homeTeam[lang]}
                </p>
                <p className="font-display text-xs font-bold uppercase tracking-[0.4em] text-mist">
                  {strings.versus}
                </p>
                <p className="font-display text-2xl font-extrabold uppercase tracking-wide text-white">
                  {nextMatch.awayTeam[lang]}
                </p>
              </div>
              <div className="mt-6 space-y-1 border-t border-line pt-5 text-center text-sm text-mist">
                <p>
                  {formatDate(nextMatch.date, lang)} · {nextMatch.time}
                </p>
                <p>{nextMatch.venue[lang]}</p>
              </div>
              <Link
                href={`/${lang}/matches`}
                className="mt-6 block rounded-full bg-white/5 py-3 text-center font-display text-xs font-bold uppercase tracking-[0.2em] text-crimson-bright transition-colors hover:bg-crimson hover:text-white"
              >
                {strings.matchPreview} →
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
