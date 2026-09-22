import type { Metadata } from "next";

import { toggleTruckActive } from "@/app/admin/(protected)/trucks/actions";
import { AddTruckForm } from "@/components/admin/add-truck-form";
import { ToggleActiveButton } from "@/components/admin/toggle-active-button";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";

export const metadata: Metadata = {
  title: "Trucks",
  robots: { index: false, follow: false },
};

const sizeLabel = { SIX_TONNE: "6 tonne", TEN_TONNE: "10 tonne" } as const;

export default async function TrucksPage() {
  await requireRole("DISPATCHER");
  const trucks = await db.truck.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Trucks</h1>

      <div className="mt-6 rounded-md border p-4">
        <AddTruckForm />
      </div>

      <ul className="mt-6 divide-y">
        {trucks.map((truck) => (
          <li key={truck.id} className="flex items-center justify-between gap-4 py-3 text-sm">
            <div>
              <p className="font-medium">
                {truck.name} &middot; {sizeLabel[truck.size]}
              </p>
              <p className="text-muted-foreground text-xs">
                {truck.registration ?? "No registration on file"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={truck.isActive ? "default" : "outline"}>
                {truck.isActive ? "Active" : "Inactive"}
              </Badge>
              <ToggleActiveButton
                id={truck.id}
                isActive={truck.isActive}
                action={toggleTruckActive}
              />
            </div>
          </li>
        ))}
        {trucks.length === 0 && (
          <p className="text-muted-foreground py-6 text-sm">No trucks yet.</p>
        )}
      </ul>
    </div>
  );
}
