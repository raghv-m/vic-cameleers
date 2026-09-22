import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { business } from "@/config/business";
import { getEnabledServices } from "@/config/services";

export const metadata: Metadata = {
  title: "Services",
  description: `Everything ${business.tradingName} moves: houses, apartments, offices, single items, and packing, all at one transparent hourly rate.`,
};

export default function ServicesPage() {
  const services = getEnabledServices();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">What we move</h1>
        <p className="text-muted-foreground mx-auto mt-2 max-w-xl">
          One crew, one truck, one hourly rate, whatever you&apos;re moving. Pick what you need
          below.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="group border-border bg-card hover:border-primary/40 flex flex-col gap-2 rounded-lg border p-5 transition-colors"
          >
            <h2 className="font-heading text-lg font-medium">{service.name}</h2>
            <p className="text-muted-foreground text-sm">{service.shortDescription}</p>
            <span className="text-primary mt-2 inline-flex items-center gap-1 text-sm font-medium">
              Learn more
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
