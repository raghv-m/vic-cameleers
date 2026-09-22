import "server-only";

import { serverEnv } from "@/env.server";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Verifies a Cloudflare Turnstile token server-side. If TURNSTILE_SECRET_KEY
 * isn't configured yet (see TODO-OWNER.md), this logs a warning and allows
 * the request through rather than blocking all public form submissions
 * during development. Once the secret is set, verification is enforced for
 * real.
 */
export async function verifyTurnstileToken(
  token: string | null,
  remoteIp?: string,
): Promise<boolean> {
  if (!serverEnv.TURNSTILE_SECRET_KEY) {
    console.warn("TURNSTILE_SECRET_KEY not set, skipping Turnstile verification (dev only).");
    return true;
  }

  if (!token) return false;

  const body = new URLSearchParams({
    secret: serverEnv.TURNSTILE_SECRET_KEY,
    response: token,
  });
  if (remoteIp) body.set("remoteip", remoteIp);

  const response = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) return false;

  const result = (await response.json()) as { success: boolean };
  return result.success;
}
