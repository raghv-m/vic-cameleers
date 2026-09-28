import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { subDays } from "date-fns";

import { db } from "@/lib/db";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";
import { logCronCompleted, logCronFailed, logCronStarted } from "@/lib/cron-log";

const JOB_NAME = "stale-quotes";
const STALE_AFTER_DAYS = 14;

/**
 * Weekly. Leads still NEW 14+ days after they came in move to FOLLOW_UP (owner decision
 * 28 Sep 2026: there's no STALE status and the schema stays as is), so they land back on
 * someone's list instead of sitting untouched. Each move gets an audit log entry with no user
 * (the system did it). Only leads that are still NEW at update time change, so a lead someone
 * picks up mid-run is left alone. Safe to run twice: the second run finds nothing.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  logCronStarted(JOB_NAME);

  try {
    const cutoff = subDays(new Date(), STALE_AFTER_DAYS);
    const stale = await db.lead.findMany({
      where: { status: "NEW", createdAt: { lt: cutoff } },
      select: { id: true },
    });
    const ids = stale.map((lead) => lead.id);

    const moved = ids.length
      ? await db.$transaction(async (tx) => {
          // Re-check inside the transaction: only leads still NEW now are moved and audited.
          const still = (
            await tx.lead.findMany({
              where: { id: { in: ids }, status: "NEW" },
              select: { id: true },
            })
          ).map((lead) => lead.id);
          const { count } = await tx.lead.updateMany({
            where: { id: { in: still }, status: "NEW" },
            data: { status: "FOLLOW_UP" },
          });
          await tx.auditLog.createMany({
            data: still.map((entityId) => ({
              userId: null,
              action: "lead.status.auto_follow_up",
              entityType: "Lead",
              entityId,
              before: { status: "NEW" },
              after: { status: "FOLLOW_UP", reason: `NEW for ${STALE_AFTER_DAYS}+ days` },
            })),
          });
          return count;
        })
      : 0;

    const result = { staleLeadsMovedToFollowUp: moved };
    logCronCompleted(JOB_NAME, result);
    return NextResponse.json(result);
  } catch (error) {
    logCronFailed(JOB_NAME, error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
