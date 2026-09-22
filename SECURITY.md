# Security

Vic Cameleers is a small business website, but it's also a cybersecurity portfolio piece, so
this document is written to be read by someone evaluating the actual controls, not just to
satisfy a checklist. It describes what's built, why, and what's still open. See `CLAUDE.md` for
the full project brief and `TODO-OWNER.md` for items that need a human decision or an account
that hasn't been provisioned yet.

## Reporting a vulnerability

Report it via [`/.well-known/security.txt`](/.well-known/security.txt) (RFC 9116), which points
to the current contact address, or call the number on the site. Please don't open a public GitHub
issue for anything that isn't already public.

## Architecture, in brief

- **Hosting**: Vercel (Next.js App Router, Node runtime for anything touching the database, Edge
  for middleware).
- **Database**: PostgreSQL via Neon, accessed through Prisma with the `pg` driver adapter.
- **Auth**: Better Auth, argon2id password hashing, mandatory TOTP 2FA for all staff, backed by
  the same Postgres database.
- **Public site**: mostly server components, minimal client JS, no staff-only data ever rendered
  on a public route.
- **Admin console**: mounted behind an env-configured `ADMIN_PATH` segment, everything under it
  requires a signed-in, active, 2FA-enrolled session with a role that satisfies the action.

## Threat model

The realistic threats for a business like this are: a public form being used to send spam or
scrape data, a staff account being phished or brute-forced, an admin session being hijacked, and
a dependency vulnerability being exploited before it's patched. This isn't a high-value target for
sophisticated attackers, so the controls below are proportionate to that, not enterprise-grade
defense in depth for its own sake.

## Authentication and session management

- Passwords are hashed with **argon2id** (`src/lib/auth.ts`), not Better Auth's default hasher.
  Staff accounts are created by `scripts/seed-admin.ts` (first super admin) or from
  `/admin/staff` (SUPER_ADMIN only); there's no public sign-up endpoint.
- **TOTP 2FA is mandatory**, but enforced at the application level rather than by the auth
  library itself: Better Auth can only challenge 2FA for an account that already has it enabled,
  so a session with `twoFactorEnabled: false` is redirected to `/setup-2fa` before it can reach
  any other admin page (`src/lib/rbac.ts`). Backup codes are issued at enrollment.
- Sessions are `HttpOnly`, `SameSite=Strict`, `Secure` in production, with a rolling 30-minute
  idle refresh and an 8-hour absolute cap (`src/lib/auth.ts`).
- Sign-in attempts are rate limited per IP+email (Upstash sliding window,
  `checkAdminLoginRateLimit`), and Better Auth's own account-level lockout kicks in after 5
  consecutive failed 2FA verifications.
- Deactivating a staff member (`isActive: false`) is checked on every sign-in attempt and on
  every session read, so revoking access takes effect on the next request, not the next login.

## Authorization

- A single linear role hierarchy (`SUPER_ADMIN > OPERATIONS_MANAGER > DISPATCHER > SALES >
FINANCE > SUPPORT > CREW`, `src/lib/role-hierarchy.ts`, unit tested) backs `requireRole()` and
  `requireAnyRole()`. Every admin page and every mutating server action calls one of these
  directly, they don't rely solely on the UI hiding a button.
- Crew accounts are excluded from the general admin console entirely (Section 10 of `CLAUDE.md`)
  and are scoped to their own assigned jobs, once that view is built.
- The `ADMIN_PATH` segment is obscurity, not security: middleware rewrites it to the internal
  `/admin/*` routes and 404s a direct guess at the literal path, but the actual gate is the
  session + role check above, which runs regardless of which path got you there.

## Input validation and output handling

- Every form and every server action validates its input with **Zod** before touching the
  database, shared between the client-side React Hook Form and the server (`src/lib/validation/*`).
- The two `dangerouslySetInnerHTML` uses in the codebase are both JSON-LD structured data
  (`src/components/seo/json-ld.tsx`), built from `JSON.stringify()` with `<` escaped to
  `<` so a string field can never break out of the `<script>` tag. Nothing else in the
  codebase uses `dangerouslySetInnerHTML`.
- No SQL is written by hand; every query goes through Prisma's generated client.

## Transport and headers

Set in `src/middleware.ts` on every response:

- `Content-Security-Policy`, nonce-based for scripts (no `unsafe-inline`), `frame-ancestors 'none'`
- `Strict-Transport-Security` (`max-age=63072000; includeSubDomains; preload`)
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive `Permissions-Policy`
- `X-Robots-Tag: noindex, nofollow` on the admin path prefix

HTTPS itself is a Vercel platform default once the site is actually deployed there (see
`TODO-OWNER.md`, not live yet).

## Bot protection and rate limiting

