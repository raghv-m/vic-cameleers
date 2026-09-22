"use client";

import { Phone } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { CamelMark } from "@/components/brand/camel-mark";
import { RouteMotif } from "@/components/marketing/route-motif";
import { Button } from "@/components/ui/button";
import { business } from "@/config/business";
import { ctaCopy } from "@/config/copy";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

// The headline is almost always the LCP element - keep it visible from the
// first paint (no opacity animation) and only give it a small settle-in
// motion, so the entrance animation elsewhere never costs a Core Web
// Vitals hit on the one thing that matters most for it.
const settleUp = {
  hidden: { opacity: 1, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <CamelMark
        className="text-foreground pointer-events-none absolute top-1/2 -right-24 hidden h-[420px] w-[420px] -translate-y-1/2 opacity-[0.04] sm:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="text-primary text-xs font-semibold tracking-[0.14em] uppercase"
        >
          Melbourne&apos;s local moving crew
        </motion.p>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={settleUp}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="font-heading text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl lg:text-7xl"
        >
          Move house without
          <br className="hidden sm:block" /> the moving-day chaos.
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-muted-foreground max-w-xl text-lg"
        >
          Based in {business.baseSuburb}, moving homes and businesses across{" "}
          {business.serviceAreaDescription}. Transparent {business.hourlyRateDisplay} rate,{" "}
          {business.minimumHours} hour minimum, no surprises.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.24 }}
        >
          <RouteMotif className="h-8 w-44" />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Button size="lg" render={<Link href="/quote" />} nativeButton={false}>
            {ctaCopy.primary}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            render={<a href={`tel:${business.phoneE164}`} />}
            nativeButton={false}
          >
            <Phone className="h-4 w-4" />
            {ctaCopy.call}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
