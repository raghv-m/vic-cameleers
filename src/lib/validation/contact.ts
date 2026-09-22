import { z } from "zod";

import { isValidAuMobile } from "@/lib/au-phone";

export const contactSubmissionSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.email("Enter a valid email"),
  phone: z
    .string()
    .optional()
    .refine((value) => !value || isValidAuMobile(value), "Enter a valid Australian mobile number"),
  message: z.string().min(10, "Tell us a bit more, at least 10 characters").max(2000),
  consentGiven: z.literal(true, { message: "You need to accept the privacy policy to continue" }),
  turnstileToken: z.string().min(1, "Please complete the verification"),
  // Honeypot: real users never fill this in. Bots that fill every field will.
  website: z.string().max(0).optional(),
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;
