import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Setup2FAForm } from "@/components/admin/setup-2fa-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminUrl, getAdminSession } from "@/lib/rbac";

export const metadata: Metadata = {
  title: "Set up two-factor authentication",
  robots: { index: false, follow: false },
};

export default async function Setup2FAPage() {
  const session = await getAdminSession();
  if (!session) redirect(adminUrl("/login"));
  if (session.user.twoFactorEnabled) redirect(adminUrl("/"));

  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Set up two-factor authentication</CardTitle>
          <CardDescription>Required before you can access the admin console.</CardDescription>
        </CardHeader>
        <CardContent>
          <Setup2FAForm />
        </CardContent>
      </Card>
    </div>
  );
}
