/**
 * Simple geometric camel line mark. Placeholder logo, see TODO-OWNER.md —
 * swap for real branding before launch. Uses currentColor so it adapts to
 * light/dark theme and to whatever text colour it's placed next to.
 */
export function CamelMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 22 Q12 14 20 13 Q16 20 18 28 Q20 20 26 14 Q34 4 44 8 Q52 12 54 20 Q56 26 52 32 L58 40" />
      <path d="M20 30 L20 52 M17 52 L23 52" />
      <path d="M26 32 L26 54 M23 54 L29 54" />
      <path d="M46 32 L46 54 M43 54 L49 54" />
      <path d="M52 34 L52 56 M49 56 L55 56" />
    </svg>
  );
}
