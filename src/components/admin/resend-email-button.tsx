"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { resendEmail } from "@/app/admin/(protected)/emails/actions";
import { Button } from "@/components/ui/button";

export function ResendEmailButton({ emailLogId }: { emailLogId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await resendEmail(emailLogId);
          if (!result.success) {
            toast.error(result.error);
            return;
          }
          toast.success("Resent");
        });
      }}
    >
      {pending ? "Resending..." : "Resend"}
    </Button>
  );
}
