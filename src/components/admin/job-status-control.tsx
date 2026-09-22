"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { JobStatus } from "@prisma/client";

import { updateJobStatus } from "@/app/admin/(protected)/bookings/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JOB_STATUS_LABEL, JOB_STATUS_ORDER } from "@/lib/job-status";

export function JobStatusControl({ jobId, status }: { jobId: string; status: JobStatus }) {
  const [pending, startTransition] = useTransition();

  function onChange(value: string) {
    startTransition(async () => {
      const result = await updateJobStatus({ jobId, status: value as JobStatus });
      if (!result.success) toast.error(result.error);
    });
  }

  return (
    <Select value={status} onValueChange={(value) => value && onChange(value)} disabled={pending}>
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Status">
          {(value: string) => JOB_STATUS_LABEL[value as JobStatus]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {JOB_STATUS_ORDER.map((option) => (
          <SelectItem key={option} value={option}>
            {JOB_STATUS_LABEL[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
