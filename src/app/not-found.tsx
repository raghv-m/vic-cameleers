import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { business } from "@/config/business";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-primary font-heading text-sm font-semibold tracking-wide uppercase">
        {business.tradingName}
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground mt-3 max-w-md">
        That page doesn&apos;t exist, or it&apos;s moved. If you were after a quote, we can help
        with that right now.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="lg" render={<Link href="/quote" />} nativeButton={false}>
          Get a free estimate
        </Button>
        <Button size="lg" variant="outline" render={<Link href="/" />} nativeButton={false}>
          Back to home
        </Button>
      </div>
      <a
        href={`tel:${business.phoneE164}`}
        className="text-muted-foreground mt-6 text-sm hover:underline"
      >
        Or call {business.phoneDisplay}
      </a>
    </div>
  );
}
