import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultPricingSettings } from "@/config/pricing-defaults";
import { db } from "@/lib/db";
import { calculateQuote } from "@/lib/pricing";
import { checkPublicFormRateLimit } from "@/lib/rate-limit";
import { generateReferenceNumber } from "@/lib/reference-number";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { toE164AuMobile } from "@/lib/au-phone";
import { quoteSubmissionSchema } from "@/lib/validation/quote";
import type { PricingSettings, PropertySize } from "@/types/pricing";

// TODO(owner): replace with a real Distance Matrix / Routes API call once
// GOOGLE_MAPS_SERVER_KEY is set (see TODO-OWNER.md). Every estimate assumes
// this typical Melbourne trip length until then.
const FALLBACK_TRAVEL_MINUTES = 20;

function getClientIp(request: NextRequest): string | undefined {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
}

/** Maps the pricing engine's PropertySize to Lead.bedrooms (null for non-residential sizes). */
function propertySizeToBedroomCount(size: PropertySize): number | null {
  switch (size) {
    case "studio":
      return 0;
    case "1bed":
      return 1;
    case "2bed":
      return 2;
    case "3bed":
      return 3;
    case "4plus":
      return 4;
    default:
      return null;
  }
}

async function getPricingSettings(): Promise<PricingSettings> {
  try {
    const settings = await db.pricingSettings.findFirst();
    if (!settings) return defaultPricingSettings;

    return {
      hourlyRateCents: settings.hourlyRateCents,
      extraMoverHourlyRateCents: settings.extraMoverHourlyRateCents,
      minimumHours: settings.minimumHours,
      calloutMinutes: settings.calloutMinutes,
      gstInclusive: settings.gstInclusive,
      baseHoursBySize: settings.baseHoursBySize as PricingSettings["baseHoursBySize"],
      accessPenaltyPerFlightHours: settings.accessPenaltyPerFlightHours,
      accessPenaltyLongCarryHours: settings.accessPenaltyLongCarryHours,
      packingHourPerBedroom: settings.packingHourPerBedroom,
      unpackingHourPerBedroom: settings.unpackingHourPerBedroom,
      disassemblyHourPerItem: settings.disassemblyHourPerItem,
    };
  } catch (error) {
    console.warn("Could not load PricingSettings from the database, using defaults.", error);
    return defaultPricingSettings;
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const rateLimit = await checkPublicFormRateLimit(ip ?? "unknown");
  if (!rateLimit.success) {
    return NextResponse.json({ error: "Too many requests, try again shortly." }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  const parsed = quoteSubmissionSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot: a real visitor never fills this field in.
  if (data.website) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const turnstileOk = await verifyTurnstileToken(data.turnstileToken, ip);
  if (!turnstileOk) {
    return NextResponse.json({ error: "Verification failed, please try again." }, { status: 400 });
  }

  const phoneE164 = toE164AuMobile(data.contactPhone);
  const pickupFlights = data.pickupAccess.hasLift ? 0 : data.pickupAccess.stairsCount;
  const dropoffFlights = data.dropoffAccess.hasLift ? 0 : data.dropoffAccess.stairsCount;
  const hasHeavyItem =
    data.specialItems.piano || data.specialItems.safe || data.specialItems.poolTable;

  const pricingSettings = await getPricingSettings();
  const estimate = calculateQuote(
    {
      propertySize: data.propertySize,
      pickupAccess: {
        flightsOfStairsNoLift: pickupFlights,
        longCarry: data.pickupAccess.longCarry,
      },
      dropoffAccess: {
        flightsOfStairsNoLift: dropoffFlights,
        longCarry: data.dropoffAccess.longCarry,
      },
      travelMinutes: FALLBACK_TRAVEL_MINUTES,
      extras: {
        packingBedrooms: data.extras.packing ? (data.extras.packingBedrooms ?? 0) : 0,
        unpackingBedrooms: data.extras.unpacking ? (data.extras.unpackingBedrooms ?? 0) : 0,
        disassemblyItems: data.extras.disassembly ? (data.extras.disassemblyItems ?? 0) : 0,
      },
      hasHeavyItem,
    },
    pricingSettings,
  );

  const referenceNumber = generateReferenceNumber();

  try {
    const lead = await db.$transaction(async (tx) => {
      const existingCustomer = await tx.customer.findFirst({ where: { phone: phoneE164 } });
      const customer = existingCustomer
        ? await tx.customer.update({
            where: { id: existingCustomer.id },
            data: { name: data.contactName, email: data.contactEmail },
          })
        : await tx.customer.create({
            data: { name: data.contactName, phone: phoneE164, email: data.contactEmail },
          });

      const quoteDraft = await tx.quoteDraft.create({
        data: {
          step: 5,
          pickupAddress: data.pickupAddress,
          dropoffAddress: data.dropoffAddress,
          additionalStopAddress: data.additionalStopAddress,
          moveDate: new Date(data.moveDate),
          dateFlexibility: data.dateFlexibility,
          preferredTime: data.preferredTime,
          propertyType: data.propertyType,
          bedrooms: propertySizeToBedroomCount(data.propertySize),
          pickupAccess: data.pickupAccess,
          dropoffAccess: data.dropoffAccess,
          specialItems: data.specialItems,
          extras: data.extras,
          contactName: data.contactName,
          contactPhone: phoneE164,
          contactEmail: data.contactEmail,
          howHeardAboutUs: data.howHeardAboutUs,
          notes: data.notes,
          consentGiven: data.consentGiven,
          isSubmitted: true,
        },
      });

      const newLead = await tx.lead.create({
        data: {
          referenceNumber,
          customerId: customer.id,
          source: "QUOTE_FORM",
          status: "NEW",
          message: data.notes,
          quoteDraftId: quoteDraft.id,
          consentGiven: data.consentGiven,
          ipAddress: ip,
          userAgent: request.headers.get("user-agent") ?? undefined,
        },
      });

      await tx.quote.create({
        data: {
          leadId: newLead.id,
          estimateLowCents: estimate.priceLowCents,
          estimateHighCents: estimate.priceHighCents,
          estimatedLowHours: estimate.lowHours,
          estimatedHighHours: estimate.highHours,
          recommendedTruck: estimate.recommendedTruck,
          recommendedCrewCount: estimate.recommendedCrewCount,
          assumptions: estimate.assumptions,
          pricingSnapshot: pricingSettings as unknown as Prisma.InputJsonValue,
        },
      });

      return newLead;
    });

    // TODO: send the customer "quote received" email and the staff
    // LEAD_NOTIFY_EMAIL alert here once the Email sending milestone lands.

    return NextResponse.json({
      referenceNumber: lead.referenceNumber,
      estimate: {
        lowHours: estimate.lowHours,
        highHours: estimate.highHours,
        priceLowCents: estimate.priceLowCents,
        priceHighCents: estimate.priceHighCents,
        recommendedTruck: estimate.recommendedTruck,
        recommendedCrewCount: estimate.recommendedCrewCount,
      },
    });
  } catch (error) {
    console.error("Failed to save quote submission", error);
    return NextResponse.json(
      { error: "Something went wrong saving your quote. Please call us instead." },
      { status: 500 },
    );
  }
}
