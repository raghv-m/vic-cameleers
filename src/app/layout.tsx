import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { business } from "@/config/business";

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

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: `${business.tradingName} | Melbourne Removalists`,
    template: `%s | ${business.tradingName}`,
  },
  description:
    "Vic Cameleers is a Cranbourne based removalist crew moving homes and businesses across Greater Melbourne. Transparent hourly pricing, no surprises.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} h-full antialiased`}>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <a
          href="#main-content"
          className="bg-background text-foreground focus-visible:ring-ring sr-only rounded-md border px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus-visible:ring-2 focus-visible:outline-none"
        >
          Skip to content
        </a>
        {children}
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
