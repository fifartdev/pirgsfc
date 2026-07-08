import type { Department, Match } from "@/types";

const PYRGOS = { el: "PYRGOS AFC", en: "PYRGOS AFC" };
const PYRGOS_STADIUM = { el: "Στάδιο Πύργου", en: "Pyrgos Stadium" };
const PYRGOS_HALL = { el: "Κλειστό Πύργου", en: "Pyrgos Indoor Hall" };

export const matches: Match[] = [
  /* ------------------------------- Men ---------------------------------- */
  {
    id: "m-14",
    department: "men",
    competition: "league",
    homeTeam: PYRGOS,
    awayTeam: { el: "Ολύμπια Γιουνάιτεντ", en: "Olympia United" },
    homeIsPyrgos: true,
    date: "2026-07-12",
    time: "19:30",
    venue: PYRGOS_STADIUM,
    status: "upcoming",
    matchweek: { el: "16η Αγωνιστική", en: "Matchweek 16" },
  },
  {
    id: "m-15",
    department: "men",
    competition: "cup",
    homeTeam: { el: "Αστέρας Νότου", en: "Asteras South" },
    awayTeam: PYRGOS,
    homeIsPyrgos: false,
    date: "2026-07-19",
    time: "20:00",
    venue: { el: "Αστέρας Αρένα", en: "Asteras Arena" },
    status: "upcoming",
    matchweek: { el: "Κύπελλο — Φάση των 16", en: "Cup — Round of 16" },
  },
  {
    id: "m-16",
    department: "men",
    competition: "league",
    homeTeam: PYRGOS,
    awayTeam: { el: "Ναυτικός Όρμου", en: "Nautikos Bay" },
    homeIsPyrgos: true,
    date: "2026-07-26",
    time: "19:00",
    venue: PYRGOS_STADIUM,
    status: "upcoming",
    matchweek: { el: "17η Αγωνιστική", en: "Matchweek 17" },
  },
  {
    id: "m-17",
    department: "men",
    competition: "league",
    homeTeam: { el: "Θύελλα Βορρά", en: "Thyella North" },
    awayTeam: PYRGOS,
    homeIsPyrgos: false,
    date: "2026-08-02",
    time: "18:30",
    venue: { el: "Πάρκο Θύελλας", en: "Thyella Park" },
    status: "upcoming",
    matchweek: { el: "18η Αγωνιστική", en: "Matchweek 18" },
  },
  {
    id: "m-13",
    department: "men",
    competition: "league",
    homeTeam: PYRGOS,
    awayTeam: { el: "Ιωνικός Δύσης", en: "Ionikos West" },
    homeIsPyrgos: true,
    homeScore: 3,
    awayScore: 1,
    date: "2026-06-28",
    time: "19:30",
    venue: PYRGOS_STADIUM,
    status: "completed",
    matchweek: { el: "15η Αγωνιστική", en: "Matchweek 15" },
  },
  {
    id: "m-12",
    department: "men",
    competition: "league",
    homeTeam: { el: "Δόξα Κοιλάδας", en: "Doxa Valley" },
    awayTeam: PYRGOS,
    homeIsPyrgos: false,
    homeScore: 0,
    awayScore: 2,
    date: "2026-06-21",
    time: "20:00",
    venue: { el: "Γήπεδο Δόξας", en: "Doxa Valley Ground" },
    status: "completed",
    matchweek: { el: "14η Αγωνιστική", en: "Matchweek 14" },
  },
  {
    id: "m-11",
    department: "men",
    competition: "cup",
    homeTeam: PYRGOS,
    awayTeam: { el: "Κεραυνός Πόλης", en: "Keravnos City" },
    homeIsPyrgos: true,
    homeScore: 4,
    awayScore: 2,
    date: "2026-06-14",
    time: "19:00",
    venue: PYRGOS_STADIUM,
    status: "completed",
    matchweek: { el: "Κύπελλο — Φάση των 32", en: "Cup — Round of 32" },
  },
  {
    id: "m-10",
    department: "men",
    competition: "league",
    homeTeam: PYRGOS,
    awayTeam: { el: "Αχιλλέας Ακρωτηρίου", en: "Achilleas Point" },
    homeIsPyrgos: true,
    homeScore: 1,
    awayScore: 1,
    date: "2026-06-07",
    time: "19:30",
    venue: PYRGOS_STADIUM,
    status: "completed",
    matchweek: { el: "13η Αγωνιστική", en: "Matchweek 13" },
  },
  {
    id: "m-09",
    department: "men",
    competition: "league",
    homeTeam: { el: "Ερμής Λιμανιού", en: "Ermis Harbour" },
    awayTeam: PYRGOS,
    homeIsPyrgos: false,
    homeScore: 1,
    awayScore: 3,
    date: "2026-05-31",
    time: "18:00",
    venue: { el: "Γήπεδο Λιμανιού", en: "Harbour Field" },
    status: "completed",
    matchweek: { el: "12η Αγωνιστική", en: "Matchweek 12" },
  },
  {
    id: "m-08",
    department: "men",
    competition: "league",
    homeTeam: PYRGOS,
    awayTeam: { el: "Άτλας Άλσους", en: "Atlas Grove" },
    homeIsPyrgos: true,
    homeScore: 2,
    awayScore: 0,
    date: "2026-05-24",
    time: "19:30",
    venue: PYRGOS_STADIUM,
    status: "completed",
    matchweek: { el: "11η Αγωνιστική", en: "Matchweek 11" },
  },

  /* ------------------------------ Women --------------------------------- */
  {
    id: "w-08",
    department: "women",
    competition: "league",
    homeTeam: PYRGOS,
    awayTeam: { el: "Αμαζόνες Δυτικής", en: "Amazones West" },
    homeIsPyrgos: true,
    date: "2026-07-13",
    time: "18:00",
    venue: PYRGOS_STADIUM,
    status: "upcoming",
    matchweek: { el: "12η Αγωνιστική", en: "Matchweek 12" },
  },
  {
    id: "w-07",
    department: "women",
    competition: "league",
    homeTeam: { el: "Ηλέκτρα Πόλης", en: "Ilektra City" },
    awayTeam: PYRGOS,
    homeIsPyrgos: false,
    homeScore: 1,
    awayScore: 3,
    date: "2026-06-29",
    time: "17:30",
    venue: { el: "Δημοτικό Στάδιο Ηλέκτρας", en: "Ilektra Municipal Stadium" },
    status: "completed",
    matchweek: { el: "11η Αγωνιστική", en: "Matchweek 11" },
  },

  /* ------------------------------ Futsal -------------------------------- */
  {
    id: "f-10",
    department: "futsal",
    competition: "league",
    homeTeam: PYRGOS,
    awayTeam: { el: "Δελφίνια Σάλας", en: "Delfinia Futsal" },
    homeIsPyrgos: true,
    date: "2026-07-15",
    time: "20:30",
    venue: PYRGOS_HALL,
    status: "upcoming",
    matchweek: { el: "10η Αγωνιστική", en: "Matchweek 10" },
  },
  {
    id: "f-09",
    department: "futsal",
    competition: "league",
    homeTeam: PYRGOS,
    awayTeam: { el: "Φοίνικας Σάλας", en: "Foinikas Futsal" },
    homeIsPyrgos: true,
    homeScore: 5,
    awayScore: 2,
    date: "2026-06-30",
    time: "20:30",
    venue: PYRGOS_HALL,
    status: "completed",
    matchweek: { el: "9η Αγωνιστική", en: "Matchweek 9" },
  },
];

export function getUpcomingMatches(department?: Department): Match[] {
  return matches
    .filter((m) => m.status === "upcoming" && (!department || m.department === department))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getCompletedMatches(department?: Department): Match[] {
  return matches
    .filter((m) => m.status === "completed" && (!department || m.department === department))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getNextMatch(department?: Department): Match | undefined {
  return getUpcomingMatches(department)[0];
}

export function getRecentResults(count = 3, department?: Department): Match[] {
  return getCompletedMatches(department).slice(0, count);
}

export function isPyrgosWin(match: Match): boolean | undefined {
  if (match.homeScore === undefined || match.awayScore === undefined) return undefined;
  if (match.homeScore === match.awayScore) return undefined;
  const pyrgosScore = match.homeIsPyrgos ? match.homeScore : match.awayScore;
  const opponentScore = match.homeIsPyrgos ? match.awayScore : match.homeScore;
  return pyrgosScore > opponentScore;
}
