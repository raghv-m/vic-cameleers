# SEO + Design Build: Progress

Source of truth: `Vic Cameleers SEO & Design Report to Rank #1 in Melbourne.pdf` ("SEO report")
and `Design and Motion Playbook.pdf` ("playbook"), both in the repo root. SEO "Prompt 1" runs
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

## SEO PHASE S2: Structured data

- [ ] S2.1 Full `MovingCompany` JSON-LD with `@id`: name, url, logo, image[] (real photos,
      empty until they exist), telephone, priceRange, taxID, address (Cranbourne, 3977, VIC,
      AU, no street), geo, `openingHoursSpecification` (owner hours), `areaServed` = City per
      published suburb, `hasOfferCatalog` per enabled service with the hourly price,
      `sameAs` GBP + socials. Files: `src/components/seo/moving-company-json-ld.tsx`,
      `src/config/business.ts`
- [ ] S2.2 `BreadcrumbList` JSON-LD + visible breadcrumbs on all inner pages.
      Files: new `src/components/seo/breadcrumbs.tsx`, inner `page.tsx` files
- [ ] S2.3 `Service` schema per service page, `provider` = MovingCompany `@id`.
      Files: `src/app/(marketing)/services/[slug]/page.tsx`
- [ ] S2.4 `FAQPage` only where Q&A is visible (audit home, /faq, service, suburb).
- [ ] S2.5 `Article` schema on guides: real `datePublished`, author = real person.
      Files: `src/app/(marketing)/guides/[slug]/page.tsx`, `src/content/guides/*`
- [ ] S2.6 No AggregateRating/Review schema. Named flag `business.reviews.showAggregateRating`
      (false) with a TODO.
- [ ] S2.7 Validate all JSON-LD (schema.org validator / Rich Results test on rendered HTML),
      report errors.

## SEO PHASE S3: Local pages that are not doorway pages

- [ ] S3.1 One content file per suburb with fields: name, postcode, council,
      driveTimeFromCranbourneMins, housingNotes, accessNotes, parkingNotes, nearbySuburbs,
      featuredJobs[], reviews[], photos[], published. Format per Decision D-4.
      Files: `content/suburbs/*` (new), `src/content/suburbs.ts` (becomes the loader)
- [ ] S3.2 Only `published: true` suburbs are built, linked, and in the sitemap; others 404.
      Files: `removalists/[suburb]/page.tsx`, `removalists/page.tsx`, `service-areas.tsx`,
      `sitemap.ts`, `llms.txt/route.ts`
- [ ] S3.3 Richer template, sections render only when data exists: local intro, drive time,
      housing and access, recent job (story, photo, truck, hours, price), reviews, services,
      nearby suburbs, 2-3 local FAQs, quote CTA prefilled with the suburb (`/quote?from=clyde-north`).
      Files: `removalists/[suburb]/page.tsx`, `src/components/quote/quote-flow.tsx`
      (read `searchParams` prefill)
- [ ] S3.4 Draft content for the 8 (Cranbourne, Cranbourne East, Cranbourne North, Clyde North,
      Berwick, Narre Warren, Officer, Pakenham), drafts flagged `// REVIEW` in the content
      file only. featuredJobs and reviews empty with TODO.
- [ ] S3.5 The other 13 suburbs set `published: false`.

## SEO PHASE S4: New pages and internal links

- [ ] S4.1 New service pages, 600-900 words, $120/hr worked price example, FAQ, 3 suburb
      links: marketplace pickups, end-of-lease moves. (Piano and pool table cut, decision D-1.)
      Files: `src/config/services.ts`, `src/config/service-content.ts`, `faq.ts`
- [ ] S4.2 Rewrite the cost guide (`/guides/how-much-does-a-removalist-cost`): example-job table
      by home size and truck (from the real pricing engine), embedded calculator, price drivers,
      hourly vs fixed. Files: `src/content/guides/cost-guide.tsx`, new calculator component
- [ ] S4.3 `/crew` page + crew content type (name, role, photo, bio). Data empty; page renders
      an honest holding state or is excluded from nav and sitemap until filled.
      Files: `src/content/crew.ts`, `src/app/(marketing)/crew/page.tsx`
- [!] S4.4 Real guide publish dates + real author name and bio. **Owner input.**
- [ ] S4.5 Internal links: suburb → 2-3 services + 3-5 neighbours; service → quote + 4 closest
      suburbs; guide → quote + one service. Descriptive anchors.
- [ ] S4.6 Reviews page: "Review us on Google" CTA with GBP review link instead of the empty
      state (falls back to quote CTA while the link is unset).

## SEO PHASE S5: Measurement

- [ ] S5.1 UTM-tagged GBP website link documented (`?utm_source=google&utm_medium=organic&utm_campaign=gbp`).
- [ ] S5.2 Vercel Analytics custom events `quote_submitted`, `phone_click` with page path.
      Files: `src/components/quote/quote-flow.tsx`, new client `PhoneLink` used by header,
      sticky bar, hero, footer, contact
- [ ] S5.3 Owner checklist: Search Console, sitemap submit, URL inspection of 10 key pages, Bing.
      File: `TODO-OWNER.md`

---

## DESIGN PHASE D0: Understand (learn-codebase, smart-explore, mem-search)

- [x] D0.1 Code map, including the "must not break" list: CSP/proxy, admin rewrite + RBAC +
      2FA, quote and contact APIs (Zod, honeypot, Turnstile, Upstash, Resend `after()`).
- [ ] D0.2 mem-search for earlier decisions on CSP, admin route, forms.
- [ ] D0.3 "Before" screenshots of every public page at 390px and 1440px (agent-browser),
      saved under `docs/screens/before/`.

## DESIGN PHASE D1: Audit (design-is)

- [ ] D1.1 Dieter Rams audit of the current site, including the known issues: zero images,
      duplicated How it works + timeline, duplicated difference + why-us, icon-card grids with
      hover lift, 01-04 badges, Oswald + Inter, "no surprises" overuse.

## DESIGN PHASE D2: Direction and brand

(redesign-existing-projects lead; high-end-visual-design + design-taste-frontend aesthetic;
industrial-brutalist-ui accents only; brandkit tokens; imagegen-frontend-web ONLY for grain,
route line, SE Melbourne map, stamps, 1860 archival illustration. Skip: minimalist-ui,
gpt-taste, stitch-design-taste, imagegen-frontend-mobile, image-to-code, wowerpoint, dataviz.)

- [ ] D2.1 One-page design brief: 3 font pairings + pick, final tokens (sand-50 #faf7f0,
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

- Stock photos vs labelled placeholders (see "Answered 27 Sep" below, conflicts with 26 Sep answer).
- Vercel Preview builds have failed since at least 22 Sep 2026 (every Preview deployment, before
  S1 too); Production builds succeed. Needs the build log (Vercel login) to fix.

Answered 27 Sep 2026:

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
