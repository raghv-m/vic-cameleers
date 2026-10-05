"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { cn } from "cn";

import { absoluteUrl } from "@/config/site-url";

/**
 * Plain share links: no third-party widgets or scripts, so nothing to consent to and nothing
 * slowing the page. Each opens the network's own share page in a new tab.
 */
export function ShareButtons({
  path,
  title,
  className,
}: {
  path: string;
  title: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const url = absoluteUrl(path);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const links = [
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: "X", href: `https://x.com/intent/post?url=${u}&text=${t}` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
    { name: "Email", href: `mailto:?subject=${t}&body=${u}` },
  ];

  const itemClass =
    "border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-sand-50 inline-flex min-h-11 items-center gap-1.5 rounded-sm border-2 px-3 text-sm font-bold transition-colors motion-reduce:transition-none";

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked: the other share options still work
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <p className="manifest-index text-muted-600 mr-1">Share</p>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={itemClass}
        >
          {link.name}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ))}
      <button type="button" onClick={copy} className={itemClass}>
        {copied ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Link2 className="size-4" aria-hidden="true" />
        )}
        <span aria-live="polite">{copied ? "Copied" : "Copy link"}</span>
      </button>
    </div>
  );
}
