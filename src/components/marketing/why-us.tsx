"use client";

import { motion } from "framer-motion";
import { MapPin, Truck, Wallet } from "lucide-react";

const differentiators = [
  {
    icon: Truck,
    title: "Real crew, real trucks",
    description: "Local movers based in Cranbourne, not a subcontractor lottery.",
  },
  {
    icon: Wallet,
    title: "Transparent pricing",
    description: "One hourly rate, shown up front, with the maths behind every estimate.",
  },
  {
    icon: MapPin,
    title: "Victoria only",
    description: "We know Melbourne. No interstate jobs, no long-haul guesswork.",
  },
];

export function WhyUs() {
  return (
    <section className="bg-navy text-navy-foreground py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">
            The Vic Cameleers difference
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Built on the same reliability as the original long-haul movers.
          </h2>
          <p className="text-navy-foreground/70 mt-4">
            In 1860, camels and cameleers landed at Port Melbourne to carry supplies for the Burke
            and Wills expedition, and spent decades hauling goods across the country through tough
            conditions. Vic Cameleers carries that same reliability into modern Melbourne moves.
          </p>
        </motion.div>

        <dl className="grid gap-5">
          {differentiators.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="flex gap-4 border-b border-white/10 pb-5 last:border-0 last:pb-0"
            >
              <item.icon className="text-primary h-6 w-6 shrink-0" />
              <div>
                <dt className="font-medium">{item.title}</dt>
                <dd className="text-navy-foreground/70 mt-1 text-sm">{item.description}</dd>
              </div>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
