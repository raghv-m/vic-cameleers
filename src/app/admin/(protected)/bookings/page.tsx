import Link from "next/link";
import type { Metadata } from "next";
import { format, startOfDay } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { JOB_STATUS_LABEL } from "@/lib/job-status";

export const metadata: Metadata = {
  title: "Bookings",
  robots: { index: false, follow: false },
};

export default async function BookingsPage() {
  await requireRole("DISPATCHER");

  const bookings = await db.booking.findMany({
    where: { moveDate: { gte: startOfDay(new Date()) } },
    include: { lead: { include: { customer: true } }, truck: true, job: true },
    orderBy: { moveDate: "asc" },
    take: 100,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <div className="flex items-center gap-4">
          <a href="/api/admin/export/bookings" className="text-primary text-sm hover:underline">
            Export CSV
          </a>
          <Link href="/admin/bookings/today" className="text-primary text-sm hover:underline">
            Today&apos;s moves
          </Link>
        </div>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">Upcoming, soonest first.</p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-muted-foreground border-b text-left">
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 pr-4 font-medium">Customer</th>
              <th className="py-2 pr-4 font-medium">Truck</th>
              <th className="py-2 pr-4 font-medium">Booking status</th>
              <th className="py-2 pr-4 font-medium">Job status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-muted/50 border-b last:border-0">
                <td className="py-2 pr-4">
                  {format(booking.moveDate, "d MMM yyyy")}
                  {booking.preferredTime ? `, ${booking.preferredTime}` : ""}
                </td>
                <td className="py-2 pr-4">
                  <Link href={`/admin/leads/${booking.leadId}`} className="hover:underline">
                    {booking.lead.customer?.name ?? "Unknown"}
                  </Link>
                </td>
                <td className="py-2 pr-4">{booking.truck?.name ?? "—"}</td>
                <td className="py-2 pr-4">
                  <Badge variant={booking.status === "CANCELLED" ? "destructive" : "secondary"}>
                    {booking.status}
                  </Badge>
                </td>
                <td className="py-2 pr-4">
                  {booking.job ? JOB_STATUS_LABEL[booking.job.status] : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <p className="text-muted-foreground py-10 text-center text-sm">No upcoming bookings.</p>
        )}
      </div>
    </div>
  );
}
