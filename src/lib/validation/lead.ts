import { z } from "zod";

export const leadStatusUpdateSchema = z
  .object({
    leadId: z.string().min(1),
    status: z.enum(["NEW", "CONTACTED", "QUOTED", "FOLLOW_UP", "BOOKED", "COMPLETED", "LOST"]),
    lostReason: z.string().trim().max(500).optional(),
  })
  .refine((data) => data.status !== "LOST" || !!data.lostReason?.length, {
    message: "A reason is required when marking a lead as lost",
    path: ["lostReason"],
  });

export type LeadStatusUpdate = z.infer<typeof leadStatusUpdateSchema>;

export const leadNoteSchema = z.object({
  leadId: z.string().min(1),
  body: z.string().trim().min(1, "Note can't be empty").max(2000),
});

export type LeadNote = z.infer<typeof leadNoteSchema>;
