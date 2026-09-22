# Vic Cameleers

Website and internal operations platform for Vic Cameleers, a Melbourne removalist business.
Next.js (App Router) + PostgreSQL (Neon) + Prisma, hosted on Vercel.

See [`CLAUDE.md`](./CLAUDE.md) for the full project brief, architecture decisions, and build
checklist. See [`TODO-OWNER.md`](./TODO-OWNER.md) for everything that needs a human decision or
an account that isn't provisioned yet. See [`SECURITY.md`](./SECURITY.md) for the security
architecture and threat model.

## Stack

- Next.js 16 (App Router, TypeScript strict), Tailwind CSS, shadcn/ui
- PostgreSQL via Neon + Prisma (driver adapter, `@prisma/adapter-pg`)
- Better Auth (staff login, argon2id, mandatory TOTP 2FA)
- Zod (shared client/server validation), React Hook Form
- Resend + React Email (transactional email), Vercel Cron (reminders, review requests, email retry)
- Upstash Redis (rate limiting), Cloudflare Turnstile (bot protection)
- Vitest (unit tests), Playwright (end to end)

## Local setup

```bash
pnpm install
cp .env.example .env
```

Fill in `.env`. At minimum, for the site to boot in development:

- `DATABASE_URL` / `DIRECT_URL` - a local or Neon Postgres connection string. Without a reachable
  database, most pages still render (they catch DB errors and fall back gracefully), but nothing
  that reads or writes data will work for real.
- `AUTH_SECRET` - generate with `openssl rand -base64 32`. Required for the admin console to boot
  at all (`src/lib/auth.ts` throws a clear error otherwise).
- `ADMIN_PATH` - any random, non-guessable segment (never `admin`). Required for the admin console
  to be reachable at all (`src/lib/rbac.ts` throws otherwise). Never reuse the production value in
  a place it could leak; it's obscurity, not the real access control (see `SECURITY.md`).

Everything else (Resend, Turnstile, Upstash, Vercel Blob, Google Maps, Stripe) is optional in
development: each integration degrades gracefully and logs a console warning when its env vars
aren't set, rather than crashing.

```bash
pnpm db:generate   # generate the Prisma client
pnpm db:migrate     # run migrations against DATABASE_URL (needs a real, reachable database)
pnpm db:seed        # seed BusinessSettings, PricingSettings, Services, Trucks
pnpm seed:admin      # create the first SUPER_ADMIN staff account (interactive, masked password)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, and
`http://localhost:3000/<ADMIN_PATH>/login` for the admin console.

## Scripts

| Command            | What it does                                          |
| ------------------ | ----------------------------------------------------- |
| `pnpm dev`         | Start the dev server (Turbopack)                      |
| `pnpm build`       | Production build                                      |
| `pnpm start`       | Run a production build locally                        |
| `pnpm lint`        | ESLint                                                |
| `pnpm typecheck`   | `tsc --noEmit`                                        |
| `pnpm format`      | Prettier, writes changes                              |
| `pnpm test`        | Unit tests (Vitest)                                   |
| `pnpm test:e2e`    | End-to-end tests (Playwright) - see note below        |
| `pnpm db:generate` | Regenerate the Prisma client after a schema change    |
| `pnpm db:migrate`  | Run Prisma migrations (`prisma migrate dev`)          |
| `pnpm db:studio`   | Prisma Studio                                         |
| `pnpm db:seed`     | Seed business settings, pricing, services, trucks     |
| `pnpm seed:admin`  | Interactive CLI to create/reset a SUPER_ADMIN account |

A pre-commit hook (Husky + lint-staged) runs ESLint and Prettier on staged files automatically.

### End-to-end tests

`tests/e2e/` covers the quote flow, contact form, admin login and RBAC redirects, and automated
accessibility checks (axe-core) on the public pages. Two specs
(`lead-status-change.spec.ts`, `booking-creation.spec.ts`) need a live, seeded database with a
known staff account and lead; they self-skip unless `PLAYWRIGHT_SEEDED_DB=1` is set (see the
comment at the top of each file for what else to seed).

```bash
pnpm exec playwright install chromium   # once, downloads the test browser
pnpm test:e2e
```

## Deploying (go-live checklist)

Most of this is one-time setup, done once by whoever owns the Vercel/Neon/etc accounts. See
`TODO-OWNER.md` for the full list; the short version:

1. **Provision accounts**, all under a business Google account with 2FA on: Vercel, Neon (via the
   Vercel Marketplace, `ap-southeast-2` region), Upstash Redis (via Vercel Marketplace), Resend,
   Cloudflare Turnstile, Google Cloud (Maps Platform), and buy the domain.
2. **Connect the GitHub repo to Vercel** for automatic preview deployments per branch.
3. **Set every env var** from `.env.example` in the Vercel project (Production and Preview).
   Generate fresh `AUTH_SECRET` and `CRON_SECRET` values for production, don't reuse local ones.
   Choose a production `ADMIN_PATH` (again, never reuse a value that's appeared anywhere public).
4. **Run migrations** against the real database: `pnpm db:migrate` with `DATABASE_URL`/`DIRECT_URL`
   pointed at Neon, then `pnpm db:seed`.
5. **Create the first admin**: `pnpm seed:admin`, then log in at
   `https://<domain>/<ADMIN_PATH>/login` and set up 2FA immediately, it's mandatory.
6. **Verify Vercel Cron Jobs are enabled** on the project (see `vercel.json` for the schedule:
   move reminders and review requests run daily, the email retry queue every 6 hours).
7. **DNS**: point the domain at Vercel, set up the mailbox (Google Workspace/Zoho) with SPF/DKIM/
   DMARC, and verify Resend's sending domain. See `TODO-OWNER.md` for the exact record sequence.
8. **Submit a real test quote end to end** on production and confirm both the customer and staff
   alert emails arrive before calling it launched.

## Project structure

```
src/app/(marketing)/    Public marketing pages (App Router route group)
src/app/admin/          Admin console, mounted behind ADMIN_PATH via middleware rewrite
src/app/api/            Route handlers: auth, quote, contact, cron jobs, CSV export
src/components/         UI components, grouped by feature (admin, marketing, quote, ui, ...)
src/config/             Business facts, services, pricing defaults, nav, FAQ - single source of truth
src/content/            Suburb and guide article content (typed TS, not MDX - see CLAUDE.md section 5)
src/lib/                Business logic: pricing engine, auth, rbac, email, validation schemas
prisma/                 Schema, seed script
tests/unit/             Vitest unit tests
tests/e2e/               Playwright end-to-end tests
```
