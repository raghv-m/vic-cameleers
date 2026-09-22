# Owner decisions needed

Running list of everything that needs a human decision before launch. Updated as the build
progresses. Each item below also has a `TODO(owner):` comment at its source location, and a `[!]`
in `CLAUDE.md` where relevant.

## Business facts

- **Legal entity name.** `src/config/business.ts` — likely "Vic Cameleers Pty Ltd", needs
  confirming against ABN/ACN registration before it appears on invoices, terms, or the privacy
  policy.
- **Public email address.** `src/config/business.ts` — will be something like `hello@` once the
  domain is bought. Nothing public-facing can go out without this.
- **Domain name.** Not purchased yet. `NEXT_PUBLIC_SITE_URL` stays as a placeholder until then;
  affects canonical URLs, sitemap, JSON-LD, and OG tags sitewide.

## Pricing and terms (CLAUDE.md section 1, "owner decisions still open")

- **Is $120/hr GST inclusive?** (`gstInclusive` setting) Needs a yes/no before the pricing page
  and quote result screen can state "incl. GST" or "excl. GST".
- **Is $120/hr for 2 movers + 6t truck?** Different rate for the 10t truck or extra movers?
  Affects `PricingSettings.hourlyRateCents` / `extraMoverHourlyRateCents` structure.
- **Public liability / goods-in-transit insurance.** Details, if any.
- **Which services are actually offered** (packing, storage, pianos, office removals)? Drives
  which rows in `src/config/services.ts` / the `Service` table stay enabled.
- **Cancellation and rescheduling terms.**
- **Accepted payment methods.**
- **Business hours / phone answering hours.** Not shown anywhere yet since it's unconfirmed —
  the contact page doesn't claim specific hours.

## Compliance claims (CLAUDE.md section 3, honesty rules)

- **Insurance.** `business.claims.isFullyInsured` is `false` with no detail. Do not flip this to
  `true` without a policy reference to show alongside it.
- **Licensing / accreditation.** `business.claims.isLicensed` is `false` with no detail. Same
  rule — no claim without a supporting detail.

## Content and media

- **Real truck and crew photos.** The design uses clearly labelled placeholder slots instead of
  stock photography. Swap in real photos before launch.
- **Suburb page local claims.** Any drafted local fact in `content/suburbs/*.mdx` is marked
  `<!-- REVIEW -->` inline and needs a human check before publishing (see CLAUDE.md section 7).
- **Real reviews.** No reviews exist yet. The reviews section shows a "we're new" state until
  real reviews are added via admin or imported from Google.

## Infrastructure and accounts (CLAUDE.md sections 4 and 18)

All should be owned by a business Google account with 2FA on.

- **Neon Postgres project** (via Vercel Marketplace, `ap-southeast-2`) — sets `DATABASE_URL`
  (pooled) and `DIRECT_URL` (unpooled, used for migrations).
- **GitHub repo connected to Vercel**, preview deployments per branch.
- **Vercel env vars** set for Production and Preview.
- **Resend** account, sending domain verified (SPF/DKIM/DMARC — see README once written).
- **Cloudflare Turnstile** site, sets `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY`.
- **Upstash Redis** (via Vercel Marketplace) for rate limiting.
- **Vercel Blob** store for quote photo uploads, sets `BLOB_READ_WRITE_TOKEN`.
- **Google Maps Platform** API keys: a browser key restricted by HTTP referrer
  (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) and a server key restricted by API
  (`GOOGLE_MAPS_SERVER_KEY`), both with budget alerts.
- **Domain purchase.** Buy through Vercel if available for `.com.au`; otherwise buy at an
  Australian registrar using the ACN and point it at Vercel. Decide canonical host (`www` vs
  apex) and redirect the other, plus redirect any extra domains (`.au`, `.com`).
- **Mailbox** (Google Workspace or Zoho) for `hello@`, aliases `quotes@` / `bookings@`, with MX,
  SPF, DKIM, and DMARC records (start `p=none`, move to `p=quarantine` after two weeks of clean
  reports). Target a mail-tester.com score of 9/10+.
- Choose and set `ADMIN_PATH` (a random, non-guessable segment, never "admin").
- Generate `AUTH_SECRET` (`openssl rand -base64 32`) and `CRON_SECRET`.
- **Google Business Profile**, Search Console, Bing Webmaster Tools verified.
- **Directory citations** (True Local, Yellow Pages, hipages, Oneflare, Find a Mover, Yelp, Apple
  Business Connect, Bing Places) with consistent name/phone/website.
