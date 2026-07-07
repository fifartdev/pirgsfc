# PYRGOS FC — Official Club Website

> Built on Passion. Driven by Glory.

The official digital home of **PYRGOS FC**, a fictional modern football club.
Built with Next.js (App Router), TypeScript, Tailwind CSS v4, and Framer Motion.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm run start
```

## Pages

| Route | Description |
| --- | --- |
| `/` | Cinematic homepage — hero, next match, results, stats, featured players, values, news, sponsors, fan CTA |
| `/about` | Club story, mission, timeline, values, stadium, community |
| `/matches` | Match centre with All / Upcoming / Results tabs |
| `/calendar` | Team calendar with event-type filters (match, training, recovery, media, community, academy) |
| `/roster` | Full squad with position filters |
| `/roster/[slug]` | Individual player profiles with season stats |
| `/staff` | Coaching and technical staff |
| `/news` | News listing with featured article |
| `/news/[slug]` | Individual article pages with related stories |
| `/contact` | Contact form, departments, club details, map placeholder |
| `POST /api/contact` | Validated placeholder contact endpoint |

## Architecture

- `src/app` — App Router pages, layout, and the contact API route
- `src/components` — `layout/`, `sections/`, `cards/`, and `ui/` component groups
- `src/data` — typed seed data (players, matches, calendar, staff, news, sponsors), structured for easy replacement with a CMS or database
- `src/types` — shared TypeScript interfaces
- `src/lib` — utilities and club constants

## Email Delivery

The contact endpoint validates submissions and returns JSON without sending
email. To enable delivery, copy `.env.local.example` to `.env.local`, configure
Resend or SMTP credentials, and implement the marked block in
`src/app/api/contact/route.ts`.
