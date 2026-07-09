export type Lang = "el" | "en";

/** A piece of content available in both site languages. */
export type LocalizedText = Record<Lang, string>;

export type Department = "men" | "women" | "futsal";

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
  department: Department;
  firstName: LocalizedText;
  lastName: LocalizedText;
  number: number;
  position: PlayerPosition;
  nationality: LocalizedText;
  age: number;
  heightCm: number;
  weightKg: number;
  preferredFoot: PreferredFoot;
  joined: string;
  bio: LocalizedText;
  featured?: boolean;
  captain?: boolean;
  stats: PlayerStats;
  /** URL of the player's profile photo (populated from Payload media). */
  photoUrl?: string;
}

export type MatchStatus = "upcoming" | "completed" | "live";

export type Competition = "league" | "cup" | "friendly";

export interface Match {
  id: string;
  department: Department;
  competition: Competition;
  homeTeam: LocalizedText;
  awayTeam: LocalizedText;
  homeIsPyrgos: boolean;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: LocalizedText;
  status: MatchStatus;
  matchweek?: LocalizedText;
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
  title: LocalizedText;
  type: CalendarEventType;
  date: string;
  startTime: string;
  endTime?: string;
  location: LocalizedText;
  description: LocalizedText;
}

export interface StaffMember {
  slug: string;
  name: LocalizedText;
  role: LocalizedText;
  bio: LocalizedText;
  yearsOfExperience: number;
  specialty: LocalizedText;
  initials: string;
}

export type NewsCategory =
  | "club"
  | "preview"
  | "report"
  | "academy"
  | "community"
  | "transfers";

export interface NewsArticle {
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  category: NewsCategory;
  author: LocalizedText;
  date: string;
  readingTime: number;
  featured?: boolean;
  content: { el: string[]; en: string[] };
  /** URL of the featured image (populated from Payload media). */
  imageUrl?: string;
  /** Alt text for the featured image. */
  imageAlt?: string;
}

export type SponsorTier = "principal" | "official" | "partner";

export interface Sponsor {
  id: string;
  name: string;
  tier: SponsorTier;
  tagline: LocalizedText;
}

export interface AcademyGroup {
  id: string;
  name: LocalizedText;
  ages: LocalizedText;
  coach: LocalizedText;
  description: LocalizedText;
  trainingDays: LocalizedText;
}
