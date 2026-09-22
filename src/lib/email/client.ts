import "server-only";

import type { ReactElement } from "react";
import { Resend } from "resend";
import type { EmailType } from "@prisma/client";

import { serverEnv } from "@/env.server";
import { db } from "@/lib/db";

const resend = serverEnv.RESEND_API_KEY ? new Resend(serverEnv.RESEND_API_KEY) : null;

interface SendEmailOptions {
  type: EmailType;
  to: string;
  subject: string;
  react: ReactElement;
  relatedLeadId?: string;
  relatedBookingId?: string;
}

/**
 * Sends a transactional email and logs the attempt to EmailLog, win or
 * lose. Never throws: per CLAUDE.md section 8, a broken email must never
 * take a lead down with it. If RESEND_API_KEY isn't configured yet (see
 * TODO-OWNER.md), this logs a warning and records a FAILED EmailLog entry
 * instead of actually sending, so nothing crashes in development.
 */
export async function sendEmail(options: SendEmailOptions): Promise<void> {
  if (!resend || !serverEnv.EMAIL_FROM) {
    console.warn(
      `RESEND_API_KEY/EMAIL_FROM not set, skipping email send (dev only): ${options.type} -> ${options.to}`,
    );
    await logEmailAttempt(options, "FAILED", "RESEND_API_KEY not configured (dev environment)");
    return;
  }

  try {
    const result = await resend.emails.send({
      from: serverEnv.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      react: options.react,
      replyTo: serverEnv.EMAIL_REPLY_TO,
    });

    if (result.error) {
      await logEmailAttempt(options, "FAILED", result.error.message);
      return;
    }

    await logEmailAttempt(options, "SENT");
  } catch (error) {
    console.error(`Failed to send email (${options.type}) to ${options.to}`, error);
    await logEmailAttempt(
      options,
      "FAILED",
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}

async function logEmailAttempt(
  options: SendEmailOptions,
  status: "SENT" | "FAILED",
  errorMessage?: string,
): Promise<void> {
  try {
    await db.emailLog.create({
      data: {
        type: options.type,
        toAddress: options.to,
        status,
        errorMessage,
        sentAt: status === "SENT" ? new Date() : undefined,
        relatedLeadId: options.relatedLeadId,
        relatedBookingId: options.relatedBookingId,
      },
    });
  } catch (error) {
    console.error("Failed to write EmailLog", error);
  }
}
