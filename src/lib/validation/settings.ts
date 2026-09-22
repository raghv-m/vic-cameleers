import { z } from "zod";

export const businessSettingsSchema = z.object({
  legalName: z.string().trim().max(200).optional(),
  abn: z.string().trim().min(1, "ABN is required"),
  acn: z.string().trim().min(1, "ACN is required"),
  baseSuburb: z.string().trim().min(1),
  serviceAreaDescription: z.string().trim().min(1),
  phoneE164: z.string().trim().min(1),
  publicEmail: z.union([z.email(), z.literal("")]).optional(),
  domain: z.string().trim().max(200).optional(),
  fleetDescription: z.string().trim().min(1),
  crewSize: z.coerce.number().int().positive().optional(),
  isFullyInsured: z.boolean(),
  insuranceDetail: z.string().trim().max(500).optional(),
  isLicensed: z.boolean(),
  licenseDetail: z.string().trim().max(500).optional(),
  googleReviewUrl: z.union([z.url(), z.literal("")]).optional(),
  estimateMode: z.enum(["SHOW_PRICE", "CALLBACK_ONLY"]),
  cancellationPolicySummary: z.string().trim().max(2000).optional(),
  paymentMethodsDescription: z.string().trim().max(500).optional(),
});

export type BusinessSettingsInput = z.infer<typeof businessSettingsSchema>;

const baseHoursBySizeSchema = z.record(
  z.enum(["studio", "1bed", "2bed", "3bed", "4plus", "office", "singleItem"]),
  z.tuple([z.number().nonnegative(), z.number().nonnegative()]),
);

export const pricingSettingsSchema = z.object({
  hourlyRateCents: z.coerce.number().int().positive(),
  extraMoverHourlyRateCents: z.coerce.number().int().nonnegative(),
  minimumHours: z.coerce.number().positive(),
  calloutMinutes: z.coerce.number().int().nonnegative(),
  gstInclusive: z.boolean(),
  baseHoursBySizeJson: z.string().transform((value, ctx) => {
    try {
      const parsed = JSON.parse(value) as unknown;
      const result = baseHoursBySizeSchema.safeParse(parsed);
      if (!result.success) {
        ctx.addIssue({ code: "custom", message: "Doesn't match the expected shape" });
        return z.NEVER;
      }
      return result.data;
    } catch {
      ctx.addIssue({ code: "custom", message: "Not valid JSON" });
      return z.NEVER;
    }
  }),
  accessPenaltyPerFlightHours: z.coerce.number().nonnegative(),
  accessPenaltyLongCarryHours: z.coerce.number().nonnegative(),
  packingHourPerBedroom: z.coerce.number().nonnegative(),
  unpackingHourPerBedroom: z.coerce.number().nonnegative(),
  disassemblyHourPerItem: z.coerce.number().nonnegative(),
});

export type PricingSettingsInput = z.infer<typeof pricingSettingsSchema>;

export const serviceToggleSchema = z.object({
  id: z.string().min(1),
  enabled: z.boolean(),
});
