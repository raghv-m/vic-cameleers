"use client";

import { useEffect } from "react";

import { tracking } from "@/config/tracking";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics 4, loaded from our own bundle rather than an inline snippet so it works under
 * both CSPs (see src/proxy.ts). Consent Mode v2 starts every storage type as denied: GA sends no
 * cookies until the consentmanager.net banner reports the visitor agreed, and the banner's
 * autoblocking also holds gtag.js back until then. Renders nothing.
 */
export function GoogleAnalytics() {
  useEffect(() => {
    const id = tracking.ga4MeasurementId;
    if (!id || window.gtag) return;

    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag() {
      // gtag.js reads the arguments object itself, not an array, so it must be pushed as is.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      wait_for_update: 500,
    });
    window.gtag("js", new Date());
    window.gtag("config", id);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(script);
  }, []);

  return null;
}
