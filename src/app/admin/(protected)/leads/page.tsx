import Link from "next/link";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import {
  LEAD_SOURCE_LABEL,
  LEAD_STATUS_BADGE_VARIANT,
  LEAD_STATUS_LABEL,
  LEAD_STATUS_ORDER,
} from "@/lib/lead-status";

export const metadata: Metadata = {
  title: "Leads",
  robots: { index: false, follow: false },
};

function formatCents(cents: number): string {
  return `$${Math.round(cents / 100)}`;
}

export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  await requireRole("SUPPORT");
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : undefined;
  const q = typeof params.q === "string" ? params.q.trim() : "";

  const where: Prisma.LeadWhereInput = {
    ...(status && LEAD_STATUS_ORDER.includes(status as (typeof LEAD_STATUS_ORDER)[number])
      ? { status: status as (typeof LEAD_STATUS_ORDER)[number] }
      : {}),
    ...(q
      ? {
          OR: [
            { referenceNumber: { contains: q, mode: "insensitive" } },
            { customer: { name: { contains: q, mode: "insensitive" } } },
            { customer: { phone: { contains: q, mode: "insensitive" } } },
            { customer: { email: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const leads = await db.lead.findMany({
    where,
    include: {
      customer: true,
      quotes: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <a href="/api/admin/export/leads" className="text-primary text-sm hover:underline">
          Export CSV
        </a>
      </div>

      <form className="mt-6 flex flex-wrap items-center gap-3" method="GET">
        <Input
          name="q"
          placeholder="Search name, phone, email, reference"
          defaultValue={q}
          className="max-w-xs"
        />
        {status && <input type="hidden" name="status" value={status} />}
        <button type="submit" className="text-sm underline underline-offset-4">
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/admin/leads"
          className={`text-sm ${!status ? "text-foreground font-medium underline" : "text-muted-foreground hover:underline"}`}
        >
          All
        </Link>
        {LEAD_STATUS_ORDER.map((option) => (
          <Link
            key={option}
            href={`/admin/leads?status=${option}`}
            className={`text-sm ${status === option ? "text-foreground font-medium underline" : "text-muted-foreground hover:underline"}`}
          >
            {LEAD_STATUS_LABEL[option]}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-muted-foreground border-b text-left">
              <th className="py-2 pr-4 font-medium">Reference</th>
              <th className="py-2 pr-4 font-medium">Customer</th>
              <th className="py-2 pr-4 font-medium">Source</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Estimate</th>
              <th className="py-2 pr-4 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const quote = lead.quotes[0];
              return (
                <tr key={lead.id} className="hover:bg-muted/50 border-b last:border-0">
                  <td className="py-2 pr-4">
                    <Link href={`/admin/leads/${lead.id}`} className="font-medium hover:underline">
                      {lead.referenceNumber}
                    </Link>
                  </td>
                  <td className="py-2 pr-4">
                    <div>{lead.customer?.name ?? "Unknown"}</div>
                    <div className="text-muted-foreground text-xs">
                      {lead.customer?.phone ?? lead.customer?.email ?? ""}
                    </div>
                  </td>
                  <td className="py-2 pr-4">{LEAD_SOURCE_LABEL[lead.source]}</td>
                  <td className="py-2 pr-4">
                    <Badge variant={LEAD_STATUS_BADGE_VARIANT[lead.status]}>
                      {LEAD_STATUS_LABEL[lead.status]}
                    </Badge>
                  </td>
                  <td className="py-2 pr-4">
                    {quote
                      ? `${formatCents(quote.estimateLowCents)}–${formatCents(quote.estimateHighCents)}`
                      : "—"}
                  </td>
                  <td className="text-muted-foreground py-2 pr-4">
                    {format(lead.createdAt, "d MMM yyyy, h:mma")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {leads.length === 0 && (
          <p className="text-muted-foreground py-10 text-center text-sm">No leads match.</p>
        )}
      </div>
    </div>
  );
}
