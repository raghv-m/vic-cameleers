import { z } from "zod";

export const twoFactorPasswordSchema = z.object({
  password: z.string().min(1, "Enter your password"),
});

export type TwoFactorPassword = z.infer<typeof twoFactorPasswordSchema>;

export const twoFactorConfirmSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code from your authenticator app"),
});

export type TwoFactorConfirm = z.infer<typeof twoFactorConfirmSchema>;
