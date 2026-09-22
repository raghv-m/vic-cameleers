import { z } from "zod";

export const loginCredentialsSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;

export const totpCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code from your authenticator app"),
  trustDevice: z.boolean(),
});

export type TotpCode = z.infer<typeof totpCodeSchema>;

export const backupCodeSchema = z.object({
  code: z.string().trim().min(1, "Enter a backup code"),
});

export type BackupCode = z.infer<typeof backupCodeSchema>;
