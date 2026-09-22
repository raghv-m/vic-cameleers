import { z } from "zod";

import { isValidAuMobile } from "@/lib/au-phone";

export const propertySizeSchema = z.enum([
  "studio",
  "1bed",
  "2bed",
  "3bed",
  "4plus",
  "office",
  "singleItem",
]);

export const propertyTypeSchema = z.enum([
  "STUDIO",
  "APARTMENT",
  "UNIT",
  "TOWNHOUSE",
  "HOUSE",
  "OFFICE",
  "STORAGE_UNIT",
  "SINGLE_ITEM",
]);

export const accessDetailsSchema = z.object({
  floorLevel: z.string().min(1, "Select a floor level"),
  hasLift: z.boolean(),
  stairsCount: z.coerce.number().int().min(0).max(20),
  longCarry: z.boolean(),
  parkingNotes: z.string().max(300).optional(),
});

export const dateFlexibilitySchema = z.enum(["exact", "within_week", "any_weekday"]);
export const preferredTimeSchema = z.enum(["morning", "midday", "afternoon"]);

export const specialItemsSchema = z.object({
  piano: z.boolean().default(false),
  safe: z.boolean().default(false),
  poolTable: z.boolean().default(false),
  gymEquipment: z.boolean().default(false),
  fragileArtwork: z.boolean().default(false),
});

export const extrasSchema = z.object({
  packing: z.boolean().default(false),
  packingBedrooms: z.coerce.number().int().min(0).max(10).optional(),
  unpacking: z.boolean().default(false),
  unpackingBedrooms: z.coerce.number().int().min(0).max(10).optional(),
  disassembly: z.boolean().default(false),
  disassemblyItems: z.coerce.number().int().min(0).max(20).optional(),
  boxesAndMaterials: z.boolean().default(false),
});

export const stepLocationDateSchema = z.object({
  pickupAddress: z.string().min(5, "Enter a pickup address"),
  dropoffAddress: z.string().min(5, "Enter a drop-off address"),
  additionalStopAddress: z.string().max(200).optional(),
  moveDate: z.string().min(1, "Pick a date"),
  dateFlexibility: dateFlexibilitySchema,
  preferredTime: preferredTimeSchema,
});

export const stepPropertySchema = z.object({
  propertyType: propertyTypeSchema,
  // Drives the pricing engine directly (src/lib/pricing.ts PropertySize).
  // Collected once here rather than asked again as a separate "quick size
  // picker" in the next step, which would just be the same question twice.
  propertySize: propertySizeSchema,
  pickupAccess: accessDetailsSchema,
  dropoffAccess: accessDetailsSchema,
});

export const stepInventorySchema = z.object({
  specialItems: specialItemsSchema,
});

export const stepExtrasSchema = z.object({
  extras: extrasSchema,
});

export const stepContactSchema = z.object({
  contactName: z.string().min(2, "Enter your name"),
  contactPhone: z
    .string()
    .min(1, "Enter a mobile number")
    .refine(isValidAuMobile, "Enter a valid Australian mobile number"),
  contactEmail: z.email("Enter a valid email"),
  howHeardAboutUs: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
  consentGiven: z.literal(true, { message: "You need to accept the privacy policy to continue" }),
  turnstileToken: z.string().min(1, "Please complete the verification"),
  // Honeypot: real users never fill this in. Bots that fill every field will.
  website: z.string().max(0).optional(),
});

export const quoteSubmissionSchema = stepLocationDateSchema
  .merge(stepPropertySchema)
  .merge(stepInventorySchema)
  .merge(stepExtrasSchema)
  .merge(stepContactSchema);

// z.coerce.number() fields (stairsCount, packingBedrooms, etc.) make the
// pre-validation "input" shape differ from the post-validation "output"
// shape. react-hook-form needs both: forms are built and read against the
// input shape, while the submit handler receives the coerced output shape.
export type QuoteSubmissionInput = z.input<typeof quoteSubmissionSchema>;
export type QuoteSubmission = z.output<typeof quoteSubmissionSchema>;

// Each step is validated against its own sub-schema rather than via RHF's
// trigger(fieldNames) — with a merged Zod object schema, trigger() doesn't
// reliably scope resulting errors to just the requested fields, so it was
// leaking validation errors for not-yet-visited steps onto the screen the
// moment the user arrived there.
export const stepSchemas = {
  1: stepLocationDateSchema,
  2: stepPropertySchema,
  3: stepInventorySchema,
  4: stepExtrasSchema,
  5: stepContactSchema,
} as const;
