"use server";

import { revalidatePath } from "next/cache";

import { recordAuditLog } from "@/lib/audit-log";
import { resendEmailLog } from "@/lib/email/resend";
import { requireRole } from "@/lib/rbac";

export async function resendEmail(
  emailLogId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  const session = await requireRole("DISPATCHER");

  const result = await resendEmailLog(emailLogId);

  await recordAuditLog({
    userId: session.user.id,
    action: result.success ? "email.resent" : "email.resend_failed",
    entityType: "EmailLog",
    entityId: emailLogId,
  });

  revalidatePath("/admin/emails");
  return result;
}
