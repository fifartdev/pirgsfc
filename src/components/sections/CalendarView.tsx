"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarEventCard } from "@/components/cards/CalendarEventCard";
import { eventTypeLabels } from "@/data/calendar";
import { cn } from "@/lib/utils";
import type { CalendarEvent, CalendarEventType } from "@/types";

type Filter = CalendarEventType | "all";

interface CalendarViewProps {
  events: CalendarEvent[];
}

const filters: Filter[] = [
  "all",
  "match",
  "training",
  "recovery",
  "media",
  "community",
  "academy",
];

const typeDotColors: Record<CalendarEventType, string> = {
  match: "bg-gold",
  training: "bg-royal-bright",
  recovery: "bg-emerald-400",
  media: "bg-purple-300",
  community: "bg-orange-300",
  academy: "bg-sky-300",
};

function monthTitle(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export function CalendarView({ events }: CalendarViewProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(
    () => (filter === "all" ? events : events.filter((e) => e.type === filter)),
    [events, filter]
  );

  const byMonth = useMemo(() => {
    const groups = new Map<string, CalendarEvent[]>();
    for (const event of visible) {
      const key = event.date.slice(0, 7);
      const group = groups.get(key) ?? [];
      group.push(event);
      groups.set(key, group);
    }
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [visible]);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter events by type">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-xs font-bold uppercase tracking-widest transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
              filter === f
                ? "bg-gold text-night shadow-glow-gold"
                : "border border-line bg-white/5 text-white/70 hover:text-white"
            )}
          >
            {f !== "all" && (
              <span
                className={cn("h-2 w-2 rounded-full", typeDotColors[f])}
                aria-hidden="true"
              />
            )}
            {f === "all" ? "All Events" : eventTypeLabels[f]}
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
          className="mt-12 space-y-14"
        >
          {byMonth.length === 0 && (
            <p className="text-mist">No events of this type are currently scheduled.</p>
          )}
          {byMonth.map(([monthKey, monthEvents]) => (
            <section key={monthKey} aria-label={monthTitle(monthEvents[0].date)}>
              <div className="mb-6 flex items-center gap-4">
                <h2 className="font-display text-2xl font-extrabold uppercase tracking-wide text-white">
                  {monthTitle(monthEvents[0].date)}
                </h2>
                <span className="h-px flex-1 bg-line" aria-hidden="true" />
                <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-mist">
                  {monthEvents.length} event{monthEvents.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {monthEvents.map((event) => (
                  <CalendarEventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
