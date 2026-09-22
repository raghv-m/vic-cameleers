"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";

import { recordAuditLog } from "@/lib/audit-log";
import { db } from "@/lib/db";
import { BookingConfirmedEmail } from "@/lib/email/templates/booking-confirmed";
import { sendEmail } from "@/lib/email/client";
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
    include: { booking: true },
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
