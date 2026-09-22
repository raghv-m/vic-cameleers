import "server-only";

import { business } from "@/config/business";
import { serverEnv } from "@/env.server";

/** Deep link into the admin lead detail page, for staff alert emails. Undefined until ADMIN_PATH is set. */
export function adminLeadUrl(leadId: string): string | undefined {
  if (!serverEnv.ADMIN_PATH) return undefined;
  return `${business.siteUrl}/${serverEnv.ADMIN_PATH}/leads/${leadId}`;
}
