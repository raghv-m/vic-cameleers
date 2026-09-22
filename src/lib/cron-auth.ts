import "server-only";

import type { NextRequest } from "next/server";

import { serverEnv } from "@/env.server";

/**
 * Vercel Cron Jobs send `Authorization: Bearer $CRON_SECRET` on every
 * request when CRON_SECRET is set as an env var (CLAUDE.md section 8:
 * "/api/cron/* protected by CRON_SECRET"). Refuses the request if the
 * secret isn't configured yet, rather than running unauthenticated.
 */
export function isAuthorizedCronRequest(request: NextRequest): boolean {
  if (!serverEnv.CRON_SECRET) return false;
  return request.headers.get("authorization") === `Bearer ${serverEnv.CRON_SECRET}`;
}
