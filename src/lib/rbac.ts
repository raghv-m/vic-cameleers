import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";

import { serverEnv } from "@/env.server";
import { auth, type Session } from "@/lib/auth";
import { roleSatisfies } from "@/lib/role-hierarchy";

export { roleSatisfies };

function adminPathOrThrow(): string {
  if (!serverEnv.ADMIN_PATH) {
    throw new Error(
      "ADMIN_PATH is not set. Choose a random, non-guessable segment and add it to .env " +
        "before using the admin console (see TODO-OWNER.md).",
    );
  }
  return serverEnv.ADMIN_PATH;
}

/** Builds an absolute admin path, e.g. adminUrl("/login") -> "/ops-7f3k/login". */
export function adminUrl(path: string): string {
  return `/${adminPathOrThrow()}${path}`;
}

/**
 * Returns the current session, or null if signed out. Does not enforce 2FA
 * enrollment or redirect; use `requireSession` / `requireRole` for that.
 */
export async function getAdminSession(): Promise<Session | null> {
  return auth.api.getSession({ headers: await headers() });
}

/**
 * Requires a signed-in, active, 2FA-enrolled session. Redirects to login if
 * signed out, or to /setup-2fa if 2FA hasn't been enrolled yet (mandatory
 * for all staff per CLAUDE.md section 11).
 */
export async function requireSession(): Promise<Session> {
  const session = await getAdminSession();
  if (!session) redirect(adminUrl("/login"));
  if (!session.user.isActive) redirect(adminUrl("/login"));
  if (!session.user.twoFactorEnabled) redirect(adminUrl("/setup-2fa"));
  return session;
}

/** Requires a session whose role satisfies `minRole` in the hierarchy above. */
export async function requireRole(minRole: Role): Promise<Session> {
  const session = await requireSession();
  if (!roleSatisfies(session.user.role as Role, minRole)) {
    redirect(adminUrl("/"));
  }
  return session;
}

/** Requires a session whose role is exactly one of `roles` (no hierarchy). */
export async function requireAnyRole(roles: Role[]): Promise<Session> {
  const session = await requireSession();
  if (!roles.includes(session.user.role as Role)) {
    redirect(adminUrl("/"));
  }
  return session;
}
