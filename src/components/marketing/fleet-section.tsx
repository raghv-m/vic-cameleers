"use client";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";

import { business } from "@/config/business";

/**
 * "Suited to" text mirrors the actual truck/crew assignment logic in
 * src/lib/pricing.ts (chooseTruckAndCrew), not invented capacity specs.
 */
const fleet = [
  {
    size: "SIX_TONNE" as const,
    label: "6 tonne truck",
    crew: "2 movers",
    suitedTo: "Studio, 1 and 2 bedroom homes",
  },
  {
    size: "TEN_TONNE" as const,
    label: "10 tonne truck",
    crew: "3-4 movers",
    suitedTo: "3+ bedroom homes, offices, and heavy items like pianos or safes",
  },
];

export function FleetSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Our fleet</h2>
        <p className="text-muted-foreground mt-2">
          Two truck sizes, matched to your job automatically when you get a quote.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {fleet.map((truck, index) => (
          <motion.div
            key={truck.size}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="border-border bg-card rounded-lg border p-6"
          >
            <Truck className="text-primary h-8 w-8" />
            <h3 className="font-heading mt-4 text-lg font-medium">{truck.label}</h3>
            <p className="text-muted-foreground mt-1 text-sm">{truck.crew} on the job</p>
            <p className="text-foreground mt-3 text-sm">{truck.suitedTo}</p>
          </motion.div>
        ))}
      </div>

      <p className="text-muted-foreground mt-6 text-center text-xs">
        Crew of {business.crewSize} across the fleet, based out of {business.baseSuburb}.
      </p>
    </section>
  );
}
