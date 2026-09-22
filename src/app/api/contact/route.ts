import { after, NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { serverEnv } from "@/env.server";
import { logAnalyticsEvent } from "@/lib/analytics";
import { toE164AuMobile } from "@/lib/au-phone";
import { db } from "@/lib/db";
import { ContactReceivedEmail } from "@/lib/email/templates/contact-received";
import { NewLeadAlertEmail } from "@/lib/email/templates/new-lead-alert";
import { sendEmail } from "@/lib/email/client";
import { checkPublicFormRateLimit } from "@/lib/rate-limit";
import { generateReferenceNumber } from "@/lib/reference-number";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { contactSubmissionSchema } from "@/lib/validation/contact";

function getClientIp(request: NextRequest): string | undefined {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const rateLimit = await checkPublicFormRateLimit(ip ?? "unknown");
  if (!rateLimit.success) {
    return NextResponse.json({ error: "Too many requests, try again shortly." }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  const parsed = contactSubmissionSchema.safeParse(json);

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

  const phoneE164 = data.phone ? toE164AuMobile(data.phone) : undefined;

  try {
    const lead = await db.$transaction(async (tx) => {
      const existingCustomer = phoneE164
        ? await tx.customer.findFirst({ where: { phone: phoneE164 } })
        : await tx.customer.findFirst({ where: { email: data.email } });

      const customer = existingCustomer
        ? await tx.customer.update({
            where: { id: existingCustomer.id },
            data: { name: data.name, email: data.email },
          })
        : await tx.customer.create({
            data: { name: data.name, phone: phoneE164, email: data.email },
          });

      return tx.lead.create({
        data: {
          referenceNumber: generateReferenceNumber(),
          customerId: customer.id,
          source: "CONTACT_FORM",
          status: "NEW",
          message: data.message,
          consentGiven: data.consentGiven,
          ipAddress: ip,
          userAgent: request.headers.get("user-agent") ?? undefined,
        },
      });
    });

    // Emails are best-effort and run after the response via after(), so a
    // broken send never blocks or fails the lead save.
    after(async () => {
      await logAnalyticsEvent("contact_submitted", {
        leadId: lead.id,
        path: "/contact",
      });

      await sendEmail({
        type: "CONTACT_RECEIVED",
        to: data.email,
        subject: "We've got your message",
        react: ContactReceivedEmail({ customerName: data.name }),
        relatedLeadId: lead.id,
      });

      if (serverEnv.LEAD_NOTIFY_EMAIL) {
        await sendEmail({
          type: "CONTACT_ALERT",
          to: serverEnv.LEAD_NOTIFY_EMAIL,
          subject: `New contact form message: ${data.name} (${lead.referenceNumber})`,
          react: NewLeadAlertEmail({
            referenceNumber: lead.referenceNumber,
            source: "Contact form",
            customerName: data.name,
            customerPhone: phoneE164,
            customerEmail: data.email,
            message: data.message,
          }),
          relatedLeadId: lead.id,
        });
      } else {
        console.warn("LEAD_NOTIFY_EMAIL not set, skipping staff alert email (dev only).");
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save contact submission", error);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please call us instead." },
      { status: 500 },
    );
  }
}
