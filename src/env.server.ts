import "server-only";
import { z } from "zod";

/**
 * Vars required for the app to boot at all. Everything else here is optional
 * because those integrations (Resend, Turnstile, Upstash, Blob, Google Maps,
 * Stripe) are wired up feature by feature in later milestones. Each feature's
 * own module should assert its own required vars when it's actually built,
 * rather than this file blocking dev/build before those exist.
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().min(1, "DIRECT_URL is required"),

  AUTH_SECRET: z.string().min(1).optional(),
  ADMIN_PATH: z.string().min(1).optional(),
  CRON_SECRET: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  EMAIL_REPLY_TO: z.string().optional(),
  LEAD_NOTIFY_EMAIL: z.string().optional(),

  TURNSTILE_SECRET_KEY: z.string().optional(),

  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  BLOB_READ_WRITE_TOKEN: z.string().optional(),

  GOOGLE_MAPS_SERVER_KEY: z.string().optional(),
  GOOGLE_REVIEW_URL: z.string().optional(),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

function parseServerEnv() {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid server environment variables:\n${issues}`);
  }

  return result.data;
}

export const serverEnv = parseServerEnv();
