import type { Match } from "@/types";

export const matches: Match[] = [
  {
    id: "m-14",
    competition: "Regional League",
    homeTeam: "PYRGOS FC",
    awayTeam: "Olympia United",
    date: "2026-07-12",
    time: "19:30",
    venue: "Pyrgos Stadium",
    status: "upcoming",
    matchweek: "Matchweek 16",
    isHome: true,
  },
  {
    id: "m-15",
    competition: "Cup",
    homeTeam: "Asteras South",
    awayTeam: "PYRGOS FC",
    date: "2026-07-19",
    time: "20:00",
    venue: "Asteras Arena",
    status: "upcoming",
    matchweek: "Cup — Round of 16",
    isHome: false,
  },
  {
    id: "m-16",
    competition: "Regional League",
    homeTeam: "PYRGOS FC",
    awayTeam: "Nautikos Bay",
    date: "2026-07-26",
    time: "19:00",
    venue: "Pyrgos Stadium",
    status: "upcoming",
    matchweek: "Matchweek 17",
    isHome: true,
  },
  {
    id: "m-17",
    competition: "Regional League",
    homeTeam: "Thyella North",
    awayTeam: "PYRGOS FC",
    date: "2026-08-02",
    time: "18:30",
    venue: "Thyella Park",
    status: "upcoming",
    matchweek: "Matchweek 18",
    isHome: false,
  },
  {
    id: "m-13",
    competition: "Regional League",
    homeTeam: "PYRGOS FC",
    awayTeam: "Ionikos West",
    homeScore: 3,
    awayScore: 1,
    date: "2026-06-28",
    time: "19:30",
    venue: "Pyrgos Stadium",
    status: "completed",
    matchweek: "Matchweek 15",
    isHome: true,
  },
  {
    id: "m-12",
    competition: "Regional League",
    homeTeam: "Doxa Valley",
    awayTeam: "PYRGOS FC",
    homeScore: 0,
    awayScore: 2,
    date: "2026-06-21",
    time: "20:00",
    venue: "Doxa Valley Ground",
    status: "completed",
    matchweek: "Matchweek 14",
    isHome: false,
  },
  {
    id: "m-11",
    competition: "Cup",
    homeTeam: "PYRGOS FC",
    awayTeam: "Keravnos City",
    homeScore: 4,
    awayScore: 2,
    date: "2026-06-14",
    time: "19:00",
    venue: "Pyrgos Stadium",
    status: "completed",
    matchweek: "Cup — Round of 32",
    isHome: true,
  },
  {
    id: "m-10",
    competition: "Regional League",
    homeTeam: "PYRGOS FC",
    awayTeam: "Achilleas Point",
    homeScore: 1,
    awayScore: 1,
    date: "2026-06-07",
    time: "19:30",
    venue: "Pyrgos Stadium",
    status: "completed",
    matchweek: "Matchweek 13",
    isHome: true,
  },
  {
    id: "m-09",
    competition: "Regional League",
    homeTeam: "Ermis Harbour",
    awayTeam: "PYRGOS FC",
    homeScore: 1,
    awayScore: 3,
    date: "2026-05-31",
    time: "18:00",
    venue: "Harbour Field",
    status: "completed",
    matchweek: "Matchweek 12",
    isHome: false,
  },
  {
    id: "m-08",
    competition: "Regional League",
    homeTeam: "PYRGOS FC",
    awayTeam: "Atlas Grove",
    homeScore: 2,
    awayScore: 0,
    date: "2026-05-24",
    time: "19:30",
    venue: "Pyrgos Stadium",
    status: "completed",
    matchweek: "Matchweek 11",
    isHome: true,
  },
];

export function getUpcomingMatches(): Match[] {
  return matches
    .filter((m) => m.status === "upcoming")
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getCompletedMatches(): Match[] {
  return matches
    .filter((m) => m.status === "completed")
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getNextMatch(): Match | undefined {
  return getUpcomingMatches()[0];
}

export function getRecentResults(count = 3): Match[] {
  return getCompletedMatches().slice(0, count);
}

export function isPyrgosWin(match: Match): boolean | undefined {
  if (match.homeScore === undefined || match.awayScore === undefined) return undefined;
  if (match.homeScore === match.awayScore) return undefined;
  const pyrgosScore = match.isHome ? match.homeScore : match.awayScore;
  const opponentScore = match.isHome ? match.awayScore : match.homeScore;
  return pyrgosScore > opponentScore;
}
