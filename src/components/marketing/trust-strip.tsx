import { Banknote, MapPin, Truck, Users } from "lucide-react";

import { business } from "@/config/business";

const items = [
  { icon: Banknote, label: `${business.hourlyRateDisplay}, ${business.minimumHours}hr minimum` },
  { icon: Truck, label: "6 tonne and 10 tonne trucks" },
  { icon: Users, label: `Local ${business.baseSuburb.replace(" VIC", "")} crew` },
  { icon: MapPin, label: `ABN ${business.abn}` },
];

export function TrustStrip() {
  return (
    <section className="border-border bg-secondary/30 border-y">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <item.icon className="text-primary h-5 w-5 shrink-0" />
            <span className="text-foreground text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
