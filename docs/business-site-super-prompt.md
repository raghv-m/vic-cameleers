# Super prompt: service-business website + lead engine + admin console

Reusable for any local service business (removalists, cleaners, trades, landscapers, detailers…).
Built from the Vic Cameleers project, with every hurdle we hit fixed up front.

## How to use it

1. **Do the 20-minute setup first (Part A).** Almost every delay last time was a missing account,
   key or login. Doing these before Claude starts means it never has to stop and wait.
2. Fill in the **business brief (Part B)**. Leave anything you don't know as `UNKNOWN`; Claude will
   build it as an editable setting and never guess.
3. Make an empty folder, open Claude Code in it, and paste **Part C** with your brief filled in.

---

## Part A: setup checklist (do before pasting the prompt)

Tick each one. Use a business Google account and turn on 2FA everywhere.

- [ ] **GitHub:** empty repo created. Run `winget install GitHub.cli` (Windows) or `brew install gh`, then `gh auth login`.
- [ ] **Vercel:** account + `npm i -g vercel` then `vercel login`. Import the empty GitHub repo as a project.
- [ ] **Database:** Vercel → Storage → Neon Postgres, **region closest to customers** (Australia: Sydney `ap-southeast-2`). Connect it to the project.
- [ ] **Domain** (recommended before launch): buy it and add it to the Vercel project. Needed for real email sending.
- [ ] **Resend:** account, verify the domain (DNS records), create an API key.
- [ ] **Cloudflare Turnstile:** add a site (your domain + `localhost`), copy site key + secret.
- [ ] **Upstash Redis:** via Vercel Marketplace (sets its own env vars).
- [ ] **Google Maps** (optional): Maps JavaScript API + Places API (New) enabled, key restricted to your domain + `localhost:3000`, budget alert on.
- [ ] **Sentry** (optional): project created, copy the DSN.
- [ ] **Vercel env vars** set for Production and Preview (Claude will generate the random ones for you):
      `NEXT_PUBLIC_SITE_URL` (https, no trailing slash), `AUTH_SECRET`, `ADMIN_PATH` (a random word),
      `CRON_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `LEAD_NOTIFY_EMAIL`, Turnstile keys, Maps key, `SENTRY_DSN`.
- [ ] Photos: not needed to start. Claude builds labelled placeholders and gives you a shot list.

---

## Part B: business brief (fill in)

```
BUSINESS
Trading name:
Legal name / ABN / ACN (or local equivalent):
Base suburb / city:
Service area (and where you DON'T go):
Phone (display + international format):
Public email:
Ops email for new-lead alerts (private, never shown on the site):
Domain:

OFFER
Services (list; mark any "only sometimes"):
Pricing model (hourly / fixed / per item / quote-only):
Rates, minimums, call-out or travel fees:
GST included? (yes / no / UNKNOWN):
What changes the price (size, access, distance, extras):
Equipment / fleet:
Team size:
Hours of operation:
Payment methods:
Cancellation / rescheduling terms:
Insurance / licences / memberships (only if real, with details):

BRAND
Story or name meaning (optional):
Colours or vibe (e.g. "earthy, trustworthy, not corporate"):
Competitors to look different from:
Real reviews you can use (paste with names/permission) or NONE:

LAUNCH SUBURBS / AREAS FOR LOCAL SEO PAGES:
```

---

## Part C: the prompt (paste into Claude Code)

```
You are building a production website, lead engine and admin console for a local service business,
deployed on Vercel. Read this whole prompt first. Create CLAUDE.md in the repo root from it and keep
its checklists updated as the single source of truth ([ ] todo, [~] in progress, [x] done and
verified, [!] blocked on the owner, with the reason).

<<PASTE THE FILLED-IN BUSINESS BRIEF HERE>>

## Working rules
- Work phase by phase (below). Show a short plan before each phase, then build without stopping
  for approval on routine decisions; only stop for decisions that are genuinely mine, and batch
  those questions together.
- After every item: typecheck, lint, unit tests, `next build`, and click through it in a LOCAL
  PRODUCTION BUILD (next build && next start) in the browser. Mark [x] only when that passes.
- One commit per item, conventional messages. Push to a working branch; fast-forward main after
  each verified item (main deploys to production).
- Never invent facts: no fake reviews, ratings, stats, years in business, insurance, licences,
  hours, response times or local facts. Missing facts become editable settings, hidden until set.
  Prices are always labelled as estimates with their assumptions shown.
- Missing real assets (photos, logo, footage): build labelled placeholders, never stock photos of
  someone else's business. At the end, write docs/image-list.md: exact filenames, sizes, what to
  shoot, where each appears, how to plug it in.
- Plain, friendly, local English (match the business's country). No em dashes in site copy.
- Secrets only in env vars, never in code, logs or the client bundle. No personal data in logs
  (use ids and reference numbers). Don't print secret values back to me.
- If a command needs my login or a password typed, tell me the exact command to run myself.

## Stack (use these unless the brief says otherwise)
Next.js App Router (latest) + TypeScript strict, Tailwind + shadcn/ui, Prisma + Postgres (Neon),
Zod on every input (shared client/server), Better Auth for staff (argon2id, mandatory TOTP 2FA,
roles), Resend + React Email, Cloudflare Turnstile + honeypot, Upstash rate limiting, Vercel Cron,
Vercel Analytics + Speed Insights, Sentry (server side, off until SENTRY_DSN is set), Vitest.
Native CSS/Web APIs for motion (IntersectionObserver, scroll-driven animations, View Transitions);
no Framer Motion, GSAP or Lottie unless I ask.

## Known pitfalls: get these right the first time
- Env validation must not crash builds: read env lazily; create the DB client on first use; the
  proxy/middleware must not depend on DB env vars.
- NEXT_PUBLIC_SITE_URL: production builds must fail loudly if it's empty/http/localhost; previews
  fall back to their own URL.
- Create Prisma migrations from day one (prisma/migrations committed), never db push only.
- Admin lives under a secret ADMIN_PATH that the proxy rewrites to /admin; literal /admin 404s.
  Therefore EVERY internal admin link and redirect goes through one adminUrl() helper. Never
  hard-code "/admin/..." in hrefs (revalidatePath uses the internal /admin route).
- Server components may only pass SERVER ACTIONS to client components, never inline arrow
  functions. Grep for `={(` in server pages before finishing.
- CSP: nonce-based on form/admin pages, static elsewhere; include every third-party host you add
  (Turnstile, Google Maps script + places.googleapis.com connect, Sentry if client-side).
- Vercel Cron runs in UTC: schedule both possible UTC hours and check the local hour in code if
  daylight saving matters. Protect every cron with CRON_SECRET; make them idempotent.
- Fixed-set DB enums (email types, statuses): design them to include what you'll need (e.g. an ops
  digest email type, a STALE lead status) so later features don't need schema changes.
- Content must never be hidden without JS: reveal animations only hide once JS runs, skip anything
  already on screen, and switch off under prefers-reduced-motion.
- Animations driven by requestAnimationFrame need a timeout fallback (background tabs pause rAF)
  and must clamp time at 0 (rAF timestamps can precede performance.now()).
- Chip/radio controls: autoComplete="off" so browser form restore can't desync React state.

## Phase 1: foundations
Scaffold, lint/format/pre-commit, env validation (split server/client), design tokens with WCAG AA
contrast tests (every text/background pair unit-tested), layout, header (full nav only where it
fits on one line), footer (legal ids, service area, Help links), mobile sticky call/quote bar,
security headers + CSP, Prisma schema + first migration + seed (settings, services, equipment).

## Phase 2: lead capture (deploy as soon as this works)
- Homepage: hero with the core promise + an instant estimate card using the real pricing engine
  (live range, "how we got this number" breakdown, a firmness meter that never says "accurate",
  inputs remembered locally). How it works, trust Q&A (only real claims), service area map,
  equipment/fleet explainer, brand story, final CTA with call/SMS/callback.
- Pricing engine in one module, fully unit-tested, all numbers from admin-editable settings.
- Quote wizard: 4 steps (where → what/size/access → when → contact), validation per step, sticky
  progress, draft saved locally (no contact details stored), resume banner, reference number,
  result screen with estimate + what happens next + .ics + copyable reference.
- Contact form. Both forms: Zod, Turnstile, honeypot, rate limit, DB transaction first, emails
  after commit, failed emails queued for a retry cron. Never lose a lead.
- Emails (customer received, staff alert, booking confirmed, reminders 7 days and 1 day, review
  request) with plain-text versions, every send logged.
- Legal pages: privacy (local privacy law), terms, cancellation policy (from my terms or clearly
  marked as placeholder for me to approve).
- SEO: unique titles/descriptions, canonical URLs, sitemap, robots (never list the admin path),
  LocalBusiness JSON-LD with real details only, FAQPage JSON-LD from one FAQ source, breadcrumbs,
  OG image, llms.txt.
- Optional: Google Places autocomplete (session tokens, region bias, plain-input fallback).

## Phase 3: admin console (roles enforced server-side on every page and action)
Login with mandatory 2FA, dashboard, leads (pipeline, search, filters, notes, activity timeline,
convert to booking), customers, bookings + week/month calendar + today's jobs with status updates,
equipment and staff/crew management, reviews moderation, settings (rates, business details,
services on/off), email log with resend, audit log, CSV export. Automations: stale leads to
follow-up, daily ops digest, reminders, review requests, email retry.

## Phase 4: local SEO + content
Location pages (one data file each, genuinely unique, unverified local claims flagged for me), a
dedicated /faq page (search, categories, deep links, FAQPage JSON-LD), 3-5 genuinely useful guides.

## Phase 5: polish and ops
Scroll reveals, page transitions, micro-interactions (all reduced-motion safe), /api/health,
structured JSON logs with request ids, Sentry, Lighthouse check, accessibility pass (labels,
aria-describedby on errors, keyboard, contrast).

## Hand-over (end of every phase and at the end)
Summarise what's live, what's placeholder, and exactly what I need to do (with commands). At the
end, write: README (setup, env vars, deploy), SECURITY.md, TODO-OWNER.md, docs/image-list.md, and
the admin quick-start (URL pattern, how to create the first admin with the seed script, 2FA).
```

---

## After launch (owner checklist)

- Create the first admin: `pnpm seed:admin` in your own terminal (it asks for a password), then log
  in at `https://<domain>/<ADMIN_PATH>/login` and set up 2FA.
- Google Business Profile, Search Console + sitemap, Bing Webmaster Tools.
- Ask the first five real customers for reviews; add them in admin.
- Shoot the photos on `docs/image-list.md`.
