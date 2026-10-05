import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { optOutCustomer, verifyUnsubscribeToken } from "@/lib/email/unsubscribe";

/**
 * RFC 8058 one-click unsubscribe: Gmail, Outlook and Apple Mail POST here when someone presses
 * their built-in Unsubscribe button. GET is deliberately not handled, so link scanners that
 * prefetch URLs can't unsubscribe anyone; people clicking the link in the email land on the
 * /unsubscribe page instead, which asks them to confirm.
 */
export async function POST(request: NextRequest) {
  const customerId = request.nextUrl.searchParams.get("c") ?? "";
  const token = request.nextUrl.searchParams.get("t") ?? "";
  if (!customerId || !verifyUnsubscribeToken(customerId, token)) {
    return NextResponse.json({ error: "Invalid link" }, { status: 400 });
  }
  await optOutCustomer(customerId);
  return NextResponse.json({ unsubscribed: true });
}
