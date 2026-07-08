"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { cn } from "@/lib/utils";
import type { Lang, Player, PlayerPosition } from "@/types";

type Filter = PlayerPosition | "all";

interface RosterGridProps {
  players: Player[];
  lang: Lang;
  labels: {
    all: string;
    positions: Record<PlayerPosition, string>;
    filterAria: string;
  };
}

const positionOrder: PlayerPosition[] = [
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Forward",
];

export function RosterGrid({ players, lang, labels }: RosterGridProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const availablePositions = positionOrder.filter((pos) =>
    players.some((p) => p.position === pos)
  );

  const visible =
    filter === "all" ? players : players.filter((p) => p.position === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={labels.filterAria}>
        <button
          type="button"
          role="tab"
          aria-selected={filter === "all"}
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-full px-5 py-2.5 font-display text-xs font-bold uppercase tracking-widest transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson",
            filter === "all"
              ? "bg-crimson text-white shadow-glow-crimson"
              : "border border-line bg-white/5 text-white/70 hover:text-white"
          )}
        >
          {labels.all}
        </button>
        {availablePositions.map((pos) => (
          <button
            key={pos}
            type="button"
            role="tab"
            aria-selected={filter === pos}
            onClick={() => setFilter(pos)}
            className={cn(
              "rounded-full px-5 py-2.5 font-display text-xs font-bold uppercase tracking-widest transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson",
              filter === pos
                ? "bg-crimson text-white shadow-glow-crimson"
                : "border border-line bg-white/5 text-white/70 hover:text-white"
            )}
          >
            {labels.positions[pos]}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {visible.map((player) => (
            <PlayerCard key={player.slug} player={player} lang={lang} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
