import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { addDays, format, startOfDay } from "date-fns";

import { db } from "@/lib/db";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";
import { sendEmail } from "@/lib/email/client";
import { MoveReminderEmail } from "@/lib/email/templates/move-reminder";
import type { EmailType } from "@prisma/client";

/**
 * Runs once a day (Vercel Cron Jobs). Sends the 7-day and 24-hour move
 * reminders (CLAUDE.md section 9) for bookings landing on those exact
 * calendar days, skipping any booking that already has that reminder type
 * logged so a re-run or a slightly-off cron schedule never double-sends.
 */
async function sendReminderBatch(daysOut: number, type: EmailType, whenLabel: string) {
  const targetDate = addDays(startOfDay(new Date()), daysOut);
  const nextDate = addDays(targetDate, 1);

  const bookings = await db.booking.findMany({
    where: { moveDate: { gte: targetDate, lt: nextDate }, status: "SCHEDULED" },
    include: { lead: { include: { customer: true } }, emailLogs: { where: { type } } },
  });

  let sent = 0;
  for (const booking of bookings) {
    if (booking.emailLogs.length > 0) continue;
    if (!booking.lead.customer?.email) continue;

    await sendEmail({
      type,
      to: booking.lead.customer.email,
      subject: `Your move is ${whenLabel}: ${booking.lead.referenceNumber}`,
      react: MoveReminderEmail({
        customerName: booking.lead.customer.name,
        referenceNumber: booking.lead.referenceNumber,
        moveDateLabel: format(booking.moveDate, "EEEE d MMMM yyyy"),
        preferredTime: booking.preferredTime,
        whenLabel,
      }),
      relatedLeadId: booking.leadId,
      relatedBookingId: booking.id,
    });
    sent += 1;
  }

  return sent;
}

export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [sevenDay, twentyFourHour] = await Promise.all([
    sendReminderBatch(7, "REMINDER_7_DAY", "in 7 days"),
    sendReminderBatch(1, "REMINDER_24_HOUR", "tomorrow"),
  ]);

  return NextResponse.json({
    sevenDayRemindersSent: sevenDay,
    twentyFourHourRemindersSent: twentyFourHour,
  });
}
