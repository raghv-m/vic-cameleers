"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { cn } from "cn";

import { buttonVariants } from "@/components/ui/button";
import { business } from "@/config/business";
import { ctaCopy } from "@/config/copy";

/**
 * Mobile bottom bar: Get a quote and Call, always one thumb away. It steps aside while an element
 * marked `data-hides-mobile-bar` is on screen (the homepage hero, which has its own CTAs, and the
 * footer, which does too) and slides back up after. Visible by default, so it works without JS.
 */
export function StickyMobileBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll("[data-hides-mobile-bar]"));
    if (targets.length === 0) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setHidden(visible.size > 0);
      },
      { threshold: 0.15 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "border-navy-900 bg-sand-50/97 fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t-2 px-3 pt-3 backdrop-blur-sm lg:hidden",
        "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        hidden && "translate-y-full",
      )}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
      inert={hidden}
    >
      <a
        href={`tel:${business.phoneE164}`}
        className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "flex-1")}
      >
        <Phone aria-hidden="true" />
        {ctaCopy.call}
      </a>
      <Link
        href="/quote"
        className={cn(buttonVariants({ size: "lg" }), "flex-[1.6] tracking-[0.08em] uppercase")}
      >
        {ctaCopy.primaryShort}
        <ArrowRight data-icon="inline-end" />
      </Link>
    </div>
  );
}
