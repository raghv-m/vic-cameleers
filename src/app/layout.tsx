import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Barlow, Barlow_Condensed, Big_Shoulders_Stencil } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { business } from "@/config/business";
import { SITE_URL } from "@/config/site-url";
import { tracking } from "@/config/tracking";
import { palette } from "@/config/design-tokens";
import { DEFAULT_OG_IMAGE, seoTitle } from "@/lib/seo";

import "./globals.css";

// Barlow: body, UI, navigation, buttons, prices (tabular figures). Drawn from road and signage
// lettering, so it pairs with the freight theme.
const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Barlow Condensed ExtraBold: every headline. Same road-signage family as the body text, so it
// reads cleanly at any size (the stencil face broke letters apart in long headlines).
const condensed = Barlow_Condensed({
  variable: "--font-condensed",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

// Big Shoulders Stencil: accents only (wordmark, manifest numbers, step markers, the RECEIVED
// stamp). Never full headlines or sentences.
const stencil = Big_Shoulders_Stencil({
  variable: "--font-stencil",
  subsets: ["latin"],
  display: "swap",
  // next/font has no metric overrides for this family ("Failed to find font override values"),
  // so it can't size-match an automatic fallback. Switch that off and name the fallback
  // directly; it only shows for the moment before the font loads, on small accents.
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "sans-serif"],
});

const siteDescription = `Removalists based in ${business.baseSuburb.replace(" VIC", "")}, moving homes and businesses across ${business.serviceAreaDescription}. ${business.hourlyRateShort}, ${business.minimumHours} hour minimum. Get a free quote.`;

// Defaults for anything without its own metadata (admin, 404). Public pages set their own
// title, canonical and share tags through pageMetadata() in src/lib/seo.ts.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: seoTitle("Removalists Melbourne", { price: true }),
    template: `%s | ${business.tradingName}`,
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName: business.tradingName,
    locale: "en_AU",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE.url] },
};

// Browser chrome colour on mobile: the page ground, so the address bar blends into the header.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: palette["sand-50"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-AU"
      className={`${barlow.variable} ${condensed.variable} ${stencil.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <a
          href="#main-content"
          className="bg-navy-900 text-sand-50 sr-only rounded-sm px-4 py-3 text-sm font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70]"
        >
          Skip to content
        </a>
        {/* Cookie banner first, so its autoblocking runs before any tracker can load. Next puts
            beforeInteractive scripts in <head> and stamps the CSP nonce on them. */}
        {tracking.consentManager && (
          <Script
            id="consentmanager"
            strategy="beforeInteractive"
            src={tracking.consentManager.scriptUrl}
            data-cmp-ab="1"
            data-cmp-host={tracking.consentManager.host}
            data-cmp-cdn={tracking.consentManager.cdn}
            data-cmp-codesrc={tracking.consentManager.codeSrc}
          />
        )}
        {children}
        <div aria-hidden="true" className="grain-overlay" />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
