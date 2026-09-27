import { useId } from "react";
import { cn } from "cn";

import { TruckGlyph } from "@/components/brand/illustrations";

/**
 * The caravan route between homepage stops. Each connector is a short dotted path that draws
 * itself as it crosses the viewport, with a small truck riding it, using CSS scroll-driven
 * animations (globals.css: .vc-route-draw, .vc-route-truck). No JavaScript runs for it.
 *
 * Without scroll-driven animation support, or with reduced motion, the line is simply drawn and
 * the truck is hidden. The SVG is fixed-size (not scaled), so the truck's offset-path, written in
 * the same coordinates, lines up exactly.
 */
const PATHS = {
  right: "M24 0 C24 30 120 22 120 48 S24 66 24 96",
  left: "M120 0 C120 30 24 22 24 48 S120 66 120 96",
} as const;

export function RouteConnector({
  bend = "right",
  label,
  tone = "light",
  className,
}: {
  bend?: keyof typeof PATHS;
  /** Next stop's name, shown beside the marker, e.g. "Stop 02 · What we move". */
  label?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const maskId = useId().replace(/:/g, "");
  const d = PATHS[bend];

  return (
    <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)} aria-hidden="true">
      <div className="relative h-[96px] w-[144px]">
        <svg
          width="144"
          height="150"
          viewBox="0 0 144 150"
          fill="none"
          className="overflow-visible"
        >
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="144" height="96">
              <path
                d={d}
                pathLength={1}
                stroke="white"
                strokeWidth="10"
                className="vc-route-draw"
              />
            </mask>
          </defs>
          <path
            d={d}
            stroke="var(--color-kraft-400)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="0.1 10"
            mask={`url(#${maskId})`}
          />
          <circle
            cx={bend === "right" ? 24 : 120}
            cy="96"
            r="6"
            fill="var(--color-terracotta-600)"
            stroke="var(--color-sand-50)"
            strokeWidth="3"
          />
        </svg>
        <span
          className="vc-route-truck text-terracotta-600 absolute top-0 left-0 block w-7"
          style={{ offsetPath: `path("${d}")`, offsetRotate: "auto" }}
        >
          <TruckGlyph size="six" className="w-7" />
        </span>
        {label && (
          <span
            className={cn(
              "manifest-index absolute bottom-[-4px] whitespace-nowrap",
              bend === "right" ? "left-[40px]" : "left-[136px]",
              tone === "dark" ? "text-sand-200" : "text-muted-600",
            )}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
