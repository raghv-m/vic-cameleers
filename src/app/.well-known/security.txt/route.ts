import { NextResponse } from "next/server";

import { business } from "@/config/business";

/**
 * security.txt (RFC 9116), CLAUDE.md section 11. Generated rather than a
 * static public file so it can't go stale against business.ts, and so it
 * doesn't publish a contact address before one exists - see the fallback
 * below and TODO-OWNER.md ("Public email address").
 */
export async function GET() {
  const contact = business.publicEmail
    ? `mailto:${business.publicEmail}`
    : `tel:${business.phoneE164}`;

  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  const lines = [
    `Contact: ${contact}`,
    `Expires: ${expires.toISOString()}`,
    `Preferred-Languages: en`,
    `Canonical: ${business.siteUrl}/.well-known/security.txt`,
  ];

  return new NextResponse(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
