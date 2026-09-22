# CLAUDE.md: Vic Cameleers Website and Operations Platform

> **How to use this file**
>
> 1. Create an empty folder, run `git init`, and save this file as `CLAUDE.md` in the root.
> 2. Open Claude Code in that folder.
> 3. Paste the **Kickoff Prompt** from Section 0.
> 4. Claude Code keeps every checklist in this file up to date. `[ ]` = not started, `[~]` = in progress, `[x]` = done and verified, `[!]` = blocked, needs owner.
> 5. Items marked **OWNER** need a human (Raghav or the business) and cannot be completed by Claude Code.

---

## 0. Kickoff Prompt (paste this into Claude Code)

```
Read CLAUDE.md completely before doing anything.

You are building the Vic Cameleers website and operations platform, hosted on Vercel.

Rules:
- Work phase by phase, milestone by milestone, in the order in Section 17.
- Before starting each milestone, show me a short plan (files, data model changes, key decisions) and wait for my approval.
- After finishing each item, run lint, typecheck and tests, then update its checkbox in CLAUDE.md to [x]. Only mark [x] if it actually works and is tested.
- If something needs a human decision, mark it [!], add it to TODO-OWNER.md, and continue with the next unblocked item.
- Never invent business facts, reviews, stats, insurance or licensing claims.
- Commit after each completed item with a conventional commit message.
- At the end of each milestone, give me a summary: what's done, what's blocked, what I need to do.

Start with Milestone 1A. First show me:
1. The full folder structure
2. The Prisma schema
3. The pricing estimator formula with 3 worked examples using the seeded values
4. Three hero headline options in the brand voice
Then wait for approval.
```

---

## 1. Business Facts (single source of truth)

Store in `src/config/business.ts` and the `BusinessSettings` table. Never hardcode these in components.

| Field             | Value                                                         |
| ----------------- | ------------------------------------------------------------- |
| Trading name      | Vic Cameleers                                                 |
| Legal entity name | `TODO_LEGAL_NAME` (likely "Vic Cameleers Pty Ltd") **OWNER**  |
| ABN               | 43 805 185 060                                                |
| ACN               | 702 456 988                                                   |
| Base suburb       | Cranbourne VIC                                                |
| Service area      | Greater Melbourne, Victoria only (no interstate yet)          |
| Phone             | 0481 950 085 (link `tel:+61481950085`)                        |
| Public email      | `TODO_PUBLIC_EMAIL` (e.g. hello@ on the new domain) **OWNER** |
| Domain            | `TODO_DOMAIN`, read from env `NEXT_PUBLIC_SITE_URL` **OWNER** |
| Fleet             | 6 tonne truck, 10 tonne truck                                 |
| Crew              | 10 movers                                                     |
| Hourly rate       | $120/hour                                                     |
| Minimum           | 2 hours                                                       |
| Call-out fee      | 45 minutes, charged at the hourly rate                        |

**Private:** new-lead alerts go to env `LEAD_NOTIFY_EMAIL`. This address must never appear on the public site, page source, structured data, or customer emails.

**Owner decisions still open** (build as editable settings, never guess in copy):

- [!] Is $120/hr GST inclusive? (`gstInclusive` setting) **OWNER**
- [!] Is $120/hr for 2 movers + 6t truck? Different rate for 10t truck or extra movers? **OWNER**
- [!] Public liability / goods in transit insurance? Details? **OWNER**
- [!] Which services do they actually offer (packing, storage, pianos, office)? **OWNER**
- [!] Cancellation and rescheduling terms **OWNER**
- [!] Accepted payment methods **OWNER**
- [!] Real truck, crew and team photos **OWNER**

---

## 2. Brand, Design and Copy

**Story:** Cameleers were Australia's original long-haul movers. In 1860 camels and cameleers landed at Port Melbourne to carry supplies for the Burke and Wills expedition, and for decades after they hauled goods across the country through tough conditions. Vic Cameleers brings that same reliability to Melbourne moves. Use it on the About page and as a quiet thread through the brand. Tasteful, never cartoonish.

**Visual:**

- Palette tokens: deep navy (primary), desert sand (surface accent), terracotta (CTAs), off-white, charcoal. Full dark mode.
- Fonts via `next/font`: strong condensed display for headings, clean sans for body.
- Logo placeholder: simple geometric camel line mark as SVG, easy to swap.
- Mobile first. Most customers are on phones.
- Subtle, fast motion. Respect `prefers-reduced-motion`.
- Must not look like a template. Clearly labelled placeholder slots for real photos.

**Copy:** plain, friendly, confident Australian English (colour, organise, removalists, suburb). Short sentences, no corporate filler. **No em dashes anywhere in user-facing copy.**

### Checklist

