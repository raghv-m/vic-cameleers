/**
 * Small decorative "origin to destination" route line: two pins joined by a
 * dashed path. Part of the camel/route visual identity (CLAUDE.md section
 * 2), used instead of stock photography we don't have real rights to.
 */
export function RouteMotif({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 40" className={className} fill="none" aria-hidden="true">
      <circle cx="14" cy="20" r="6" className="fill-primary" />
      <path
        d="M20 20 H90 Q100 20 105 12 T140 12 Q150 12 155 20 H200"
        stroke="currentColor"
        strokeWidth={2}
        strokeDasharray="1 8"
        strokeLinecap="round"
        className="text-border"
      />
      <circle cx="206" cy="20" r="6" className="fill-navy dark:fill-primary" />
    </svg>
  );
}
