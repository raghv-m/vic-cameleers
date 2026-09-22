import "server-only";

import { format } from "date-fns";

import { serverEnv } from "@/env.server";
import { adminLeadUrl } from "@/lib/admin-lead-url";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email/client";
import { BookingConfirmedEmail } from "@/lib/email/templates/booking-confirmed";
import { ContactReceivedEmail } from "@/lib/email/templates/contact-received";
import { NewLeadAlertEmail } from "@/lib/email/templates/new-lead-alert";
import { QuoteReceivedEmail } from "@/lib/email/templates/quote-received";

const truckLabel = { SIX_TONNE: "6 tonne truck", TEN_TONNE: "10 tonne truck" } as const;

type ResendResult = { success: true } | { success: false; error: string };

/**
 * Reconstructs and resends one logged email from its related lead/booking
 * data. Used by both the manual "Resend" button on the email log page and
 * the /api/cron/email-retry job. Only supports the email types that are
 * actually sent today and carry enough related data to rebuild from - see
 * the default case for the rest.
 */
export async function resendEmailLog(emailLogId: string): Promise<ResendResult> {
  const log = await db.emailLog.findUnique({ where: { id: emailLogId } });
  if (!log) return { success: false, error: "Email log not found" };

  switch (log.type) {
    case "QUOTE_RECEIVED": {
      if (!log.relatedLeadId) return { success: false, error: "Missing lead reference" };
      const lead = await db.lead.findUnique({
        where: { id: log.relatedLeadId },
        include: { customer: true, quotes: { orderBy: { createdAt: "desc" }, take: 1 } },
      });
      const quote = lead?.quotes[0];
      if (!lead?.customer?.email || !quote) {
        return { success: false, error: "Missing lead or quote data" };
      }

      await sendEmail({
        type: "QUOTE_RECEIVED",
        to: lead.customer.email,
        subject: `Your Vic Cameleers estimate: ${lead.referenceNumber}`,
        react: QuoteReceivedEmail({
          customerName: lead.customer.name,
          referenceNumber: lead.referenceNumber,
          priceLowCents: quote.estimateLowCents,
          priceHighCents: quote.estimateHighCents,
          lowHours: quote.estimatedLowHours,
          highHours: quote.estimatedHighHours,
          recommendedCrewCount: quote.recommendedCrewCount,
          recommendedTruckLabel: truckLabel[quote.recommendedTruck],
        }),
        relatedLeadId: lead.id,
      });
      return { success: true };
    }

    case "CONTACT_RECEIVED": {
      if (!log.relatedLeadId) return { success: false, error: "Missing lead reference" };
      const lead = await db.lead.findUnique({
        where: { id: log.relatedLeadId },
        include: { customer: true },
      });
      if (!lead?.customer?.email) return { success: false, error: "Missing lead data" };

      await sendEmail({
        type: "CONTACT_RECEIVED",
        to: lead.customer.email,
        subject: "We've got your message",
        react: ContactReceivedEmail({ customerName: lead.customer.name }),
        relatedLeadId: lead.id,
      });
      return { success: true };
    }

    case "NEW_LEAD_ALERT":
    case "CONTACT_ALERT": {
      if (!log.relatedLeadId) return { success: false, error: "Missing lead reference" };
      if (!serverEnv.LEAD_NOTIFY_EMAIL) {
        return { success: false, error: "LEAD_NOTIFY_EMAIL is not configured" };
      }

      const lead = await db.lead.findUnique({
        where: { id: log.relatedLeadId },
        include: { customer: true, quotes: { orderBy: { createdAt: "desc" }, take: 1 } },
      });
      if (!lead) return { success: false, error: "Lead not found" };

      const quote = lead.quotes[0];
      const source = log.type === "NEW_LEAD_ALERT" ? "Quote" : "Contact form";

      await sendEmail({
        type: log.type,
        to: serverEnv.LEAD_NOTIFY_EMAIL,
        subject: `${log.type === "NEW_LEAD_ALERT" ? "New quote lead" : "New contact form message"}: ${lead.customer?.name ?? "Unknown"} (${lead.referenceNumber})`,
        react: NewLeadAlertEmail({
          referenceNumber: lead.referenceNumber,
          source,
          customerName: lead.customer?.name ?? "Unknown",
          customerPhone: lead.customer?.phone ?? undefined,
          customerEmail: lead.customer?.email ?? undefined,
          message: lead.message ?? undefined,
          estimateSummary: quote
            ? `$${quote.estimateLowCents / 100} to $${quote.estimateHighCents / 100}, ${quote.recommendedCrewCount} movers, ${truckLabel[quote.recommendedTruck]}`
            : undefined,
          adminLeadUrl: adminLeadUrl(lead.id),
        }),
        relatedLeadId: lead.id,
      });
      return { success: true };
    }

    case "BOOKING_CONFIRMED": {
      if (!log.relatedBookingId) return { success: false, error: "Missing booking reference" };
      const booking = await db.booking.findUnique({
        where: { id: log.relatedBookingId },
        include: { lead: { include: { customer: true } } },
      });
      if (!booking?.lead.customer?.email) {
        return { success: false, error: "Missing booking or customer data" };
      }

      await sendEmail({
        type: "BOOKING_CONFIRMED",
        to: booking.lead.customer.email,
        subject: `Your move is confirmed: ${booking.lead.referenceNumber}`,
        react: BookingConfirmedEmail({
          customerName: booking.lead.customer.name,
          referenceNumber: booking.lead.referenceNumber,
          moveDateLabel: format(booking.moveDate, "EEEE d MMMM yyyy"),
          preferredTime: booking.preferredTime,
        }),
        relatedLeadId: booking.leadId,
        relatedBookingId: booking.id,
      });
      return { success: true };
    }

    default:
      return { success: false, error: `Resending a ${log.type} email isn't supported yet` };
  }
}
