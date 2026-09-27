"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Phone, RotateCcw } from "lucide-react";
import { cn } from "cn";

import { Container } from "@/components/site/layout-primitives";
import { Button, buttonVariants } from "@/components/ui/button";
import { business } from "@/config/business";

/**
 * Shown when a page breaks while rendering. Says so plainly, offers a retry, and always gives
 * the phone number, so a broken page never costs a customer.
 */
export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="grid min-h-[60svh] content-center py-16">
      <p className="manifest-index text-terracotta-600">Something broke</p>
      <h1 className="font-headline text-navy-900 display-lg mt-3 max-w-[18ch]">
        This page hit a pothole.
      </h1>
      <p className="text-ink-900 mt-4 max-w-[52ch] text-lg">
        It&apos;s on our side, not yours. Try again, or call us and we&apos;ll sort your move out
        over the phone.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={reset} className="tracking-[0.08em] uppercase">
          <RotateCcw />
          Try again
        </Button>
        <a
          href={`tel:${business.phoneE164}`}
          className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "tabular")}
        >
          <Phone />
          {business.phoneDisplay}
        </a>
        <Link href="/" className={buttonVariants({ variant: "ghost", size: "lg" })}>
          Back to the homepage
        </Link>
      </div>
      {error.digest && (
        <p className="text-muted-600 tabular mt-8 text-sm">Reference: {error.digest}</p>
      )}
    </Container>
  );
}
