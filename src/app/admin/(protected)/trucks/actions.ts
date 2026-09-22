"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { recordAuditLog } from "@/lib/audit-log";
import { toggleActiveSchema, truckSchema } from "@/lib/validation/fleet";

type ActionResult = { success: true } | { success: false; error: string };

export async function createTruck(input: unknown): Promise<ActionResult> {
  const session = await requireRole("DISPATCHER");

  const parsed = truckSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const truck = await db.truck.create({ data: parsed.data });

  await recordAuditLog({
    userId: session.user.id,
    action: "truck.created",
    entityType: "Truck",
    entityId: truck.id,
    after: { name: truck.name, size: truck.size },
  });

  revalidatePath("/admin/trucks");
  return { success: true };
}

export async function toggleTruckActive(input: unknown): Promise<ActionResult> {
  const session = await requireRole("DISPATCHER");

  const parsed = toggleActiveSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const truck = await db.truck.update({
    where: { id: parsed.data.id },
    data: { isActive: parsed.data.isActive },
  });

  await recordAuditLog({
    userId: session.user.id,
    action: parsed.data.isActive ? "truck.activated" : "truck.deactivated",
    entityType: "Truck",
    entityId: truck.id,
  });

  revalidatePath("/admin/trucks");
  return { success: true };
}
