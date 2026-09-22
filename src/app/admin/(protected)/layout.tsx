import { AdminNav } from "@/components/admin/admin-nav";
import { requireSession } from "@/lib/rbac";

/**
 * Every page under this group requires a signed-in, active, 2FA-enrolled
 * session (requireSession redirects to /login or /setup-2fa otherwise).
 * The bookings/dispatcher admin UI (rest of Milestone 1C) nests here too.
 */
export default async function ProtectedAdminLayout({ children }: LayoutProps<"/admin">) {
  await requireSession();
  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}
