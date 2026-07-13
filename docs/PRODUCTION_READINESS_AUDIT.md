# PYRGOS AFC — Production Readiness Audit

**Date:** 2026-07-12
**Auditor:** Claude (Sonnet 5), acting as principal engineer / production readiness reviewer
**Scope:** Full repository at `/Users/tasssop-macbook-pro/Desktop/pyrgosfc`, branch `claude/pyrgos-fc-website-dol8vd`
**Method:** Static review of every collection, route, and Server Action; live `npm run lint` / `tsc --noEmit` / `npm run build` / `npm run start` runs against the real project database (via the gitignored `.env.local`); four parallel deep-dive audits (collections/access-control, public-page data sourcing, SEO/structured data, security) each independently verifying claims against the actual source, not documentation.

---

## 1. Executive Summary

**Status: READY WITH DOCUMENTED LIMITATIONS** *(upgraded across three passes — see §21 and §22 for what changed)*

This is a hobby/demo-scale club website (fictional club, "founded 2026") built on Next.js 16 + Payload CMS 3 + Postgres, deployed on Vercel with Vercel Blob media storage. Following three remediation passes, the CMS→public-site pipeline is now real and working for **every** content type the project has a collection or global for: News, Matches (with real league names and season stats), Teams, Players, Staff, and club-wide info (contact, social links, values, sponsors, SEO defaults, site-operational toggles). The codebase is small, clean, and the team (across prior sessions, per `AGENTS.md`) has fixed several serious production incidents (missing revalidation, a missing DB column that broke production, a broken migration pipeline).

Across all three passes this audit found and fixed **31 concrete defects/gaps** — all verified via real `npm run lint` / `tsc --noEmit` / `npm run build` / `npm run start` runs against the live project database, not just static review. None were build-breaking; they spanned runtime-correctness, data-integrity, security-hardening, SEO-indexation, and architectural/content-wiring gaps that would otherwise have shipped silently or stayed permanently unbuilt.

**Critical blockers: none. High-risk items: none.** Every "High" item from the initial pass is resolved (§21.1–§21.2), and round 3 (§22) closed the two remaining structural gaps explicitly requested by the project owner: **player season stats** now have a real database home (on `Rosters`, the correct relational location — a player's stats are per team/season, not an intrinsic property of the player), and **every previously-unwired CMS global** (`ClubInfo`, the remainder of `SiteSettings`) is now genuinely connected to the public site, with two narrow, explicitly-documented exceptions (visual identity fields — logo/brand colors — deliberately left alone; see §22.2).

**Fixes completed and verified across all three rounds:** 31 (full list in §16, §21, §22). **Validations run (all rounds):** lint (clean), `tsc --noEmit` (clean), production build (141 pages, clean every time), production server smoke test against the real database (all sampled routes 200, hreflang/canonical/JSON-LD/security headers confirmed present, real backfilled data confirmed rendering end-to-end, no new runtime errors in server logs).

---

## 2. Confirmation of Business-Logic Understanding

**Documentation reviewed:** `AGENTS.md` (imported into `CLAUDE.md`), `README.md`, `docs/CLUB_ADMIN_MANUAL.md`. No other `docs/`, architecture, or PRD files exist in the repo.

PYRGOS AFC is a fictional Greek football club's official bilingual (Greek-primary, English-secondary) website. It has three squads (Men, Women, Futsal). The public site is a Next.js App Router marketing/content site (`/[lang]/...`); a purpose-built admin UI at `/club-admin` (custom Next.js pages + Server Actions, **not** Payload's own admin) lets `club_admin`/`superadmin` users manage content in Greek; Payload's own `/admin` panel exists underneath but is restricted to `superadmin` only, per `Users.access.admin`.

**Core entities and their documented lifecycle** (from `CLUB_ADMIN_MANUAL.md`):
- **Seasons** — backbone; every match/roster entry belongs to one. Manual: "never delete a season with matches/rosters linked."
- **Teams** — the 3 squads; mostly static, rarely created.
- **Leagues, Venues** — reference data for Matches.
- **Players** — draft-like status enum (`Ενεργός`/`Ανενεργός`/`Μεταγραφή`/`Απόσυρση`) with documented public-visibility rules per status.
- **Staff** — coaches/support staff, assigned to teams via `StaffAssignments`.
- **Rosters** — join table: player × team × season, with per-season shirt number/captaincy/status.
- **Matches** — fixtures/results with a 4-value status enum controlling "Upcoming" vs "Results" display.
- **News** — 3-status editorial workflow (`Πρόχειρο`/`Δημοσιευμένο`/`Αρχειοθετημένο`) mapping to draft/public/hidden-but-preserved.

**Manual's stated non-negotiables:** records are never hard-deleted (status fields retire them instead); club admins cannot access `/admin`, cannot edit News rich-text body, cannot delete records, cannot change user passwords/roles — those are superadmin-only.

I treated the manual as the intended business logic and the code as the thing to verify against it — per §4 below, several of these promises are not actually true in the code today, and I've flagged rather than silently "fixed" the ones where the correct resolution is a product decision (which side is wrong: the doc or the code).

---

## 3. Architecture Summary

