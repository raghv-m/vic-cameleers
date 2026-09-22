export interface NavLink {
  label: string;
  href: string;
}

/** Header nav: kept short on purpose. Everything else still lives in the footer and inline links. */
export const primaryNav: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Areas", href: "/removalists" },
  { label: "About", href: "/about" },
];

/** Everything not in the header's primary nav, but still needs to be reachable. Footer "Resources" column. */
export const secondaryNav: NavLink[] = [
  { label: "Reviews", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
  { label: "Guides", href: "/guides" },
  { label: "Contact", href: "/contact" },
];

export const footerLegalNav: NavLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cancellation policy", href: "/cancellation-policy" },
];
