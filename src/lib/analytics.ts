import "server-only";

import type { Prisma } from "@prisma/client";

import { db } from "@/lib/db";

/**
 * Server-side funnel event logging (CLAUDE.md section 12). Works on any
 * Vercel plan, unlike custom client-side Analytics events, which need a
 * paid plan — this is the one guaranteed to feed the admin funnel chart
 * once that's built. Never throws: a broken analytics write must never
 * affect the actual request.
 */
export async function logAnalyticsEvent(
  eventName: string,
  options: { leadId?: string; path?: string; metadata?: Record<string, unknown> } = {},
): Promise<void> {
  try {
    await db.analyticsEvent.create({
      data: {
        eventName,
        leadId: options.leadId,
        path: options.path,
        metadata: options.metadata as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    console.error(`Failed to log analytics event "${eventName}"`, error);
  }
}