- [x] Design tokens (colours, type scale, spacing, radius, shadows) in Tailwind theme
- [x] Light and dark mode (palettes defined in `globals.css`; no theme toggle UI yet, not required by this item)
- [x] Logo SVG placeholder + favicon + app icons + manifest
- [~] Core UI components: Button, Input, Select, Checkbox, Radio cards, Stepper, Card, Badge, Accordion, Modal, Toast (all added via shadcn/ui except Stepper, which doesn't exist as a registry component and will be hand-built in the quote flow milestone where it's actually used)
- [x] Header with nav + phone + CTA, mobile menu
- [x] Footer with ABN, ACN, service areas, legal links, contact
- [x] Sticky mobile bar: "Call" and "Get estimate"
- [ ] Copy audit: no em dashes, Australian spelling, no unverified claims (ongoing — most page copy doesn't exist yet)

---

## 3. Honesty and Compliance Rules (non-negotiable)

- No fake reviews, ratings, review counts, or testimonials. Empty state: "We're new. Be one of our first reviews."
- No invented stats. Stats come from config and stay hidden while empty.
- Never claim "fully insured", "licensed", "accredited", "police checked", or memberships unless the matching config flag is true with supporting detail.
- Price estimates always labelled as estimates, with assumptions shown.
- No invented local facts on suburb pages.
- Prices displayed consistent with Australian Consumer Law (total price, GST treatment clear once confirmed).

### Australian-specific checklist

- [ ] Australian mobile and landline validation and formatting (display `0481 950 085`, store E.164)
- [ ] Address autocomplete restricted to Australia, capture suburb, state, postcode
- [ ] Postcode/suburb data for Victoria service-area checks (warn if outside Greater Melbourne)
- [ ] GST display driven by `gstInclusive` setting
- [~] ABN and ACN in footer, contact page, and schema (`taxID`) — visible in the footer on every page; JSON-LD `taxID` lands with the Section 13 SEO work
- [x] Privacy Policy aligned with the Australian Privacy Principles (what's collected, why, storage location, access and correction, contact)
- [x] Terms and Conditions
- [x] Cancellation and rescheduling policy page
- [ ] Consumer-law-friendly wording (no misleading claims, clear pricing)
- [ ] Insurance information section (only shown when config is filled)
- [ ] Service-area restriction clearly stated (Victoria only)
- [ ] Consent checkbox on every form linking to privacy policy

---

## 4. Tech Stack (Vercel-hosted)

- **Next.js (App Router, latest stable) + TypeScript strict**, server components by default, minimal client JS on marketing pages
- **Tailwind CSS** + **shadcn/ui** (admin and form components)
- **PostgreSQL** via **Neon** (Vercel Marketplace integration, Sydney region `ap-southeast-2`) + **Prisma**
- **Zod** for all validation, shared client and server
- **Resend** + **React Email** for transactional email
- **Cloudflare Turnstile** on all public forms (works without Cloudflare DNS)
- **Upstash Redis** (Vercel Marketplace) for rate limiting
- **Vercel Blob** for quote photo uploads
- **Vercel Cron Jobs** for reminders, review requests, email retries
- **Vercel Web Analytics** (`@vercel/analytics`) + **Vercel Speed Insights** (`@vercel/speed-insights`)
- **Vercel Firewall** for WAF rules, bot protection and rate limits at the edge
- **Auth.js (or Better Auth)** for staff login: argon2id hashing, mandatory TOTP 2FA
- **Google Maps Platform**: Places Autocomplete (AU only) + Routes/Distance Matrix for travel time
- **Stripe** (Phase 2) for deposits and payments
- **SMS provider** (Phase 2, e.g. Twilio or an Australian provider)
- **Vitest** (unit), **Playwright** (end to end)
- pnpm, ESLint, Prettier, conventional commits, GitHub repo connected to Vercel

### Environment variables (`.env.example`, never commit secrets)

```
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SITE_URL=
RESEND_API_KEY=
EMAIL_FROM=
EMAIL_REPLY_TO=
LEAD_NOTIFY_EMAIL=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
BLOB_READ_WRITE_TOKEN=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
GOOGLE_MAPS_SERVER_KEY=
AUTH_SECRET=
ADMIN_PATH=
CRON_SECRET=
GOOGLE_REVIEW_URL=
STRIPE_SECRET_KEY=            # Phase 2
STRIPE_WEBHOOK_SECRET=        # Phase 2
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # Phase 2
```

### Setup checklist

- [x] Next.js + TypeScript strict + Tailwind + shadcn/ui scaffold
- [x] ESLint, Prettier, lint-staged, Husky pre-commit
- [~] Prisma connected to Neon, migrations working (full schema written and validated against the pg driver adapter and Neon's pooled/direct URL split; `prisma/seed.ts` confirmed to parse, resolve, and reach the DB layer correctly; no real Neon project provisioned yet, so no migration has actually run against a live database) **OWNER for Neon provisioning**
- [x] Seed script: business settings, pricing settings, services, trucks (`prisma/seed.ts`) and first super admin via interactive CLI with masked password entry, never hardcoded (`scripts/seed-admin.ts`) — logic verified, full run pending a live database
- [x] `.env.example` complete
- [x] Env validation at startup with Zod (split into `src/env.server.ts`, guarded by `server-only`, and `src/env.client.ts`, guarded by `client-only`, so secrets can't leak into the client bundle even by accident)
- [!] GitHub repo connected to Vercel, preview deployments per branch **OWNER**
- [!] Vercel env vars set for Production and Preview **OWNER**

---

## 5. Public Site Pages

```
/                               Home
/about                          Our story + team
/how-it-works
/services                       Services hub
/services/house-removals
/services/apartment-removals
/services/office-removals       Commercial / office relocation
/services/local-removals
/services/furniture-removals    Single items, marketplace pickups
/services/packing               Packing and unpacking
/services/storage               Only if offered (config flag)
/services/heavy-items           Pianos, safes, pool tables (config flag)
/services/same-day-removals     "Your mover cancelled? Call us."
/pricing                        Rates, worked examples, calculator
/quote                          Multi-step quote flow
/removalists                    Service areas hub (map + suburb list)
/removalists/[suburb]           Suburb pages
/reviews
/faq
/guides                         Moving guides / blog (MDX)
/guides/[slug]
/contact
/privacy
/terms
/cancellation-policy
/my-move                        Customer portal (Phase 2)
```

Services are config-driven so they can be switched on or off without code changes. Disabled services return 404 and drop out of nav and sitemap.

### Homepage structure

1. Hero: headline about Melbourne removalists who show up on time and look after your things. Sub: based in Cranbourne, moving homes and businesses across Melbourne. CTAs: "Get an instant estimate" + "Call 0481 950 085".
2. Trust strip: ABN shown, transparent hourly rate, 6t and 10t trucks, local Cranbourne crew (verified items only)
3. Services grid
4. Pricing teaser: "$120/hr. 2 hour minimum. No surprises." + mini calculator
5. How it works: Tell us about your move, Get your estimate, Pick your date, We move you
6. Why Vic Cameleers (story in two lines + differentiators)
7. Service areas map + top suburbs
8. Reviews (real only, or empty state)
9. Moving timeline (what happens from booking to moving day)
10. FAQ (8 to 10: minimum charge, call-out fee, what's included, stairs, parking, cancellations, what we don't move, payment, insurance)
11. Final CTA: "Ready to move? Get your free estimate"

### Trust section checklist

- [x] Google reviews / real testimonials block (empty state until real)
- [x] Review count (only when real — currently hidden, correctly)
- [x] Years in business / moves completed (hidden until real numbers exist)
- [x] Insurance information (hidden until confirmed)
- [x] ABN / ACN visible
- [ ] Real team photos slot (not yet — homepage currently uses icons, not photo placeholders)
- [ ] Real truck photos slot (same as above)
- [x] Base location (Cranbourne, service-area business)
- [x] Industry memberships (hidden until real)
- [x] Payment methods (not shown, correctly, since the accepted methods are still unconfirmed)
- [~] Secure booking indicators (privacy link is live in the footer; HTTPS depends on the Vercel deployment, not live yet; no card data is collected anywhere yet)

### Pages checklist

- [x] Home
- [x] About
- [x] How it works
- [x] Services hub + each service page (unique content, FAQs, CTA) (`/services`, `/services/[slug]`
      for each enabled service in `src/config/services.ts`; a disabled slug like `heavy-items` 404s)
- [~] Pricing (rate, minimum, call-out, 3 worked examples in plain text, calculator) (rate, minimum,
  call-out, and 3 worked examples computed live with the real pricing engine are on `/pricing`; no
  interactive calculator widget, that links out to `/quote` instead)
- [x] Quote
- [~] Service areas hub with map (`/removalists` lists all 21 launch suburbs; no interactive map,
  same as the homepage's service-areas section, both pending the Google Maps API key)
- [x] Suburb pages (Section 7)
- [x] Reviews (public `/reviews` reads real `Review` rows with status APPROVED; empty state until
      any exist, matching the honesty rule; the homepage's reviews section was also made live for
      the same reason, it used to be a hardcoded "we're new" regardless of real data)
- [x] FAQ (`/faq`, FAQPage JSON-LD; content now lives in `src/config/faq.ts`, shared with the
      homepage FAQ accordion so the two can't drift apart)
- [~] Guides index + MDX article template + 5 starter articles (cost guide, moving checklist,
  apartment moving tips, packing guide, hourly vs fixed price) (all 5 articles live at `/guides`
  and `/guides/[slug]`; built as typed TSX content under `src/content/guides/` rather than MDX,
  since no MDX toolchain was installed and this avoided adding one under time pressure - same
  frontmatter-equivalent fields, same routing, just not the file format CLAUDE.md named)
- [~] Contact (phone, email, form, service area) — hours not shown, unconfirmed (see TODO-OWNER.md)
- [x] Privacy, Terms, Cancellation policy
- [~] Custom 404 and error pages with quote CTA (`src/app/not-found.tsx` has the quote CTA; no
  custom `error.tsx` for runtime errors yet)
- [ ] Cookie / analytics consent notice if any non-essential tracking is added

---

## 6. Quote System (most important feature)

Full flow at `/quote`, compact version embeddable on home, service and suburb pages.

**Step 1, Where and when:** pickup address, drop-off address (Places autocomplete), optional extra stop, moving date, flexible date (no / within a week / any weekday), preferred start time (morning / midday / afternoon).

**Step 2, Property:** type (apartment, unit, townhouse, house, office, storage unit, single item), bedrooms (studio to 5+), pickup access (floor level, lift, stairs count, long carry, parking), same for drop-off, vehicle/truck access notes.

**Step 3, What's moving:** quick size picker (few items, 1 bed, 2 bed, 3 bed, 4+ bed), optional itemised inventory with counts (bed, fridge, washer, couch, dining table, wardrobe, TV, boxes, etc.), special items (piano, safe, pool table, gym gear, artwork), photo upload (up to 10, type and size validated, stored in Vercel Blob).

**Step 4, Extras:** packing, unpacking, disassembly/reassembly, boxes and materials, storage (if offered).

**Step 5, Contact:** name, mobile (AU validated), email, how did you hear about us, notes, privacy consent, Turnstile.

**Result screen:** reference number (e.g. `VC-2610-0042`), estimate range with plain-English maths, recommended truck and crew, note that the final price is based on actual time, "Call us now", "Add to calendar" (.ics). Alternative mode (setting): "Thanks, we'll call you shortly" without a price.

**Estimator** (`src/lib/pricing.ts`, fully unit tested):

- Inputs: size, inventory volume, access difficulty both ends, travel time between addresses, extras
- Outputs: low/high hours, recommended truck (6t / 10t), crew count
- `price = max(minimumHours, estHours) × hourlyRate + (calloutMinutes / 60) × hourlyRate + extras`
- All numbers from `PricingSettings`, editable in admin, seeded from Section 1
- Always a range, rounded to nearest $10

### Checklist

- [x] Multi-step form with progress indicator, back/next, validation per step
- [ ] State persisted in URL or local state so refresh doesn't lose progress (currently in-memory only, lost on refresh)
- [!] Places autocomplete AU-only for all addresses (plain text inputs for now) **OWNER for Google Maps API key**
- [!] Travel time lookup server-side (key never exposed), cached (every estimate assumes a fixed 20 minute trip until this exists) **OWNER for Google Maps API key**
- [ ] Service-area check with friendly message if outside Melbourne
- [ ] Inventory picker with counts (special items checkboxes exist; itemised bed/fridge/washer-style counts do not yet)
- [!] Photo upload to Vercel Blob with validation **OWNER for Vercel Blob store**
- [x] Pricing engine with unit tests (min charge, call-out, access, extras, rounding, truck choice)
- [ ] Draft saved server-side after Step 1 (abandoned quote tracking) — currently only submitted, completed quotes reach the database
- [x] Final submit creates Lead + Quote records (Customer and QuoteDraft too), verified up to the DB transaction; blocked on a live Neon database to run for real
- [x] Reference number generator (unique, readable)
- [x] Result screen with estimate, recommended truck/crew, next steps
- [x] .ics calendar download
- [ ] Compact embeddable quote widget
- [ ] Analytics events on every step (Section 12)
- [ ] Playwright test covering full happy path + validation errors

---

## 7. Suburb Pages (Local SEO)

Launch set, Cranbourne area first:
Cranbourne, Cranbourne East, Cranbourne North, Cranbourne West, Clyde, Clyde North, Berwick, Narre Warren, Narre Warren South, Hampton Park, Lynbrook, Lyndhurst, Pakenham, Officer, Dandenong, Keysborough, Frankston, Carrum Downs, Skye, Botanic Ridge, Langwarrin.

Then expand across Melbourne with the same template (inner city, east, north, west).

Rules:

- Content in `content/suburbs/*.mdx` with frontmatter (name, postcode, LGA, lat/lng, nearby suburbs, intro, FAQs)
- Each page genuinely unique: typical property types, access considerations, services available, nearby suburbs, suburb-specific FAQs, estimated travel time from Cranbourne base, quote CTA
- Drafted local claims marked `<!-- REVIEW -->` for human check. Never invent landmarks, council rules, or parking laws
- Links to 4 to 6 nearby suburbs and relevant services
- Unique titles, e.g. "Removalists Berwick | Local Movers from $120/hr | Vic Cameleers"

### Checklist

- [~] Suburb MDX schema and loader (typed TS content in `src/content/suburbs.ts` +
  `getSuburbBySlug`, not MDX, see the Section 5 guides note for why)
- [~] Suburb page template with embedded quote widget (`/removalists/[suburb]`; CTA links to
  `/quote` rather than an embedded widget, since the compact quote widget itself isn't built yet)
- [x] 21 launch suburb pages drafted (postcode and LGA sourced from public directories, not
      invented; every page renders a visible draft-content notice, see the next item)
- [ ] All `<!-- REVIEW -->` items checked **OWNER** (each suburb page shows a standing draft
      notice instead of inline comments, since there's no MDX; nothing here is verified firsthand)
- [~] Service areas hub with interactive map (`/removalists` lists all 21 suburbs; no interactive
  map, pending `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, same blocker as the homepage's map)
- [x] Nearby-suburb internal linking (4-6 real nearby suburbs per page based on actual adjacency)
- [x] Suburb pages in sitemap

---

## 8. Backend, API and Data

**Endpoints / server actions:** `POST /api/quote` (+ draft updates), `POST /api/contact`, `POST /api/review` (signed link from email, goes to moderation), `POST /api/upload`, `/api/cron/*` (protected by `CRON_SECRET`), `POST /api/stripe/webhook` (Phase 2).

**Submit order:** validate, save to DB in a transaction, then send emails. If email fails, lead stays saved and marked for retry by cron. **Never lose a lead.**

**Prisma models (Phase 1, designed so Phase 2/3 add without painful migrations):**
`User, Role, Session, TwoFactor, Lead, QuoteDraft, Quote, Customer, Booking, Job, Truck, CrewMember, Team, Review, Service, PricingSettings, BusinessSettings, EmailLog, AuditLog, Note, Attachment`
Phase 2+: `Payment, Invoice, Document, Message, SupportTicket, Route`

### Checklist

- [~] Prisma schema + migrations + indexes on status, dates, phone, email (schema complete with indexes; no migration has run against a live database yet) **OWNER for Neon provisioning**
- [x] Zod schemas shared across client and server (`src/lib/validation/*.ts`, used by both the React Hook Form instances and the API routes' `safeParse`)
- [x] Quote API with Turnstile, rate limit, honeypot, size limits
- [x] Contact API with same protections
- [ ] Review submission API with signed tokens
- [ ] Upload API with type/size checks
- [~] Transactional lead creation, email after commit (transaction done; email dispatch lands in the next milestone)
- [x] Email retry queue via Vercel Cron (`/api/cron/email-retry`, retries FAILED `EmailLog` entries
      from the last 48 hours via the shared `resendEmailLog` reconstruction)
- [ ] Request ID on every request, structured logging
- [ ] Lead source capture (UTM params, referrer, landing page) stored on lead (QuoteDraft has the columns; not populated yet)
- [x] Every quote automatically becomes a structured lead in the CRM (Section 10)
- [ ] Database backups verified (Neon point-in-time restore) **OWNER to confirm plan**

---

## 9. Notifications and Email

Sender: `Vic Cameleers <quotes@DOMAIN>`, reply-to the public inbox. React Email templates, branded, mobile friendly, plain-text fallback. Every send logged in `EmailLog`.

### Checklist

- [x] Customer: quote received (reference, move summary, estimate, next steps, phone)
- [x] Staff: new lead alert to `LEAD_NOTIFY_EMAIL` (all details, tap-to-call, and a "View in admin"
      link to the lead detail page once `ADMIN_PATH` is set)
- [x] Customer: contact form received
- [x] Staff: contact form alert
- [ ] Customer: quote reminder (if quoted but not booked after X days, setting)
- [x] Customer: booking confirmed (triggered from admin) ("Send confirmation email" button on the
      lead detail page's Booking card, calls `sendBookingConfirmation`)
- [x] Customer: 7-day reminder (`/api/cron/reminders`, checks bookings exactly 7 days out; see
      `vercel.json` for the schedule) **OWNER to verify Vercel Cron Jobs are enabled on the project**
- [x] Customer: 24-hour reminder (same cron, checks bookings exactly 1 day out; both reminder types
      share one `MoveReminderEmail` template and skip any booking that already has that reminder logged)
- [ ] Customer: moving-day "crew on the way" (manual trigger from admin in Phase 1)
- [ ] Customer: move completed / thank you
- [x] Customer: review request 1 day after Completed, links to `GOOGLE_REVIEW_URL` and on-site review
      form (`/api/cron/review-requests`; the on-site review form itself doesn't exist yet, see Section 8's
      "Review submission API with signed tokens", so this only links to the Google review URL, and only
      once one is set in Settings)
- [ ] Payment receipt (Phase 2)
- [ ] SMS versions of key notifications (Phase 2)
- [ ] Unsubscribe / preference handling for non-transactional emails

---

## 10. Admin Console and CRM

Mounted at env `ADMIN_PATH` (non-obvious path). The obscure path only filters noise. Real security is authentication and authorisation.

**Roles (least privilege, enforced server-side on every action):**
`SUPER_ADMIN → OPERATIONS_MANAGER → DISPATCHER → SALES → FINANCE → SUPPORT → CREW`
Crew only see their own assigned jobs.

**Lead pipeline:** `New → Contacted → Quoted → Follow-up → Booked → Completed → Lost` (with lost reason).

**Lead record example:** Lead #, customer, phone, move (from → to), date, property, services, lead source, status, estimate, notes, attachments, activity timeline.

**Dispatcher "Today's moves" view:** time, customer, from → to, team, truck, status (Scheduled, En route, Loading, In transit, Unloading, Completed).

### Phase 1 admin checklist

- [~] Staff login, TOTP 2FA enforced, recovery codes (Better Auth wired to Prisma with argon2id
  password hashing, disabled public sign-up, mandatory TOTP enrollment with QR + backup codes,
  app-level 2FA enforcement and role hierarchy in `src/lib/rbac.ts`, login rate limiting; role
  hierarchy unit tested; no live login has actually run, blocked on Neon provisioning)
  **OWNER for Neon provisioning**
- [x] Dashboard: new leads today/week, conversion rates, upcoming moves, revenue estimate (leads
      today/week, status breakdown, booked-lead conversion rate, upcoming-move count, and a rough
      revenue estimate summing booked leads' quoted ranges are all live)
- [~] Leads list: filters, search, sort, status pipeline (list + kanban) (search + status filter +
  newest-first list at `/admin/leads`; no kanban board yet)
- [~] Lead detail: all quote data, photos, notes, activity timeline, call/SMS/email buttons, convert
  to booking (quote/move data, photos, notes with add-note action, merged activity timeline,
  call/email quick links, and convert-to-booking with truck/crew assignment and double-booking
  prevention all done at `/admin/leads/[id]`; no SMS link)
- [ ] Abandoned quote drafts list (blocked: nothing creates an unsubmitted `QuoteDraft` yet, see the
      "Draft saved server-side after Step 1" item in Section 6, so this page would always be empty)
- [x] Customers list and detail (history of leads and bookings) (`/admin/customers` and
      `/admin/customers/[id]`; booking history renders correctly but has nothing to show until a
      booking is actually created)
- [~] Bookings: calendar view, assign truck and crew, double-booking prevention (`/admin/bookings`
  is a list view, soonest-first, not a calendar; truck/crew assignment and same-day double-booking
  prevention happen at conversion time in `src/lib/booking-conflicts.ts`, unit tested)
- [x] Today's moves dispatcher view with status updates (`/admin/bookings/today`, `JobStatusControl`
      drives `Job.status` through the Scheduled -> En route -> ... -> Completed states)
- [x] Trucks (6t, 10t) and crew members management (`/admin/trucks`, `/admin/crew`; add and
      activate/deactivate, gated to DISPATCHER and above)
- [x] Reviews: approve, hide, feature, add manually with source (`/admin/reviews`; status select,
      feature toggle, and a manual-entry form that saves as source MANUAL, status APPROVED)
- [x] Settings: pricing, business details, services on/off, Google review URL, estimate mode (price
      vs callback) (`/admin/settings`; writes the singleton `BusinessSettings`/`PricingSettings` rows;
      the base-hours-by-property-size table is edited as raw JSON rather than one input per size)
- [x] Email log with resend button (`/admin/emails`; resend reconstructs the original email from
      its related lead/booking via `src/lib/email/resend.ts`, only for the types that carry enough
      related data to rebuild - the ones actually sent today)
- [x] Staff user management with roles (`/admin/staff`, SUPER_ADMIN only; creates an account with a
      random one-time password shown once, matching `scripts/seed-admin.ts`'s credential shape; role
      change and activate/deactivate. No email invite flow, the password is shown in the admin UI only)
- [x] Audit log viewer (`/admin/audit-log`, OPERATIONS_MANAGER and above, most recent 300 actions
      with an expandable before/after diff)
- [x] CSV export (leads, bookings) (`/api/admin/export/leads`, `/api/admin/export/bookings`, linked
      from their list pages)

### Phase 2/3 admin checklist

- [ ] Quotes as separate formal documents (PDF) sent to customers
- [ ] Payments, deposits, refunds, outstanding balances
- [ ] Invoices (GST-compliant tax invoice)
- [ ] Documents per job
- [ ] Support tickets / messages
- [ ] Routes planning
- [ ] Analytics page inside admin (funnel, sources, revenue, cost per lead)
- [ ] Crew mobile view: today's jobs, start/finish, photos, customer signature

---

## 11. Security

This is also a cybersecurity portfolio piece, so treat it seriously and document it.

### Checklist

- [~] HTTPS everywhere (Vercel default) + HSTS (HSTS header set in middleware; HTTPS itself depends on the Vercel deployment, not live yet) **OWNER for deployment**
- [~] Secure authentication, argon2id password hashing (`src/lib/auth.ts` overrides Better Auth's
  default hasher with argon2id, matching `scripts/seed-admin.ts`; unverified against a live login)
- [~] MFA (TOTP) mandatory for all staff (Better Auth's twoFactor plugin + app-level enforcement
  in `src/lib/rbac.ts` that redirects any session without it to `/setup-2fa`; unverified live)
- [~] Role-based access control enforced server-side (role hierarchy + `requireRole`/`requireAnyRole`
  in `src/lib/rbac.ts`, unit tested; only the admin dashboard stub uses it so far, no lead/booking
  actions exist yet to gate)
- [~] Session management: HttpOnly, Secure, SameSite=Strict, idle and absolute timeouts (all set in
  `src/lib/auth.ts` session/advanced config); revoke on password change not independently verified
- [~] Login rate limiting + progressive lockout (flat 5-attempts/15-minute window per IP+email via
  Upstash, plus Better Auth's own account-level lockout on repeated failed 2FA codes; not
  progressive/exponential backoff)
- [~] CSRF protection on all state-changing requests (Better Auth's built-in origin checking covers
  `/api/auth/*`; no other state-changing admin endpoints exist yet to cover)
- [ ] Input validation (Zod) on every endpoint
- [ ] Output encoding, no `dangerouslySetInnerHTML` with user content
- [x] Security headers in middleware: CSP (nonce-based), X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- [~] Admin: `noindex, nofollow`, `X-Robots-Tag`, excluded from sitemap and robots (middleware sets `X-Robots-Tag` for the `ADMIN_PATH` prefix once that env var is set; sitemap/robots exclusion lands with the admin console itself in Milestone 1C)
- [ ] Rate limiting on all public APIs (Upstash) + Vercel Firewall rules
- [ ] Bot protection: Turnstile + honeypot + Vercel bot protection
- [ ] File upload safety: MIME and magic-byte check, size limit, randomised names, no execution
- [ ] Secrets only in Vercel env vars, never in code or logs
- [ ] PII minimisation, no card data ever stored (Stripe handles it in Phase 2)
- [~] Audit logs for all admin actions (who, what, when, IP, before/after) (`src/lib/audit-log.ts`,
  wired into every mutating admin action built so far: leads, bookings, trucks, crew, reviews,
  settings, and staff management; will need the same treatment on any future admin action)
- [ ] Database encryption at rest (Neon default) + TLS connections
- [ ] Regular backups and a tested restore
- [ ] Dependency scanning (Dependabot / `pnpm audit`) in CI
- [ ] Static analysis / vulnerability scanning in CI (e.g. CodeQL)
- [ ] Error monitoring and logging (Vercel logs, optional Sentry), alerts on spikes in errors or failed logins
- [ ] `SECURITY.md` documenting architecture, threat model, and controls
- [ ] `security.txt` at `/.well-known/security.txt`

---

## 12. Analytics (Vercel Web Analytics + Speed Insights)

- `<Analytics />` from `@vercel/analytics/next` and `<SpeedInsights />` from `@vercel/speed-insights/next` in the root layout
- Enable Web Analytics and Speed Insights in the Vercel project dashboard **OWNER**
- Custom events via `track()` from `@vercel/analytics`. Note: custom events need a paid Vercel plan. The DB funnel tracking below works on any plan, so build both.
- Also store funnel events server-side (`AnalyticsEvent` table) so the admin dashboard shows real conversion data

**Funnel:** Visitor → Quote started → Each step → Quote completed → Lead created → Contacted → Quoted → Booked → Paid → Completed → Reviewed

### Checklist

- [x] Vercel Web Analytics installed
- [x] Vercel Speed Insights installed
- [~] Events: `quote_started`, `quote_step_1..5`, `quote_completed`, `quote_abandoned`, `phone_click`, `email_click`, `contact_submitted`, `review_submitted` (`quote_completed` and `contact_submitted` logged; the rest need client-side instrumentation, not done yet)
- [ ] Lead source attribution (organic, Google Ads, social, referral, direct, Google Business Profile via UTM on GBP link)
- [x] Server-side funnel table (`AnalyticsEvent`); the admin funnel chart itself waits on the admin console (Milestone 1C)
- [ ] Metrics in admin: quote conversion, booking conversion, abandoned forms, phone clicks, revenue, cost per lead (manual ad spend input)
- [ ] Google Search Console verified **OWNER**
- [ ] Bing Webmaster Tools verified **OWNER**

---

## 13. SEO (Technical and Local)

### Checklist

- [x] Semantic HTML, one H1 per page, correct heading hierarchy
- [x] `generateMetadata` on every route that exists so far (unique title and description)
- [ ] Open Graph + Twitter/X cards, generated OG images per page
- [x] `sitemap.xml` generated from the routes that exist so far; grows as later milestones add more
- [x] `robots.txt` (blocks `/api/` and the admin path once `ADMIN_PATH` is set; no drafts route exists yet)
- [ ] Canonical URLs
- [x] JSON-LD `MovingCompany` / LocalBusiness: name, phone, `areaServed`, `priceRange`, `taxID` (geo and opening hours not included — no confirmed address/hours yet)
- [x] JSON-LD `Service` on service pages
- [x] JSON-LD `FAQPage` where eligible (dedicated FAQ page, every service page, every suburb page)
- [ ] JSON-LD `BreadcrumbList` + visible breadcrumbs
- [x] `aggregateRating` only once real reviews exist (currently omitted entirely, correctly)
- [~] Internal linking: services ↔ suburbs ↔ guides (suburb pages link to services and to
  `/guides`; guide articles link to relevant services and `/pricing`; the services hub doesn't
  link back out to suburbs or guides yet)
- [ ] Image optimisation: `next/image`, AVIF/WebP, lazy loading, descriptive alt text
- [x] Pricing page written in plain text so Google and AI assistants can quote it directly
- [x] `llms.txt` summarising the business, services, area and pricing (`/llms.txt`, generated from
      the same config and live `PricingSettings` as the rest of the site, can't drift out of sync)
- [ ] Google Business Profile set up as service-area business, linked with UTM **OWNER**
- [ ] Citations: True Local, Yellow Pages, hipages, Oneflare, Find a Mover, Yelp, Apple Business Connect, Bing Places (same name, phone, website everywhere) **OWNER**

---

## 14. Performance

### Checklist

- [ ] Lighthouse mobile 95+ on all marketing pages
- [ ] LCP < 2.5s, CLS < 0.1, INP < 200ms (verify in Speed Insights)
- [ ] Static generation / ISR for marketing, suburb and guide pages
- [ ] Minimal client JS on marketing pages
- [ ] Font subsetting and preloading via `next/font`
- [ ] Caching for travel-time lookups and settings
- [ ] DB indexes on hot queries
- [ ] Compression and CDN (Vercel default)

---

## 15. Accessibility

### Checklist

- [ ] WCAG 2.2 AA target
- [ ] Full keyboard navigation, visible focus states
- [ ] Labels on every input, errors linked with `aria-describedby`
- [ ] Colour contrast checked in light and dark mode
- [ ] Skip-to-content link
- [ ] Automated axe checks in Playwright

---

## 16. Payments, Customer Portal and AI (Phase 2 and 3)

### Payments (Stripe) checklist

- [ ] Deposit at booking (card, Apple Pay, Google Pay)
- [ ] Balance payment link after move
- [ ] Bank transfer option with reference
- [ ] Invoices and receipts (GST tax invoice)
- [ ] Refunds from admin
- [ ] Outstanding balance tracking
- [ ] Stripe webhook with signature verification

### Customer portal `/my-move` checklist

- [ ] Magic-link login (email) or reference + mobile verification
- [ ] Booking info: date, pickup time window, pickup and destination, status
- [ ] Quote and invoice, payment status
- [ ] Assigned team (first names only)
- [ ] Documents
- [ ] Messages with the office
- [ ] Reschedule and cancel requests (per policy)
- [ ] Move status updates

### AI features (Phase 3, useful, not gimmicks) checklist

- [ ] Inventory suggestions from uploaded photos, always shown as editable suggestions for the customer to confirm
- [ ] FAQ assistant grounded only in site content and settings
- [ ] Lead prioritisation hints in admin
- [ ] Email/message classification for the inbox
- [ ] Automated quote follow-up drafts (staff approve before sending)

---

## 17. Build Order and Milestones

### Phase 1: Launch

**Milestone 1A: Foundations**

- [~] Section 4 setup checklist (only Neon provisioning and Vercel/GitHub connection remain, both **OWNER**)
- [~] Section 2 design system (Stepper and the copy audit remain, both deferred to the milestones that actually need them)
- [x] Layout, header, footer, sticky mobile bar
- [x] Security headers middleware + env validation

**Milestone 1B: Lead capture live (deploy this as soon as it works)**

- [x] Homepage
- [x] Quote flow + pricing engine + tests
- [x] Contact page + form
- [x] Customer + staff emails for quote and contact
- [x] Privacy, Terms, Cancellation pages
- [x] Vercel Analytics + Speed Insights
- [x] Basic SEO (metadata, sitemap, robots, MovingCompany schema)
- [!] Deployed to Vercel production **OWNER to approve**

**Milestone 1C: Admin and CRM**

- [~] Auth with mandatory 2FA + RBAC (see Section 10 and 11 checklists; code complete and unit
  tested, live login flow blocked on Neon provisioning) **OWNER for Neon provisioning**
- [~] Leads, drafts, customers, lead detail, pipeline (see Section 10 checklist; abandoned drafts
  still blocked on step-1 draft persistence)
- [~] Bookings, trucks, crew, today's moves (see Section 10 checklist; bookings list has no
  calendar view yet)
- [x] Reviews moderation, settings, email log, audit log, CSV export (see Section 10 checklist)
- [x] Booking confirmation, reminders, review request emails + crons (see Section 9)

**Milestone 1D: Content and SEO**

- [~] All remaining pages (Section 5) (see Section 5 checklist; cookie consent notice not
  applicable yet, no custom `error.tsx`)
- [~] Suburb pages (Section 7) (see Section 7 checklist; owner review of drafted local facts
  still outstanding, as designed)
- [x] Guides + 5 starter articles
- [~] Full schema, OG images, internal linking, `llms.txt` (Service/FAQPage JSON-LD and `llms.txt`
  done; no OG images or BreadcrumbList yet)

**Milestone 1E: Hardening and QA**

- [ ] Full Section 11 security checklist
- [ ] Section 14 performance targets met
- [ ] Section 15 accessibility checks
- [ ] Playwright suite: quote flow, contact, admin login with 2FA, lead status change, booking creation
- [ ] `README.md`, `SECURITY.md`, `TODO-OWNER.md` complete

### Phase 2: Payments, portal, SMS

- [ ] Section 16 Payments
- [ ] Section 16 Customer portal
- [ ] SMS notifications
- [ ] Google reviews import

### Phase 3: Operations and AI

- [ ] Crew mobile view
- [ ] Routes, documents, support tickets
- [ ] Section 16 AI features

---

## 18. Go-Live Checklist (mostly OWNER, Claude Code writes the step-by-step guide in README)

### Domain (bought through Vercel)

- [ ] Domain purchased in Vercel and assigned to the project (check if Vercel sells .com.au; if not, buy .com.au at an Australian registrar using the ACN and point it to Vercel) **OWNER**
- [ ] `www` redirects to apex (or the reverse), one canonical host **OWNER**
- [ ] Extra domains (.au, .com) redirect to main **OWNER**

### Email (records added in Vercel DNS)

- [ ] Google Workspace (or Zoho) mailbox `hello@` + aliases `quotes@`, `bookings@` **OWNER**
- [ ] Mailbox MX records **OWNER**
- [ ] SPF for mailbox provider on root (only one SPF record per hostname) **OWNER**
- [ ] Mailbox DKIM **OWNER**
- [ ] Resend domain verified (its records on the `send` subdomain + DKIM) **OWNER**
- [ ] DMARC at `_dmarc` starting `p=none`, move to `p=quarantine` after 2 weeks of passing reports **OWNER**
- [ ] mail-tester.com score 9/10+ for both mailbox and website emails **OWNER**
- [ ] `LEAD_NOTIFY_EMAIL` switched to the business inbox once live **OWNER**

### Accounts (all owned by a business Google account, 2FA on)

- [ ] Vercel, Neon, Upstash, Resend, Cloudflare Turnstile, Google Cloud (Maps), Google Workspace, Stripe (Phase 2) **OWNER**
- [ ] Google Maps API keys restricted (HTTP referrer for browser key, server key restricted by API) with budget alerts **OWNER**

### Launch

- [ ] First super admin created, 2FA set up **OWNER**
- [ ] Real test quote submitted end to end on production, both emails received **OWNER**
- [ ] Google Business Profile verified and linked **OWNER**
- [ ] Search Console + Bing verified, sitemap submitted **OWNER**
- [ ] Citations created **OWNER**
- [ ] First 5 real customers asked for Google reviews **OWNER**

---

## 19. Working Rules for Claude Code

- Plan before each milestone, wait for approval.
- Small commits, conventional messages. Run `pnpm lint && pnpm typecheck && pnpm test` before marking anything `[x]`.
- Keep business data in config and database, never in components.
- Mark human decisions `[!]`, add them to `TODO-OWNER.md`, keep going on unblocked work.
- Don't build Phase 2 or 3 until asked, but design the schema so they slot in.
- No em dashes in user-facing copy. Australian English.
- Never expose `LEAD_NOTIFY_EMAIL` or any secret client-side.
- Update this file's checkboxes as work progresses. This file is the project's source of truth.
