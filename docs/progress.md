# SEO + Design Build: Progress

Source of truth: `docs/reference/seo-and-design-report.pdf` ("SEO report")
and `docs/reference/design-and-motion-playbook.pdf` ("playbook"). SEO "Prompt 1" runs
first; the playbook's "Master Claude Code prompt" runs second and replaces the SEO report's
"Prompt 2". CLAUDE.md remains the project brief; its checkboxes get updated as items land.

Status keys: `[ ]` not started, `[~]` in progress, `[x]` done and verified, `[!]` blocked on owner.

Rules that apply to every step: Australian English, no em dashes in site copy, no invented
reviews/ratings/names/job stories/stats/years, keep CSP + security headers + admin protection +
quote form (Resend, Turnstile, Upstash) working. `pnpm lint && pnpm typecheck && pnpm test &&
pnpm build` before ticking anything. End of each phase: changed-files summary + agent-browser
screenshots at 390px and 1440px, then wait for OK.

---

## Phase 0 findings (documentation discovery, done 26 Sep 2026)

Verified against `node_modules/next/dist/docs` (Next 16.3.5):

- `middleware.ts` is **deprecated in Next 16, renamed `proxy.ts`** (export `proxy`), codemod
  `npx @next/codemod@canary middleware-to-proxy .`
  (`03-api-reference/03-file-conventions/middleware.md:11-18`).
- Nonce CSP **forces dynamic rendering on every page** and disables SSG/ISR
  (`02-guides/content-security-policy.md:181, 385-397`). This is the cause of the
  `cache-control: no-store` the SEO report found.
- Static-friendly alternative: `experimental.sri` (hash-based, App Router only, experimental)
  (`content-security-policy.md:458-538`). Must be verified in a real build that Next's inline
  RSC payload scripts are not blocked before relying on it.
- `JsonLd` currently calls `headers()` to read the nonce, which also forces dynamic rendering.
  `application/ld+json` is a data block, not executed script, so it does not need a nonce.
- Canonicals: `metadata.alternates.canonical` (`03-api-reference/04-functions/generate-metadata.md:823-844`).
- OG images: `opengraph-image` file convention + `ImageResponse`
  (`03-api-reference/03-file-conventions/01-metadata/opengraph-image.md`).
- `export const revalidate` still works because Cache Components is not enabled
  (`02-route-segment-config/index.md:19`).
- View transitions: React `<ViewTransition>` (`02-guides/view-transitions.md`), check the
  required config flag before using it in design Phase D3.
- `framer-motion@13` is already installed (same library as the `motion` package). GSAP is not.

Current-state facts from the code map that shape the plan:

- `business.siteUrl` falls back to `http://localhost:3000` (`src/config/business.ts:353`).
  That's why sitemap, robots, JSON-LD and the metadata base all point at localhost in production.
- `robots.ts` publishes `ADMIN_PATH` (`src/app/robots.ts:257`). The live value leaked, and
  was also hardcoded as the e2e default. It must be rotated in Vercel.
- Unauthenticated admin requests redirect to `/login` (`src/lib/rbac.ts:885`), not 404.
- Suburb title template doubles the brand (`removalists/[suburb]/page.tsx:2378` + layout template).
- `DraftContentNotice` renders publicly on all 21 suburb pages.
- Guide dates are 1 to 29 Jan 2026 (placeholder, pre-trading).
- FAQ says "We don't currently handle pianos, safes" (`src/config/faq.ts:10438`) while the
  fleet section says the 10t truck suits pianos and the SEO report wants piano and pool table
  pages. `heavy-items` service is `enabled: false`. Needs an owner decision.
- Zero images anywhere; no `public/` folder is tracked; no `public/photos/`.

---

## SEO PHASE S1: Technical fixes (done 26 Sep 2026, branch `site-rebuild`, awaiting OK)

- [x] S1.1 Single `SITE_URL` in `src/config/site-url.ts` from `NEXT_PUBLIC_SITE_URL`. Vercel
      production/preview builds fail if it's empty, not https, or localhost; vercel.app allowed.
      Local/CI builds unaffected. Unit tested (`tests/unit/site-url.test.ts`).
