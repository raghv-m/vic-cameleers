import type { Metadata } from "next";
import { endOfDay, format, startOfDay } from "date-fns";

import { JobStatusControl } from "@/components/admin/job-status-control";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";

export const metadata: Metadata = {
  title: "Today's moves",
  robots: { index: false, follow: false },
};

export default async function TodaysMovesPage() {
  await requireRole("DISPATCHER");

  const now = new Date();
  const bookings = await db.booking.findMany({
    where: { moveDate: { gte: startOfDay(now), lte: endOfDay(now) }, status: "SCHEDULED" },
    include: {
      lead: { include: { customer: true } },
      truck: true,
      job: { include: { assignments: { include: { crewMember: true } } } },
    },
    orderBy: { moveDate: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Today&apos;s moves</h1>
      <p className="text-muted-foreground mt-1 text-sm">{format(now, "EEEE d MMMM yyyy")}</p>

      <ul className="mt-6 space-y-3">
        {bookings.map((booking) => (
          <li key={booking.id} className="rounded-md border p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium">
                  {booking.lead.customer?.name ?? "Unknown"}
                  {booking.preferredTime ? ` · ${booking.preferredTime}` : ""}
                </p>
                <p className="text-muted-foreground text-sm">
                  {booking.lead.referenceNumber} &middot;{" "}
                  {booking.truck?.name ?? "No truck assigned"}
                </p>
                {booking.job && booking.job.assignments.length > 0 && (
                  <p className="text-muted-foreground text-sm">
                    Crew: {booking.job.assignments.map((a) => a.crewMember.name).join(", ")}
                  </p>
                )}
              </div>
              {booking.job ? (
                <JobStatusControl jobId={booking.job.id} status={booking.job.status} />
              ) : (
                <Badge variant="outline">No job record</Badge>
              )}
            </div>
          </li>
        ))}

        {bookings.length === 0 && (
          <p className="text-muted-foreground py-10 text-center text-sm">
            No moves scheduled today.
          </p>
        )}
      </ul>
    </div>
  );
}
