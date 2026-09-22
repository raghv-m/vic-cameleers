import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { subDays } from "date-fns";

import { db } from "@/lib/db";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";
import { logCronCompleted, logCronFailed, logCronStarted } from "@/lib/cron-log";
import { sendEmail } from "@/lib/email/client";
import { ReviewRequestEmail } from "@/lib/email/templates/review-request";

const JOB_NAME = "review-requests";

/**
 * Runs once a day. Sends a review request 1+ days after a job is marked
 * Completed (CLAUDE.md section 9), for leads that don't already have one
 * logged. Needs a Google review URL set in Settings first; skips silently
 * if none is configured yet rather than sending a broken link.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  logCronStarted(JOB_NAME);

  try {
    const businessSettings = await db.businessSettings.findFirst();
    if (!businessSettings?.googleReviewUrl) {
      const result = { reviewRequestsSent: 0, skipped: "No Google review URL configured" };
      logCronCompleted(JOB_NAME, result);
      return NextResponse.json(result);
    }

    const cutoff = subDays(new Date(), 1);

    const leads = await db.lead.findMany({
      where: {
        status: "COMPLETED",
        booking: { job: { completedAt: { lte: cutoff } } },
        reviews: { none: {} },
      },
      include: { customer: true, emailLogs: { where: { type: "REVIEW_REQUEST" } } },
    });

    let sent = 0;
    for (const lead of leads) {
      if (lead.emailLogs.length > 0) continue;
      if (!lead.customer?.email) continue;

      await sendEmail({
        type: "REVIEW_REQUEST",
        to: lead.customer.email,
        subject: "How did we do?",
        react: ReviewRequestEmail({
          customerName: lead.customer.name,
          googleReviewUrl: businessSettings.googleReviewUrl,
        }),
        relatedLeadId: lead.id,
      });
      sent += 1;
    }

    const result = { reviewRequestsSent: sent };
    logCronCompleted(JOB_NAME, result);
    return NextResponse.json(result);
  } catch (error) {
    logCronFailed(JOB_NAME, error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
