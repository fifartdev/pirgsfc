<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Payload CMS gotchas (learned the hard way — read before touching Payload code)

## Relationship/upload field values must be `number`, not string

`payload.config.ts` uses the Postgres adapter with default (serial integer) IDs.
Payload's own relationship/upload validator (`isValidID`) requires
`typeof value === 'number'` for numeric-ID collections — a numeric **string**
like `"42"` is rejected with `"The following field is invalid: <label>"`.

Every Server Action in `src/lib/club-admin/actions.ts` that sets a
`relationship`/`upload` field (e.g. `featuredImage`, `profileImage`) reads the
ID from `formData.get(...)`, which is always a string. **Always convert with
`Number(...)` before passing it to `payload.create`/`payload.update`** — never
pass the raw string through. Plain `select` fields (e.g. `category` on Teams/
Leagues) are unaffected since their values are strings by design.

## CORS/CSRF origin allowlist must track Vercel's dynamic URLs

Payload's cookie auth (`payload.auth()` / the `/api/*` REST routes) silently
drops the JWT when the request's `Origin` header isn't in `payload.config.csrf`
— this doesn't throw a CSRF error, it manifests as a generic downstream
`Forbidden` ("You are not allowed to perform this action.") from whatever
access-control check runs next (e.g. Media's `create` check). A single static
`NEXT_PUBLIC_SERVER_URL` can't cover Vercel's per-deployment `*.vercel.app`
URLs, so `payload.config.ts` derives the allowlist from
`NEXT_PUBLIC_SERVER_URL` + `VERCEL_PROJECT_PRODUCTION_URL` + `VERCEL_URL`
(both auto-injected by Vercel, prefixed with `https://`) + localhost. Don't
revert this to a single hardcoded origin.

`NEXT_PUBLIC_SERVER_URL` must still be set explicitly in Vercel's project env
vars (Production) — it's independently used as Payload's `serverURL` config
(admin-panel/absolute URL generation), separate from the CORS/CSRF allowlist.

## Every club-admin mutation must revalidate the public site, not just itself

Payload's local API (`payload.create`/`payload.update`/`payload.delete`) writes
straight to Postgres — it doesn't go through Next's fetch cache, so Next has
no idea a public page's underlying data just changed. Calling
`revalidatePath("/club-admin/<collection>")` only busts the cache for the
admin panel's own list/detail views; the public `/[lang]/...` routes stay
stale until the next deploy unless something explicitly revalidates them too.

This bit us with News: an article published via club-admin didn't show up on
`/news` because `createNewsAction`/`updateNewsAction` only revalidated
`/club-admin/news`. Every mutating action in `src/lib/club-admin/actions.ts`
now also calls the shared `revalidatePublic(collection, extraPaths?)` helper,
which revalidates every public path in `PUBLIC_PATHS` for both locales (`el`,
`en`). **When you wire a new collection to a public page, add its paths to
`PUBLIC_PATHS`** — don't just add a new `revalidatePath("/club-admin/...")`
call and assume the public site will pick it up.

## Adding/changing a collection field needs a committed migration — it will not reach the database on its own

`payload.config.ts`'s `postgresAdapter` has no `migrationDir` override, so
schema sync relies entirely on Payload's `drizzle-kit push`. Push only runs
automatically when `NODE_ENV !== "production"` — it's silently skipped on
every Vercel build and at runtime. This means: editing a collection field in
`src/collections/*.ts` (adding, renaming, removing) changes what the *code*
expects, but does **nothing** to the actual database schema by itself. The
next request that touches that collection fails with a raw Postgres error
like `column news.featured does not exist` — not a Payload validation error,
a hard query failure across the whole collection (admin panel and public site
both break). This has already happened once (the News `featured` field).

**Use `npm run migrate*`, never the `payload` CLI bin directly.** Running
`node node_modules/.bin/payload migrate*` (or `npx payload migrate*`) crashes
with `ERR_REQUIRE_ASYNC_MODULE` on this repo's Node/tsx combo — the CLI's own
nested `tsx` synchronously `require()`s `@payloadcms/richtext-lexical` (ESM,
top-level await), which Node's `require(esm)` support does not allow. The
`migrate`/`migrate:create`/`migrate:status`/`migrate:deploy` npm scripts route
through `scripts/migrate.ts` instead, which calls the same
`payload.db.migrate()`/`createMigration()`/`migrateStatus()` local-API methods
the CLI would — proven working (same pattern `scripts/seed.ts` already uses:
top-level `import` executed via `-r tsx/cjs`, not the CLI entrypoint). If you
ever add a *new* migration-related npm script, wrap `scripts/migrate.ts`
rather than the CLI bin, or you'll hit the same crash.

**This database has never used tracked migrations — it's baseline is `push`.**
`payload_migrations` has exactly one row: `{name: "dev", batch: -1}`, which is
Payload's own marker for "schema was synced via push." Because of this, the
*first* `npm run migrate:create` on this DB doesn't generate a small diff —
`drizzle-kit` has no prior snapshot to compare against, so it generates a
migration that `CREATE TABLE`s **every** collection from scratch. Running that
file for real via `npm run migrate` would try to create tables that already
exist and fail (or worse). **Before running `npm run migrate` on a freshly
generated file, open it and confirm it's a small, targeted diff — if it's
recreating tables you know already exist, stop and don't run it.** The
`featured` field fix was applied by hand (a single `ALTER TABLE ... ADD
COLUMN IF NOT EXISTS`) instead of through this generated file, specifically
because of this. Establishing a real migration baseline for this project (so
future `migrate:create` runs produce small diffs) is unsolved — flag it if
you hit this again.

**Workflow for any field change**, once a baseline exists:
1. `npm run migrate:create -- <short-description>` — writes a migration file
   under `src/migrations/`. Requires `DATABASE_URI` (and `PAYLOAD_SECRET`) in
   `.env.local` pointing at the database you're diffing against (commonly the
   same one production uses — see the SSL-mode note below on keeping
   `.env.local` and Vercel's `DATABASE_URI` in sync).
2. Review the generated file (see baseline warning above) — it's the only
   record of what changed, and the thing that actually reaches the database.
3. Commit it. **You still need to do this even though the build applies
   migrations automatically (see below)** — without a committed migration
   file, there's nothing for the build to apply.

`package.json`'s `vercel-build` script (`npm run migrate:deploy && next
build`) runs migrations before every Vercel build, so once a migration file
is committed it applies itself on deploy — no manual `npm run migrate` against
production needed anymore. `migrate:deploy` intentionally skips
`--env-file=.env.local` (that file doesn't exist on Vercel; env vars are
already in `process.env` there). With no migration files present it's a safe
no-op (`"No migrations to run."`) — confirmed via a full local `npm run
vercel-build` against the real database.

**Caveat:** if Preview and Production share the same `DATABASE_URI` in
Vercel's project settings, migrations from *any* branch's preview build apply
to that shared database the moment the preview builds — before the PR is
reviewed or merged. Payload tracks applied migrations and skips ones already
run, so this won't error on a re-run, but it does mean an unreviewed branch
can alter the shared schema early. Give Preview its own database if that's a
problem.

## Postgres SSL mode

`DATABASE_URI` uses `sslmode=verify-full` (not `require`) — `pg-connection-string`
warns that `require`/`prefer`/`verify-ca` are deprecated aliases for
`verify-full` and will lose that meaning in a future major version. Keep both
`.env.local` and Vercel's `DATABASE_URI` env var in sync on this.
