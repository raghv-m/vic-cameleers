import type { Metadata } from "next";

import { toggleCrewActive } from "@/app/admin/(protected)/crew/actions";
import { AddCrewForm } from "@/components/admin/add-crew-form";
import { ToggleActiveButton } from "@/components/admin/toggle-active-button";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";

export const metadata: Metadata = {
  title: "Crew",
  robots: { index: false, follow: false },
};

export default async function CrewPage() {
  await requireRole("DISPATCHER");
  const crewMembers = await db.crewMember.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Crew</h1>

      <div className="mt-6 rounded-md border p-4">
        <AddCrewForm />
      </div>

      <ul className="mt-6 divide-y">
        {crewMembers.map((crewMember) => (
          <li key={crewMember.id} className="flex items-center justify-between gap-4 py-3 text-sm">
            <div>
              <p className="font-medium">{crewMember.name}</p>
              <p className="text-muted-foreground text-xs">{crewMember.phone}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={crewMember.isActive ? "default" : "outline"}>
                {crewMember.isActive ? "Active" : "Inactive"}
              </Badge>
              <ToggleActiveButton
                id={crewMember.id}
                isActive={crewMember.isActive}
                action={toggleCrewActive}
              />
            </div>
          </li>
        ))}
        {crewMembers.length === 0 && (
          <p className="text-muted-foreground py-6 text-sm">No crew members yet.</p>
        )}
      </ul>
    </div>
  );
}
