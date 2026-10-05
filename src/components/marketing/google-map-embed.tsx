import { cn } from "cn";

import { business } from "@/config/business";

/**
 * Keyless Google Maps embed (the public `output=embed` URL, so no API key or billing). Shows the
 * depot address once business.depotAddress is set, otherwise the suburb of Cranbourne, which is
 * all a service-area business should publish by default. Lazy-loaded, so it costs nothing until
 * it scrolls near the screen. Allowed by the frame-src in src/proxy.ts.
 */
export function GoogleMapEmbed({
  zoom,
  className,
  title,
}: {
  /** 10 shows Greater Melbourne around Cranbourne; 14 or so for a street address. */
  zoom?: number;
  className?: string;
  title?: string;
}) {
  const place =
    business.depotAddress ?? `${business.baseSuburb} ${business.basePostcode}, Australia`;
  const z = zoom ?? (business.depotAddress ? 14 : 10);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(place)}&z=${z}&output=embed`;

  return (
    <div
      className={cn(
        "border-navy-900 bg-sand-100 relative aspect-[4/3] overflow-hidden rounded-sm border-2 sm:aspect-[16/9]",
        className,
      )}
    >
      <iframe
        src={src}
        title={title ?? `Map of ${business.tradingName}'s base in ${business.baseSuburb}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 size-full"
      />
    </div>
  );
}

/** Link that opens Google Maps directions to the base (or depot, once it's public). */
export function directionsUrl(): string {
  const place = business.depotAddress ?? `${business.baseSuburb} ${business.basePostcode}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place)}`;
}
