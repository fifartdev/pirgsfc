export type PlayerPosition = "Goalkeeper" | "Defender" | "Midfielder" | "Forward";

export type PreferredFoot = "Left" | "Right" | "Both";

export interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  cleanSheets?: number;
}

export interface Player {
  slug: string;
  firstName: string;
  lastName: string;
  number: number;
  position: PlayerPosition;
  nationality: string;
  age: number;
  heightCm: number;
  weightKg: number;
  preferredFoot: PreferredFoot;
  joined: string;
  bio: string;
  featured?: boolean;
  captain?: boolean;
  stats: PlayerStats;
}

export type MatchStatus = "upcoming" | "completed" | "live";

export type Competition = "Regional League" | "Cup" | "Friendly";

export interface Match {
  id: string;
  competition: Competition;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  status: MatchStatus;
  matchweek?: string;
  isHome: boolean;
}

export type CalendarEventType =
  | "match"
  | "training"
  | "recovery"
  | "media"
  | "community"
  | "academy";

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  description: string;
}

export interface StaffMember {
  slug: string;
  name: string;
  role: string;
  bio: string;
  yearsOfExperience: number;
  specialty: string;
  initials: string;
}

export type NewsCategory =
  | "Club News"
  | "Match Preview"
  | "Match Report"
  | "Academy"
  | "Community"
  | "Transfers";

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  author: string;
  date: string;
  readingTime: number;
  featured?: boolean;
  content: string[];
}

export type SponsorTier = "principal" | "official" | "partner";

export interface Sponsor {
  id: string;
  name: string;
  tier: SponsorTier;
  tagline: string;
}
