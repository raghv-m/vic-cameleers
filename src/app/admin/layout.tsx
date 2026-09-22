import type { Metadata } from "next";

/**
 * Shell for every admin page (login, 2FA setup, and everything under the
 * (protected) group). No auth check here: login and setup-2fa must render
 * without a full session. Route-level access control lives in
 * src/lib/rbac.ts and the (protected) layout.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="bg-muted/30 min-h-svh">{children}</div>;
}
