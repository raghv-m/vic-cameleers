import type { Metadata } from "next";

import { SignOutButton } from "@/components/admin/sign-out-button";
import { requireSession } from "@/lib/rbac";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const session = await requireSession();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Signed in as {session.user.name} ({session.user.role}).
          </p>
        </div>
        <SignOutButton />
      </div>
      <p className="text-muted-foreground mt-8 text-sm">
        Leads, bookings, and the rest of the admin console land in the next milestone slice.
      </p>
    </div>
  );
}