- [x] S1.2 robots: allow all, disallow `/api/`, sitemap on SITE_URL, admin path removed. Signed-out
      requests to protected admin pages (and API exports) return 404 with `X-Robots-Tag`; login
      page renders. The old leaked path and literal `/admin` 404. Local ADMIN_PATH rotated.
- [x] S1.3 Self-referencing canonical on every public page (`pageMetadata()` in `src/lib/seo.ts`).
- [x] S1.4 Titles: "[keyword] | From $120/hr | Vic Cameleers", brand once, 60 char budget with
      automatic fallback (drops price, then brand). Unit tested (`tests/unit/seo.test.ts`).
- [x] S1.5 Open Graph + Twitter on every public page; default `public/og/default.jpg` 1200x630
      (branded card, swap for a real truck photo later, same path).
- [x] S1.6 Custom-domain + www/apex 301s written in `next.config.ts`, disabled behind
      `CUSTOM_DOMAIN_REDIRECTS_ENABLED = false` (TODO) until a domain exists.
- [x] S1.7 Removed: `DraftContentNotice` on all 21 suburb pages (component deleted); About "Real
      photos of the truck and crew are going up as we get them, this section will fill in as the
      site grows"; Contact "Use the form, or call us, our email goes live with the new site" (email
      block now shows only once `publicEmail` is set); Turnstile "Verification widget will appear
      here once configured" (renders nothing without a site key). Guide dates moved from fake
      Jan 2026 to 2026-09-26 (no backdating).
- [x] S1.8 `middleware.ts` → `src/proxy.ts`. Marketing pages static/SSG with ISR 1 day (verified
      `s-maxage=86400`); nonce CSP kept on admin, /quote, /contact (render per request). Static CSP
      needs `script-src 'self' 'unsafe-inline'`: tested that `'self'` alone stops React hydrating.
      JsonLd no longer reads headers(). Admin review/pricing changes revalidate `/`, `/reviews`,
      `/pricing`, `/llms.txt` on demand. All other headers unchanged.
- [x] S1.9 Sitemap: 46 indexable URLs on SITE_URL, `lastModified` from content dates, not build time.
- [x] S1.10 FAQ answers in server HTML (accordion `hiddenUntilFound`, verified in built HTML).
- [~] S1.11 Lighthouse mobile (local prod build, simulated 4G, no CDN): home 92/88/96/100,
  pricing 95/92/96/100, suburb 95/92/96/100, service 95/96/96/100 (perf/a11y/bp/seo). CLS 0,
  TBT ≤ 40ms. LCP 2.9-3.3s, over target: LCP element is the Oswald hero headline, render
  delay from CSS + font swap. Hero, fonts and the a11y issues (contrast, `<dl>` in why-us) are
  rebuilt in design D5/D6; re-measure live in Speed Insights and in D7.

## SEO PHASE S2: Structured data (done 26 Sep 2026)

- [x] S2.1 Full `MovingCompany` node with `@id` (`src/components/seo/moving-company-json-ld.tsx`):
      name, url, logo, image, telephone, priceRange, taxID, suburb-level address (Cranbourne 3977),
      geo (suburb centre, not the depot), areaServed as City per suburb page, hasOfferCatalog per
      enabled service at $120/hour. Left out until confirmed: openingHoursSpecification, sameAs,
      legalName, email (each appears automatically once set in `business.ts`).
