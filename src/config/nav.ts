export interface NavLink {
  label: string;
  href: string;
}

/** Header navigation, in the order people decide: what, how, where, who, proof, questions. */
export const primaryNav: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Service areas", href: "/removalists" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
];

/** Secondary pages, listed in the footer. */
export const secondaryNav: NavLink[] = [
  { label: "Pricing", href: "/pricing" },
  { label: "Moving guides", href: "/guides" },
  { label: "Contact", href: "/contact" },
];

export const footerLegalNav: NavLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cancellation policy", href: "/cancellation-policy" },
];
