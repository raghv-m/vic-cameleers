import { z } from "zod";

import { isValidAuMobile } from "@/lib/au-phone";

export const truckSchema = z.object({
  name: z.string().trim().min(1, "Enter a name for the truck"),
  size: z.enum(["SIX_TONNE", "TEN_TONNE"]),
  registration: z.string().trim().max(20).optional(),
});

export type TruckInput = z.infer<typeof truckSchema>;

export const crewMemberSchema = z.object({
  name: z.string().trim().min(1, "Enter the crew member's name"),
  phone: z
    .string()
    .trim()
    .refine((value) => isValidAuMobile(value), "Enter a valid Australian mobile number"),
});

export type CrewMemberInput = z.infer<typeof crewMemberSchema>;

export const toggleActiveSchema = z.object({
  id: z.string().min(1),
  isActive: z.boolean(),
});

export type ToggleActiveInput = z.infer<typeof toggleActiveSchema>;
