import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ClipboardList, MapPin, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { business } from "@/config/business";

export const metadata: Metadata = {
  title: "How it works",
  description: `How a move with ${business.tradingName} works, from your first estimate to moving day.`,
};

const steps = [
  {
    icon: ClipboardList,
    title: "Tell us about your move",
    description:
      "Head to our quote page and answer a few questions: where you're moving from and to, your move date, the size of the place, and anything extra like packing or a piano. Takes a couple of minutes.",
  },
  {
    icon: Calendar,
    title: "Get your estimate",
    description: `You'll see a real price range straight away, based on your actual job, not a generic guess. We show our maths: base hours for your property size, extra time for stairs or a long carry, and the ${business.calloutMinutes} minute call-out.`,
  },
  {
    icon: MapPin,
    title: "Pick your date",
    description:
      "Choose a date and preferred time. We'll confirm by phone or SMS, and lock in your truck and crew ahead of the day. If your date's flexible, tell us, it sometimes helps us fit you in sooner.",
  },
  {
    icon: Truck,
    title: "We move you",
    description:
      "Our crew turns up on time with the right truck for your job. We load carefully, drive safely, and unload where you want things. You pay for actual time on the job, always within the range we quoted.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">How it works</h1>
        <p className="text-muted-foreground mt-2">
          Four steps from quote to moving day, no surprises along the way.
        </p>
      </div>

      <ol className="space-y-10">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-5">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-full">
                <step.icon className="h-5 w-5" />
              </div>
              {index < steps.length - 1 && <div className="bg-border mt-2 w-px flex-1" />}
            </div>
            <div className="pb-2">
              <p className="text-muted-foreground text-sm font-medium">
                Step {index + 1} of {steps.length}
              </p>
              <h2 className="font-heading mt-1 text-xl font-medium">{step.title}</h2>
              <p className="text-muted-foreground mt-2">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 text-center">
        <Button size="lg" render={<Link href="/quote" />} nativeButton={false}>
          Get your free estimate
        </Button>
      </div>
    </div>
  );
}
