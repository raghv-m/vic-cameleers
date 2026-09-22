"use client";

import { useEffect, useRef } from "react";

import { clientEnv } from "@/env.client";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: { sitekey: string; callback: (token: string) => void },
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
const DEV_BYPASS_TOKEN = "dev-bypass-token";

/**
 * Renders the real Cloudflare Turnstile widget once
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY is configured. Until then, auto-supplies a
 * bypass token so the quote form stays testable in development — the server
 * mirrors this in src/lib/turnstile.ts (skips verification when the secret
 * isn't set). See TODO-OWNER.md.
 */
export function TurnstileWidget({ onVerify }: { onVerify: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const siteKey = clientEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) {
      onVerify(DEV_BYPASS_TOKEN);
      return;
    }

    let widgetId: string | undefined;

    function render() {
      if (containerRef.current && window.turnstile && siteKey) {
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: onVerify,
        });
      }
    }

    if (window.turnstile) {
      render();
    } else {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = render;
      document.head.appendChild(script);
    }

    return () => {
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [siteKey, onVerify]);

  if (!siteKey) {
    return (
      <p className="text-muted-foreground text-xs">
        Verification widget will appear here once configured.
      </p>
    );
  }

  return <div ref={containerRef} />;
}
