import { z } from "zod";

const ROLES = [
  "SUPER_ADMIN",
  "OPERATIONS_MANAGER",
  "DISPATCHER",
  "SALES",
  "FINANCE",
  "SUPPORT",
  "CREW",
] as const;

export const createStaffSchema = z.object({
  name: z.string().trim().min(1, "Enter a name"),
  email: z.email("Enter a valid email"),
  role: z.enum(ROLES),
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>;

export const updateStaffRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(ROLES),
});

export const toggleStaffActiveSchema = z.object({
  userId: z.string().min(1),
  isActive: z.boolean(),
});
