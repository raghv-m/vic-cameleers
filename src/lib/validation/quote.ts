import { z } from "zod";

import { isValidAuMobile } from "@/lib/au-phone";

/**
 * A move date must be a real YYYY-MM-DD date, today or later, and within 18 months. "Today" is the
 * caller's local date, so the same check works in the browser and on the server.
 */
export function moveDateProblem(value: string, today: Date = new Date()): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Pick a moving date";
  const [y, m, d] = value.split("-").map(Number) as [number, number, number];
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return "That date doesn't exist";
  }
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (date < start) return "Pick today or a later date";
  const limit = new Date(start);
  limit.setMonth(limit.getMonth() + 18);
  if (date > limit) return "We book up to 18 months ahead. Call us for later dates";
  return null;
}

/**
 * Addresses must be long enough to find, and anything with a postcode outside Victoria (3xxx
 * and 8xxx are Victorian) is flagged, because we only move within Victoria.
 */
export function addressProblem(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length < 5) return "Enter the street and suburb";
  // The last standalone 4-digit number is the postcode, so a long street number is ignored.
  const postcode = trimmed.match(/\b(\d{4})\b(?!.*\b\d{4}\b)/)?.[1];
  if (postcode && !/^[38]\d{3}$/.test(postcode)) {
    return "That postcode is outside Victoria. We only move within Victoria";
  }
  return null;
}

function address(label: string) {
  return z
    .string()
    .max(200, `${label} is too long`)
    .superRefine((value, ctx) => {
      const problem = addressProblem(value);
      if (problem) ctx.addIssue({ code: "custom", message: problem });
    });
}

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

/** What Google Places returned for a picked address. Optional: typed addresses work without it. */
export const pickedPlaceSchema = z.object({
  suburb: z.string().max(80).nullable(),
  postcode: z.string().max(8).nullable(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  placeId: z.string().max(300),
});

export const stepRouteSchema = z.object({
  pickupAddress: address("Pickup address"),
  dropoffAddress: address("Drop-off address"),
  pickupPlace: pickedPlaceSchema.nullish(),
  dropoffPlace: pickedPlaceSchema.nullish(),
  additionalStopAddress: z
    .string()
    .max(200)
    .optional()
    .superRefine((value, ctx) => {
      if (!value?.trim()) return;
      const problem = addressProblem(value);
      if (problem) ctx.addIssue({ code: "custom", message: problem });
    }),
});

export const stepWhenSchema = z.object({
  moveDate: z.string().superRefine((value, ctx) => {
    const problem = moveDateProblem(value);
    if (problem) ctx.addIssue({ code: "custom", message: problem });
  }),
  dateFlexibility: dateFlexibilitySchema,
  preferredTime: preferredTimeSchema,
});

/** The move itself: where and when. Same shape as before the wizard split it over two steps. */
export const stepLocationDateSchema = stepRouteSchema.merge(stepWhenSchema);

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
// trigger(fieldNames): with a merged Zod object schema, trigger() doesn't
// reliably scope resulting errors to just the requested fields, so it was
// leaking validation errors for not-yet-visited steps onto the screen the
// moment the user arrived there. Four steps (owner decision, 28 Sep 2026, replacing the
// 26 Sep three-step flow): where from and to, what's moving (property, access, special
// items, extras), when, and the person.
export const stepSchemas = {
  1: stepRouteSchema,
  2: stepPropertySchema.merge(stepInventorySchema).merge(stepExtrasSchema),
  3: stepWhenSchema,
  4: stepContactSchema,
} as const;
