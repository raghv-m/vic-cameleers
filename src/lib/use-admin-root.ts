"use client";

import { usePathname } from "next/navigation";

/**
 * The admin root path from the current URL, e.g. "/ops-7f3k/leads/123" ->
 * "/ops-7f3k". Works at any depth under the admin console without the
 * client needing to know ADMIN_PATH (a server-only env var): middleware
 * only ever rewrites requests starting with "/${ADMIN_PATH}", so the first
 * path segment is always it, and `usePathname` reflects the real browser
 * URL regardless of that internal rewrite.
 */
export function useAdminRoot(): string {
  const pathname = usePathname();
  return "/" + pathname.split("/")[1];
}
