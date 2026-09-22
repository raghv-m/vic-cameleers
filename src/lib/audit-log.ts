import "server-only";

import type { Prisma } from "@prisma/client";

import { db } from "@/lib/db";

/**
 * Records one admin action (CLAUDE.md section 11: "Audit logs for all admin
 * actions, who, what, when, IP, before/after"). Best-effort: a failed audit
 * write logs to the console but never blocks or rolls back the action it's
 * recording, the same way email sends are best-effort elsewhere.
 */
export async function recordAuditLog(entry: {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress?: string | null;
  before?: Prisma.InputJsonValue;
  after?: Prisma.InputJsonValue;
}): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        ipAddress: entry.ipAddress ?? undefined,
        before: entry.before,
        after: entry.after,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log entry", entry.action, entry.entityType, error);
  }
}
