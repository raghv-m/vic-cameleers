"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

import { MELBOURNE_TZ } from "@/lib/melbourne-time";

const FORMAT = new Intl.DateTimeFormat("en-AU", {
  timeZone: MELBOURNE_TZ,
  weekday: "short",
  hour: "numeric",
  minute: "2-digit",
});

/**
 * The time at the Cranbourne depot, for visitors elsewhere. Rendered only after mount (a
 * prerendered page would otherwise show the build time), refreshed every 15 seconds. It just tells
 * the time: no opening hours are claimed, since they aren't confirmed.
 */
export function CranbourneClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="text-sand-200 inline-flex items-center gap-1.5">
      <Clock className="size-3.5" aria-hidden="true" />
      <span>
        Cranbourne time{" "}
        <time className="tabular text-sand-50 font-semibold" suppressHydrationWarning>
          {now ? FORMAT.format(now) : "--:--"}
        </time>
      </span>
    </p>
  );
}
