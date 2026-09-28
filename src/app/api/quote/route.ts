import type { Prisma } from "@prisma/client";
import { log } from "@/lib/log";
import { after, NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { serverEnv } from "@/env.server";
import { adminLeadUrl } from "@/lib/admin-lead-url";
import { logAnalyticsEvent } from "@/lib/analytics";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email/client";
import { NewLeadAlertEmail } from "@/lib/email/templates/new-lead-alert";
import { QuoteReceivedEmail } from "@/lib/email/templates/quote-received";
import { calculateQuote } from "@/lib/pricing";
import { toPricingInput } from "@/lib/quote-pricing";
import { getPricingSettings } from "@/lib/pricing-settings";
import { checkPublicFormRateLimit } from "@/lib/rate-limit";
import { generateReferenceNumber } from "@/lib/reference-number";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { toE164AuMobile } from "@/lib/au-phone";
import { quoteSubmissionSchema } from "@/lib/validation/quote";
import type { PropertySize } from "@/types/pricing";

const truckLabel: Record<"SIX_TONNE" | "TEN_TONNE", string> = {
  SIX_TONNE: "6 tonne truck",
  TEN_TONNE: "10 tonne truck",
};

/** A repeat of the same request inside this window returns the first one instead of a new lead. */
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

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

async function handlePost(request: NextRequest) {
  const requestId = request.headers.get("x-request-id");
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
  const pricingSettings = await getPricingSettings();
  const estimate = calculateQuote(toPricingInput(data), pricingSettings);

  // Duplicate submission (double tap, back-and-resend, a retry after a slow response): the same
  // mobile, pickup and date within a few minutes gets the first request's reference back rather
  // than a second lead and a second round of emails.
  try {
    const recent = await db.lead.findFirst({
      where: {
        source: "QUOTE_FORM",
        createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
        customer: { phone: phoneE164 },
        quoteDraft: { pickupAddress: data.pickupAddress, moveDate: new Date(data.moveDate) },
      },
      orderBy: { createdAt: "desc" },
      select: {
        referenceNumber: true,
        quotes: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
    const recentQuote = recent?.quotes[0];
    if (recent && recentQuote) {
      return NextResponse.json({
        referenceNumber: recent.referenceNumber,
        duplicate: true,
        estimate: {
          lowHours: recentQuote.estimatedLowHours,
          highHours: recentQuote.estimatedHighHours,
          priceLowCents: recentQuote.estimateLowCents,
          priceHighCents: recentQuote.estimateHighCents,
          recommendedTruck: recentQuote.recommendedTruck,
          recommendedCrewCount: recentQuote.recommendedCrewCount,
        },
      });
    }
  } catch (error) {
    // The check is a nicety. If it fails, save the lead anyway: never lose a lead.
    log.error("QUOTE_DUPLICATE_CHECK_FAILED", error, { requestId });
  }

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
          step: 3,
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

    // Emails are best-effort: a broken send must never take the lead down
    // with it, and the DB transaction has already committed by this point.
    // after() hands this to Vercel's background work queue instead of a
    // bare fire-and-forget promise, which the platform can kill the instant
    // the response is sent.
    after(async () => {
      await logAnalyticsEvent("quote_completed", {
        leadId: lead.id,
        path: "/quote",
        metadata: { propertySize: data.propertySize, source: "QUOTE_FORM" },
      });

      await sendEmail({
        type: "QUOTE_RECEIVED",
        to: data.contactEmail,
        subject: `Your Vic Cameleers estimate: ${lead.referenceNumber}`,
        react: QuoteReceivedEmail({
          customerName: data.contactName,
          referenceNumber: lead.referenceNumber,
          priceLowCents: estimate.priceLowCents,
          priceHighCents: estimate.priceHighCents,
          lowHours: estimate.lowHours,
          highHours: estimate.highHours,
          recommendedCrewCount: estimate.recommendedCrewCount,
          recommendedTruckLabel: truckLabel[estimate.recommendedTruck],
        }),
        relatedLeadId: lead.id,
      });

      if (serverEnv.LEAD_NOTIFY_EMAIL) {
        await sendEmail({
          type: "NEW_LEAD_ALERT",
          to: serverEnv.LEAD_NOTIFY_EMAIL,
          subject: `New quote lead: ${data.contactName} (${lead.referenceNumber})`,
          react: NewLeadAlertEmail({
            referenceNumber: lead.referenceNumber,
            source: "Quote",
            customerName: data.contactName,
            customerPhone: phoneE164,
            customerEmail: data.contactEmail,
            message: data.notes,
            estimateSummary: `$${estimate.priceLowCents / 100} to $${estimate.priceHighCents / 100}, ${estimate.recommendedCrewCount} movers, ${truckLabel[estimate.recommendedTruck]}`,
            adminLeadUrl: adminLeadUrl(lead.id),
          }),
          relatedLeadId: lead.id,
        });
      } else {
        log.warn("LEAD_NOTIFY_EMAIL_UNSET", { requestId });
      }
    });

    log.info("QUOTE_CREATED", {
      requestId,
      referenceNumber: lead.referenceNumber,
      leadId: lead.id,
    });

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
    log.error("QUOTE_SAVE_FAILED", error, { requestId });
    return NextResponse.json(
      { error: "Something went wrong saving your quote. Please call us instead." },
      { status: 500 },
    );
  }
}

/**
 * Last-resort guard: anything that fails outside the handler's own error handling (for example
 * the server env check when DATABASE_URL isn't configured) is logged and answered with a proper
 * JSON 500 the form can show, instead of an empty error response.
 */
export async function POST(request: NextRequest) {
  const requestId = request.headers.get("x-request-id");
  try {
    return await handlePost(request);
  } catch (error) {
    log.error("QUOTE_UNHANDLED", error, { requestId });
    return NextResponse.json(
      { error: "Something went wrong sending your quote. Please call us instead." },
      { status: 500 },
    );
  }
}
