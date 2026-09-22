import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { getEnabledServices } from "@/config/services";

export function ServicesGrid() {
  const services = getEnabledServices();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">What we move</h2>
        <p className="text-muted-foreground mt-2">
          Pick what you need. Every job gets the same crew, the same truck, the same rate.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="group border-border bg-card hover:border-primary/40 flex flex-col gap-2 rounded-lg border p-5 transition-colors"
          >
            <h3 className="font-heading text-lg font-medium">{service.name}</h3>
            <p className="text-muted-foreground text-sm">{service.shortDescription}</p>
            <span className="text-primary mt-2 inline-flex items-center gap-1 text-sm font-medium">
              Learn more
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
