import { cn } from "cn";

import { CAMEL_PATH } from "@/components/brand/camel-mark";

/**
 * Road-sign references: an amber warning diamond with a camel, and a navy direction plate.
 * Inspired by Australian roadside signage (outback camel warning signs), deliberately not a copy:
 * our palette, our camel, our proportions, no official sign codes.
 */
export function CamelSign({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <rect
        x="17.5"
        y="17.5"
        width="85"
        height="85"
        rx="7"
        transform="rotate(45 60 60)"
        fill="var(--color-signal-400, #f2a900)"
      />
      <rect
        x="23.5"
        y="23.5"
        width="73"
        height="73"
        rx="4"
        transform="rotate(45 60 60)"
        fill="none"
        stroke="var(--color-navy-900, #1b2a41)"
        strokeWidth="3.5"
      />
      <path
        d={CAMEL_PATH}
        fill="var(--color-navy-900, #1b2a41)"
        transform="translate(30.5 40) scale(0.92)"
      />
    </svg>
  );
}

/** A direction plate, like the small sign under a warning diamond. Text stays real HTML. */
export function SignPlate({
  children,
  className,
  tone = "navy",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "navy" | "amber";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-[3px] px-2.5 py-1.5 text-[0.6875rem] leading-none font-bold tracking-[0.14em] uppercase ring-2 ring-inset",
        tone === "navy"
          ? "bg-navy-900 text-sand-50 ring-sand-50/70"
          : "bg-signal-400 text-navy-900 ring-navy-900",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Direction arrow in the same line weight as the route line. */
export function RouteArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 12" className={className} fill="none" aria-hidden="true">
      <path
        d="M1 6h20M16 1.5 21.5 6 16 10.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Measurement ticks: a ruler-like rule for technical panels. */
export function MeasureRule({ className, ticks = 24 }: { className?: string; ticks?: number }) {
  return (
    <svg
      viewBox={`0 0 ${ticks * 10} 10`}
      preserveAspectRatio="none"
      className={cn("h-2.5 w-full", className)}
      aria-hidden="true"
    >
      <line x1="0" y1="0.75" x2={ticks * 10} y2="0.75" stroke="currentColor" strokeWidth="1.5" />
      {Array.from({ length: ticks + 1 }).map((_, i) => (
        <line
          key={i}
          x1={i * 10}
          x2={i * 10}
          y1="0"
          y2={i % 4 === 0 ? 10 : 5}
          stroke="currentColor"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
