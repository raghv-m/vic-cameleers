"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import { cn } from "cn";

import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { requestEstimatePrefill } from "@/lib/browser-store";

interface PinChoice {
  name: string;
  href: string;
  driveMins: string | null;
}

/** Below lg the map pins are small for fingers, so a tap opens a sheet instead. */
function isPhoneLayout(): boolean {
  return window.matchMedia("(max-width: 1023px)").matches;
}

/**
 * Wraps the coverage map so a suburb pin starts an estimate instead of leaving the page. Desktop:
 * a click prefills the hero estimator and scrolls up. Phones: a tap opens a bottom sheet with the
 * drive time, "Start an estimate from here" and the suburb's own page. Pins stay real links, so
 * without JavaScript, or with Ctrl/Cmd/Shift/middle click, they open the suburb page.
 */
export function MapPrefill({ children }: { children: React.ReactNode }) {
  const [choice, setChoice] = useState<PinChoice | null>(null);

  function onClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const pin = (event.target as Element).closest<HTMLElement | SVGElement>("[data-prefill]");
    const suburb = pin?.getAttribute("data-prefill");
    if (!pin || !suburb) return;
    // Capture phase: stop the pin's own Link handler from navigating before this runs.
    event.preventDefault();
    event.stopPropagation();

    if (isPhoneLayout()) {
      setChoice({
        name: suburb,
        href: pin.getAttribute("href") ?? "/removalists",
        driveMins: pin.getAttribute("data-drive"),
      });
      return;
    }
    requestEstimatePrefill({ from: `${suburb} VIC` });
  }

  return (
    <>
      <div onClickCapture={onClick}>{children}</div>
      <Sheet open={choice !== null} onOpenChange={(open) => !open && setChoice(null)}>
        <SheetContent
          side="bottom"
          className="bg-sand-50 border-navy-900 rounded-t-md border-t-2 px-4 pt-2 pb-6"
        >
          <span
            aria-hidden="true"
            className="bg-navy-900/25 mx-auto mt-1 block h-1 w-10 rounded-full"
          />
          <SheetHeader className="p-0 pt-2">
            <SheetTitle className="font-headline text-navy-900 text-2xl">{choice?.name}</SheetTitle>
            <SheetDescription className="text-muted-600">
              {choice?.driveMins
                ? `About ${choice.driveMins} min from our Cranbourne depot.`
                : "Our home base."}
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                const name = choice?.name;
                setChoice(null);
                if (name)
                  window.setTimeout(() => requestEstimatePrefill({ from: `${name} VIC` }), 200);
              }}
              className={cn(buttonVariants({ size: "lg" }), "w-full")}
            >
              <Calculator aria-hidden="true" />
              Start an estimate from here
            </button>
            {choice && (
              <Link
                href={choice.href}
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full")}
              >
                Removalists in {choice.name}
                <ArrowRight data-icon="inline-end" />
              </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
