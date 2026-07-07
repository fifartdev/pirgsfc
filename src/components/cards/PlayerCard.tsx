import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { initialsOf } from "@/lib/utils";
import type { Player } from "@/types";

interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Link
      href={`/roster/${player.slug}`}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      aria-label={`View profile of ${player.firstName} ${player.lastName}, ${player.position}, number ${player.number}`}
    >
      <article className="gradient-border relative overflow-hidden rounded-2xl shadow-card transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-glow-royal">
        {/* Visual header — CSS "trading card" portrait placeholder */}
        <div className="relative flex h-52 items-end justify-center overflow-hidden bg-gradient-to-b from-navy-700 via-navy-900 to-navy-950">
          <span
            className="absolute -right-4 top-2 select-none font-display text-[7rem] font-extrabold leading-none text-white/6 transition-transform duration-500 group-hover:scale-110"
            aria-hidden="true"
          >
            {player.number}
          </span>
          <span
            className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-royal/25 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gold/30 bg-gradient-to-b from-navy-600 to-navy-900 font-display text-3xl font-extrabold text-gold shadow-glow-gold"
            aria-hidden="true"
          >
            {initialsOf(player.firstName, player.lastName)}
          </div>
          {player.captain && (
            <span className="absolute left-4 top-4">
              <Badge variant="gold">Captain</Badge>
            </span>
          )}
        </div>

        <div className="relative p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-mist">
                {player.firstName}
              </p>
              <h3 className="font-display text-xl font-extrabold uppercase tracking-wide text-white transition-colors group-hover:text-gold-bright">
                {player.lastName}
              </h3>
            </div>
            <span className="font-display text-3xl font-extrabold text-gold" aria-hidden="true">
              {player.number}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="royal">{player.position}</Badge>
            <Badge variant="outline">{player.nationality}</Badge>
          </div>

          <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
            <div>
              <dt className="text-[0.62rem] uppercase tracking-widest text-mist">Age</dt>
              <dd className="font-display text-sm font-bold text-white">{player.age}</dd>
            </div>
            <div>
              <dt className="text-[0.62rem] uppercase tracking-widest text-mist">Height</dt>
              <dd className="font-display text-sm font-bold text-white">
                {player.heightCm} cm
              </dd>
            </div>
            <div>
              <dt className="text-[0.62rem] uppercase tracking-widest text-mist">Foot</dt>
              <dd className="font-display text-sm font-bold text-white">
                {player.preferredFoot}
              </dd>
            </div>
          </dl>

          <p className="mt-4 font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold/80 transition-colors group-hover:text-gold">
            View Profile →
          </p>
        </div>
      </article>
    </Link>
  );
}