- **Cloudflare Turnstile** on the quote and contact forms, plus a honeypot field. In development,
  without `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set, the widget auto-supplies a bypass token and the
  server mirrors that by skipping verification - this only happens when the secret isn't
  configured at all, never in an environment that has it (`src/lib/turnstile.ts`).
- **Upstash Redis** sliding-window rate limits on the quote API, contact API, and staff login.
  Falls back to allowing all requests with a console warning if Upstash isn't configured, which
  is only acceptable for local development, not production (see `TODO-OWNER.md`).
- The three `/api/cron/*` endpoints require `Authorization: Bearer $CRON_SECRET`
  (`src/lib/cron-auth.ts`) and refuse the request outright if `CRON_SECRET` isn't set, rather than
  running unauthenticated. Each wraps its work in try/catch so a single bad row can't silently
  kill the whole run, and logs a structured `CRON_STARTED`/`CRON_COMPLETED`/`CRON_FAILED` event
  (`src/lib/cron-log.ts`, captured by Vercel's log pipeline).
- `email-retry` specifically claims each row it's about to retry with a conditional
  `FAILED -> QUEUED` update before acting on it, so if the same cron ever ran twice concurrently
  (Vercel doesn't normally do this, but a manual trigger could race the real one), only one
  invocation can win that row - no email gets sent twice for the same original failure.

## Audit logging

Every mutating admin action (lead status/notes/conversion, truck and crew management, job status,
reviews, settings, staff management) writes an entry to `AuditLog` via `src/lib/audit-log.ts`:
who, what, when, and a before/after snapshot where relevant. Viewable at `/admin/audit-log`
(OPERATIONS_MANAGER and above). A successful staff sign-in also logs a `staff.login` entry
(`src/lib/auth.ts`'s `session.create` hook) - it only fires once auth is fully complete, 2FA
included where enabled, since the 2FA challenge step uses a short-lived cookie rather than a
real session.

## Error handling

Every API route that touches the database (`/api/quote`, `/api/contact`, all three
`/api/cron/*`) wraps its work in try/catch: the real error is logged server-side
(`console.error`, captured by Vercel), and the client only ever gets a generic message
("Something went wrong saving your quote, please call us instead", "Cron job failed"). No route
in this codebase echoes a raw Prisma error, stack trace, or environment variable back to the
client - audited directly by grepping for `error.message` and similar patterns reaching a
response body. The one place server errors ARE detailed to the client is Zod validation
responses (`{ error: "Invalid submission", issues: [...] }`), which is intentional and safe:
those describe problems with the client's own submitted input (a bad email format, a missing
field), not server internals.

Admin Server Actions don't have explicit try/catch around their Prisma calls; an uncaught
exception there is handled by Next.js itself, which strips the message/stack from a Server
Action error before it reaches the client in production and replaces it with a generic message
plus a correlation digest. That's a framework guarantee, not something this codebase has to
implement itself, so it wasn't duplicated - but it does mean those errors show as a hard failure
rather than a graceful inline message today, which is a UX gap, not a security one.

## Secrets

All secrets live in environment variables (`.env` locally, Vercel project env vars in
production), validated at startup by `src/env.server.ts` / `src/env.client.ts` (the latter
guarded by `client-only` so a server secret can't accidentally end up in the client bundle).
`LEAD_NOTIFY_EMAIL`, the internal staff-alert address, is explicitly never rendered client-side
or in structured data. Nothing in this repo logs a secret value; error logging captures messages
and stack traces only.

## Dependencies

- `pnpm audit` is run manually before releases today; see `.github/workflows/ci.yml` for the
  automated version and `.github/dependabot.yml` for update PRs.
- `.github/workflows/codeql.yml` runs GitHub's static analysis on every push to `main` and on
  pull requests.

## What's intentionally not built yet

These are tracked, not overlooked:

- File upload safety (MIME/magic-byte checks, size limits) for quote photo uploads - the upload
  feature itself isn't built yet.
- A signed-token public review submission flow - reviews today are entered by staff via the admin
  console or imported manually.
- Full production hardening (Vercel Firewall rules, Vercel Bot Protection, Sentry or another error
  monitor) - these are dashboard/account configuration, not code, and need the actual Vercel
  project and accounts provisioned first (`TODO-OWNER.md`).
- Database backups and a tested restore - a Neon platform feature, needs Neon provisioned first.
- A CSRF token on non-Better-Auth state-changing requests. Next.js Server Actions get origin
  checking from the framework itself, and Better Auth checks origin on its own routes, so this is
  covered for everything currently built, but hasn't been independently verified end to end
  against a live deployment.

## For anyone reviewing this as a portfolio piece

The interesting parts to look at are `src/lib/rbac.ts` and `src/lib/auth.ts` (how mandatory 2FA
is enforced around a library that doesn't do that by default), `src/middleware.ts` (the
ADMIN_PATH rewrite plus CSP nonce plumbing), and `src/lib/booking-conflicts.ts` (a small, deliberately
pure, unit-tested function kept separate from its Prisma-querying caller specifically so the
conflict logic itself is trivially testable).
