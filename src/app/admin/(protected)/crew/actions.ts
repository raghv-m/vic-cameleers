"use server";

import { revalidatePath } from "next/cache";

import { recordAuditLog } from "@/lib/audit-log";
import { toE164AuMobile } from "@/lib/au-phone";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { crewMemberSchema, toggleActiveSchema } from "@/lib/validation/fleet";

type ActionResult = { success: true } | { success: false; error: string };

export async function createCrewMember(input: unknown): Promise<ActionResult> {
  const session = await requireRole("DISPATCHER");

  const parsed = crewMemberSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const crewMember = await db.crewMember.create({
    data: { name: parsed.data.name, phone: toE164AuMobile(parsed.data.phone) },
  });

  await recordAuditLog({
    userId: session.user.id,
    action: "crew_member.created",
    entityType: "CrewMember",
    entityId: crewMember.id,
    after: { name: crewMember.name },
  });

  revalidatePath("/admin/crew");
  return { success: true };
}

export async function toggleCrewActive(input: unknown): Promise<ActionResult> {
  const session = await requireRole("DISPATCHER");

  const parsed = toggleActiveSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const crewMember = await db.crewMember.update({
    where: { id: parsed.data.id },
    data: { isActive: parsed.data.isActive },
  });

  await recordAuditLog({
    userId: session.user.id,
    action: parsed.data.isActive ? "crew_member.activated" : "crew_member.deactivated",
    entityType: "CrewMember",
    entityId: crewMember.id,
  });

  revalidatePath("/admin/crew");
  return { success: true };
}
