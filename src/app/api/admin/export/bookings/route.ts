import { NextResponse } from "next/server";
import { format } from "date-fns";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { toCsv } from "@/lib/csv";
import { JOB_STATUS_LABEL } from "@/lib/job-status";

export async function GET() {
  await requireRole("DISPATCHER");

  const bookings = await db.booking.findMany({
    include: { lead: { include: { customer: true } }, truck: true, job: true },
    orderBy: { moveDate: "desc" },
  });

  const csv = toCsv(
    bookings.map((booking) => ({
      reference: booking.lead.referenceNumber,
      customerName: booking.lead.customer?.name ?? "",
      moveDate: format(booking.moveDate, "yyyy-MM-dd"),
      preferredTime: booking.preferredTime ?? "",
      truck: booking.truck?.name ?? "",
      bookingStatus: booking.status,
      jobStatus: booking.job ? JOB_STATUS_LABEL[booking.job.status] : "",
    })),
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bookings-${format(new Date(), "yyyy-MM-dd")}.csv"`,
    },
  });
}
