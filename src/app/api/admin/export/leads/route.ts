import { NextResponse } from "next/server";
import { format } from "date-fns";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { toCsv } from "@/lib/csv";
import { LEAD_SOURCE_LABEL, LEAD_STATUS_LABEL } from "@/lib/lead-status";

export async function GET() {
  await requireRole("DISPATCHER");

  const leads = await db.lead.findMany({
    include: { customer: true, quotes: { orderBy: { createdAt: "desc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  const csv = toCsv(
    leads.map((lead) => ({
      reference: lead.referenceNumber,
      customerName: lead.customer?.name ?? "",
      customerPhone: lead.customer?.phone ?? "",
      customerEmail: lead.customer?.email ?? "",
      source: LEAD_SOURCE_LABEL[lead.source],
      status: LEAD_STATUS_LABEL[lead.status],
      lostReason: lead.lostReason ?? "",
      estimateLow: lead.quotes[0] ? (lead.quotes[0].estimateLowCents / 100).toFixed(2) : "",
      estimateHigh: lead.quotes[0] ? (lead.quotes[0].estimateHighCents / 100).toFixed(2) : "",
      createdAt: format(lead.createdAt, "yyyy-MM-dd HH:mm"),
    })),
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${format(new Date(), "yyyy-MM-dd")}.csv"`,
    },
  });
}
