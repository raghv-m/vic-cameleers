import type { JobStatus } from "@prisma/client";

/** Dispatcher status order from CLAUDE.md section 10. */
export const JOB_STATUS_ORDER: JobStatus[] = [
  "SCHEDULED",
  "EN_ROUTE",
  "LOADING",
  "IN_TRANSIT",
  "UNLOADING",
  "COMPLETED",
];

export const JOB_STATUS_LABEL: Record<JobStatus, string> = {
  SCHEDULED: "Scheduled",
  EN_ROUTE: "En route",
  LOADING: "Loading",
  IN_TRANSIT: "In transit",
  UNLOADING: "Unloading",
  COMPLETED: "Completed",
};
