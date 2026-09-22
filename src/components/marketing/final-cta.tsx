import { Phone } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { business } from "@/config/business";
import { ctaCopy } from "@/config/copy";

export function FinalCta() {
  return (
    <section className="bg-primary text-primary-foreground py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight">Ready when you are.</h2>
        <p className="text-primary-foreground/85 max-w-xl">
          Get your free quote in a couple of minutes, or call us direct.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            variant="secondary"
            render={<Link href="/quote" />}
            nativeButton={false}
          >
            {ctaCopy.primary}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            render={<a href={`tel:${business.phoneE164}`} />}
            nativeButton={false}
          >
            <Phone className="h-4 w-4" />
            Call {business.phoneDisplay}
          </Button>
        </div>
      </div>
    </section>
  );
}
