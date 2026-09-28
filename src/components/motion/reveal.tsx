"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "cn";

const PENDING = "pending";
const SHOWN = "shown";

/**
 * Wrap anything to fade and slide it up the first time it scrolls into view. Top-level sections
 * of every marketing page get the same treatment automatically from <RevealObserver>.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "li";
}) {
  return (
    <Tag data-reveal="" className={cn(className)}>
      {children}
    </Tag>
  );
}

/**
 * One observer for the whole page. Content is only ever hidden once this has run, so the server
 * HTML, crawlers and no-JS visits always see everything; anything already on screen at load is
 * shown straight away (no flash), and reduced motion skips it entirely. An element reveals when
 * its top crosses 30% up from the bottom of the viewport, then is left alone.
 */
export function RevealObserver() {
  // The layout survives client navigation, so re-scan whenever the page changes.
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.getElementById("main-content");
    if (!main) return;

    const targets = new Set<HTMLElement>(main.querySelectorAll<HTMLElement>("[data-reveal]"));
    for (const section of main.querySelectorAll<HTMLElement>("section")) {
      // Top-level sections only; nested ones move with their parent.
      if (!section.parentElement?.closest("section")) targets.add(section);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealState = SHOWN;
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -30% 0px" },
    );

    for (const el of targets) {
      if (el.getBoundingClientRect().top < window.innerHeight) continue; // already on screen
      el.dataset.revealState = PENDING;
      observer.observe(el);
    }
    // Printing never scrolls, so show everything first.
    const showAll = () => {
      for (const el of targets) el.dataset.revealState = SHOWN;
    };
    window.addEventListener("beforeprint", showAll);
    return () => {
      observer.disconnect();
      window.removeEventListener("beforeprint", showAll);
    };
  }, [pathname]);

  return null;
}
