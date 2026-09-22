import "server-only";

import argon2 from "argon2";
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";

import { business } from "@/config/business";
import { serverEnv } from "@/env.server";
import { recordAuditLog } from "@/lib/audit-log";
import { db } from "@/lib/db";
import { checkAdminLoginRateLimit } from "@/lib/rate-limit";

/**
 * Staff auth (CLAUDE.md section 10 and 11). Public customers never get an
 * account here, only staff created by `scripts/seed-admin.ts` or, later, an
 * admin "invite" action, so email/password sign-up is disabled entirely.
 *
 * TOTP 2FA is enforced at the app level, not by better-auth itself: a
 * password sign-in succeeds and issues a normal session even for a staff
 * member who hasn't enrolled yet (better-auth can only challenge 2FA for
 * users who already have it enabled). src/lib/rbac.ts closes that gap by
 * redirecting any session with `twoFactorEnabled: false` to /setup-2fa
 * before it can reach any other admin page.
 */
function getAuthSecret(): string {
  if (!serverEnv.AUTH_SECRET) {
    throw new Error(
      "AUTH_SECRET is not set. Generate one with `openssl rand -base64 32` and add it to .env " +
        "before using staff login (see TODO-OWNER.md).",
    );
  }
  return serverEnv.AUTH_SECRET;
}

export const auth = betterAuth({
  secret: getAuthSecret(),
  baseURL: business.siteUrl,
  database: prismaAdapter(db, { provider: "postgresql" }),

  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 12,
    password: {
      hash: (password) => argon2.hash(password, { type: argon2.argon2id }),
      verify: ({ hash, password }) => argon2.verify(hash, password),
    },
  },

  session: {
    // Absolute cap on a session's lifetime regardless of activity.
    expiresIn: 60 * 60 * 8,
    // Rolling idle timeout: a session more than 30 minutes old at request
    // time gets its expiry pushed out, so inactive sessions still lapse.
    updateAge: 60 * 30,
    freshAge: 60 * 15,
  },

  advanced: {
    useSecureCookies: serverEnv.NODE_ENV === "production",
    defaultCookieAttributes: {
      sameSite: "strict",
      httpOnly: true,
    },
  },

  user: {
    additionalFields: {
      role: { type: "string", required: true, input: false },
      isActive: { type: "boolean", required: true, defaultValue: true, input: false },
    },
  },

  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          await db.user.update({
            where: { id: session.userId },
            data: { lastLoginAt: new Date() },
          });
          // Only fires once auth is fully complete (2FA included, where
          // enabled) - better-auth's 2FA challenge step uses a separate
          // short-lived cookie, not a Session row, so this never logs a
          // partial/unverified sign-in.
          await recordAuditLog({
            userId: session.userId,
            action: "staff.login",
            entityType: "User",
            entityId: session.userId,
            ipAddress: session.ipAddress,
          });
        },
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-in/email") return;

      const email = typeof ctx.body?.email === "string" ? ctx.body.email : undefined;
      const ip = ctx.request
        ? (ctx.request.headers.get("x-forwarded-for") ?? "unknown")
        : "unknown";

      const rateLimit = await checkAdminLoginRateLimit(`${ip}:${email ?? "unknown"}`);
      if (!rateLimit.success) {
        throw new APIError("TOO_MANY_REQUESTS", {
          message: "Too many sign-in attempts. Try again in a few minutes.",
        });
      }

      if (!email) return;
      const user = await db.user.findUnique({ where: { email } });
      if (user && !user.isActive) {
        throw new APIError("FORBIDDEN", { message: "This account has been deactivated." });
      }
    }),
  },

  plugins: [
    twoFactor({
      issuer: business.tradingName,
      accountLockout: {
        enabled: true,
        maxFailedAttempts: 5,
        durationSeconds: 60 * 15,
      },
    }),
    // Must be last: lets server actions set/clear auth cookies via `next/headers`.
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
