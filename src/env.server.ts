import "server-only";
import { z } from "zod";

/**
 * An env var set to "" (easy to do by accident in the Vercel dashboard) means "not set", the same
 * as leaving it out, rather than failing a `min(1)` check.
 */
const emptyAsUnset = (value: unknown) => (value === "" ? undefined : value);

/**
 * Vars required for the app to run at all. Everything else here is optional
 * because those integrations (Resend, Turnstile, Upstash, Blob, Google Maps,
 * Stripe) are wired up feature by feature in later milestones. Each feature's
 * own module should assert its own required vars when it's actually built,
 * rather than this file blocking dev/build before those exist.
 */
const serverEnvSchema = z.preprocess(
  (env) =>
    Object.fromEntries(
      Object.entries(env as Record<string, unknown>).map(([key, value]) => [
        key,
        emptyAsUnset(value),
      ]),
    ),
  z.object({
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
  }),
);

export type ServerEnv = z.output<typeof serverEnvSchema>;

function parseServerEnv(): ServerEnv {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid server environment variables:\n${issues}`);
  }

  return result.data;
}

let cached: ServerEnv | undefined;

/**
 * Server env, validated on first read rather than at import.
 *
 * `next build` imports every route module to collect its config ("Collecting page data"). When
 * this validated at import, one unset variable (AUTH_SECRET, say) failed the whole build, even
 * though no request ever runs during a build. Now importing is free, and the full validation
 * still runs, with the same error, the first time any request actually reads a variable.
 * Nothing is relaxed: required vars are still required, just checked when they're needed.
 */
export const serverEnv: ServerEnv = new Proxy({} as ServerEnv, {
  get(_target, key) {
    cached ??= parseServerEnv();
    return cached[key as keyof ServerEnv];
  },
  has(_target, key) {
    cached ??= parseServerEnv();
    return key in cached;
  },
  ownKeys() {
    cached ??= parseServerEnv();
    return Reflect.ownKeys(cached);
  },
  getOwnPropertyDescriptor(_target, key) {
    cached ??= parseServerEnv();
    return Reflect.getOwnPropertyDescriptor(cached, key);
  },
});
