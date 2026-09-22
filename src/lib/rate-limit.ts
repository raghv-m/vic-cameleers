import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { serverEnv } from "@/env.server";

/**
 * 5 requests per 10 minutes per IP on public form endpoints (CLAUDE.md
 * section 8). If Upstash isn't configured yet (see TODO-OWNER.md), this
 * allows every request through rather than blocking all public forms
 * during development.
 */
const publicFormLimiter =
  serverEnv.UPSTASH_REDIS_REST_URL && serverEnv.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: new Redis({
          url: serverEnv.UPSTASH_REDIS_REST_URL,
          token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(5, "10 m"),
        prefix: "ratelimit:public-form",
      })
    : null;

export async function checkPublicFormRateLimit(identifier: string): Promise<{ success: boolean }> {
  if (!publicFormLimiter) {
    console.warn("Upstash not configured, skipping rate limiting (dev only).");
    return { success: true };
  }

  const result = await publicFormLimiter.limit(identifier);
  return { success: result.success };
}

/**
 * 5 attempts per 15 minutes per IP+email on staff sign-in (CLAUDE.md section
 * 11, "login rate limiting + progressive lockout"). This is the app-level
 * layer; the twoFactor plugin's own accountLockout (src/lib/auth.ts) adds a
 * second, account-scoped lockout for failed 2FA verification specifically.
 */
const adminLoginLimiter =
  serverEnv.UPSTASH_REDIS_REST_URL && serverEnv.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: new Redis({
          url: serverEnv.UPSTASH_REDIS_REST_URL,
          token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(5, "15 m"),
        prefix: "ratelimit:admin-login",
      })
    : null;

export async function checkAdminLoginRateLimit(identifier: string): Promise<{ success: boolean }> {
  if (!adminLoginLimiter) {
    console.warn("Upstash not configured, skipping admin login rate limiting (dev only).");
    return { success: true };
  }

  const result = await adminLoginLimiter.limit(identifier);
  return { success: result.success };
}