- [x] S2.2 `BreadcrumbList` JSON-LD + visible breadcrumbs on every inner page
      (`src/components/seo/breadcrumbs.tsx`, one component renders both so they can't drift).
- [x] S2.3 `Service` schema per service page, `provider` = the MovingCompany `@id`, hourly price.
- [x] S2.4 `FAQPage` only where the Q&A is visibly rendered (/faq, service pages, suburb pages);
      a service with no FAQs emits no FAQPage.
- [x] S2.5 `Article` schema on guides: real datePublished, author "Vic Cameleers crew" (TODO for a
      real person), publisher = business `@id`; visible byline with `<time>`.
- [x] S2.6 No AggregateRating/Review: `business.reviewSchemaEnabled = false` with TODO.
- [x] S2.7 Validated with validator.schema.org on 8 pages (home, service, guide, suburb, faq,
      privacy, pricing, quote): 0 errors, 0 warnings.

## SEO PHASE S3: Local pages that are not doorway pages (done 26 Sep 2026)

- [x] S3.1 One typed file per suburb in `src/content/suburbs/<slug>.ts` exporting `suburbData`
      (`types.ts` has the owner's interface plus two optional fields the template needs: `intro` and
      `localFaqs`). Loader in `src/content/suburbs/index.ts`.
- [x] S3.2 Only `published: true` suburbs are built, linked, in the sitemap, in llms.txt and in
      schema areaServed; unpublished and unknown slugs 404 (`dynamicParams = false`).
- [x] S3.3 New template: drive-time label, local intro, housing/access/parking notes, recent jobs,
      reviews, local photo, 3 service links, local + 2 general FAQs (FAQPage from the visible ones),
      published neighbours, quote CTA prefilled via `/quote?suburb=<slug>` (resolved server-side
      against published suburbs only). Every optional section renders only when its data exists.
- [x] S3.4 Drafted local content for Cranbourne, Cranbourne East, Cranbourne North, Clyde North,
      Berwick, Narre Warren, Officer, Pakenham, every drafted line marked `// REVIEW` in the data file
      (nothing on the live page). Drive times are approximations to confirm. featuredJobs, reviews and
      photos empty with TODO(owner).
- [x] S3.5 The other 13 suburbs are `published: false`.
- Tests: `tests/unit/suburbs.test.ts` enforces unique slugs, the published set, minimum local
  content per published suburb, valid nearby slugs, 2+ published neighbours, no em dashes. It
  caught a real bug: Cranbourne West listed a non-existent `cranbourne-south` neighbour (fixed).

## SEO PHASE S4: New pages and internal links (done 26 Sep 2026)

- [x] S4.1 New service pages `/services/marketplace-pickups` (734 words) and
      `/services/end-of-lease-moves` (611 words): long-form sections, a worked price example
      calculated live by the pricing engine with the maths line by line
      (`src/components/marketing/worked-price-example.tsx`), FAQ, links to the 4 published suburbs
      closest to the depot. Piano and pool table cut (decision D-1).
- [x] S4.2 Cost guide rewritten: example estimates table by home size and truck (engine output,
      labelled "not past jobs", TODO for real job prices), embedded calculator
      (`src/components/marketing/price-calculator.tsx`, reusable for the design-phase hero), price
      drivers, hourly vs fixed, cost-saving tips. Date = day it went live.
- [x] S4.3 `/crew` page + `src/content/crew.ts` (name, role, bio in their own words, photo). Data
      empty; the page 404s and stays out of the sitemap until the first real profile is added.
- [x] S4.4 Guide dates are go-live dates; author "Vic Cameleers crew" with TODO (done in S2).
- [x] S4.5 Internal links: suburb pages link 3 services + published neighbours; every service
      page links the quote page, the pricing page and the 4 closest published suburbs; every guide
      links the quote page and one related service (`relatedService` on each guide). Descriptive
      anchors throughout.
- [x] S4.6 Reviews page: "Reviews coming soon, we're new" + quote CTA; a "Review us on Google"
      button appears once `business.googleReviewUrl` is set (TODO).
- Fixed along the way: two guides printed a literal `&apos;` inside list items; guide dates were
  parsed as UTC and showed the previous day in timezones behind UTC (now `parseISO`); the cost
  table hid its price column behind a sideways scroll on mobile.

## SEO PHASE S5: Measurement (done 26 Sep 2026)

- [x] S5.1 UTM-tagged Google Business Profile website link documented in `TODO-OWNER.md`.
- [x] S5.2 Vercel Analytics custom events: `quote_submitted` (path, `fromSuburb`, property size),
      `contact_submitted`, and `phone_click` / `email_click` (page path) from one delegated listener
      (`src/components/analytics/contact-link-tracker.tsx`, public pages only, not admin). Verified the
      event is queued with the right path; needs a Vercel plan with custom events to show up.
- [x] S5.3 Owner checklist in `TODO-OWNER.md`: Search Console property, verification, sitemap
      submission, URL inspection for 10 key pages, Bing Webmaster Tools.

---

## DESIGN PHASE D0: Understand (learn-codebase, smart-explore, mem-search)

- [x] D0.1 Code map, including the "must not break" list: CSP/proxy, admin rewrite + RBAC +
      2FA, quote and contact APIs (Zod, honeypot, Turnstile, Upstash, Resend `after()`).
- [x] D0.2 mem-search attempted: the claude-mem worker isn't running, so no results. Earlier
      decisions are in CLAUDE.md, git history and this file instead.
- [x] D0.3 "Before" screenshots of 16 public pages at 390px and 1440px (32 images, production build),
      saved under `docs/screens/before/` (removed 28 Sep 2026; in git history).

## DESIGN PHASE D1: Audit (design-is) (done 26 Sep 2026)

- [x] D1.1 Dieter Rams audit in `docs/reference/design-audit-2026-09-26/`: 15/30, verdict REDESIGN. Worst: aesthetic,
      long-lasting, thorough, as-little-design (1/3 each). New finding: the CTA terracotta #c1502e
      fails AA (4.41:1), and the why-us and fleet sections render blank until scrolled (opacity 0).

## DESIGN PHASE D2: Direction and brand

(redesign-existing-projects lead; high-end-visual-design + design-taste-frontend aesthetic;
industrial-brutalist-ui accents only; brandkit tokens; imagegen-frontend-web ONLY for grain,
route line, SE Melbourne map, stamps, 1860 archival illustration. Skip: minimalist-ui,
gpt-taste, stitch-design-taste, imagegen-frontend-mobile, image-to-code, wowerpoint, dataviz.)

- [~] D2.1 Design brief published for approval (https://claude.ai/artifact/Uy93DrYgAxyAwG7SHWnjtQ,
  copy in `docs/reference/design-brief.html`): recommends Big Shoulders Stencil + Barlow, CTA terracotta
  deepened to #b34628 for AA, headline "Same job as the 1860 cameleers. Better suspension.",
  services as a freight manifest. Skills used: redesign-existing-projects, high-end-visual-design,
  design-taste-frontend, industrial-brutalist-ui (accents). brandkit and imagegen-frontend-web
  skipped: no image-generation tool in this environment. Original item: 3 font pairings + pick, final tokens (sand-50 #faf7f0,
  sand-100 #f5efdd, kraft-300 #c9a878, terracotta-500 #d5673f, terracotta-700 #c1502e,
  navy-800 #1b3a5c, navy-950 #0b1b2e, ink-900 #232323, signal-400 #f99c00), 70/20/10,
  clamp() type scale, 4px radius, 2px navy borders, grain spec, photo grading/duotone, icons.
  5 hero headline options, pick one. **Wait for OK.**
- [ ] D2.2 Tokens in `src/app/globals.css` (`@theme`), fonts in `src/app/layout.tsx`, contrast
      checked on every text/background pair (terracotta on sand for small text).
- [ ] D2.3 Generated decorative assets (texture under 20KB, map, stamps, archival
      illustration) in `public/brand/`.

## DESIGN PHASE D3: Motion system (design-motion-principles)

- [ ] D3.1 Add `gsap` (ScrollTrigger, MotionPathPlugin), bundled locally, no CDN.
      Motion tokens in `src/lib/motion.ts`.
- [ ] D3.2 Client components with reduced-motion fallbacks: `<Reveal>`, `<StampText>`,
      `<Odometer>`, `<RouteLine>`, `<ClipReveal>` in `src/components/motion/`.
- [ ] D3.3 Animation JS budget check: under 60KB gzipped, only on pages that use it
      (LazyMotion + dynamic import of GSAP).

## DESIGN PHASE D4: Plan (make-plan)

- [ ] D4.1 Numbered task list for D5-D7 with files and checkpoints, appended here.

## DESIGN PHASE D5: Build (do + full-output-enforcement)

- [ ] D5.1 Homepage, 9 stops: hero + overlapping calculator, proof strip, alternating service
      photo rows, merged 3-step how it works on the route, crew strip, navy cameleer story,
      fleet on kraft with what-fits, SE map + suburb chips, FAQ + final quote panel.
      Removes `how-it-works.tsx`, `moving-timeline.tsx`, `why-us.tsx`, `trust-strip.tsx`,
      `services-grid.tsx`, `pricing-teaser.tsx` (merged). **Show and wait for feedback.**
- [ ] D5.2 Pricing (full-width calculator + invoice example), service pages, suburb pages,
      about (1860 timeline), guides (68ch, sticky TOC, inline CTA), quote (stepper per
      Decision D-5, progress route, BOOKED IN stamp), 404 (lost camel).

## DESIGN PHASE D6: Polish (impeccable)

- [ ] D6.1 Pixel pass 360px to 1920px: spacing, states, empty/error states, dark sections.
- [ ] D6.2 Fix the known a11y gap: `aria-invalid` / `aria-describedby` in
      `src/components/ui/field.tsx`.

## DESIGN PHASE D7: Test (run + agent-browser)

- [ ] D7.1 "After" screenshots at 390px and 1440px beside "before".
- [ ] D7.2 Lighthouse mobile: home, pricing, one service, one suburb, quote. Perf 90+, a11y 100,
      SEO 100, LCP < 2.5s, CLS < 0.1, INP < 200ms, hero under 180KB AVIF.
- [ ] D7.3 prefers-reduced-motion on; keyboard-only pass.

## DESIGN PHASE D8: Ship (simplify, code-review, security-review, babysit)

- [ ] D8.1 Remove unused components, CSS, deps.
- [ ] D8.2 Code review + security review: CSP unchanged or stricter, admin protected and
      noindexed, quote form validates, rate-limits and emails, no new third-party scripts.
- [!] D8.3 Preview branch + babysit the Vercel build. **Needs GitHub connected to Vercel.**

---

## Decisions and owner inputs

Answered decisions get recorded here with the date.

Open:

- Stock photos vs labelled placeholders (see the later answers below; conflicts with the first 26 Sep answer).
- Vercel Preview builds have failed since at least 22 Sep 2026 (every Preview deployment, before
  S1 too); Production builds succeed. Needs the build log (Vercel login) to fix.

Answered 26 Sep 2026:

- Always-on preview: one long-lived branch `site-rebuild`, every commit pushed there, reviews on
  its Vercel branch URL; production deploy (merge to main) only on owner approval.
- D-4 Suburb format: one TypeScript file per suburb (`suburbs/clyde-north.ts`) exporting a typed
  `suburbData` object (name, postcode, council, driveTimeFromCranbourneMins?, housingNotes?,
  accessNotes?, parkingNotes?, nearbySuburbs?, featuredJobs?, reviews?, photos?, published).
  No MDX, no Markdown; featuredJobs and reviews are typed data in the same file.
- D-1 Heavy items: no piano or pool table pages. Cut from S4; FAQ stays "no pianos".
- D-5 Quote form: the playbook's 3 steps, each fitting one mobile screen, large tap targets,
  progress indicator at the top.
- ADMIN_PATH: not committed to the repo (it's public on GitHub); set as a Vercel env var instead.
- Stock photos (10-15 royalty-free, no logos, in `public/photos/stock/`) requested, which
  reverses the 26 Sep "no stock photos" answer. Awaiting confirmation before D5.

Answered 26 Sep 2026:

- Domain: none yet. SITE_URL = https://vic-cameleers.vercel.app via env; custom-domain redirect
  written but disabled. www vs apex decided later (D-3 deferred, config-driven).
- GBP: not set up. No sameAs; /reviews shows "Reviews coming soon, we're new" + quote CTA
  (owner instruction, overrides CLAUDE.md's no-"we're new" note); TODOs where the link goes.
- Socials: none. No empty icons anywhere.
- Hours: unconfirmed. No openingHoursSpecification, no hours on the site.
- Guides: author "Vic Cameleers crew", no bio, TODO; dates = date live after rework, no backdating.
- Photos: none. Labelled placeholder slots (sand/kraft block, "PHOTO: ..." label, correct aspect
  ratio), all paths + alt text in one config file, `docs/photo-shot-list.md`. No stock or AI
  photos of trucks, crews, homes or customers; generated textures and the 1860 illustration OK.
- Admin: new long random ADMIN_PATH from env, old path 404s, 404 when signed out, noindex header.
- D-2 CSP: nonce on admin/quote/contact, static CSP with 'unsafe-inline' scripts elsewhere
  (tested; SRI can't cover Next's inline bootstrap scripts).
- Owner sets NEXT_PUBLIC_SITE_URL in Vercel Production + Preview before merging S1.
