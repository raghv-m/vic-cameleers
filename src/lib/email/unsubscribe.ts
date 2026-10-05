import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { business } from "@/config/business";
import { serverEnv } from "@/env.server";
import { db } from "@/lib/db";

/**
 * Unsubscribe links for non-essential emails (quote follow-up, thank-you, review request), as the
 * Spam Act 2003 requires for anything promotional. The link carries the customer id and an HMAC
 * of it keyed on AUTH_SECRET, so nobody can unsubscribe someone else by guessing ids. No expiry:
 * an unsubscribe link should keep working however old the email is.
 */

function signature(customerId: string): string | null {
  if (!serverEnv.AUTH_SECRET) return null;
  return createHmac("sha256", serverEnv.AUTH_SECRET)
    .update(`unsubscribe:${customerId}`)
    .digest("base64url");
}

export function verifyUnsubscribeToken(customerId: string, token: string): boolean {
  const expected = signature(customerId);
  if (!expected) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Marks the customer as opted out. Idempotent: the first opt-out date is kept. */
export async function optOutCustomer(customerId: string): Promise<boolean> {
  const { count } = await db.customer.updateMany({
    where: { id: customerId, emailOptOutAt: null },
    data: { emailOptOutAt: new Date() },
  });
  if (count > 0) return true;
  return (await db.customer.count({ where: { id: customerId } })) > 0;
}

export interface MarketingEnvelope {
  /** Visible link in the email footer: a page with a confirm button. */
  unsubscribeUrl: string;
  /** RFC 8058 one-click headers, so Gmail and Outlook show their own unsubscribe button. */
  headers: Record<string, string>;
}

/**
 * Everything a non-essential email needs, or null when it mustn't be sent: the customer opted
 * out, or there's no AUTH_SECRET to sign links with (never send promotional mail without a
 * working unsubscribe).
 */
export function marketingEnvelope(customer: {
  id: string;
  emailOptOutAt: Date | null;
}): MarketingEnvelope | null {
  if (customer.emailOptOutAt) return null;
  const token = signature(customer.id);
  if (!token) return null;
  const query = `c=${encodeURIComponent(customer.id)}&t=${token}`;
  return {
    unsubscribeUrl: `${business.siteUrl}/unsubscribe?${query}`,
    headers: {
      "List-Unsubscribe": `<${business.siteUrl}/api/unsubscribe?${query}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}
