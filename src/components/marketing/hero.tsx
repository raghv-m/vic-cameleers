import { Phone } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { business } from "@/config/business";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        You move. We make it easy.
      </h1>
      <p className="text-muted-foreground max-w-xl text-lg">
        Based in {business.baseSuburb}, moving homes and businesses across{" "}
        {business.serviceAreaDescription}. Transparent {business.hourlyRateDisplay} rate,{" "}
        {business.minimumHours} hour minimum, no surprises.
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
    </section>
  );
}
