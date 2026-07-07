import { Badge } from "@/components/ui/Badge";
import { eventTypeLabels } from "@/data/calendar";
import { dayOfMonth, monthShort, weekdayShort, cn } from "@/lib/utils";
import type { CalendarEvent, CalendarEventType } from "@/types";

interface CalendarEventCardProps {
  event: CalendarEvent;
}

const typeAccents: Record<CalendarEventType, string> = {
  match: "border-gold/50 text-gold",
  training: "border-royal/50 text-royal-bright",
  recovery: "border-emerald-500/50 text-emerald-300",
  media: "border-purple-400/50 text-purple-300",
  community: "border-orange-400/50 text-orange-300",
  academy: "border-sky-400/50 text-sky-300",
};

const typeBadgeVariant: Record<CalendarEventType, "gold" | "royal" | "success" | "neutral"> = {
  match: "gold",
  training: "royal",
  recovery: "success",
  media: "neutral",
  community: "neutral",
  academy: "neutral",
};

export function CalendarEventCard({ event }: CalendarEventCardProps) {
  return (
    <article className="glass group flex gap-5 rounded-2xl p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/25">
      <div
        className={cn(
          "flex h-20 w-16 shrink-0 flex-col items-center justify-center rounded-xl border bg-night/60",
          typeAccents[event.type]
        )}
      >
        <span className="text-[0.6rem] font-semibold uppercase tracking-widest opacity-80">
          {weekdayShort(event.date)}
        </span>
        <span className="font-display text-2xl font-extrabold leading-none text-white">
          {dayOfMonth(event.date)}
        </span>
        <span className="text-[0.6rem] font-semibold uppercase tracking-widest opacity-80">
          {monthShort(event.date)}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={typeBadgeVariant[event.type]}>
            {eventTypeLabels[event.type]}
          </Badge>
          <span className="text-xs tabular-nums text-mist">
            {event.startTime}
            {event.endTime ? ` – ${event.endTime}` : ""}
          </span>
        </div>
        <h3 className="mt-2 font-display text-base font-bold text-white sm:text-lg">
          {event.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-mist">
          {event.description}
        </p>
        <p className="mt-2 text-xs font-medium uppercase tracking-widest text-white/50">
          {event.location}
        </p>
      </div>
    </article>
  );
}
