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
function createLimiter(
  window: Parameters<typeof Ratelimit.slidingWindow>[1],
  prefix: string,
): Ratelimit | null {
  if (!serverEnv.UPSTASH_REDIS_REST_URL || !serverEnv.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Ratelimit({
    redis: new Redis({
      url: serverEnv.UPSTASH_REDIS_REST_URL,
      token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(5, window),
    prefix,
  });
}

// Created on first use, not at import, so `next build` never reads the Upstash env vars.
let publicFormLimiter: Ratelimit | null | undefined;
let adminLoginLimiter: Ratelimit | null | undefined;

export async function checkPublicFormRateLimit(identifier: string): Promise<{ success: boolean }> {
  if (publicFormLimiter === undefined) {
    publicFormLimiter = createLimiter("10 m", "ratelimit:public-form");
  }
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
export async function checkAdminLoginRateLimit(identifier: string): Promise<{ success: boolean }> {
  if (adminLoginLimiter === undefined) {
    adminLoginLimiter = createLimiter("15 m", "ratelimit:admin-login");
  }
  if (!adminLoginLimiter) {
    console.warn("Upstash not configured, skipping admin login rate limiting (dev only).");
    return { success: true };
  }

  const result = await adminLoginLimiter.limit(identifier);
  return { success: result.success };
}
