# Scope

- **Audited:** the public Vic Cameleers site, production build of branch `site-rebuild` at commit
  5a71491 (after SEO phases S1-S5), served locally. 16 pages at 390px and 1440px:
  `docs/screens/before/*.png`. Source: `src/app/(marketing)/**`, `src/components/marketing/**`,
  `src/components/layout/**`, `src/app/globals.css`, `src/app/layout.tsx`.
- **Primary user:** someone in Melbourne's south-east planning a move, usually on a phone.
- **Primary task:** find the price and the phone number in seconds, then get a quote or call.
- **Constraints:** Next.js 16 App Router, Tailwind 4, shadcn/Base UI; keep CSP, admin protection,
  quote form integrations, SEO metadata/schema/static rendering from S1-S5. No stock or AI photos
  of trucks, crew or customers (labelled placeholders until real photos). Australian English, no
  em dashes, nothing invented.
- **References:** `Design and Motion Playbook.pdf` ("The Caravan Route"), SEO report design section,
  competitors Man With A Van, Okay Movers, EFG Movers, MoveStar.
