import { z } from "zod";

export const convertToBookingSchema = z.object({
  leadId: z.string().min(1),
  moveDate: z.iso.date("Pick a move date"),
  preferredTime: z.string().trim().max(50).optional(),
  truckId: z.string().min(1).optional(),
  crewMemberIds: z.array(z.string().min(1)).default([]),
});

export type ConvertToBookingInput = z.infer<typeof convertToBookingSchema>;

export const jobStatusUpdateSchema = z.object({
  jobId: z.string().min(1),
  status: z.enum(["SCHEDULED", "EN_ROUTE", "LOADING", "IN_TRANSIT", "UNLOADING", "COMPLETED"]),
});

export type JobStatusUpdate = z.infer<typeof jobStatusUpdateSchema>;