- **Frontend:** Next.js 16 (App Router, Turbopack build), React 19, Tailwind CSS v4, Framer Motion. Locale routing via `src/proxy.ts` (middleware): bare paths render Greek (rewrite, not redirect — no `/el` prefix ever appears publicly), `/en/*` serves English, and any literal `/el/*` 307-redirects to the bare path.
- **CMS/backend:** Payload CMS 3.43 with `@payloadcms/db-postgres` (Neon Postgres), local API only (no separate backend service). 13 collections, 3 globals (`SiteSettings`, `ClubInfo`, `SeoDefaults` — see §5, two of the three are dead code).
- **Media:** Vercel Blob storage plugin, 10MB upload limit, falls back to local disk when `BLOB_READ_WRITE_TOKEN` is unset.
- **Auth:** Payload's built-in email/password auth on the `users` collection, two roles (`superadmin`, `club_admin`). A single shared cookie (`payload-token`) authenticates both the custom `/club-admin` panel (hand-rolled login Server Action) and Payload's own `/admin` (Payload's built-in auth flow) — same JWT, same collection.
- **Deployment:** Vercel. `vercel-build` runs `migrate:deploy` (Payload migrations via a custom local-API wrapper script, see `AGENTS.md`) before `next build`.
- **Caching/revalidation:** On-demand ISR via `revalidatePath`, driven by a shared `PUBLIC_PATHS` map + `revalidatePublic()` helper in `src/lib/club-admin/actions.ts`, called from every mutating Server Action.
- **SEO:** `src/app/sitemap.ts` / `robots.ts` (dynamic, CMS-aware for News), `src/lib/seo.ts` (JSON-LD generators, partially wired).

---

## 4. Business Requirements Traceability Matrix

| Requirement (source) | Implementation | Validation | Status | Notes |
|---|---|---|---|---|
| Only `club_admin`/`superadmin` can log into `/club-admin` (manual §1) | `requireClubAdmin()` in protected layout + independent re-check in every Server Action | Code review of `src/lib/club-admin/auth.ts` + all ~20 actions | **Verified** | Defense-in-depth confirmed, not just a layout gate. |
| Only `superadmin` can access `/admin` (manual §12) | `Users.access.admin` | Code review | **Verified** | Enforced at the collection level, applies to the whole panel since `Users` is `admin.user`. |
| Club admins cannot delete records (manual §12) | `deleteDocumentAction`/`deleteSeasonAction` require only `superadmin` **or** `club_admin` | Code review | **Defective** | Currently unreachable dead code (no UI button calls it) — real gap if ever wired up. Not fixed this session (ambiguous whether doc or code is "correct" — see §17). |
| Club admins cannot edit News rich-text body (manual §11/§12) | `RichTextEditor` rendered and saved for both roles in `news/new` and `news/[id]` forms | Code review | **Defective** | Contradicts manual for both roles equally. Not fixed — ambiguous intent, see §17. |
| Never hard-delete Seasons/Players/Matches with dependents (manual §12) | No FK-dependency check exists in either delete action | Code review | **Missing** | Same dead-code caveat as above. |
| Player status controls public visibility (manual §7) | No query-layer status filter exists; public roster pages don't query Payload's Players at all (static base + photo overlay only) | Code review, confirmed by dedicated agent audit | **Missing** | Moot in practice today since Players isn't the roster source of truth — see §17 item 1. |
| News status controls public visibility (manual §11) | `getCmsNewsArticles`/`getCmsNewsArticle` filter `status: "published"` explicitly | Code review + live query against production DB | **Verified** | |
| Match status controls Upcoming/Results (manual §10) | `getCmsMatches` — **fixed this session** to exclude `status: "draft"`; `cancelled`/`postponed` correctly fall through to "upcoming" per `STATUS_MAP` | Code review + build | **Fixed** | Previously: no filter at all, so a `draft` match was publicly visible as an upcoming fixture. |
| Bilingual fallback: EN falls back to EL when blank (manual, "Bilingual content") | `String(doc.titleEn ?? doc.title)` pattern used consistently in `mapNews`/`mapMatch` | Code review | **Verified** | |
| Records preserved, only status changes (manual §12, "Records are never deleted") | No cascading delete logic exists (consistent with "never delete" being a *procedural* rule, not enforced in code) | Code review | **Partially verified** | The rule is currently enforced only by operator discipline + the manual's warning text, not by code (see delete-action gap above). |
| Club-admin mutations must revalidate the public site (`AGENTS.md`) | `revalidatePublic()` called from every mutating action | Code review | **Verified, with one gap found and fixed** | `players` had an empty `PUBLIC_PATHS` entry despite `revalidatePublic("players")` being called — fixed this session (§16). |
| Schema changes require a committed migration (`AGENTS.md`) | `vercel-build` runs `migrate:deploy` before `next build` | Not independently re-tested this session (would require a real schema change); trusted based on `AGENTS.md`'s documented prior verification | **Not re-tested** | No schema changes were made this session, so this wasn't exercised. |

---

## 5. CMS and Database Source-of-Truth Matrix

| Website Area | Intended Source | Actual Source | DB Change Reflected? | Fallback Present? | Status |
|---|---|---|---|---|---|
| `/news`, `/news/[slug]`, homepage latest news | Payload `news` | `getCmsNewsArticles`/`getCmsFeaturedArticle`/`getCmsLatestArticles`/`getCmsNewsArticle` | Yes | Static seed on Payload error only | **Verified** |
| `/matches`, `/calendar` (matches), homepage next-match/results | Payload `matches` | `getCmsMatches` family — **homepage fixed this session** to use these instead of 100%-static `src/data/matches.ts` | Yes (after fix) | Static seed on Payload error only | **Fixed** |
| `/men`, `/women`, `/futsal` team logo | Payload `teams` | `getCmsTeamLogoUrl` | Yes | none (undefined → no logo shown) | **Verified** |
| `/men`, `/women`, `/futsal` squad list, `/roster/[slug]` | *Should be* Payload `players` | Static `src/data/players.ts` base, with Payload `players.profileImage` overlaid by matching slug only | **No** (only the photo updates; everything else is static and unaffected by club-admin edits) | N/A | **Hybrid — architectural gap, not fixed** (§17.1) |
| `/staff` | *Should be* Payload `staff`/`staff-assignments` (both exist, both editable in club-admin) | 100% static `src/data/staff.ts` | No | N/A | **Missing — dead collection** (§17.2) |
| Match "competition" badge | Should reference `matches.league` (Payload relationship) | `mapMatch` never reads `doc.league`; badge shows the generic `matchType` select value instead | No | N/A | **Missing — dead relationship** (§17.2) |
| News category badge | Payload `news-categories` relationship | **Fixed this session** — was casting the populated relation object directly into a string-keyed dict lookup (`dict.categories[object]` → blank badge whenever a category was actually set) | Yes (after fix) | Falls back to `"club"` | **Fixed** |
| `/contact` form submission | Should email/store the enquiry | `POST /api/contact` validates and returns `{success:true}` but the actual send block is intentionally unimplemented — **submissions are silently discarded** | N/A | N/A | **Confirmed no-op, by design per README** (not a bug — flagged for product awareness) |
| Contact email/phone/address/social links | Payload `ClubInfo`/`SiteSettings` globals exist for exactly this | 100% hardcoded in `src/lib/constants.ts` and `src/app/[lang]/contact/page.tsx` (placeholder-looking values: `.example.com`-style domain, generic social root URLs) | No | N/A | **Missing — dead globals** (§17.3) |
| `SeoDefaults` global (title template, default OG image, robots directives) | Should feed `generateMetadata` | Defined in Payload, zero call sites anywhere in `src/app`/`src/lib` | No | N/A | **Missing — dead global** (§17.3) |
| Sitemap/robots/canonical/JSON-LD base URL | Should track the actual deployment origin | **Fixed this session** — was a hardcoded `https://pyrgosafc.example.com` literal; now derives from `NEXT_PUBLIC_SERVER_URL`/Vercel env vars, same pattern as `payload.config.ts`'s CORS allowlist | Yes (after fix) | Falls back to `http://localhost:3000` | **Fixed — was a hard blocker** |

---

## 6. Entity and Data-Flow Audit

Full per-collection access-control table (produced by dedicated agent audit, spot-checked):

| Collection/Global | Read access | Write access | Drafts/versions | Notable hooks |
|---|---|---|---|---|
| Users | `superadmin` only | `superadmin` only | no | — |
| News | published-or-authenticated | `superadmin`/`club_admin` | `drafts: true` | `afterChange`: un-features other articles when one is marked featured |
| Players | active-or-authenticated (access fn exists but never actually invoked — see below) | `superadmin`/`club_admin` | no | `beforeChange`: `fullName` concatenation |
| Matches | non-draft-or-authenticated (ditto) | `superadmin`/`club_admin` | no | — |
| Rosters | public, unfiltered | `superadmin`/`club_admin` | no | — |
| Seasons, Teams | active-or-authenticated (ditto) | `superadmin`/`club_admin` | no | slug generation |
| Leagues, Venues, StaffAssignments, NewsCategories, Media | public, unfiltered (Staff: active-or-authenticated) | `superadmin`/`club_admin` | no | slug generation |
| ClubInfo, SeoDefaults | public read, `superadmin`/`club_admin` write | — | n/a | — |
| SiteSettings | public read, `superadmin`-only write | — | n/a | — |

**Important architectural finding:** the `access.read` functions in `src/lib/access.ts` (`publishedOnlyOrAuthenticated`, `activeOnlyOrAuthenticated`, `nonDraftOrAuthenticated`) are Payload collection-config access-control functions, but **Payload's local API bypasses access control by default** and `overrideAccess: false` is never set anywhere in the app's own queries (`src/lib/cms-data.ts`, `src/lib/club-admin/actions.ts`). This means these functions only actually govern Payload's own REST/GraphQL API and the `/admin` panel — they do **not** protect what `cms-data.ts` shows on the public site. Public-site correctness currently depends entirely on manually duplicated `where` filters inside `cms-data.ts`. This is why the Matches draft-leak bug (§4, fixed) existed despite `nonDraftOrAuthenticated` being defined and looking correct — it was simply never being called for the public query path. **Recommendation for a future pass:** either set `overrideAccess: false` on public reads (making the access functions the actual enforcement layer, single source of truth) or delete the unused access functions to stop implying a protection that isn't there.

---

## 7. Route and Page Audit

| Route | Data source | Auth | SEO | Runtime | Notes |
|---|---|---|---|---|---|
| `/[lang]` (home) | Hybrid (CMS matches/news/players + static marketing sections) | public | metadata via layout only (no page-level `generateMetadata`) | 200, verified live | Fixed this session (was fully static matches) |
| `/[lang]/news`, `/news/[slug]` | CMS | public | full `generateMetadata`, OG image **added this session** | 200, verified live | |
| `/[lang]/men`, `/women`, `/futsal` | Hybrid | public | full `generateMetadata` | 200 (build) | Squad is static base, see §17.1 |
| `/[lang]/roster/[slug]` | Hybrid, metadata **switched to CMS-backed this session** | public | OG image **added this session** | 200 (build) | |
| `/[lang]/matches`, `/calendar` | CMS (matches) / static (calendar events — no CMS collection exists for generic events) | public | full `generateMetadata` | 200 (build) | |
| `/[lang]/staff` | Static (dead Payload collection) | public | full `generateMetadata` | 200 (build) | See §17.2 |
| `/[lang]/about`, `/academy`, `/contact` | Static/i18n + `constants.ts` | public | full `generateMetadata` | 200 (build) | Contact info hardcoded, see §17.3 |
| `/admin/[[...segments]]` | Payload admin UI | `superadmin` only | n/a (noindex expected, not independently verified this session) | dynamic | |
| `/club-admin/*` | Server Actions | `club_admin`/`superadmin` | correctly excluded from sitemap/robots | dynamic | |
| `/api/contact` | validation only, no-op send | public (rate-limit gap, see §13) | n/a | 200 on valid POST (code review, not live-tested) | |
| `/sitemap.xml`, `/robots.txt` | CMS-aware (News + Teams) | public | **base URL fixed this session** | 200, verified live | Player detail pages (`/roster/[slug]`) are not enumerated in the sitemap at all — flagged, not fixed (mechanical addition, out of this session's fix scope) |

---

## 8. Production Validation Results

| Command | Purpose | Result |
|---|---|---|
| `npm run lint` (before fixes) | ESLint | Clean, 0 errors/warnings |
| `npx tsc --noEmit` (before fixes) | Type check | Clean, 0 errors |
| `npm run build` (before fixes) | Production build | Success, 141 pages, but with a `sharp not installed` Payload warning (see §16 fix #1) |
| `npm run lint` (after fixes) | ESLint | Clean |
| `npx tsc --noEmit` (after fixes) | Type check | **1 error found and fixed** (`sameSite: "lax"` → `"Lax"` — Payload's cookie type is case-sensitive, distinct from the Next.js `cookies().set()` API used elsewhere in the same codebase) |
| `npm run build` (after fixes) | Production build | Success, 141 pages, **sharp warning gone** |
| `npm run start` + live smoke test | Runtime validation against the real project database | Homepage, `/el/news`, `/el/roster/[slug]`, `/el/matches`, `/sitemap.xml`, `/robots.txt` all `200` (or `307`→`200` for the `/el/*`→bare-path locale redirect, which is expected behavior); new security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`) confirmed present on responses; OG image tag confirmed conditionally correct (present when `imageUrl`/`photoUrl` exists, correctly absent otherwise); server log showed no new errors (only the pre-existing, unrelated Postgres SSL-mode deprecation warning and Payload's "no email adapter" notice) |

No automated test suite exists in this repository (`package.json` has no `test` script) — this was **not** something introduced by this session; it's a pre-existing gap, flagged in §17.

---

## 9. Database and Migration Assessment

Not re-exercised in depth this session (no schema changes were made). Per `AGENTS.md`, which documents a prior, verified incident and fix:
- Adapter: `@payloadcms/db-postgres` (Neon), no `migrationDir` override — schema sync previously relied entirely on `drizzle-kit push`, which is silently skipped in production.
- A real production incident (`column news.featured does not exist`) was fixed by hand-applying targeted `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` statements, and a longer-term fix wired `migrate:deploy` into `vercel-build`.
- **This database has no real migration baseline** — its `payload_migrations` table has only Payload's `{name: "dev", batch: -1}` push marker. The first real `migrate:create` on this DB will generate a full-schema "recreate every table" migration that must be manually inspected and never run as-is. This is a standing, documented, **unresolved** risk for any future schema change (see §17).
- Postgres SSL mode: `.env.local`'s `DATABASE_URI` uses `sslmode=require`, which `pg-connection-string` now warns is a deprecated alias for `verify-full` (confirmed live in this session's build output). Not a current functional issue, but worth updating before the alias behavior changes in a future major version, per `AGENTS.md`'s own note.

---

## 10. Authentication and Authorization Assessment

- **Roles:** `superadmin`, `club_admin`. No self-registration path exists (verified via grep — no public user-create Server Action or route).
- **Defense in depth:** every one of the ~20 mutating Server Actions in `src/lib/club-admin/actions.ts` independently re-verifies the session/role via `getAuthenticatedPayload()` — confirmed by direct inspection, not just the protected-layout gate.
- **Admin panel isolation:** `/admin` (Payload's own UI) is gated to `superadmin` only at the collection-access level (`Users.access.admin`), not just hidden in navigation.
- **Draft exposure:** News and (after this session's fix) Matches are correctly filtered from public queries. Players are not filtered because Players isn't the public roster's source of truth at all (§17.1) — moot rather than a live leak.
- **Session hardening — fixed this session:** Payload's own `/admin` login previously issued the shared `payload-token` cookie with framework-default `secure: false`, inconsistent with the hand-rolled club-admin login (which already correctly set `secure: NODE_ENV === "production"`). Now both paths match.
- **Open redirect — fixed this session:** `/club-admin/login?from=<url>` previously redirected to any attacker-supplied URL after a successful login with no validation. Now restricted to same-origin `/club-admin/*` paths only.
- **Privilege escalation:** no path found by which a `club_admin` can elevate to `superadmin` or modify another user's role/password (verified: no Server Action touches the `users` collection except `payload.login`).
- **Gap not fixed (ambiguous, needs a product decision):** delete actions (`deleteDocumentAction`, `deleteSeasonAction`) require only `superadmin` **or** `club_admin`, contradicting the manual's "only superadmin can delete" rule — but they're currently dead code with no UI entry point, so there is no live exploit path today. See §17.

---

## 11. SEO Audit

| Area | Status | Notes |
|---|---|---|
| `robots.txt` | Verified | Correctly disallows `/admin/`, `/club-admin/`, `/api/`, `/_next/`; references the sitemap. |
| `sitemap.xml` — dynamic content | Verified, one gap | Pulls published News and active Teams from Payload live. Individual player detail pages (`/roster/[slug]`) are never enumerated — flagged, not fixed this session (mechanical, out of scope). |
| `sitemap.xml`/canonical/OG/JSON-LD base URL | **Fixed** | Was a hardcoded placeholder domain — the single highest-impact SEO defect found. |
| Metadata coverage | Verified | All page templates implement `generateMetadata` with title+description+OG. |
| hreflang / `alternates.languages` | **Not fixed — flagged as a real gap** | Set once, identically, in the root layout (`/` and `/en`) and never overridden per-page. Every article/player/team page currently emits hreflang links pointing at the homepage in both locales instead of to itself. Correct fix requires a small shared helper wired into ~11 page templates — scoped as a follow-up (§17) rather than done in this pass, to keep this session's diff small and independently verifiable. |
| Canonical URLs | **Missing, not fixed** | No page sets `alternates.canonical` anywhere. Low practical risk today because the locale-routing scheme (proxy.ts) already prevents duplicate-URL indexing, but it's a missing defense-in-depth layer. Same follow-up scope as hreflang above. |
| Structured data (JSON-LD) | Partial | `organizationJsonLd`/`stadiumJsonLd` render site-wide. `articleJsonLd`/`matchJsonLd`/`personJsonLd`/`breadcrumbJsonLd` are fully implemented in `src/lib/seo.ts` but have zero call sites — a real, easy, high-value follow-up (rich results for news/players/fixtures) not done this session. |
| OG/Twitter images | **Fixed** for News and Player pages this session (conditionally present when the CMS record has an image). |
| Heading structure | Verified | Exactly one `<h1>` on every template spot-checked. |
| `SeoDefaults` global | **Dead code, not fixed** | Fully defined in Payload (title template, default OG image, robots directives) but never read by the frontend — editors can change it in the admin panel with zero visible effect. Flagged for a future wiring pass. |

---

## 12. GEO and AI Search Audit

The site's entity signals are currently weak for AI/answer-engine discovery, mostly for the same reasons as the SEO gaps above:
- `organizationJsonLd`/`stadiumJsonLd` give a baseline Organization/Place graph, which is good — but `personJsonLd` (players) and `matchJsonLd` (fixtures/results) exist in code and are never rendered, so individual players and matches have no machine-readable entity representation despite having dedicated public pages.
- Contact/address/social-link data is hardcoded and reads as placeholder (`.example.com`-style domain, generic un-handled social root URLs) rather than real, verifiable `sameAs` targets — low authority signal, though this may be intentional for a fictional-club demo project.
- No `dateModified`/freshness signal beyond News' `publishedDate`.
- No FAQ, comparison, or definition-style content exists (not necessarily a defect for this type of site).

**Not actioned this session** — these are content/product decisions (is this a real club with real social accounts? should player/match structured data be turned on?) rather than bugs, so they're recommendations in §17, not fixes.

---

## 13. Security Assessment

| Severity | Finding | Status |
|---|---|---|
| Medium | Open redirect via unvalidated `from` param on club-admin login | **Fixed** — restricted to same-origin `/club-admin/*` paths |
| Medium | Payload's own `/admin` login cookie missing `secure` flag (inconsistent with the hardened club-admin cookie) | **Fixed** — explicit `auth.cookies` config added to `Users.ts` |
| Low | No security response headers anywhere (no CSP, HSTS, X-Frame-Options, etc.) | **Partially fixed** — added `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`. **CSP deliberately not added** — the site relies on inline JSON-LD `<script>` tags, and a correct CSP would need per-request nonces; that's a larger, separately-scoped change flagged for a future pass, not attempted here per the explicit instruction not to ship a CSP that risks breaking functionality. |
| Low | No rate limiting on `/club-admin/login` or `/api/contact` | **Not fixed** — requires infrastructure (Vercel Firewall rule or a rate-limit library), out of scope for a code-only pass. Payload does provide per-account lockout by default (5 attempts / 10 min), which partially mitigates login brute-forcing. Contact-form impact is currently minimal since the send path is a no-op. |
| Low | Seed/reset scripts fall back to hardcoded default passwords (`ChangeMe123!`) when env vars are unset | **Not fixed** — these are ops scripts, not reachable from the running app; flagged for the scripts to refuse running with the default in `NODE_ENV=production`. |
| Informational | `README.md` references a `.env.local.example` that doesn't exist in the repo | **Not fixed** — documentation gap, no security impact. |
| Informational | `npm audit --production`: 14 vulnerabilities (1 low, 13 moderate), all transitive through `@payloadcms/*`/`next`/`drizzle-kit`/`esbuild` | **Not fixed** — no direct first-party code affected; track upstream releases. |
| Pass | Secrets hygiene: `.env.local` gitignored and confirmed never committed (`git log --all --full-history` clean); no hardcoded credentials found anywhere in tracked files | Verified, no action needed |
| Pass | CORS/CSRF origin allowlist intact (derived from `NEXT_PUBLIC_SERVER_URL`/Vercel env vars, per `AGENTS.md`) | Verified, not reverted |
| Pass | Every state-changing Server Action independently re-checks auth; CSRF protection via Next's built-in encrypted Server Action IDs | Verified |
| Pass | No raw/string-concatenated SQL anywhere in application code | Verified |

No secrets, credentials, or connection-string values are reproduced anywhere in this report.

---

## 14. Accessibility Assessment

Not exhaustively audited this session (would require live browser/screen-reader testing, which wasn't performed). Static review found no obvious defects: semantic heading structure is correct on all sampled templates, images use `alt` text (from the CMS `alt` field where available), and interactive elements appear to use native `<button>`/`<a>` elements rather than div-based fakes. **This is a static-review-only finding, not a verified pass** — flagged as not independently tested in §17.

---

## 15. End-User Documentation Assessment

`docs/CLUB_ADMIN_MANUAL.md` was checked line-by-line against the actual `src/lib/club-admin/actions.ts` and collection configs. Findings:
- **Accurate:** login flow, dashboard content, Seasons/Teams/Leagues/Venues/Rosters/Matches field lists and workflows, News status effects, bilingual fallback behavior, slug immutability.
- **Inaccurate — code contradicts the manual:** "club admins cannot edit article rich-text body" (they can, per code); "club admins cannot delete records" (the delete Server Actions don't actually restrict this to superadmin, though they're currently unreachable dead code). I did not edit the manual to match the code, nor change the code to match the manual — this is a business-intent question for the project owner (§17), and silently picking a side would risk concealing either a real security gap or a real feature regression.
- **Undocumented implemented behavior:** the News "featured article" toggle (added in a prior session per `AGENTS.md`) isn't mentioned in the manual's News section.

---

## 16. Changes Implemented

| File | Change | Reason |
|---|---|---|
| `payload.config.ts` | Import `sharp` and pass it to `buildConfig({ sharp, ... })` | `Media.ts` defines `imageSizes`/`adminThumbnail`, but Payload 3.x requires `sharp` to be passed explicitly (not just installed) — build was silently emitting "sharp not installed" and skipping all image-variant generation. |
| `src/lib/constants.ts` | `SITE_URL` now derives from `NEXT_PUBLIC_SERVER_URL`/Vercel env vars (mirroring `payload.config.ts`'s existing CORS-origin derivation) instead of a hardcoded `https://pyrgosafc.example.com` | Every sitemap URL, robots.txt sitemap link, canonical/OG URL, and JSON-LD `@id`/`url` field pointed at a domain the site doesn't run on — would have blocked correct search-engine indexing. |
| `src/lib/cms-data.ts` | `getCmsMatches` now filters `where: { status: { not_equals: "draft" } }` | Draft matches were publicly visible as upcoming fixtures — a private-data leak (`STATUS_MAP` had no entry for `"draft"`, so the `?? "upcoming"` fallback made it public). |
| `src/lib/cms-data.ts` | Added `getCmsRecentResults()`; `src/app/[lang]/page.tsx` now sources next-match/recent-results from CMS instead of 100%-static `src/data/matches.ts` | Homepage previously never reflected club-admin match edits — the exact bug class already fixed for News in a prior session, now closed for Matches too. |
| `src/lib/cms-data.ts` | Fixed `mapNews`'s category mapping — now extracts the populated relation's `slug` instead of casting the whole object | `dict.categories[article.category]` was keying with `"[object Object]"` whenever a News document had a category set, silently rendering a blank badge. |
| `src/lib/club-admin/actions.ts` | `PUBLIC_PATHS.players` populated (`/men`, `/women`, `/futsal`); `createPlayerAction`/`updatePlayerAction` now also revalidate the specific `/roster/[slug]` path | `revalidatePublic("players")` was already being called on every player mutation but had an empty path list — a no-op. Player photo edits wouldn't appear on statically-generated pages until the next full deploy. |
| `src/app/club-admin/login/page.tsx` | Added `safeRedirectTarget()` — post-login redirect now only accepts same-origin `/club-admin/*` paths | Open redirect: `?from=<any-url>` was passed straight to `router.push()` with no validation. |
| `src/collections/Users.ts` | Added explicit `auth.cookies` config (`secure` in production, `sameSite: "Lax"`) | Payload's own `/admin` login previously used the framework default (`secure: false`) for the same `payload-token` cookie the hardened club-admin login already sets correctly. |
| `next.config.ts` | Added `headers()` (server-build branch only) setting `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` | No security response headers existed anywhere. CSP intentionally omitted — see §13. |
| `src/app/[lang]/news/[slug]/page.tsx`, `src/app/[lang]/roster/[slug]/page.tsx` | Added `openGraph.images` (News: `article.imageUrl`; Player: switched `generateMetadata` from static to CMS-backed `getCmsPlayerBySlug` and added `player.photoUrl`) | Shared article/player links previously always rendered with no social-preview image despite the image being fetched and rendered in the page body. Also fixes a metadata/content data-source mismatch on the roster page (title/description previously came from static data while the page body was CMS-backed). |

Every change above was re-validated with a clean `npm run lint`, `tsc --noEmit`, `npm run build` (141/141 pages), and a live `npm run start` smoke test against the real project database.

---

## 17. Unresolved Issues

*Updated after round 2 (§21) — the three High-severity items from the initial pass (Players/Staff/Leagues CMS wiring, and the rich-text/delete permission conflict) are resolved and removed from this table. Remaining items are Medium/Low/Informational.*

| Severity | Issue | Impact | Reason Unresolved | Remediation | Production Blocker? |
|---|---|---|---|---|---|
*Updated again after round 3 (§22) — player season stats and every ClubInfo/SiteSettings field with a natural existing UI consumer are now wired. Two fields (logo, brand colors) are intentionally still unwired — see §22.2 for why.*

| Severity | Issue | Impact | Reason Unresolved | Remediation | Production Blocker? |
|---|---|---|---|---|---|
| Medium | No automated test suite exists (`package.json` has no `test` script) | No regression safety net for future changes | Pre-existing, not introduced by this audit; adding meaningful coverage is a multi-day effort of its own | Add integration tests for the CMS→public-site data flow at minimum (the class of bug this audit found most often) | No, but recommended before further feature work |
| Low | `ClubInfo.logo` and `ClubInfo.colors` remain unwired — the SVG `Crest` component and Tailwind's compiled crimson/white theme are used everywhere instead | Editors can upload a logo or set brand hex colors in Payload with zero visible effect | Deliberately out of scope, in all three rounds: swapping the hand-drawn `Crest` for an uploaded raster/vector logo, or making the color system runtime-configurable (currently compiled Tailwind utility classes, not CSS custom properties), are visual-identity/design-system changes, not content wiring — explicitly outside "don't make broad visual redesigns" | If ever wanted, needs a deliberate design decision first (keep Crest as default with logo as optional override? Rebuild the theme on CSS variables?), not just a data-wiring pass | No |
| Low | `articleJsonLd()` (News structured data) still uses the hardcoded `CLUB.name` for the JSON-LD `publisher.name` field, not `ClubInfo.name`/`SeoDefaults.structuredData.organizationName` (both of which `organizationJsonLd()`/`stadiumJsonLd()` now use) | If an admin renames the club in Payload, the org-level JSON-LD updates everywhere except this one per-article publisher field | Minor inconsistency introduced by wiring `organizationJsonLd`/`stadiumJsonLd` (§21.3, §22) but not revisiting every other JSON-LD generator that references `CLUB.name`; `articleJsonLd` is a synchronous function called inline in `news/[slug]/page.tsx` without `await`, so fixing it means also making that call site async | Wire `articleJsonLd`'s publisher name to `getCmsClubInfo()`/`getSeoDefaults()`, same pattern as the other generators | No |
| Low | Google Analytics (when `googleAnalyticsId` is set) loads unconditionally, not gated behind the cookie banner's accept action, even when `cookieBannerEnabled` is also on | Basic consent-then-track flow isn't enforced — GA can fire before a visitor clicks "Accept" | Scoped deliberately: the request was to wire the field to a working feature, not to build a full consent-management platform (blocking/unblocking scripts based on stored consent, categorized cookie types, etc.) — a legitimate larger feature in its own right | Gate the two GA `<Script>` tags in `src/app/[lang]/layout.tsx` behind a consent check if/when real GDPR compliance is required | No, unless serving EU visitors under GDPR with analytics enabled |
| Low | The announcement bar (`SiteSettings.nav.announcementBar`) only renders on desktop (`lg:` breakpoint and up) in `Header.tsx`, not in the mobile slide-out menu | Mobile visitors never see the announcement | The header is `fixed`-positioned with hardcoded page-content top-padding (`pt-40` etc.) across every template — adding a full-width second bar would grow the header's height and require auditing/adjusting that padding on all ~13 templates, a much larger and riskier change than a badge that doesn't affect header height | Either thread `announcement` into `MobileNav.tsx`'s slide-out panel (no height-budget conflict there), or accept desktop-only as the permanent scope | No |
| Low | No rate limiting on login or contact form | Brute-force/spam surface — relevant since round 2 wired up real SMTP sending (§21.5) | Requires infrastructure (Vercel Firewall / Upstash), not a code-only fix | Add IP-based rate limiting, especially now that the contact form sends real email | No, but recommended soon given SMTP is now live |
| Low | Seed/reset scripts default to a hardcoded password (`ChangeMe123!`) if env vars are unset | Guessable credential if ever run against production without overrides | Ops-script hardening, not app code | Add a `NODE_ENV === "production"` guard that refuses the default | No |
| Informational | CSP not implemented | XSS blast-radius mitigation missing | Requires nonce-based wiring for the inline JSON-LD scripts (News/Player/Match/Organization/Stadium — now more of them after §21/§22) and the inline GA init script added in round 3 | Add nonces to every inline `<script>` tag and a strict `script-src` | No |
| Informational | `npm audit`: 14 transitive vulnerabilities, all upstream in `@payloadcms/*`/`next`/`drizzle-kit` (unchanged by `nodemailer` in round 2 — 0 new vulnerabilities) | No first-party code affected | Waiting on upstream releases | Re-check after each Payload/Next version bump | No |
| Not testable | Accessibility (WCAG) — only statically reviewed, not tested with a real screen reader/keyboard-only pass | Unknown | Requires live browser/AT testing tooling not available in this session | Run axe-core or manual AT testing in a follow-up | Not testable this session |
| Not testable | `migrate:deploy` — not re-exercised via a real Vercel deploy (the `featured` and `stats_*` columns were both added via the same hand-verified direct-`ALTER TABLE` method as the prior `News.featured` incident, not through a committed migration file, consistent with this DB's documented lack of a migration baseline) | Unknown until a schema change next goes through the real `migrate:create`/`migrate:deploy` path | No migration baseline exists yet (per `AGENTS.md`) — generating one now was out of scope for this audit | Establish a real migration baseline (flagged in `AGENTS.md` since a prior session, still open) before the next schema change | Not testable this session |
| Not testable | SMTP email delivery — code path implemented and verified to *not* crash when unconfigured (§21.5), but actual message delivery was not tested since no real SMTP credentials exist in this environment | Unknown until real `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` are set and a message is sent end-to-end | No SMTP credentials available in this session | Send a real test message after setting SMTP env vars in Vercel | Not testable this session |
| Not testable | Google Analytics — script wiring verified to render correctly when `googleAnalyticsId` is set (and to render nothing when unset), but no real GA property ID exists in this environment to confirm events actually reach Google | Unknown until a real GA4 measurement ID is set and traffic is checked in GA's real-time report | No GA credentials available in this session | Set a real `googleAnalyticsId` in `SiteSettings` and confirm real-time hits after deploy | Not testable this session |

---

## 18. Environment Variable Matrix

| Variable | Required | Scope | Purpose | Notes |
|---|---|---|---|---|
| `DATABASE_URI` | Yes | Server | Postgres connection string (Neon) | `.env.local` uses `sslmode=require`, which `pg-connection-string` warns is a deprecated alias for `verify-full` — not urgent, flagged in `AGENTS.md` already |
| `PAYLOAD_SECRET` | Yes | Server | Payload JWT signing secret | |
| `NEXT_PUBLIC_SERVER_URL` | Yes (production) | Public | Payload `serverURL`; **now also** the canonical `SITE_URL` for SEO/sitemap/JSON-LD (fixed this session) | Must be set in Vercel Production env vars; without it, falls back to Vercel's auto-injected URL vars, then `localhost:3000` |
| `VERCEL_PROJECT_PRODUCTION_URL` | Auto (Vercel) | Server | CORS/CSRF allowlist + SITE_URL fallback | Auto-injected by Vercel, no action needed |
| `VERCEL_URL` | Auto (Vercel) | Server | CORS/CSRF allowlist + SITE_URL fallback (covers preview deployments) | Auto-injected by Vercel |
| `BLOB_READ_WRITE_TOKEN` | Recommended | Server | Vercel Blob media storage | Falls back to local disk storage if unset (fine for dev, not durable on Vercel's serverless filesystem in production) |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | Yes, to enable real sending | Server | Contact-form email delivery via Nodemailer (§21.5) — set all three to activate; unset leaves the endpoint validating-only (safe no-op) | Not yet set anywhere in this environment — sending is implemented but untested end-to-end (see §17) |
| `SMTP_PORT`, `SMTP_SECURE` | No | Server | Optional SMTP transport overrides | Default `587` / `secure` inferred from port `465` |
| `CONTACT_RECIPIENT_EMAIL` | No | Server | Where contact-form messages are delivered | Defaults to `CLUB.contact.email` in `src/lib/constants.ts` |
| `RESEND_API_KEY` | No (unused) | Server | Read by legacy code path, not wired to any send logic | This project uses SMTP as its email transport, not Resend — kept only because README previously documented it as an alternative |
| `ADMIN_TEMP_PASSWORD`, `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`, `SEED_CLUB_ADMIN_EMAIL`/`SEED_CLUB_ADMIN_PASSWORD` | No (ops scripts only) | Server, dev/ops use only | `scripts/seed.ts`/`scripts/reset-admin.ts` | Fall back to a hardcoded default password if unset — see §17 |
| `STATIC_EXPORT` / `NEXT_PUBLIC_STATIC_EXPORT` | No | Build-time | Switches to the fully-static export build (`npm run export`) | |
| `PAYLOAD_MIGRATING` | No | Server, set internally | Set by `scripts/migrate.ts` during migration runs | Not user-facing |

No `NEXT_PUBLIC_*` variable exposes a secret — confirmed by grep across all usages.

---

## 19. Deployment Checklist

- [ ] `NEXT_PUBLIC_SERVER_URL` set in Vercel Production env vars (load-bearing for SEO correctness, not just Payload's `serverURL`/CORS)
- [ ] `DATABASE_URI`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN` set in Vercel (Production and Preview, per `AGENTS.md`'s shared-database caveat if Preview points at the same DB)
- [ ] Set `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` (and optionally `SMTP_PORT`/`SMTP_SECURE`/`CONTACT_RECIPIENT_EMAIL`) in Vercel, then send one real test message through the live `/contact` form to confirm end-to-end delivery (untested in this session — no credentials available)
- [ ] Add rate limiting to `/api/contact` and `/club-admin/login` before/soon after enabling real email sending (see §17)
- [ ] Confirm `vercel-build`'s `migrate:deploy` step runs clean on the next deploy (no migration files are currently committed, so this should be a no-op until the next schema change)
- [ ] Mark at least one player `featured` in club-admin/Payload if you want the homepage's "Featured Players" section to reflect real CMS data instead of its static fallback (round 2 added the `featured` field but seeded data doesn't set it — confirmed graceful fallback works, see §21.2)
- [ ] Fill in Payload's `ClubInfo` global (real contact details, social media URLs, sponsors, club values, "about" text) if the real business wants this content to diverge from the current static/demo defaults — confirmed round 3's fallback is safe either way, but the whole point of wiring it was to make it *editable*
- [ ] If using Google Analytics, set a real `googleAnalyticsId` in `SiteSettings` and confirm real-time hits after deploy (untested in this session — no GA property available)
- [ ] Decide whether `SiteSettings.cookieBannerEnabled` needs to gate Google Analytics behind consent for GDPR compliance before enabling both together for EU visitors (see §17 — currently GA loads unconditionally regardless of the cookie banner's accept state)
- [ ] Re-run `npm audit --production` after the next `@payloadcms/*`/`next` version bump
- [ ] No backup/restore procedure is documented for the Neon database — recommend confirming Neon's point-in-time-recovery settings match the club's data-loss tolerance (not evaluated in this session, outside the codebase)
- [ ] Smoke test after deploy: homepage, `/news`, one `/roster/[slug]` (confirm real season stats render), `/men`/`/women`/`/futsal`, `/staff`, `/about`, `/contact` (confirm footer/contact details), `/matches`, `/sitemap.xml`, `/robots.txt`, `/club-admin/login`, and a real contact-form submission (the same set verified locally across all three audit rounds)
- [ ] **Test `SiteSettings.maintenanceMode` deliberately once in a safe environment** (e.g., a preview deployment) before ever relying on it in production — confirm it correctly blocks the public site while leaving `/club-admin` reachable to turn it back off, since flipping this field live in production without a prior test would be a bad first try

---

## 20. Final Verdict

**READY WITH DOCUMENTED LIMITATIONS.**

The site can be deployed as-is. All fixes made across all three rounds are verified via real production builds and live server smoke tests against the actual project database — not just static review. No critical or high-severity *code* defect remains open, and round 3 closed the two remaining structural content gaps (player season stats, and every ClubInfo/SiteSettings field with a natural UI consumer) that the project owner explicitly asked to be fixed rather than left as a documented limitation. The only fields still deliberately unwired are visual-identity ones (logo, brand colors) that would require a design-system decision, not a data-wiring pass — see §17 and §22.2.

**Fully verified across all three rounds:** lint, type-check, production build (141 pages, clean, three times), and live-server rendering of every public route — homepage, news list/detail, men/women/futsal squads, staff, roster detail (confirmed real backfilled season stats rendering, e.g. Alexandros Marinakis's 14 appearances/3 clean sheets matching the database exactly), about, contact (confirmed real ClubInfo contact/social data rendering with graceful static fallback), matches, sitemap, robots.txt — against the real database, plus hreflang/canonical/JSON-LD/security-header presence, plus the specific behavior of every individual fix listed in §16, §21, and §22.

**Only statically reviewed (not live-tested):** accessibility, real end-to-end SMTP delivery, real Google Analytics event delivery (script wiring confirmed correct, but no real GA property exists in this environment), Payload migration tooling via the real `migrate:create`/`migrate:deploy` path (all three schema changes across this audit — `featured` on News, `featured` on Players, `stats_*` on Rosters — were applied via the same hand-verified direct-SQL method already established for this project's original `News.featured` incident, since no migration baseline exists yet), and `SiteSettings.maintenanceMode` (implemented and code-reviewed, but never actually flipped on against a running server in this session — test it once in a safe environment before relying on it in production, per §19).

**Conditions before the next deploy should specifically consider:** confirming `NEXT_PUBLIC_SERVER_URL` is correctly set in Vercel; setting real `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` and sending one live test message before relying on the contact form; marking at least one player `featured: true` if the homepage's featured-players section should show real data instead of its fallback; and filling in Payload's `ClubInfo` global with the club's real contact/social/sponsor details if they should diverge from the current demo defaults.

---

## 21. Round 2 Remediation (Follow-Up Pass)

The project owner reviewed round 1's findings and gave explicit direction on all open items. This section documents exactly what was decided, what was built, and how it was verified — a second full validation cycle (lint → typecheck → build → live smoke test against the real database) was run after these changes, independent of round 1's.

### 21.1 Owner decisions on the permissions conflict (§17, round 1)

- **News rich-text editing: code is correct, manual was wrong.** `docs/CLUB_ADMIN_MANUAL.md` §11/§12 previously claimed club admins couldn't edit article body text — updated to state they can, matching the actual (intended) behavior.
- **Record deletion: manual is correct, code was the gap.** The manual's "club admins cannot delete records" claim is now enforced in code, not just aspirational: `deleteSeasonAction` and `deleteDocumentAction` (`src/lib/club-admin/actions.ts`) now explicitly check `user.role !== "superadmin"` and reject with `"Forbidden"` before the general `getAuthenticatedPayload()` check (which only required *either* role) would have let a `club_admin` through. Both actions are currently unreachable from any club-admin UI button, so this closes a latent gap rather than fixing an active bug — but it means the manual's promise is now actually true if a delete button is ever wired up later.

### 21.2 Players, Staff, and Leagues are now genuinely CMS-driven

This was the largest change. Per the owner's direction ("even the demo content has to be the content that be fetched by the database... if record updated with actual image it will be displayed also in the frontend"):

- **Verified the existing seed script first.** `scripts/seed.ts` already had full, idempotent (`findOrCreate`-by-slug) coverage for Seasons, Venues, Teams, Leagues, Players, Staff, Rosters, Matches, News, and StaffAssignments. A direct read-only query against the live database (via `.env.local`'s `DATABASE_URI`) confirmed it had already been run and was fully up to date: 39/39 players, 8/8 staff, 14/14 matches — exactly matching the static seed source counts. No re-seed was needed.
- **Added a `featured` checkbox to the `Players` collection** (`src/collections/Players.ts`), mirroring the existing `News.featured` pattern but without the single-featured-only `afterChange` hook (the homepage shows several featured players, not one). Schema change applied via a hand-verified `ALTER TABLE "players" ADD COLUMN IF NOT EXISTS "featured" boolean DEFAULT false;` against the live database — the same targeted, minimal-diff approach documented in `AGENTS.md` for the prior `News.featured` incident, not the dangerous full-recreate migration `migrate:create` would generate on a database with no tracked-migration baseline. Verified present via `information_schema.columns` before and after.
- **Rewrote `src/lib/cms-data.ts`'s Player functions** (`getCmsPlayerBySlug`, `getCmsPlayersByDepartment`, `getCmsFeaturedPlayers`, `getCmsRelatedPlayers`) to query Payload's `players` collection as the primary source, joined against the **current season's `rosters` entries** (via a new `getCurrentSeasonRosterMap()` helper) for the season-relative concerns the relational model deliberately keeps off the Player record — department/team, captaincy, shirt number, join date (a player can appear on more than one department's roster, which is exactly why this isn't a plain field on Players). The static `src/data/players.ts` array is now used only as: (a) a full fallback if Payload is unreachable or a department's roster is empty, matching the same try/catch pattern already used for News and Matches; and (b) a per-field supplement for `age` (when no `dateOfBirth` is set in Payload) and `stats` (season appearances/goals/etc. — genuinely absent from the Payload schema, flagged as an open Medium item in §17, not silently invented).
- **Removed the now-dead `getCmsPlayerPhotoMap`/`withCmsPhoto` helpers** entirely (confirmed zero remaining references) — the old "static-primary, CMS-photo-overlay-only" architecture they implemented is fully replaced.
- **Built `getCmsStaff()`** (same file) and a `mapStaff()` function following the identical CMS-primary/static-fallback pattern, and wired `src/app/[lang]/staff/page.tsx` to call it instead of importing the static `staff` array directly.
- **Wired the `Matches.league` relationship into `mapMatch()`** — added a `leagueName?: LocalizedText` field to the `Match` type (`src/types/index.ts`) and populated it from the already-`depth:1`-populated `doc.league` object; `MatchCard.tsx`'s competition badge now shows the real league name (e.g. "Περιφερειακό Πρωτάθλημα Άντρων") when present, falling back to the generic match-type label otherwise.
- **Fixed the players/staff/rosters revalidation gap** that would have undermined all of the above: `PUBLIC_PATHS.players` and `PUBLIC_PATHS.staff` were both empty arrays despite `revalidatePublic("players"/"staff")` already being called on every mutation — a silent no-op identical in shape to the already-fixed News revalidation bug from a prior session. Now `players` revalidates `/men`, `/women`, `/futsal` plus the specific edited player's `/roster/[slug]` (captured from `payload.create`/`payload.update`'s own return value, no extra query needed); `staff` revalidates `/staff`; `rosters` (previously also empty) now revalidates `/men`/`/women`/`/futsal` too, since a roster change can move a player between departments.
- **Verified live, twice** (once immediately after the rewrite, once again after all subsequent SEO changes): killed a stale leftover `next start` process that was masking the first verification attempt with pre-change responses (caught via `EADDRINUSE` on the real restart), then confirmed against a clean server — `/men` renders 19 real DB-backed players, `/staff` renders real staff names from Postgres, `/matches` shows real league names, a player's biography falls back correctly to static content when Payload's `biography` field is empty, and the homepage's featured-players section gracefully falls back to static data (since no seeded player has `featured: true` in Payload yet — flagged in the deployment checklist, not a bug).

### 21.3 SEO/GEO structured data and hreflang

- **Fixed a real bug in `src/lib/seo.ts`'s `matchJsonLd`**: `eventStatus` mapped `"completed"` to `https://schema.org/EventPostponed`, which is factually wrong (schema.org has no distinct "completed" event status; `EventScheduled` is correct for an event that already occurred). Simplified to always emit `EventScheduled`.
- **Wired the previously-unused `articleJsonLd`/`personJsonLd`/`matchJsonLd`/`breadcrumbJsonLd` generators** into their natural pages: `articleJsonLd` + a Home→News→Article `breadcrumbJsonLd` on `src/app/[lang]/news/[slug]/page.tsx`; `personJsonLd` + a Home→Department→Player `breadcrumbJsonLd` on `src/app/[lang]/roster/[slug]/page.tsx`; `matchJsonLd` (one `<script>` per rendered match) on `src/app/[lang]/matches/page.tsx`.
- **Fixed the broken per-page hreflang/canonical issue.** Added `buildAlternates(lang, path)` to `src/lib/utils.ts` (thin wrapper around the existing `localeHref` helper, so `el`/`en` hrefs and the self-referencing canonical stay consistent with how the rest of the app computes locale URLs). Removed the root layout's single hardcoded `alternates: { languages: { el: "/", en: "/en" } }` (which every page had been inheriting unchanged, so every article/player/team page's hreflang pointed at the homepage instead of itself) and added a page-specific `alternates: buildAlternates(...)` call to all 12 page templates with `generateMetadata` (including a brand-new `generateMetadata` on the homepage, which previously had none). Verified live: `/news` now emits `hreflang="el" href=".../news"` + `hreflang="en" href=".../en/news"`; `/roster/alexandros-marinakis` emits the equivalent self-referencing pair; `/men` emits a matching `<link rel="canonical">`.
- **Fixed a real sitemap bug, not just a gap.** `src/app/sitemap.ts`'s `cmsRosterUrls` was querying the `teams` collection but building `/roster/${slug}` URLs — since team slugs look like `pyrgos-afc-men`, this generated non-existent sitemap entries like `/roster/pyrgos-afc-men` instead of real player pages, and never included any actual player. Fixed by querying `players` (filtered to `status: "active"`, matching public visibility) instead — the URL-building logic itself was already correct, only the source collection was wrong. Verified live: the sitemap now lists real player slugs (`/roster/alexandros-marinakis`, `/roster/aliki-beneki`, etc.).

### 21.4 `SeoDefaults` global wired in (scoped deliberately — see below)

Given `ClubInfo`, `SiteSettings`, and `SeoDefaults` have substantial field overlap (all three define their own title/description/OG-image-ish defaults) and `SiteSettings.siteUrl` / `SeoDefaults.structuredData.organizationUrl` both carry the exact same wrong `https://pyrgosafc.example.com` placeholder as their Payload `defaultValue` — a landmine that would have silently reintroduced the round-1 `SITE_URL` bug for any admin who never edits those fields — this pass scoped strictly to `SeoDefaults`, and only its non-URL editorial fields:

- `structuredData.{organizationName, foundingYear, sport, location}` → `organizationJsonLd()` in `src/lib/seo.ts` (made async; `src/app/[lang]/layout.tsx` updated to `await` it). `url`/`@id`/`logo` fields deliberately still derive from the fixed `SITE_URL` constant, never from Payload — documented inline with a comment explaining exactly why, so a future editor doesn't "fix" this by wiring in the URL field.
- `defaultOgImage` → root layout's `openGraph.images` fallback.
- `twitterHandle` → root layout's `twitter.site`.
- `robots.{index, follow, additionalDirectives}` → both the per-response `<meta name="robots">` tag (root layout metadata) and `src/app/robots.ts`'s actual `robots.txt` rules (with `additionalDirectives` merged into, not replacing, the hardcoded admin/API disallow list, so a typo in that free-text Payload field can't accidentally un-block `/admin/` or `/club-admin/`).

`ClubInfo` (contact details, social links, about copy, club values, sponsor list) and the rest of `SiteSettings` (maintenance mode, analytics ID, cookie banner, announcement bar) remain unwired — flagged as a Medium/Low follow-up in §17, not silently done, since wiring them touches `Footer`/`Header`/the Contact page and would need to first confirm none of those are client components before threading in async CMS data — a meaningfully larger and separately-scoped change than the SEO-only wiring done here.

### 21.5 SMTP email delivery implemented

Per the owner's direction to set up SMTP for the production domain: installed `nodemailer` (+ `@types/nodemailer`, 0 new `npm audit` findings) and implemented real sending in `src/app/api/contact/route.ts`. A transporter is only constructed when `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` are all set (optional `SMTP_PORT`/`SMTP_SECURE` overrides, default port `587`); without them the endpoint still validates and returns success but sends nothing, so the form stays safely testable without real credentials in dev/preview. Recipient defaults to `CLUB.contact.email`, overridable via `CONTACT_RECIPIENT_EMAIL`. User-supplied `name`/`email`/`subject` are stripped of line breaks before being placed in mail headers (defense in depth against header injection, on top of nodemailer's own MIME builder already treating them as structured fields rather than raw concatenated strings). `RESEND_API_KEY` is read but deliberately left unwired — this project uses SMTP as its transport, not Resend. Updated `README.md`'s "Email Delivery" section, which previously described the endpoint as an unimplemented placeholder. **Not verified end-to-end**: no real SMTP credentials exist in this environment, so actual message delivery was not tested — only confirmed, live, that a POST with no SMTP env vars set still validates and returns `{"success":true}` without throwing.

### 21.6 Round 2 validation summary

| Command | Result |
|---|---|
| `npx tsc --noEmit` (after Players/Staff/Leagues rewrite) | Clean |
| `npm run lint` + `npx tsc --noEmit` + `npm run build` (after JSON-LD/hreflang/sitemap/SeoDefaults/SMTP changes) | All clean; 141/141 pages |
| `npm run start` + live smoke test | All sampled routes 200 (or expected 307 locale redirects); sitemap contains real player URLs; hreflang/canonical self-reference correctly per page; JSON-LD present on news/roster/matches pages; security headers from round 1 still present; contact-form POST validates and returns success with no SMTP configured; no new runtime errors in server logs |

**Files changed in round 2:** `docs/CLUB_ADMIN_MANUAL.md`, `src/lib/club-admin/actions.ts`, `src/collections/Players.ts`, `src/lib/cms-data.ts`, `src/app/[lang]/staff/page.tsx`, `src/types/index.ts`, `src/components/cards/MatchCard.tsx`, `src/lib/seo.ts`, `src/app/[lang]/news/[slug]/page.tsx`, `src/app/[lang]/roster/[slug]/page.tsx`, `src/app/[lang]/matches/page.tsx`, `src/lib/utils.ts`, `src/app/[lang]/layout.tsx`, `src/app/[lang]/{page,about,academy,contact,calendar,men,women,futsal,news}/page.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/api/contact/route.ts`, `README.md`, `package.json`/`package-lock.json` (added `nodemailer`).

---

## 22. Round 3 Remediation (Second Follow-Up Pass)

The project owner asked for two more things after reviewing round 2: (1) fix player season stats "in the database," and (2) finish "all the remaining wiring" — i.e. every CMS global flagged as unwired in §17. This section documents both, plus a third full validation cycle.

### 22.1 Player season stats now live in the database, on the correct entity

**Design decision:** stats were added to the **Rosters** collection, not Players. A player's appearances/goals/assists/etc. are specific to one team in one season — the same player can have completely different stats for the Men's squad vs. Futsal in the same season (the manual already documents this dual-roster scenario). Rosters already models exactly this player×team×season relationship (it's where `shirtNumber`, `isCaptain`, and `joinedDate` already lived, all season-relative overrides) — adding stats to the Player record itself would have been the architecturally wrong choice, conflating a per-season fact with an intrinsic player property.

- **Schema:** added a `stats` group to `src/collections/Rosters.ts` — `appearances`, `goals`, `assists`, `yellowCards`, `redCards`, `minutesPlayed` (all number, default 0), and `cleanSheets` (number, no default — left empty for outfield players, since a `0` clean-sheet is meaningfully different from "not a goalkeeper").
- **Migration:** applied via a hand-verified `ALTER TABLE "rosters" ADD COLUMN IF NOT EXISTS ...` for all seven `stats_*` columns (Payload flattens group fields to `groupname_fieldname` in Postgres — confirmed via `information_schema.columns` before and after), following the same safe, targeted pattern used for the `featured` fields in rounds 1–2, since this database still has no tracked-migration baseline.
- **club-admin UI:** added a "Στατιστικά σεζόν" (season stats) field group to both the roster creation form (`NewRosterForm.tsx`) and edit form (`EditRosterForm.tsx`), wired through `createRosterAction`/`updateRosterAction` (`src/lib/club-admin/actions.ts`) via a new `parseRosterStats()` helper, and through the edit page's data loader (`rosters/[id]/page.tsx`) so existing values populate the edit form correctly.
- **Public site:** `src/lib/cms-data.ts`'s `mapPlayer()` now sources `stats` from the current-season roster entry first (via the existing `getCurrentSeasonRosterMap()`/`RosterInfo` machinery already built in round 2 for department/captaincy), falling back to the static seed's demo stats only when a roster entry exists but nobody has entered real numbers yet (a new `rosterStats()` helper distinguishes "genuinely all zero" from "field never touched," using the same reasoning as everywhere else in this codebase: Payload always returns `0` defaults, so presence alone can't signal "real data").
- **Backfill:** wrote a one-off script (`scripts/tmp-backfill-roster-stats.ts`, deleted immediately after running — never committed, matching this project's established temp-script discipline) that matched all 39 existing roster entries to their static-seed player by slug and copied the demo stats in via Payload's local API (not raw SQL, so Payload's validation/hooks still ran). Result: **39/39 updated, 0 skipped** — verified directly against Postgres (`stats_appearances`/`stats_goals`/etc. non-null and non-zero on all 39 rows) and again live through the rendered `/roster/[slug]` page (Alexandros Marinakis's page shows 14 appearances, 3 clean sheets — the exact values now stored in the database, not the static file).
- **Docs:** `docs/CLUB_ADMIN_MANUAL.md` §9 (Rosters) now documents the stats fields and explains why they live on the roster entry rather than the player.

### 22.2 Every remaining CMS global wired — with two deliberate, documented exceptions

Round 2 scoped `SeoDefaults` wiring narrowly and left `ClubInfo` and the rest of `SiteSettings` unwired, flagging them in §17. Round 3 closes essentially all of that gap:

**`ClubInfo` global** — added `getCmsClubInfo()` to `src/lib/cms-data.ts` (wrapped in React's `cache()` since it's now read by 5+ independent server components per page render — `Footer`, `ClubValues`, `SponsorsStrip`, the About and Contact pages, and `organizationJsonLd`/`stadiumJsonLd` in `seo.ts`; without memoization each would issue its own identical Payload query). Returns bilingual (`{el, en}`) values for every field, falling back field-by-field to the existing static `CLUB`/`SOCIAL_LINKS`/`sponsors` data and the i18n dictionaries' `values` entries (imported directly from `src/i18n/el.ts`/`en.ts`, not via `getDict(lang)`, since the fallback needs both languages at once) when Payload is unreachable or a field is unset — the same graceful-degradation pattern used everywhere else in this project.
- `contact`/`socialMedia` → `Footer.tsx` (converted to an `async` server component) and the Contact page's core details (department emails, which have no CMS field at all, are untouched).
- `values` → `ClubValues.tsx` (converted to async); a value's icon is chosen by cycling through 4 fixed Lucide icons by array index, since the CMS array has no icon field of its own and a 5th admin-added value still needs to render something.
- `sponsors` → `SponsorsStrip.tsx` (converted to async) and `Footer.tsx`'s partners list; extended the `Sponsor` type (`src/types/index.ts`) with optional `url`/`logoUrl` fields (additive, non-breaking) to carry the CMS-only sponsor link/logo data.
- `stadium` (name/capacity/opened) and `contact.address` → the About page's stadium section and JSON-LD (`organizationJsonLd`/`stadiumJsonLd`, both now `async` and awaited from `src/app/[lang]/layout.tsx`).
- `about`/`aboutEn` (rich text) → rendered as a new, purely **additive** section on the About page, shown only when non-empty. This field's content doesn't map onto the About page's existing multi-section, i18n-dict-driven narrative (mission/story-timeline/fans-quote are distinct authored blocks, not one prose field) — rather than force-fitting it into an existing section (which would have meant picking one arbitrarily to overwrite) or restructuring the page around it (a redesign, explicitly out of scope), it gets its own optional block so the field has genuine purpose without disturbing existing content.
- **Deliberately left unwired:** `logo` and `colors`. The site's brand mark is a hand-drawn SVG (`Crest` component) used consistently across Header/Footer/About/favicon-adjacent contexts, and the color system is compiled Tailwind utility classes (`text-crimson-bright` etc.), not runtime CSS custom properties. Wiring either would be a visual-identity/design-system change requiring its own decision (Does an uploaded logo replace or supplement Crest? Does the whole Tailwind theme move to CSS variables?) — explicitly out of scope per the standing "don't make broad visual redesigns" instruction. Documented as a Low, not silently dropped.

**`SiteSettings` global** — added `getCmsSiteSettings()` (also `cache()`-wrapped) alongside `getCmsClubInfo()`. Wired all four remaining fields, each as a genuinely new, working feature rather than just a data pass-through:
- `maintenanceMode` → gates `src/app/[lang]/layout.tsx`: when on, renders a minimal maintenance screen instead of the normal site for every public route. Crucially, `/club-admin` and `/admin` live in separate route trees outside this layout, so admins retain access to turn it back off — verified by inspection of the route structure, not yet live-tested (flagged in §17/§19: test this once, deliberately, in a safe environment before ever relying on it in production).
- `googleAnalyticsId` → conditional GA4 script tags (`next/script`, `afterInteractive`) in the root layout, rendering nothing when unset.
- `cookieBannerEnabled` → new `CookieBanner` client component (`src/components/layout/CookieBanner.tsx`), shown when enabled and not yet dismissed (tracked via `localStorage`). Built with `useSyncExternalStore` rather than a `useEffect`-driven `setState` after an ESLint `react-hooks/set-state-in-effect` failure caught a real anti-pattern (a synchronous one-shot `setState` inside an effect with no subscription) — `useSyncExternalStore` is the correct React-recommended primitive for reading an external, non-reactive store like `localStorage` without that problem, and it's SSR-safe by design (a server snapshot avoids hydration mismatches).
- `announcementBar`/`announcementBarEnabled` → threaded through as a new optional `Header` prop, rendered as a small badge in the desktop nav bar only. **Deliberately desktop-only**: the header is `fixed`-positioned and every page template hardcodes its top padding (`pt-40` etc.) to match the header's current height — a full-width second bar would grow that height and require auditing/adjusting padding across all ~13 templates, a materially larger and riskier change than a badge that doesn't affect header height. Flagged as a Low limitation, not silently shipped as "done."

**New i18n strings:** added `cookieBanner.{message,accept}` and `maintenance.{title,text}` to both `src/i18n/el.ts` and `src/i18n/en.ts`, following the existing dictionary pattern exactly (the `Dictionary` type is inferred from `el.ts`, so `en.ts` is type-checked against it — a missing key would have been a build error, not a silent gap).

### 22.3 Round 3 validation summary

| Command | Result |
|---|---|
| `npx tsc --noEmit` (after stats schema + wiring) | Clean |
| `npx tsc --noEmit` (after ClubInfo data-layer + seo.ts wiring) | Clean |
| `npx tsc --noEmit` (after all ClubInfo UI consumers wired) | Clean |
| `npm run lint` | **1 real error found and fixed**: `react-hooks/set-state-in-effect` in the first `CookieBanner` draft — rewritten with `useSyncExternalStore` (§22.2); clean after |
| `npx tsc --noEmit` + `npm run build` (final, after SiteSettings wiring) | Clean; 141/141 pages |
| `npm run start` + live smoke test | All sampled routes 200; footer/about pages render real ClubInfo-sourced contact/social/sponsor/values data (via static fallback, since Payload's `ClubInfo` global is unedited — confirming the fallback path works, not just the happy path); roster detail page confirmed showing the exact backfilled season-stats values from Postgres; no new runtime errors in server logs |

**Files changed in round 3:** `src/collections/Rosters.ts`, `src/app/club-admin/(protected)/rosters/new/NewRosterForm.tsx`, `src/app/club-admin/(protected)/rosters/[id]/EditRosterForm.tsx`, `src/app/club-admin/(protected)/rosters/[id]/page.tsx`, `src/lib/club-admin/actions.ts`, `src/lib/cms-data.ts`, `src/types/index.ts`, `src/lib/seo.ts`, `src/app/[lang]/layout.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/CookieBanner.tsx` (new), `src/components/sections/ClubValues.tsx`, `src/components/sections/SponsorsStrip.tsx`, `src/app/[lang]/about/page.tsx`, `src/app/[lang]/contact/page.tsx`, `src/i18n/el.ts`, `src/i18n/en.ts`, `docs/CLUB_ADMIN_MANUAL.md`. Plus a temporary, never-committed backfill script (deleted immediately after running) and two hand-verified `ALTER TABLE` statements applied directly to the live database (documented above, same pattern as prior rounds).
