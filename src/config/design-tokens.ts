/**
 * Vic Cameleers design tokens: the one place brand colours are defined as values. CSS custom
 * properties in src/app/globals.css mirror these (tests/unit/design-tokens.test.ts keeps the two
 * in sync and checks every approved text/background pair against WCAG 2.2 AA).
 *
 * Brand anchors from the owner: terracotta #B34628, navy #1B2A41, sand #E8D5B5.
 */

export const palette = {
  /** Page ground: a pale tint of the brand sand, so long text stays easy to read. */
  "sand-50": "#faf6ee",
  "sand-100": "#f3e9d6",
  /** Brand sand. Bands and panels; terracotta text is NOT allowed on it (3.82:1). */
  "sand-200": "#e8d5b5",
  /** Kraft: route lines, rules, texture. Never text on light grounds. */
  "kraft-400": "#d4b98c",
  /** Brand terracotta: every primary CTA, links on sand-50/100. */
  "terracotta-600": "#81612f",
  "terracotta-700": "#6a4f26",
  /** Bright terracotta: graphics and large display on navy only. */
  "terracotta-400": "#c19a55",
  /** Brand navy: headings, rules, dark sections. */
  "navy-900": "#18352a",
  "navy-950": "#0d1c14",
  "navy-700": "#36513b",
  "ink-900": "#22262d",
  "muted-600": "#5a5244",
  /** Road-sign amber: tiny accents on navy only (warning-sign diamond, route markers). */
  "signal-400": "#f2a900",
  "success-700": "#2f6b3a",
  "danger-700": "#a3261a",
} as const;

export type PaletteToken = keyof typeof palette;

/**
 * Text/background pairs the UI actually uses. Each must meet its minimum ratio: 4.5 for body
 * and UI text, 3 for large display text (24px+, or 18.66px+ bold) and non-text graphics.
 */
export const approvedPairs: { fg: PaletteToken; bg: PaletteToken; min: 3 | 4.5; use: string }[] = [
  { fg: "ink-900", bg: "sand-50", min: 4.5, use: "Body text on the page" },
  { fg: "ink-900", bg: "sand-200", min: 4.5, use: "Body text on sand bands" },
  { fg: "navy-900", bg: "sand-50", min: 4.5, use: "Headings, links on the page" },
  { fg: "navy-900", bg: "sand-200", min: 4.5, use: "Headings and links on sand bands" },
  { fg: "muted-600", bg: "sand-50", min: 4.5, use: "Secondary text" },
  { fg: "muted-600", bg: "sand-200", min: 4.5, use: "Secondary text on sand bands" },
  { fg: "terracotta-600", bg: "sand-50", min: 4.5, use: "Links and labels on the page" },
  { fg: "terracotta-600", bg: "sand-100", min: 4.5, use: "Links on light panels" },
  { fg: "sand-50", bg: "terracotta-600", min: 4.5, use: "Primary CTA label" },
  { fg: "sand-50", bg: "terracotta-700", min: 4.5, use: "Primary CTA hover" },
  { fg: "sand-50", bg: "navy-900", min: 4.5, use: "Text on navy sections" },
  { fg: "sand-200", bg: "navy-900", min: 4.5, use: "Secondary text on navy" },
  { fg: "sand-100", bg: "navy-900", min: 4.5, use: "Body text in navy panels" },
  { fg: "sand-200", bg: "navy-950", min: 4.5, use: "Footer text" },
  { fg: "signal-400", bg: "navy-900", min: 4.5, use: "Amber labels on navy" },
  { fg: "navy-900", bg: "signal-400", min: 4.5, use: "Navy text on amber sign" },
  { fg: "kraft-400", bg: "navy-900", min: 4.5, use: "Kraft labels on navy" },
  { fg: "terracotta-400", bg: "navy-900", min: 3, use: "Large display accents on navy" },
  { fg: "success-700", bg: "sand-50", min: 4.5, use: "Form success text" },
  { fg: "danger-700", bg: "sand-50", min: 4.5, use: "Form error text" },
];

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => channel(parseInt(hex.slice(i, i + 2), 16)));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

/** Motion tokens (playbook section "Motion tokens"). */
export const motion = {
  easeHaul: [0.22, 1, 0.36, 1] as const,
  easeRoute: [0.65, 0, 0.35, 1] as const,
  durQuick: 0.15,
  durBase: 0.4,
  durHero: 0.7,
  stagger: 0.06,
};
