"use client";

import { tracking } from "@/config/tracking";

declare global {
  interface Window {
    __cmp?: (command: string, ...args: unknown[]) => void;
  }
}

/** Reopens the consentmanager.net banner so a visitor can change their cookie choice. */
export function CookieSettingsButton({ className }: { className?: string }) {
  if (!tracking.consentManager) return null;
  return (
    <button type="button" className={className} onClick={() => window.__cmp?.("showScreen")}>
      Cookie settings
    </button>
  );
}
