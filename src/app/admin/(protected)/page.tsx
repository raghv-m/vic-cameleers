import Link from "next/link";
import type { Metadata } from "next";
import { startOfDay, startOfWeek } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/rbac";
import { LEAD_STATUS_BADGE_VARIANT, LEAD_STATUS_LABEL, LEAD_STATUS_ORDER } from "@/lib/lead-status";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const session = await requireSession();

  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });

  const [
    leadsToday,
    leadsThisWeek,
    statusCounts,
    bookedCount,
    totalCount,
    recentLeads,
    upcomingMoves,
    bookedQuotes,
  ] = await Promise.all([
    db.lead.count({ where: { createdAt: { gte: todayStart } } }),
    db.lead.count({ where: { createdAt: { gte: weekStart } } }),
    db.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    db.lead.count({ where: { status: "BOOKED" } }),
    db.lead.count(),
    db.lead.findMany({
      include: { customer: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.booking.count({ where: { moveDate: { gte: todayStart }, status: "SCHEDULED" } }),
    db.quote.findMany({
      where: { lead: { status: "BOOKED" } },
      orderBy: { createdAt: "desc" },
      distinct: ["leadId"],
      select: { estimateLowCents: true, estimateHighCents: true },
    }),
  ]);

  const countByStatus = Object.fromEntries(
    statusCounts.map((row) => [row.status, row._count._all]),
  );
  const conversionRate = totalCount > 0 ? Math.round((bookedCount / totalCount) * 100) : null;

  // Rough estimate, not a real revenue figure: sum of each booked lead's
  // quoted range midpoint. The final price is based on actual time on the
  // job (CLAUDE.md section 6), so this is directional only.
  const revenueEstimateCents = bookedQuotes.reduce(
    (sum, quote) => sum + (quote.estimateLowCents + quote.estimateHighCents) / 2,
    0,
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground mt-1">
        Signed in as {session.user.name} ({session.user.role}).
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-xs font-normal">Leads today</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{leadsToday}</CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-xs font-normal">
              Leads this week
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{leadsThisWeek}</CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-xs font-normal">Booked</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{bookedCount}</CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-xs font-normal">Conversion</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {conversionRate === null ? "—" : `${conversionRate}%`}
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-xs font-normal">
              Upcoming moves
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{upcomingMoves}</CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-xs font-normal">
              Revenue estimate
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            ${Math.round(revenueEstimateCents / 100).toLocaleString()}
          </CardContent>
        </Card>
      </div>

      <h2 className="mt-8 text-sm font-medium">Pipeline</h2>
      <div className="mt-2 flex flex-wrap gap-2">
        {LEAD_STATUS_ORDER.map((status) => (
          <Badge key={status} variant={LEAD_STATUS_BADGE_VARIANT[status]}>
            {LEAD_STATUS_LABEL[status]}: {countByStatus[status] ?? 0}
          </Badge>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-sm font-medium">Recent leads</h2>
        <Link href="/admin/leads" className="text-primary text-sm hover:underline">
          View all
        </Link>
      </div>
      <ul className="mt-2 divide-y">
        {recentLeads.map((lead) => (
          <li key={lead.id} className="flex items-center justify-between py-2 text-sm">
            <Link href={`/admin/leads/${lead.id}`} className="hover:underline">
              {lead.referenceNumber} &middot; {lead.customer?.name ?? "Unknown"}
            </Link>
            <Badge variant={LEAD_STATUS_BADGE_VARIANT[lead.status]}>
              {LEAD_STATUS_LABEL[lead.status]}
            </Badge>
          </li>
        ))}
        {recentLeads.length === 0 && (
          <li className="text-muted-foreground py-4 text-sm">No leads yet.</li>
        )}
      </ul>

      <p className="text-muted-foreground mt-8 text-xs">
        Revenue estimate is a rough sum of quoted ranges for booked leads, not a real figure. The
        final price is always based on actual time on the job.
      </p>
    </div>
  );
}
