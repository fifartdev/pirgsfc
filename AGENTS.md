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

## Postgres SSL mode

`DATABASE_URI` uses `sslmode=verify-full` (not `require`) — `pg-connection-string`
warns that `require`/`prefer`/`verify-ca` are deprecated aliases for
`verify-full` and will lose that meaning in a future major version. Keep both
`.env.local` and Vercel's `DATABASE_URI` env var in sync on this.
