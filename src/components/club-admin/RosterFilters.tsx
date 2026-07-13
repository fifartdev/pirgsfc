"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface Option {
  value: string;
  label: string;
}

interface RosterFiltersProps {
  teamOptions: Option[];
  seasonOptions: Option[];
}

const selectClass =
  "rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-red-600/60 focus:outline-none focus:ring-1 focus:ring-red-600/40";

export function RosterFilters({ teamOptions, seasonOptions }: RosterFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTeam = searchParams.get("team") ?? "";
  const currentSeason = searchParams.get("season") ?? "";
  const hasFilter = Boolean(currentTeam || currentSeason);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        aria-label="Φιλτράρισμα ανά ομάδα"
        className={selectClass}
        value={currentTeam}
        onChange={(e) => updateParam("team", e.target.value)}
      >
        <option value="">Όλες οι ομάδες</option>
        {teamOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <select
        aria-label="Φιλτράρισμα ανά σεζόν"
        className={selectClass}
        value={currentSeason}
        onChange={(e) => updateParam("season", e.target.value)}
      >
        <option value="">Όλες οι σεζόν</option>
        {seasonOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hasFilter && (
        <button
          type="button"
          onClick={() => router.push(pathname)}
          className="text-sm text-gray-400 transition-colors hover:text-white"
        >
          Καθαρισμός φίλτρων
        </button>
      )}
    </div>
  );
}
