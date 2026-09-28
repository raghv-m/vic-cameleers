import "server-only";

import { log } from "@/lib/log";

/**
 * Cron lifecycle logging, as structured events (src/lib/log.ts): CRON_STARTED, CRON_COMPLETED
 * (with the job's result counts) and CRON_FAILED, so a failed job is easy to alert on.
 */
export function logCronStarted(job: string): void {
  log.info("CRON_STARTED", { job });
}

export function logCronCompleted(job: string, result: Record<string, unknown>): void {
  const fields: Record<string, string | number | boolean | null> = { job };
  for (const [key, value] of Object.entries(result)) {
    if (["string", "number", "boolean"].includes(typeof value) || value === null) {
      fields[key] = value as string | number | boolean | null;
    }
  }
  log.info("CRON_COMPLETED", fields);
}

export function logCronFailed(job: string, error: unknown): void {
  log.error("CRON_FAILED", error, { job });
}
