import { Phone } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { business } from "@/config/business";

/**
 * Placeholder hero only, to prove out the design system (header, footer,
 * sticky mobile bar, theme tokens, fonts). The full 11-section homepage is
 * built in Milestone 1B.
 */
export default function Home() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        You move. We make it easy.
      </h1>
      <p className="text-muted-foreground max-w-xl text-lg">
        Based in {business.baseSuburb}, moving homes and businesses across{" "}
        {business.serviceAreaDescription}.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" render={<Link href="/quote" />} nativeButton={false}>
          Get an instant estimate
        </Button>
        <Button
          size="lg"
          variant="secondary"
          render={<a href={`tel:${business.phoneE164}`} />}
          nativeButton={false}
        >
          <Phone className="h-4 w-4" />
          Call {business.phoneDisplay}
        </Button>
      </div>
    </div>
  );
}
