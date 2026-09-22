import { Phone } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { business } from "@/config/business";

export function StickyMobileBar() {
  return (
    <div
      className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t p-3 backdrop-blur lg:hidden"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <Button
        variant="secondary"
        className="flex-1"
        render={<a href={`tel:${business.phoneE164}`} />}
        nativeButton={false}
      >
        <Phone className="h-4 w-4" />
        Call
      </Button>
      <Button className="flex-1" render={<Link href="/quote" />} nativeButton={false}>
        Get estimate
      </Button>
    </div>
  );
}
