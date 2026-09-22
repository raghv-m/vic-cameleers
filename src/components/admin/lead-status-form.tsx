"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { LeadStatus } from "@prisma/client";

import { updateLeadStatus } from "@/app/admin/(protected)/leads/[id]/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  LEAD_STATUS_BADGE_VARIANT,
  LEAD_STATUS_LABEL,
  LEAD_STATUS_ORDER,
  requiresLostReason,
} from "@/lib/lead-status";

export function LeadStatusForm({
  leadId,
  currentStatus,
  currentLostReason,
}: {
  leadId: string;
  currentStatus: LeadStatus;
  currentLostReason: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<LeadStatus>(currentStatus);
  const [lostReason, setLostReason] = useState(currentLostReason ?? "");

  const dirty =
    status !== currentStatus || (status === "LOST" && lostReason !== (currentLostReason ?? ""));

  function submit() {
    startTransition(async () => {
      const result = await updateLeadStatus({ leadId, status, lostReason });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(`Status updated to ${LEAD_STATUS_LABEL[status]}`);
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Badge variant={LEAD_STATUS_BADGE_VARIANT[currentStatus]}>
          {LEAD_STATUS_LABEL[currentStatus]}
        </Badge>
        <Select value={status} onValueChange={(value) => value && setStatus(value as LeadStatus)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Change status">
              {(value: string) => LEAD_STATUS_LABEL[value as LeadStatus]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {LEAD_STATUS_ORDER.map((option) => (
              <SelectItem key={option} value={option}>
                {LEAD_STATUS_LABEL[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {requiresLostReason(status) && (
        <Field>
          <FieldLabel htmlFor="lost-reason">Reason lost</FieldLabel>
          <Textarea
            id="lost-reason"
            value={lostReason}
            onChange={(event) => setLostReason(event.target.value)}
            rows={2}
          />
        </Field>
      )}

      {dirty && (
        <Button
          size="sm"
          disabled={pending || (requiresLostReason(status) && !lostReason.trim())}
          onClick={submit}
        >
          {pending ? "Saving..." : "Save status"}
        </Button>
      )}
    </div>
  );
}
