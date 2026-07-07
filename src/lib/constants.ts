export const CLUB = {
  name: "PYRGOS FC",
  shortName: "PFC",
  founded: 2026,
  tagline: "Built on Passion. Driven by Glory.",
  supportingLines: [
    "The Pride of Pyrgos",
    "One City. One Team. One Dream.",
    "Where tradition meets ambition.",
    "More than a club. A movement.",
  ],
  statement:
    "PYRGOS FC is built on the belief that football can unite a city, inspire a generation, and create moments that live forever.",
  stadium: {
    name: "Pyrgos Stadium",
    capacity: "12,500",
    address: "1 Tower Hill Avenue, Pyrgos",
    opened: 2026,
  },
  contact: {
    email: "hello@pyrgosfc.com",
    phone: "+30 26210 00000",
    address: "1 Tower Hill Avenue, Pyrgos, Greece",
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Club", href: "/about" },
  { label: "Matches", href: "/matches" },
  { label: "Calendar", href: "/calendar" },
  { label: "Roster", href: "/roster" },
  { label: "Staff", href: "/staff" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
] as const;

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com", handle: "@pyrgosfc" },
  { label: "X / Twitter", href: "https://x.com", handle: "@pyrgosfc" },
  { label: "YouTube", href: "https://youtube.com", handle: "PYRGOS FC TV" },
  { label: "Facebook", href: "https://facebook.com", handle: "PYRGOS FC" },
] as const;

export const SITE_URL = "https://pyrgosfc.example.com";
