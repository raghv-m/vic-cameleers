"use server";

import { randomBytes } from "node:crypto";

import { revalidatePath } from "next/cache";
import argon2 from "argon2";

import { recordAuditLog } from "@/lib/audit-log";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import {
  createStaffSchema,
  toggleStaffActiveSchema,
  updateStaffRoleSchema,
} from "@/lib/validation/staff";

type ActionResult =
  { success: true; temporaryPassword: string } | { success: false; error: string };

/**
 * Creates a staff account with a random one-time password shown once in
 * the response and never logged, emailed, or stored in plain text - the
 * same credential shape `scripts/seed-admin.ts` writes (providerId
 * "credential", accountId = user id), so it signs in the same way.
 * The new staff member still has to set up mandatory 2FA on first login.
 */
export async function createStaffUser(input: unknown): Promise<ActionResult> {
  const session = await requireRole("SUPER_ADMIN");

  const parsed = createStaffSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { success: false, error: "A staff account with that email already exists" };

  const temporaryPassword = randomBytes(18).toString("base64url");
  const passwordHash = await argon2.hash(temporaryPassword, { type: argon2.argon2id });

  const user = await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      emailVerified: true,
      isActive: true,
    },
  });

  await db.account.create({
    data: { userId: user.id, providerId: "credential", accountId: user.id, password: passwordHash },
  });

  await recordAuditLog({
    userId: session.user.id,
    action: "staff.created",
    entityType: "User",
    entityId: user.id,
    after: { name: user.name, email: user.email, role: user.role },
  });

  revalidatePath("/admin/staff");
  return { success: true, temporaryPassword };
}

export async function updateStaffRole(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  const session = await requireRole("SUPER_ADMIN");

  const parsed = updateStaffRoleSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await db.user.findUnique({ where: { id: parsed.data.userId } });
  if (!user) return { success: false, error: "Staff member not found" };

  const updated = await db.user.update({
    where: { id: user.id },
    data: { role: parsed.data.role },
  });

  await recordAuditLog({
    userId: session.user.id,
    action: "staff.role_changed",
    entityType: "User",
    entityId: user.id,
    before: { role: user.role },
    after: { role: updated.role },
  });

  revalidatePath("/admin/staff");
  return { success: true };
}

export async function toggleStaffActive(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  const session = await requireRole("SUPER_ADMIN");

  const parsed = toggleStaffActiveSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  if (parsed.data.userId === session.user.id) {
    return { success: false, error: "You can't deactivate your own account" };
  }

  const user = await db.user.update({
    where: { id: parsed.data.userId },
    data: { isActive: parsed.data.isActive },
  });

  await recordAuditLog({
    userId: session.user.id,
    action: parsed.data.isActive ? "staff.activated" : "staff.deactivated",
    entityType: "User",
    entityId: user.id,
  });

  revalidatePath("/admin/staff");
  return { success: true };
}
