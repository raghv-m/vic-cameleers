import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { subDays } from "date-fns";

import { db } from "@/lib/db";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";
import { logCronCompleted, logCronFailed, logCronStarted } from "@/lib/cron-log";
import { sendEmail } from "@/lib/email/client";
import { QuoteFollowUpEmail } from "@/lib/email/templates/quote-follow-up";
import { marketingEnvelope } from "@/lib/email/unsubscribe";
import { BUSINESS_SETTINGS_ID } from "@/lib/settings-ids";

const JOB_NAME = "quote-follow-ups";

/** Never chase quotes older than this: after a month the move has almost certainly happened. */
const MAX_AGE_DAYS = 30;

function dollars(cents: number): string {
  return `$${Math.round(cents / 100).toLocaleString("en-AU")}`;
}

/**
 * Daily. One follow-up email per quote-form lead that hasn't booked, quoteFollowUpDays after it
 * came in (Settings → Business). Skips leads that are booked, completed or lost, customers who
 * unsubscribed, and anyone already followed up (an EmailLog of type QUOTE_REMINDER, sent or
 * failed): a follow-up is a nice-to-have, so a failed one is left alone rather than risk a double.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  logCronStarted(JOB_NAME);

  try {
    const settings = await db.businessSettings.findUnique({ where: { id: BUSINESS_SETTINGS_ID } });
    const enabled = settings?.quoteFollowUpEnabled ?? true;
    const days = settings?.quoteFollowUpDays ?? 3;
    if (!enabled) {
      const result = { followUpsSent: 0, skipped: "Quote follow-ups are switched off" };
      logCronCompleted(JOB_NAME, result);
      return NextResponse.json(result);
    }

    const now = new Date();
    const leads = await db.lead.findMany({
      where: {
        source: "QUOTE_FORM",
        status: { in: ["NEW", "CONTACTED", "QUOTED", "FOLLOW_UP"] },
        createdAt: { lte: subDays(now, days), gte: subDays(now, MAX_AGE_DAYS) },
        booking: null,
        emailLogs: { none: { type: "QUOTE_REMINDER" } },
        customer: { email: { not: null }, emailOptOutAt: null },
      },
      include: { customer: true, quotes: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    let sent = 0;
    for (const lead of leads) {
      if (!lead.customer?.email) continue;
      const envelope = marketingEnvelope(lead.customer);
      if (!envelope) continue;
      const quote = lead.quotes[0];
      const estimateLabel = quote
        ? quote.estimateLowCents === quote.estimateHighCents
          ? dollars(quote.estimateLowCents)
          : `${dollars(quote.estimateLowCents)} to ${dollars(quote.estimateHighCents)}`
        : undefined;

      await sendEmail({
        type: "QUOTE_REMINDER",
        to: lead.customer.email,
        subject: `Still planning your move? (${lead.referenceNumber})`,
        react: QuoteFollowUpEmail({
          customerName: lead.customer.name,
          referenceNumber: lead.referenceNumber,
          estimateLabel,
          unsubscribeUrl: envelope.unsubscribeUrl,
        }),
        headers: envelope.headers,
        relatedLeadId: lead.id,
      });
      sent += 1;
    }

    const result = { followUpsSent: sent, afterDays: days };
    logCronCompleted(JOB_NAME, result);
    return NextResponse.json(result);
  } catch (error) {
    logCronFailed(JOB_NAME, error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
