import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";

import { MotionProvider } from "@/components/motion-provider";
import { Toaster } from "@/components/ui/sonner";
import { business } from "@/config/business";
import { SITE_URL } from "@/config/site-url";
import { DEFAULT_OG_IMAGE, seoTitle } from "@/lib/seo";

import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
    <html lang="en-AU" className={`${inter.variable} ${oswald.variable} h-full antialiased`}>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <a
          href="#main-content"
          className="bg-background text-foreground focus-visible:ring-ring sr-only rounded-md border px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus-visible:ring-2 focus-visible:outline-none"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
