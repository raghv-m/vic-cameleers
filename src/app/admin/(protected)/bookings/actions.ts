"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";

import { recordAuditLog } from "@/lib/audit-log";
import { db } from "@/lib/db";
import { BookingConfirmedEmail } from "@/lib/email/templates/booking-confirmed";
import { CrewOnTheWayEmail } from "@/lib/email/templates/crew-on-the-way";
import { MoveCompletedEmail } from "@/lib/email/templates/move-completed";
import { sendEmail } from "@/lib/email/client";
import { marketingEnvelope } from "@/lib/email/unsubscribe";
import { requireRole } from "@/lib/rbac";
import { jobStatusUpdateSchema, sendBookingConfirmationSchema } from "@/lib/validation/booking";

type ActionResult = { success: true } | { success: false; error: string };

async function clientIp(): Promise<string | null> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}

export async function updateJobStatus(input: unknown): Promise<ActionResult> {
  const session = await requireRole("DISPATCHER");

  const parsed = jobStatusUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const job = await db.job.findUnique({
    where: { id: parsed.data.jobId },
    include: {
      booking: {
        include: {
          lead: {
            include: {
              customer: true,
              emailLogs: { where: { type: { in: ["CREW_ON_THE_WAY", "MOVE_COMPLETED"] } } },
            },
          },
        },
      },
    },
  });
  if (!job) return { success: false, error: "Job not found" };

  const updated = await db.job.update({
    where: { id: job.id },
    data: {
      status: parsed.data.status,
      startedAt: parsed.data.status === "EN_ROUTE" && !job.startedAt ? new Date() : undefined,
      completedAt: parsed.data.status === "COMPLETED" ? new Date() : undefined,
    },
  });

  // A finished job closes out the booking and its lead, which is what
  // unblocks the review-request cron (CLAUDE.md section 9).
  if (parsed.data.status === "COMPLETED") {
    await db.booking.update({ where: { id: job.bookingId }, data: { status: "COMPLETED" } });
    await db.lead.update({ where: { id: job.booking.leadId }, data: { status: "COMPLETED" } });
  }

  await sendJobStatusEmail(job.booking, parsed.data.status);

  await recordAuditLog({
    userId: session.user.id,
    action: "job.status_change",
    entityType: "Job",
    entityId: job.id,
    ipAddress: await clientIp(),
    before: { status: job.status },
    after: { status: updated.status },
  });

  revalidatePath("/admin/bookings/today");
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/leads/${job.booking.leadId}`);
  return { success: true };
}

/**
 * Customer emails tied to job status, each sent once per lead: "crew on the way" when the job
 * goes En route, and a thank-you when it's Completed (skipped if the customer unsubscribed; the
 * review request follows a day later from its own cron). sendEmail never throws, so a failed
 * email can't block the status change.
 */
async function sendJobStatusEmail(
  booking: {
    id: string;
    leadId: string;
    lead: {
      referenceNumber: string;
      customer: {
        id: string;
        name: string;
        email: string | null;
        emailOptOutAt: Date | null;
      } | null;
      emailLogs: { type: string }[];
    };
  },
  status: string,
): Promise<void> {
  const { lead } = booking;
  const customer = lead.customer;
  if (!customer?.email) return;
  const alreadySent = (type: string) => lead.emailLogs.some((log) => log.type === type);
  const related = { relatedLeadId: booking.leadId, relatedBookingId: booking.id };

  if (status === "EN_ROUTE" && !alreadySent("CREW_ON_THE_WAY")) {
    await sendEmail({
      type: "CREW_ON_THE_WAY",
      to: customer.email,
      subject: `Your crew is on the way (${lead.referenceNumber})`,
      react: CrewOnTheWayEmail({
        customerName: customer.name,
        referenceNumber: lead.referenceNumber,
      }),
      ...related,
    });
  }

  if (status === "COMPLETED" && !alreadySent("MOVE_COMPLETED")) {
    const envelope = marketingEnvelope(customer);
    if (!envelope) return;
    await sendEmail({
      type: "MOVE_COMPLETED",
      to: customer.email,
      subject: "Thanks for moving with Vic Cameleers",
      react: MoveCompletedEmail({
        customerName: customer.name,
        referenceNumber: lead.referenceNumber,
        unsubscribeUrl: envelope.unsubscribeUrl,
      }),
      headers: envelope.headers,
      ...related,
    });
  }
}

export async function sendBookingConfirmation(input: unknown): Promise<ActionResult> {
  const session = await requireRole("DISPATCHER");

  const parsed = sendBookingConfirmationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const booking = await db.booking.findUnique({
    where: { id: parsed.data.bookingId },
    include: { lead: { include: { customer: true } } },
  });
  if (!booking) return { success: false, error: "Booking not found" };
  if (!booking.lead.customer?.email)
    return { success: false, error: "Customer has no email on file" };

  await sendEmail({
    type: "BOOKING_CONFIRMED",
    to: booking.lead.customer.email,
    subject: `Your move is confirmed: ${booking.lead.referenceNumber}`,
    react: BookingConfirmedEmail({
      customerName: booking.lead.customer.name,
      referenceNumber: booking.lead.referenceNumber,
      moveDateLabel: format(booking.moveDate, "EEEE d MMMM yyyy"),
      preferredTime: booking.preferredTime,
    }),
    relatedLeadId: booking.leadId,
    relatedBookingId: booking.id,
  });

  await recordAuditLog({
    userId: session.user.id,
    action: "booking.confirmation_sent",
    entityType: "Booking",
    entityId: booking.id,
    ipAddress: await clientIp(),
  });

  revalidatePath(`/admin/leads/${booking.leadId}`);
  return { success: true };
}
