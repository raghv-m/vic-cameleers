import "server-only";

/**
 * Structured, greppable cron logging (console.log/error, captured by
 * Vercel's own log pipeline - no separate logging service needed for this
 * scale). Named events rather than free-text so CRON_FAILED is easy to
 * alert on later.
 */
export function logCronStarted(job: string): void {
  console.log(JSON.stringify({ event: "CRON_STARTED", job, timestamp: new Date().toISOString() }));
}

export function logCronCompleted(job: string, result: Record<string, unknown>): void {
  console.log(
    JSON.stringify({
      event: "CRON_COMPLETED",
      job,
      timestamp: new Date().toISOString(),
      ...result,
    }),
  );
}

export function logCronFailed(job: string, error: unknown): void {
  console.error(
    JSON.stringify({
      event: "CRON_FAILED",
      job,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
    }),
  );
}
