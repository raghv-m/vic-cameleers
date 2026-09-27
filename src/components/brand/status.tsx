import { cn } from "cn";

import { TruckGlyph } from "@/components/brand/illustrations";

/**
 * Branded status graphics. The loading convoy only moves while work is actually happening; with
 * reduced motion it's a still truck and the text does the talking.
 */
export function LoadingConvoy({ label, className }: { label: string; className?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center gap-3", className)}
    >
      <div className="relative h-10 w-48 overflow-hidden" aria-hidden="true">
        <div className="vc-convoy absolute bottom-2 left-0 w-16">
          <TruckGlyph size="six" className="text-terracotta-600 w-16" wheelClassName="vc-wheel" />
        </div>
        <div className="border-kraft-400 absolute right-0 bottom-0 left-0 border-t-2 border-dashed" />
      </div>
      <p className="text-navy-900 text-sm font-semibold">{label}</p>
    </div>
  );
}

/**
 * The confirmation stamp for a received quote request. It says RECEIVED, not BOOKED: submitting
 * the form asks for a quote, it doesn't book a move (bookings are confirmed by the crew).
 */
export function ReceivedStamp({ reference, className }: { reference: string; className?: string }) {
  return (
    <div
      className={cn(
        "vc-stamp border-terracotta-600 text-terracotta-600 inline-flex -rotate-3 flex-col items-center rounded-sm border-[3px] px-5 py-2.5",
        className,
      )}
    >
      <span className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase">Quote request</span>
      <span className="font-stencil text-3xl leading-none">RECEIVED</span>
      <span className="tabular mt-1 text-xs font-bold tracking-[0.12em]">REF {reference}</span>
    </div>
  );
}
