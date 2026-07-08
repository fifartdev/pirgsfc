# PYRGOS AFC — Official Club Website

> Χτισμένη με Πάθος. Ταγμένη στη Δόξα. · Built on Passion. Driven by Glory.

The official digital home of **PYRGOS AFC**, a fictional modern football club.
Fully bilingual (Greek primary, English secondary) with a crimson/white
identity drawn from the club crest. Built with Next.js (App Router),
TypeScript, Tailwind CSS v4, and Framer Motion.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to
`/el` (Greek). English lives under `/en`; the header has a language switcher.

Production build:

```bash
npm run build
npm run start
```

## Site Structure

All routes are locale-prefixed (`/el/...`, `/en/...`). `src/proxy.ts` redirects
bare paths to the visitor's language (Greek by default).

| Route | Description |
| --- | --- |
| `/{lang}` | Cinematic homepage — hero, next match, results, stats, departments, featured players, values, news, sponsors, fan CTA |
| `/{lang}/news` + `/[slug]` | Νέα / Ανακοινώσεις — featured article, grid, bilingual article pages |
| `/{lang}/men` | Άντρες — men's squad, position filters, fixtures |
| `/{lang}/women` | Γυναίκες — women's squad and fixtures |
| `/{lang}/futsal` | Futsal — futsal squad and fixtures |
| `/{lang}/academy` | Υποδομές — philosophy, age groups (Κ10–Κ19), trials |
| `/{lang}/about` | Σύλλογος — story, mission, timeline, stadium, community |
| `/{lang}/matches` | Match centre across all sections, with tabs |
| `/{lang}/calendar` | Team calendar with event-type filters |
| `/{lang}/staff` | Coaching and technical staff |
| `/{lang}/roster/[slug]` | Player profiles (all departments) with season stats |
| `/{lang}/contact` | Contact form, departments, club details |
| `POST /api/contact` | Validated placeholder contact endpoint |

## Architecture

- `src/i18n` — typed dictionaries (`el.ts` is the source of truth, `en.ts` mirrors it)
- `src/data` — bilingual seed data (players across 3 departments, matches, calendar, staff, news, sponsors, academy groups), structured for a future CMS
- `src/components` — `layout/`, `sections/`, `cards/`, `ui/` (including the SVG `Crest`)
- `src/types` — shared interfaces (`LocalizedText`, `Department`, ...)
- `src/proxy.ts` — locale redirect (the Next.js proxy/middleware convention)

## Email Delivery

The contact endpoint validates submissions and returns JSON without sending
email. To enable delivery, copy `.env.local.example` to `.env.local`, configure
Resend or SMTP credentials, and implement the marked block in
`src/app/api/contact/route.ts`.
