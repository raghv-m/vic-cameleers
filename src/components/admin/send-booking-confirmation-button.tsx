"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { sendBookingConfirmation } from "@/app/admin/(protected)/bookings/actions";
import { Button } from "@/components/ui/button";

export function SendBookingConfirmationButton({ bookingId }: { bookingId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await sendBookingConfirmation({ bookingId });
          if (!result.success) {
            toast.error(result.error);
            return;
          }
          toast.success("Confirmation email sent");
        });
      }}
    >
      {pending ? "Sending..." : "Send confirmation email"}
    </Button>
  );
}
