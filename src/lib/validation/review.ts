import { z } from "zod";

export const reviewStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["PENDING", "APPROVED", "HIDDEN"]),
});

export const reviewFeatureSchema = z.object({
  id: z.string().min(1),
  isFeatured: z.boolean(),
});

export const manualReviewSchema = z.object({
  authorName: z.string().trim().min(1, "Enter the reviewer's name"),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().trim().min(1, "Enter the review text").max(2000),
});
