import type { Role } from "@prisma/client";

/**
 * Least-privilege ordering from CLAUDE.md section 10. Written as a single
 * chain there, so this is treated as a linear hierarchy: a role satisfies a
 * `minRole` requirement if it sits at or above it in this list. CREW is
 * deliberately last, and excluded from checks that gate general admin
 * pages, since crew only ever see their own jobs through dedicated,
 * narrowly-scoped views, not the hierarchy.
 *
 * Kept dependency-free (no "server-only", no auth/db imports) so it can be
 * unit tested without pulling in the whole auth stack; src/lib/rbac.ts
 * wraps it with the actual session/redirect logic.
 */
export const ROLE_HIERARCHY: Role[] = [
  "SUPER_ADMIN",
  "OPERATIONS_MANAGER",
  "DISPATCHER",
  "SALES",
  "FINANCE",
  "SUPPORT",
  "CREW",
];

export function roleRank(role: Role): number {
  return ROLE_HIERARCHY.indexOf(role);
}

/** True if `role` sits at or above `minRole` in the hierarchy. */
export function roleSatisfies(role: Role, minRole: Role): boolean {
  return roleRank(role) <= roleRank(minRole);
}
