import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { subHours } from "date-fns";
import { Resend } from "resend";

import { business } from "@/config/business";
import { serverEnv } from "@/env.server";
import { adminLeadUrl } from "@/lib/admin-lead-url";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";
import { logCronCompleted, logCronFailed, logCronStarted } from "@/lib/cron-log";
import { db } from "@/lib/db";
import { log } from "@/lib/log";
import { melbourneDayRange, melbourneParts } from "@/lib/melbourne-time";
import { DailyDigestEmail } from "@/lib/ops/daily-digest-email";

const JOB_NAME = "daily-digest";
const SEND_AT_MELBOURNE_HOUR = 7;

/**
 * 7am Melbourne ops digest to LEAD_NOTIFY_EMAIL: today's moves (window, truck, crew), new leads
 * from the last 24 hours, which reminders go out, and follow-ups waiting. References only, no
 * customer details.
 *
 * Vercel Cron runs on UTC, and Melbourne's offset changes with daylight saving, so vercel.json
 * triggers this at 20:00 and 21:00 UTC and it only sends on the run where it's 7am in Melbourne.
 * `?force=1` (still needs the cron secret) sends regardless, for testing.
 *
 * Sent straight through Resend rather than sendEmail: EmailLog's type enum has no digest value
 * and the schema stays unchanged (owner decision 28 Sep 2026). The send is logged as an event.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const force = request.nextUrl.searchParams.get("force") === "1";
  if (!force && melbourneParts(now).hour !== SEND_AT_MELBOURNE_HOUR) {
    return NextResponse.json({ skipped: "Not 7am in Melbourne" });
  }

  logCronStarted(JOB_NAME);
  try {
    const today = melbourneDayRange(0, now);
    const in7 = melbourneDayRange(7, now);
    const in1 = melbourneDayRange(1, now);

    const [newLeads, moves, remind7, remind1, followUps] = await Promise.all([
      db.lead.findMany({
        where: { createdAt: { gte: subHours(now, 24) } },
        select: { id: true, referenceNumber: true },
        orderBy: { createdAt: "asc" },
      }),
      db.booking.findMany({
        where: { moveDate: { gte: today.start, lt: today.end }, status: { not: "CANCELLED" } },
        select: {
          leadId: true,
          preferredTime: true,
          lead: { select: { referenceNumber: true } },
          truck: { select: { name: true } },
          team: { select: { members: { select: { crewMember: { select: { name: true } } } } } },
          job: {
            select: { assignments: { select: { crewMember: { select: { name: true } } } } },
          },
        },
        orderBy: { moveDate: "asc" },
      }),
      db.booking.findMany({
        where: { moveDate: { gte: in7.start, lt: in7.end }, status: { not: "CANCELLED" } },
        select: { lead: { select: { referenceNumber: true } } },
      }),
      db.booking.findMany({
        where: { moveDate: { gte: in1.start, lt: in1.end }, status: { not: "CANCELLED" } },
        select: { lead: { select: { referenceNumber: true } } },
      }),
      db.lead.count({ where: { status: "FOLLOW_UP" } }),
    ]);

    const dateLabel = new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Melbourne",
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(now);

    const email = DailyDigestEmail({
      dateLabel,
      newLeads: newLeads.map((lead) => ({
        reference: lead.referenceNumber,
        adminUrl: adminLeadUrl(lead.id),
      })),
      movesToday: moves.map((move) => {
        const crew = [
          ...(move.job?.assignments.map((a) => a.crewMember.name) ?? []),
          ...(move.team?.members.map((m) => m.crewMember.name) ?? []),
        ];
        return {
          reference: move.lead.referenceNumber,
          window: move.preferredTime ?? "time to confirm",
          truck: move.truck?.name ?? "truck not assigned",
          crew: crew.length ? [...new Set(crew)].join(", ") : "crew not assigned",
          adminUrl: adminLeadUrl(move.leadId),
        };
      }),
      reminders7Day: remind7.map((b) => b.lead.referenceNumber),
      reminders1Day: remind1.map((b) => b.lead.referenceNumber),
      followUpsWaiting: followUps,
      adminHomeUrl: serverEnv.ADMIN_PATH
        ? `${business.siteUrl}/${serverEnv.ADMIN_PATH}`
        : undefined,
    });

    if (!serverEnv.RESEND_API_KEY || !serverEnv.EMAIL_FROM || !serverEnv.LEAD_NOTIFY_EMAIL) {
      const result = { sent: false, skipped: "Email not configured" };
      logCronCompleted(JOB_NAME, result);
      return NextResponse.json(result);
    }

    const { error } = await new Resend(serverEnv.RESEND_API_KEY).emails.send({
      from: serverEnv.EMAIL_FROM,
      to: serverEnv.LEAD_NOTIFY_EMAIL,
      subject: `Daily digest: ${moves.length} move(s) today, ${newLeads.length} new lead(s)`,
      react: email,
    });
    if (error) throw new Error(error.message);

    log.info("OPS_DIGEST_SENT", { moves: moves.length, newLeads: newLeads.length });
    const result = { sent: true, moves: moves.length, newLeads: newLeads.length };
    logCronCompleted(JOB_NAME, result);
    return NextResponse.json(result);
  } catch (error) {
    logCronFailed(JOB_NAME, error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
