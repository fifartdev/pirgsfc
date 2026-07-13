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

## Static Export (plain HTML/CSS/JS)

To produce a fully static bundle that runs on any static host (no Node server):

```bash
npm run export
```

This writes the site to `out/` and a `pyrgos-afc-static-site.zip` alongside it.
Because a static export can't run the locale proxy or the POST `/api/contact`
route, the export build:

- always redirects the root `/` to the Greek site (`/el/`) via a generated
  `out/index.html`;
- makes the contact form validate and confirm entirely on the client.

Serve it over HTTP (e.g. `npx serve out`, Netlify drop, GitHub Pages, S3,
nginx) — the assets use absolute paths, so it is not meant to be opened via
`file://`. The regular `npm run build` / `npm run start` remains a normal
server build with the API route and proxy intact.

## Email Delivery

`POST /api/contact` (`src/app/api/contact/route.ts`) sends via SMTP through
Nodemailer once `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` are set in the
environment (Vercel project env vars in production; `.env.local` locally).
Optional: `SMTP_PORT` (default `587`), `SMTP_SECURE` (`"true"`/`"false"`,
defaults to `true` only when the port is `465`), and
`CONTACT_RECIPIENT_EMAIL` (defaults to `CLUB.contact.email` in
`src/lib/constants.ts`). Without SMTP credentials set, the endpoint still
validates submissions and returns success, but sends nothing — safe to run in
dev/preview without real credentials. `RESEND_API_KEY` is read but not wired
up; this project uses SMTP as its transport.
