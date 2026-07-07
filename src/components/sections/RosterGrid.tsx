"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { cn } from "@/lib/utils";
import type { Player, PlayerPosition } from "@/types";

type Filter = PlayerPosition | "all";

interface RosterGridProps {
  players: Player[];
}

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All Players" },
  { id: "Goalkeeper", label: "Goalkeepers" },
  { id: "Defender", label: "Defenders" },
  { id: "Midfielder", label: "Midfielders" },
  { id: "Forward", label: "Forwards" },
];

export function RosterGrid({ players }: RosterGridProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all" ? players : players.filter((p) => p.position === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter players by position">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full px-5 py-2.5 font-display text-xs font-bold uppercase tracking-widest transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
              filter === f.id
                ? "bg-gold text-night shadow-glow-gold"
                : "border border-line bg-white/5 text-white/70 hover:text-white"
            )}
          >
            {f.label}
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
            <PlayerCard key={player.slug} player={player} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
