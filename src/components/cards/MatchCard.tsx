import { Badge } from "@/components/ui/Badge";
import { isPyrgosWin } from "@/data/matches";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Match } from "@/types";

interface MatchCardProps {
  match: Match;
  highlight?: boolean;
}

function TeamName({ name, score }: { name: string; score?: number }) {
  const isPyrgos = name === "PYRGOS FC";
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={cn(
          "font-display text-lg font-bold uppercase tracking-wide sm:text-xl",
          isPyrgos ? "text-gold-bright" : "text-white"
        )}
      >
        {name}
      </span>
      {score !== undefined && (
        <span className="font-display text-2xl font-extrabold tabular-nums text-white">
          {score}
        </span>
      )}
    </div>
  );
}

export function MatchCard({ match, highlight = false }: MatchCardProps) {
  const win = isPyrgosWin(match);

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl p-6 shadow-card transition-transform duration-300 hover:-translate-y-1",
        highlight ? "gradient-border" : "glass"
      )}
    >
      <div
        className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-royal/15 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="royal">{match.competition}</Badge>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{match.isHome ? "Home" : "Away"}</Badge>
            {match.status === "upcoming" && <Badge variant="gold">Upcoming</Badge>}
            {match.status === "live" && <Badge variant="danger">Live</Badge>}
            {match.status === "completed" && (
              <Badge
                variant={win === true ? "success" : win === false ? "danger" : "neutral"}
              >
                {win === true ? "Win" : win === false ? "Loss" : "Draw"}
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <TeamName name={match.homeTeam} score={match.homeScore} />
          <div className="flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-line" />
            <span className="font-display text-[0.6rem] font-bold uppercase tracking-[0.3em] text-mist">
              {match.status === "completed" ? "Full Time" : "VS"}
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <TeamName name={match.awayTeam} score={match.awayScore} />
        </div>

        <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-1 border-t border-line pt-4 text-xs text-mist">
          <div className="flex gap-1.5">
            <dt className="sr-only">Date</dt>
            <dd>{formatDate(match.date)}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="sr-only">Kick-off</dt>
            <dd>{match.time}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="sr-only">Venue</dt>
            <dd>{match.venue}</dd>
          </div>
        </dl>
        {match.matchweek && (
          <p className="mt-2 font-display text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/50">
            {match.matchweek}
          </p>
        )}
      </div>
    </article>
  );
}
