import { Badge } from "@/components/ui/Badge";
import { isPyrgosWin } from "@/data/matches";
import { getDict } from "@/i18n";
import { formatDate, cn } from "@/lib/utils";
import type { Lang, Match } from "@/types";

interface MatchCardProps {
  match: Match;
  lang: Lang;
  highlight?: boolean;
}

function TeamName({
  name,
  isPyrgos,
  score,
}: {
  name: string;
  isPyrgos: boolean;
  score?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={cn(
          "font-display text-lg font-bold uppercase tracking-wide sm:text-xl",
          isPyrgos ? "text-crimson-bright" : "text-white"
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

export function MatchCard({ match, lang, highlight = false }: MatchCardProps) {
  const dict = getDict(lang);
  const win = isPyrgosWin(match);

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl p-6 shadow-card transition-transform duration-300 hover:-translate-y-1",
        highlight ? "gradient-border" : "glass"
      )}
    >
      <div
        className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-crimson/15 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="crimson">{dict.competitions[match.competition]}</Badge>
            <Badge variant="neutral">{dict.departments[match.department]}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {match.homeIsPyrgos ? dict.common.home : dict.common.away}
            </Badge>
            {match.status === "upcoming" && (
              <Badge variant="smoke">{dict.common.upcoming}</Badge>
            )}
            {match.status === "live" && <Badge variant="danger">{dict.common.live}</Badge>}
            {match.status === "completed" && (
              <Badge
                variant={win === true ? "success" : win === false ? "danger" : "neutral"}
              >
                {win === true
                  ? dict.common.win
                  : win === false
                    ? dict.common.loss
                    : dict.common.draw}
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <TeamName
            name={match.homeTeam[lang]}
            isPyrgos={match.homeIsPyrgos}
            score={match.homeScore}
          />
          <div className="flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-line" />
            <span className="font-display text-[0.6rem] font-bold uppercase tracking-[0.3em] text-mist">
              {match.status === "completed" ? dict.common.fullTime : "VS"}
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <TeamName
            name={match.awayTeam[lang]}
            isPyrgos={!match.homeIsPyrgos}
            score={match.awayScore}
          />
        </div>

        <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-1 border-t border-line pt-4 text-xs text-mist">
          <div className="flex gap-1.5">
            <dt className="sr-only">Date</dt>
            <dd>{formatDate(match.date, lang)}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="sr-only">Kick-off</dt>
            <dd>{match.time}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="sr-only">Venue</dt>
            <dd>{match.venue[lang]}</dd>
          </div>
        </dl>
        {match.matchweek && (
          <p className="mt-2 font-display text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/50">
            {match.matchweek[lang]}
          </p>
        )}
      </div>
    </article>
  );
}
