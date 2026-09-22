"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { Service } from "@prisma/client";

import { toggleService } from "@/app/admin/(protected)/settings/actions";
import { Checkbox } from "@/components/ui/checkbox";

export function ServiceToggleList({ services }: { services: Service[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <ul className="divide-y">
      {services.map((service) => (
        <li key={service.id} className="flex items-center justify-between py-2 text-sm">
          <div>
            <p className="font-medium">{service.name}</p>
            <p className="text-muted-foreground text-xs">{service.shortDescription}</p>
          </div>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={service.enabled}
              disabled={pending}
              onCheckedChange={(checked) => {
                startTransition(async () => {
                  const result = await toggleService({ id: service.id, enabled: checked === true });
                  if (!result.success) toast.error(result.error);
                });
              }}
            />
            Enabled
          </label>
        </li>
      ))}
    </ul>
  );
}
