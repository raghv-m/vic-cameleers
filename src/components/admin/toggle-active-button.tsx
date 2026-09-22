"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type ActionResult = { success: true } | { success: false; error: string };

export function ToggleActiveButton({
  id,
  isActive,
  action,
}: {
  id: string;
  isActive: boolean;
  action: (input: { id: string; isActive: boolean }) => Promise<ActionResult>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await action({ id, isActive: !isActive });
          if (!result.success) toast.error(result.error);
        });
      }}
    >
      {pending ? "Saving..." : isActive ? "Deactivate" : "Activate"}
    </Button>
  );
}
