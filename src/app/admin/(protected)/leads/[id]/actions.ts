"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";

import { recordAuditLog } from "@/lib/audit-log";
import { findBookingConflicts, type ExistingBookingRef } from "@/lib/booking-conflicts";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { convertToBookingSchema } from "@/lib/validation/booking";
import { leadNoteSchema, leadStatusUpdateSchema } from "@/lib/validation/lead";

async function clientIp(): Promise<string | null> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}

export async function updateLeadStatus(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  // Crew are scoped to their own assigned jobs only (CLAUDE.md section 10),
  // everyone else on staff can work the pipeline.
  const session = await requireRole("SUPPORT");

  const parsed = leadStatusUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const lead = await db.lead.findUnique({ where: { id: parsed.data.leadId } });
  if (!lead) return { success: false, error: "Lead not found" };

  const updated = await db.lead.update({
    where: { id: parsed.data.leadId },
    data: {
      status: parsed.data.status,
      lostReason: parsed.data.status === "LOST" ? parsed.data.lostReason : null,
    },
  });

  await recordAuditLog({
    userId: session.user.id,
    action: "lead.status_change",
    entityType: "Lead",
    entityId: lead.id,
    ipAddress: await clientIp(),
    before: { status: lead.status, lostReason: lead.lostReason },
    after: { status: updated.status, lostReason: updated.lostReason },
  });

  revalidatePath(`/admin/leads/${lead.id}`);
  revalidatePath("/admin/leads");
  return { success: true };
}

export async function addLeadNote(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  const session = await requireRole("SUPPORT");

  const parsed = leadNoteSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const lead = await db.lead.findUnique({ where: { id: parsed.data.leadId } });
  if (!lead) return { success: false, error: "Lead not found" };

  const note = await db.note.create({
    data: {
      body: parsed.data.body,
      authorId: session.user.id,
      leadId: lead.id,
    },
  });

  await recordAuditLog({
    userId: session.user.id,
    action: "lead.note_added",
    entityType: "Lead",
    entityId: lead.id,
    ipAddress: await clientIp(),
    after: { noteId: note.id },
  });

  revalidatePath(`/admin/leads/${lead.id}`);
  return { success: true };
}

export async function convertToBooking(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  const session = await requireRole("DISPATCHER");

  const parsed = convertToBookingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const lead = await db.lead.findUnique({
    where: { id: parsed.data.leadId },
    include: { booking: true },
  });
  if (!lead) return { success: false, error: "Lead not found" };
  if (lead.booking) return { success: false, error: "This lead already has a booking" };

  const dateISO = parsed.data.moveDate;
  const activeBookings = await db.booking.findMany({
    where: { status: "SCHEDULED" },
    include: { job: { include: { assignments: true } } },
  });

  const existing: ExistingBookingRef[] = activeBookings.map((booking) => ({
    id: booking.id,
    dateISO: format(booking.moveDate, "yyyy-MM-dd"),
    truckId: booking.truckId,
    crewMemberIds: booking.job?.assignments.map((assignment) => assignment.crewMemberId) ?? [],
  }));

  const conflicts = findBookingConflicts(existing, {
    dateISO,
    truckId: parsed.data.truckId ?? null,
    crewMemberIds: parsed.data.crewMemberIds,
  });

  if (conflicts.truckConflict) {
    return { success: false, error: "That truck is already booked for this date" };
  }
  if (conflicts.crewConflictIds.length > 0) {
    return {
      success: false,
      error: "One or more selected crew members are already booked for this date",
    };
  }

  const booking = await db.$transaction(async (tx) => {
    const created = await tx.booking.create({
      data: {
        leadId: lead.id,
        moveDate: new Date(`${dateISO}T00:00:00`),
        preferredTime: parsed.data.preferredTime,
        truckId: parsed.data.truckId,
        status: "SCHEDULED",
      },
    });

    await tx.job.create({
      data: {
        bookingId: created.id,
        status: "SCHEDULED",
        assignments: {
          create: parsed.data.crewMemberIds.map((crewMemberId) => ({ crewMemberId })),
        },
      },
    });

    await tx.lead.update({ where: { id: lead.id }, data: { status: "BOOKED" } });

    return created;
  });

  await recordAuditLog({
    userId: session.user.id,
    action: "lead.converted_to_booking",
    entityType: "Lead",
    entityId: lead.id,
    ipAddress: await clientIp(),
    after: { bookingId: booking.id, moveDate: dateISO },
  });

  revalidatePath(`/admin/leads/${lead.id}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin/bookings");
  return { success: true };
}
