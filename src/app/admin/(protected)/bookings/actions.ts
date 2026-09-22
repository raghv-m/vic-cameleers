"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { recordAuditLog } from "@/lib/audit-log";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { jobStatusUpdateSchema } from "@/lib/validation/booking";

async function clientIp(): Promise<string | null> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}

export async function updateJobStatus(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  const session = await requireRole("DISPATCHER");

  const parsed = jobStatusUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const job = await db.job.findUnique({ where: { id: parsed.data.jobId } });
  if (!job) return { success: false, error: "Job not found" };

  const updated = await db.job.update({
    where: { id: job.id },
    data: {
      status: parsed.data.status,
      startedAt: parsed.data.status === "EN_ROUTE" && !job.startedAt ? new Date() : undefined,
      completedAt: parsed.data.status === "COMPLETED" ? new Date() : undefined,
    },
  });

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
  return { success: true };
}
