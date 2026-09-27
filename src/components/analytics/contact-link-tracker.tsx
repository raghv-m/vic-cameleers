"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

/**
 * Records a Vercel Analytics custom event for every phone and email link click on the public
 * site, with the page it happened on (SEO report, Prompt 1 phase 5). One delegated listener
 * covers every tel:/mailto: link, including ones in server components, so no link needs its own
 * handler. Mounted in the marketing layout only: staff calling customers from the admin console
 * aren't leads. Custom events need a Vercel plan that includes them (CLAUDE.md section 12).
 */
export function ContactLinkTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;

      const href = link.getAttribute("href") ?? "";
      const name = href.startsWith("tel:")
        ? "phone_click"
        : href.startsWith("mailto:")
          ? "email_click"
          : null;
      if (!name) return;

      track(name, { path: window.location.pathname });
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
