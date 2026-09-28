import Link from "next/link";
import type { Metadata } from "next";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import { serverEnv } from "@/env.server";
import { db } from "@/lib/db";
import { melbourneDateKey, melbourneMidnight, melbourneParts } from "@/lib/melbourne-time";
import { requireRole } from "@/lib/rbac";

export const metadata: Metadata = {
  title: "Calendar",
  robots: { index: false, follow: false },
};

type View = "week" | "month";

/** Links must use the real ADMIN_PATH: the proxy 404s literal /admin/... URLs. */
function adminHref(path: string): string {
  return `/${serverEnv.ADMIN_PATH ?? "admin"}${path}`;
}

function parseDate(value: string | undefined): { y: number; m: number; d: number } {
  const match = value && /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match) return { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) };
  const today = melbourneParts();
  return { y: today.year, m: today.month, d: today.day };
}

function key(y: number, m: number, d: number): string {
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toISOString().slice(0, 10);
}

/** Monday-based weekday (0 = Monday) of a calendar date. */
function weekday(y: number, m: number, d: number): number {
  return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
}

/**
 * Booked moves on a week or month grid, in Melbourne dates, each showing time window, reference,
 * truck and crew. Cancelled bookings are left off. DISPATCHER and above, checked server-side.
 */
export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; date?: string }>;
}) {
  await requireRole("DISPATCHER");

  const params = await searchParams;
  const view: View = params.view === "month" ? "month" : "week";
  const { y, m, d } = parseDate(params.date);

  // Grid: whole weeks, Monday first. Week view is the week containing the date; month view is
  // every week touching that month.
  let first: { y: number; m: number; d: number };
  let days: number;
  if (view === "week") {
    first = { y, m, d: d - weekday(y, m, d) };
    days = 7;
  } else {
    const lead = weekday(y, m, 1);
    const inMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
    first = { y, m, d: 1 - lead };
    days = Math.ceil((lead + inMonth) / 7) * 7;
  }

  const gridKeys = Array.from({ length: days }, (_, i) => key(first.y, first.m, first.d + i));
  const rangeStart = melbourneMidnight(first.y, first.m, first.d);
  const rangeEnd = melbourneMidnight(first.y, first.m, first.d + days);

  const bookings = await db.booking.findMany({
    where: { moveDate: { gte: rangeStart, lt: rangeEnd }, status: { not: "CANCELLED" } },
    select: {
      id: true,
      leadId: true,
      moveDate: true,
      preferredTime: true,
      status: true,
      lead: { select: { referenceNumber: true } },
      truck: { select: { name: true } },
      team: { select: { members: { select: { crewMember: { select: { name: true } } } } } },
      job: { select: { assignments: { select: { crewMember: { select: { name: true } } } } } },
    },
    orderBy: { moveDate: "asc" },
  });

  const byDay = new Map<string, typeof bookings>();
  for (const booking of bookings) {
    const k = melbourneDateKey(booking.moveDate);
    byDay.set(k, [...(byDay.get(k) ?? []), booking]);
  }

  const todayKey = melbourneDateKey(new Date());
  const step = view === "week" ? { d: 7, m: 0 } : { d: 0, m: 1 };
  // Months step from the 1st, so 31 March back one month is February, not early March.
  const prev = view === "week" ? key(y, m, d - step.d) : key(y, m - 1, 1);
  const next = view === "week" ? key(y, m, d + step.d) : key(y, m + 1, 1);
  const title =
    view === "week"
      ? `Week of ${new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${gridKeys[0]}T00:00:00Z`))}`
      : new Intl.DateTimeFormat("en-AU", {
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }).format(new Date(Date.UTC(y, m - 1, 1)));
  const href = (v: View, date: string) => adminHref(`/calendar?view=${v}&date=${date}`);
  const current = key(y, m, d);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Calendar</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {title} · {bookings.length} booked move{bookings.length === 1 ? "" : "s"} · Melbourne
            time
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link href={href(view, prev)} className="hover:bg-muted rounded-md border px-3 py-1.5">
            ← Previous
          </Link>
          <Link
            href={href(view, todayKey)}
            className="hover:bg-muted rounded-md border px-3 py-1.5"
          >
            Today
          </Link>
          <Link href={href(view, next)} className="hover:bg-muted rounded-md border px-3 py-1.5">
            Next →
          </Link>
          <span className="bg-border mx-1 h-5 w-px" aria-hidden="true" />
          {(["week", "month"] as const).map((v) => (
            <Link
              key={v}
              href={href(v, current)}
              aria-current={v === view ? "page" : undefined}
              className={cn(
                "rounded-md border px-3 py-1.5 capitalize",
                v === view ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              {v}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="grid min-w-[760px] grid-cols-7 border-t border-l text-sm">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((name) => (
            <div
              key={name}
              className="text-muted-foreground border-r border-b px-2 py-1.5 font-medium"
            >
              {name}
            </div>
          ))}
          {gridKeys.map((dayKey) => {
            const [, mm, dd] = dayKey.split("-").map(Number) as [number, number, number];
            const outside = view === "month" && mm !== m;
            const items = byDay.get(dayKey) ?? [];
            return (
              <div
                key={dayKey}
                className={cn(
                  "border-r border-b p-1.5",
                  view === "week" ? "min-h-64" : "min-h-28",
                  outside && "bg-muted/40",
                )}
              >
                <p
                  className={cn(
                    "mb-1 text-xs font-semibold",
                    dayKey === todayKey
                      ? "bg-primary text-primary-foreground inline-block rounded px-1.5"
                      : outside
                        ? "text-muted-foreground"
                        : "",
                  )}
                >
                  {dd}
                </p>
                <ul className="space-y-1">
                  {items.map((booking) => {
                    const crew = [
                      ...(booking.job?.assignments.map((a) => a.crewMember.name) ?? []),
                      ...(booking.team?.members.map((mem) => mem.crewMember.name) ?? []),
                    ];
                    return (
                      <li key={booking.id}>
                        <Link
                          href={adminHref(`/leads/${booking.leadId}`)}
                          className="hover:bg-muted block rounded border p-1.5 text-xs leading-snug"
                        >
                          <span className="font-semibold">{booking.lead.referenceNumber}</span>
                          {booking.preferredTime && (
                            <span className="text-muted-foreground">
                              {" "}
                              · {booking.preferredTime}
                            </span>
                          )}
                          <span className="mt-0.5 block">
                            {booking.truck?.name ?? <em>No truck</em>}
                          </span>
                          {view === "week" && (
                            <span className="text-muted-foreground block">
                              {crew.length ? [...new Set(crew)].join(", ") : "No crew assigned"}
                            </span>
                          )}
                          {booking.status === "COMPLETED" && (
                            <Badge variant="secondary" className="mt-1">
                              Done
                            </Badge>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
