"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { useAdminRoot } from "@/lib/use-admin-root";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const adminRoot = useAdminRoot();
  const [signingOut, setSigningOut] = useState(false);

  return (
    <Button
      variant="outline"
      disabled={signingOut}
      onClick={async () => {
        setSigningOut(true);
        await authClient.signOut();
        router.push(`${adminRoot}/login`);
      }}
    >
      {signingOut ? "Signing out..." : "Sign out"}
    </Button>
  );
}
