"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { ReviewStatus } from "@prisma/client";

import { toggleReviewFeatured, updateReviewStatus } from "@/app/admin/(protected)/reviews/actions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusLabel: Record<ReviewStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  HIDDEN: "Hidden",
};

export function ReviewRowControls({
  id,
  status,
  isFeatured,
}: {
  id: string;
  status: ReviewStatus;
  isFeatured: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <Select
        value={status}
        disabled={pending}
        onValueChange={(value) => {
          if (!value) return;
          startTransition(async () => {
            const result = await updateReviewStatus({ id, status: value });
            if (!result.success) toast.error(result.error);
          });
        }}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status">
            {(value: string) => statusLabel[value as ReviewStatus]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {(["PENDING", "APPROVED", "HIDDEN"] as ReviewStatus[]).map((option) => (
            <SelectItem key={option} value={option}>
              {statusLabel[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            const result = await toggleReviewFeatured({ id, isFeatured: !isFeatured });
            if (!result.success) toast.error(result.error);
          });
        }}
      >
        {isFeatured ? "Unfeature" : "Feature"}
      </Button>
    </div>
  );
}
