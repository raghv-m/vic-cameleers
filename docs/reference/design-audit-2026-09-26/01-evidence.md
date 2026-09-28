# Evidence

## Structural

- Homepage = 12 sections (`src/app/(marketing)/page.tsx:83-95`): Hero, TrustStrip, ServicesGrid,
  PricingTeaser, HowItWorks, WhyUs, FleetSection, ServiceAreas, ReviewsSection, MovingTimeline,
  FaqAccordion, FinalCta.
- Repeated patterns (same purpose, >1 place):
  - Process told twice: `how-it-works.tsx` (4 steps) and `moving-timeline.tsx` (4 steps).
  - Differentiators told three times: `trust-strip.tsx` (rate, trucks, local crew, ABN),
    `why-us.tsx` (crew/trucks, pricing, Victoria only), `reviews-section.tsx` empty state
    (local crew, pricing, fleet, communication).
  - "No surprises" in site copy 4 times (hero, how-it-works page, apartment service copy,
    apartment guide) plus previously pricing/suburb pages; "not a call centre" twice.
- Identical card grids: `services-grid.tsx` (8 bordered cards, hover lift `hover:-translate-y-1`),
  `reviews-section.tsx` 2x2 icon cards, `services/page.tsx` 3-col cards.
- Numbered badges `01 02 03 04` in `how-it-works.tsx:854-856`.

## Visual

- Fonts: Oswald headings + Inter body (`src/app/layout.tsx`), the pairing the SEO report calls the
  most common "bold local business" template.
- Colour tokens in use: ~12 (`globals.css` :root); terracotta is both CTA and eyebrow text.
- Radius 0.75rem everywhere (rounded, soft), soft shadows on hover.
- Zero images on any page. Only graphic: `camel-mark.tsx` line mark + small `route-motif.tsx`.
- `why-us.tsx` and `fleet-section.tsx` use `whileInView` with `initial opacity: 0`: in the
  full-page 1440 screenshot the navy band and fleet cards render **blank**
  (`docs/screens/before/home-1440.png`, y≈2300-2700 and 2800-3100).
- Lowest contrast on primary UI: CTA button `#faf7f0` on `#c1502e` = **4.41:1** (fails AA for
  14px text); eyebrow/link text `#c1502e` on `#faf7f0` = 4.41:1; final CTA body
  `primary-foreground/85` on `#c1502e` = **3.62:1**; link on sand band 4.1:1 (Lighthouse
  `color-contrast`, home). Playbook terracotta-500 `#d5673f` on sand-50 = 3.36:1.
- States: focus rings present (shadcn); loading ("Getting your estimate...") present; error text
  present; empty review state present; **no custom `error.tsx`**; field errors not linked with
  `aria-describedby` (CLAUDE.md s15).

## Copy & honesty

- No fake reviews, ratings or stats. Claims map to config (`business.ts`).
- Generic headline "Move house without the moving-day chaos." (`hero.tsx:776`), could belong to
  any mover.
- Filler repetition: "no surprises", "real crew, real trucks", "not a call centre".
- Footer "Professional Melbourne removalists" is unbacked but mild.

## Weight & friction (Lighthouse mobile, local prod build)

- Home: 29 requests, 17 scripts, **271 KB JS** transferred, 397 KB total, TTI 3.5s, TBT 40ms,
  LCP 3.3s (hero headline, Oswald font swap).
- Idle animations: none looping; entrance animations on hero + 2 sections; reduced motion honoured
  via `MotionConfig reducedMotion="user"`.

## Accessibility

- Skip link present (`layout.tsx`). Landmarks: header, nav, main, footer.
- Lighthouse a11y: home 88 (contrast, `<dl>` misuse in `why-us.tsx`), pricing 92, suburb 92.
