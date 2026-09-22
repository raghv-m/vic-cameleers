import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { subHours } from "date-fns";

import { db } from "@/lib/db";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";
import { logCronCompleted, logCronFailed, logCronStarted } from "@/lib/cron-log";
import { resendEmailLog } from "@/lib/email/resend";

const JOB_NAME = "email-retry";

/**
 * Runs periodically. Retries FAILED EmailLog entries from the last 48
 * hours - old enough failures are left alone rather than retried forever
 * (CLAUDE.md section 8: "Email retry queue via Vercel Cron").
 *
 * Idempotency: before retrying a row, atomically flips it FAILED -> QUEUED
 * with a conditional `updateMany`. If two invocations ever overlap (Vercel
 * doesn't normally run the same cron concurrently, but this guards against
 * a manual trigger racing the real one), only one can win that update, so
 * the same failure is never retried twice in parallel. `resendEmailLog`
 * writes its own fresh EmailLog row recording the retry's outcome either
 * way, so the original row staying QUEUED afterward is fine, it's just a
 * marker that this particular failure was already handled.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  logCronStarted(JOB_NAME);

  try {
    const failed = await db.emailLog.findMany({
      where: { status: "FAILED", createdAt: { gte: subHours(new Date(), 48) } },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    let retried = 0;
    let succeeded = 0;

    for (const log of failed) {
      const claim = await db.emailLog.updateMany({
        where: { id: log.id, status: "FAILED" },
        data: { status: "QUEUED" },
      });
      if (claim.count === 0) continue; // another run already claimed this one

      const result = await resendEmailLog(log.id);
      retried += 1;
      if (result.success) succeeded += 1;
    }

    const summary = { retried, succeeded };
    logCronCompleted(JOB_NAME, summary);
    return NextResponse.json(summary);
  } catch (error) {
    logCronFailed(JOB_NAME, error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
