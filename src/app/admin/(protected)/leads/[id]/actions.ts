"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { recordAuditLog } from "@/lib/audit-log";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
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
