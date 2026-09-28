# Handoff

```
/make-plan Redesign the Vic Cameleers public website (Next.js 16 App Router, Tailwind 4, shadcn/Base UI). Current design failed a Dieter Rams audit at 15/30 with critical gaps in principles #1 innovative, #3 aesthetic, #7 long-lasting, #8 thorough and #10 as little design as possible.

Verdict paragraph:
> The site's facts, copy honesty and technical base are sound, but at 15/30 it reads as a generic template that repeats itself, hides the price below the fold, fails AA contrast on its own CTA, and shows the business's one memorable idea (the cameleers) only as text, so it needs a redesign built around purpose, not a restyle.

Why redesign and not refine: total is below 20, and the problems are structural (12 homepage sections that repeat each other, price tool below the fold), not cosmetic.

Preserve from current design:
- Brand hues: sand #faf7f0 / #f5efdd, terracotta #d5673f / #c1502e (deepened where needed for AA), navy #1b3a5c / #0b1b2e, ink #232323 (src/app/globals.css :root).
- All routes, SEO metadata, canonicals, JSON-LD, breadcrumbs, static rendering and ISR from SEO phases S1-S5 (src/lib/seo.ts, src/lib/structured-data.ts, src/components/seo/*).
- CSP split in src/proxy.ts, admin protection, quote/contact APIs (Zod, honeypot, Turnstile, Upstash, Resend), the pricing engine src/lib/pricing.ts.
- Honest copy rules: no invented reviews, ratings, names, stats; Australian English; no em dashes.

Discard:
- Duplicated process sections: src/components/marketing/how-it-works.tsx + moving-timeline.tsx. Caused failure on #10.
- Triplicated differentiators: trust-strip.tsx, why-us.tsx, reviews-section.tsx empty-state cards. Caused failure on #10.
- Identical hover-lift card grids and 01-04 badges: services-grid.tsx, how-it-works.tsx. Caused failure on #7.
- Content that starts at opacity 0 (why-us.tsx, fleet-section.tsx whileInView). Caused failure on #3 and #8.
- Oswald + Inter pairing (src/app/layout.tsx). Caused failure on #1 and #7.

Top moves from the audit:
1. #2 Useful: put the live price calculator and phone number in the first mobile screen. Evidence: pricing-teaser.tsx is section 4 of 12.
2. #10 Less but better: one 3-stop "how it works" on the route; one proof strip; crew strip instead of trust cards.
3. #8 Thorough: CTA text contrast >= 4.5:1 (deepen terracotta), never hide content behind opacity 0, add error.tsx, aria-describedby on field errors.
4. #1/#7 Identity: "The Caravan Route" (scroll-drawn dotted route line ending at the quote button), slab/stencil display type, kraft grain texture, hard 2px navy borders, 4px radius, labelled photo slots at final aspect ratios from one config file.
5. #9 Weight: animation JS under 60 KB gzipped, only on pages that use it; LCP under 2.5s.

Redesign principles in priority order:
1. #2 Useful: price and phone visible and usable within 3 seconds on a phone.
2. #10 As little design as possible: every homepage stop makes one point, once.
3. #8 Thorough: AA contrast everywhere, every state designed, reduced-motion fallbacks.

Deliverables for the plan:
- New homepage IA (9 stops per the playbook) and inner-page templates
- Token system (colour, type scale with clamp(), spacing, radius, borders, motion tokens)
- Motion components (Reveal, StampText, Odometer, RouteLine, ClipReveal) with reduced-motion fallbacks
- 3-step quote form (owner decision), progress route, BOOKED IN stamp
- States checklist (empty, loading, error, success, focus, disabled)
- Photo slot config + docs/photo-shot-list.md
- Before/after screenshots and Lighthouse budgets

Anti-patterns to guard against:
- Porting the old 12-section structure under new styling
- Decoration not tied to the route, the stamp or the price
- Stock or AI photos of trucks, crew, homes or customers
- Trend effects the playbook bans: custom cursors, scroll-jacking, particles, typewriter text, 3D tilt, marquees, confetti
```
