"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MatchCard } from "@/components/cards/MatchCard";
import { cn } from "@/lib/utils";
import type { Match } from "@/types";

type Tab = "all" | "upcoming" | "results";

interface MatchesTabsProps {
  upcoming: Match[];
  completed: Match[];
}

const tabs: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "results", label: "Results" },
];

export function MatchesTabs({ upcoming, completed }: MatchesTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const visible =
    activeTab === "upcoming"
      ? upcoming
      : activeTab === "results"
        ? completed
        : [...upcoming, ...completed];

  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter matches"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-full px-6 py-2.5 font-display text-xs font-bold uppercase tracking-widest transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
              activeTab === tab.id
                ? "bg-gold text-night shadow-glow-gold"
                : "border border-line bg-white/5 text-white/70 hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
