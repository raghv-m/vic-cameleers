import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { subHours } from "date-fns";

import { db } from "@/lib/db";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";
import { resendEmailLog } from "@/lib/email/resend";

/**
 * Runs periodically. Retries FAILED EmailLog entries from the last 48
 * hours - old enough failures are left alone rather than retried forever
 * (CLAUDE.md section 8: "Email retry queue via Vercel Cron").
 */
export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const failed = await db.emailLog.findMany({
    where: { status: "FAILED", createdAt: { gte: subHours(new Date(), 48) } },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  let retried = 0;
  let succeeded = 0;
  for (const log of failed) {
    const result = await resendEmailLog(log.id);
    retried += 1;
    if (result.success) succeeded += 1;
  }

  return NextResponse.json({ retried, succeeded });
}
