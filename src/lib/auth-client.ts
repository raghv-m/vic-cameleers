"use client";

import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

// No baseURL: the admin console is always same-origin, so relative fetches
// work in dev and prod without depending on NEXT_PUBLIC_SITE_URL (still a
// placeholder until the domain is bought, see TODO-OWNER.md).
export const authClient = createAuthClient({
  plugins: [twoFactorClient()],
});
