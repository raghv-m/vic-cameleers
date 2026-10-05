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
- **Cancellation and rescheduling terms.** `src/app/(marketing)/cancellation-policy/page.tsx`
  currently describes the general approach honestly without a specific notice period or fee
  amount, since neither is confirmed. Update once decided.
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

## Security

- `pnpm audit` currently reports 2 high-severity advisories, both in transitive dependencies of
  `prisma`/`better-auth`'s own build tooling (`mysql2`, used internally even though this project
  only uses Postgres, and `deepmerge-ts`, used by `@prisma/config`), not in code this app's
  runtime actually reaches. Not urgent, but re-check after the next `prisma`/`better-auth` bump;
  `.github/dependabot.yml` will open PRs as upstream patches land.

## SEO and design build (from the Sep 2026 SEO report, see docs/progress.md)

- **Set `NEXT_PUBLIC_SITE_URL=https://vic-cameleers.vercel.app`** in Vercel for Production and
  Preview before merging SEO phase S1. Vercel builds now fail on purpose if it's empty or
  localhost (`src/config/site-url.ts`). When a custom domain exists, change only this value, then
  flip `CUSTOM_DOMAIN_REDIRECTS_ENABLED` in `next.config.ts` to redirect vercel.app and the
  www/apex twin to it.
- **Rotate `ADMIN_PATH` in Vercel.** The old value was published in robots.txt and now 404s.
  Format: `ops-` plus 48 random hex characters. Generate with
  `node -e "console.log('ops-'+require('crypto').randomBytes(24).toString('hex'))"`.
  Production, Preview and local `.env` should each use a different value.
- **Google Business Profile.** Not set up. When it is: add the profile URL to `sameAs` in
  `src/components/seo/moving-company-json-ld.tsx`, the review link to Settings (Google review URL),
  and use a UTM-tagged website link (SEO phase S5).
- **Business hours.** Not confirmed, so there's no `openingHoursSpecification` in the schema and no
  hours shown on the site. Add both once confirmed.
- **Guide author.** Guides will credit "Vic Cameleers crew" (SEO phase S2) until then. Needs a real person's name and a
  short bio for the Article schema.
- **Photos.** None yet. Every photo slot is a labelled placeholder with the right aspect ratio,
  driven from one config file; see `docs/photo-shot-list.md` (written in the design phase). The
  default share image `public/og/default.jpg` is a branded card until a real 10 tonne truck photo
  replaces it (1200x630, same path).
- **Heavy items.** The FAQ says pianos and safes aren't handled, but the SEO report wants piano and
  pool table pages. Confirm which is true before SEO phase S4 builds those pages.

## Measurement setup (SEO phase S5)

Do these once the S1 merge is live on `https://vic-cameleers.vercel.app` (swap in the custom
domain everywhere below once there is one).

**Google Business Profile website link.** Use this exact URL as the profile's website, so visits
from the profile show up as their own source in Vercel Analytics:

```
https://vic-cameleers.vercel.app/?utm_source=google&utm_medium=organic&utm_campaign=gbp
```

**Vercel Analytics events** (already in the code, need a Vercel plan that includes custom events):
`quote_submitted` (with `fromSuburb` when the visitor came from a suburb page), `contact_submitted`,
`phone_click` and `email_click` (both with the page path). Check they appear under Analytics →
Events after the first real clicks.

**Google Search Console**

1. Go to search.google.com/search-console, add a property. For the vercel.app URL use the
   "URL prefix" type with `https://vic-cameleers.vercel.app/`. (With a custom domain later, add a
   "Domain" property instead, verified by a DNS TXT record in Vercel DNS.)
2. Verify with the HTML tag method: send me the `google-site-verification` code and I'll add it to
   the site metadata, or use a DNS record once there's a custom domain.
3. Sitemaps → submit `https://vic-cameleers.vercel.app/sitemap.xml`.
4. URL inspection → "Request indexing" for these 10 pages, one at a time:
   - `/`
   - `/pricing`
   - `/quote`
   - `/removalists`
   - `/removalists/cranbourne`
   - `/removalists/clyde-north`
   - `/removalists/berwick`
   - `/services/house-removals`
   - `/services/end-of-lease-moves`
   - `/guides/how-much-does-a-removalist-cost`
5. Check back after a week: Pages report for errors, Performance report for which
   "removalists [suburb]" searches are getting impressions.

**Bing Webmaster Tools**

1. Go to bing.com/webmasters and choose "Import from Google Search Console" (fastest), or add the
   site manually and verify with the meta tag (send me the code).
2. Submit the same sitemap URL.

## Google Places address autocomplete (code shipped 28 Sep 2026)

Address fields (hero estimator from/to, quote wizard pickup, drop-off and extra stop) use Google
Places when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set, and fall back to plain inputs with the
suburb list when it isn't. To switch it on:

1. Google Cloud Console → a project owned by the business Google account → enable
   **Maps JavaScript API** and **Places API (New)**. Set a budget alert.
2. Create an API key, then restrict it:
   - Application restrictions → Websites: `https://vic-cameleers.vercel.app/*`,
     `http://localhost:3000/*` (add the custom domain later).
   - API restrictions → Maps JavaScript API and Places API (New) only.
3. Vercel → Environment Variables → `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (Production and Preview),
   then redeploy (it's baked in at build time).

Cost: suggestions use one session token per typing session, closed by a single details lookup
with only formatted address, location and address components.
The estimate still assumes a 20 minute drive: real drive times need the server-side Routes API
(`GOOGLE_MAPS_SERVER_KEY`, CLAUDE.md section 6), not built yet.

## Analytics, cookie banner and map (code shipped 5 Oct 2026)

GA4 (`G-X31VERYW4Z`) and the consentmanager.net banner are set in `src/config/tracking.ts`.

1. consentmanager.net dashboard → turn on **Google Consent Mode v2**, and make sure the banner's
   allowed domains include `vic-cameleers.vercel.app` (and the custom domain later).
2. GA4 → Admin → Events → mark **generate_lead** as a key event (fires on quote and contact
   submissions; `phone_click` and `email_click` are worth marking too).
3. Depot address for the Google map: set `business.depotAddress` in `src/config/business.ts`.
   Until then the map shows the suburb of Cranbourne. Only publish an address you're happy for
   anyone to see.
4. The site now says "We reply the same day" (`business.responsePromise`). Change or clear it
   if that stops being true.
