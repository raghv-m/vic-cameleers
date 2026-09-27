import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Barlow, Big_Shoulders_Stencil } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { business } from "@/config/business";
import { SITE_URL } from "@/config/site-url";
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

// Big Shoulders Stencil: major display headlines and big numbers only. Variable weight, one file.
const stencil = Big_Shoulders_Stencil({
  variable: "--font-stencil",
  subsets: ["latin"],
  display: "swap",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${barlow.variable} ${stencil.variable} h-full antialiased`}>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <a
          href="#main-content"
          className="bg-navy-900 text-sand-50 sr-only rounded-sm px-4 py-3 text-sm font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70]"
        >
          Skip to content
        </a>
        {children}
        <div aria-hidden="true" className="grain-overlay" />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
