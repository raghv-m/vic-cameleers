import { NextResponse } from "next/server";

import { business } from "@/config/business";
import { getEnabledServices } from "@/config/services";
import { getPricingSettings } from "@/lib/pricing-settings";
import { suburbs } from "@/content/suburbs";

/**
 * llms.txt (CLAUDE.md section 13): a short, plain-text summary AI
 * assistants and crawlers can read directly, generated from the same
 * config/DB used everywhere else so it can't drift out of sync.
 */
export async function GET() {
  const settings = await getPricingSettings();
  const services = getEnabledServices();

  const lines = [
    `# ${business.tradingName}`,
    "",
    `${business.tradingName} is a removalist business based in ${business.baseSuburb}, Victoria, Australia, covering ${business.serviceAreaDescription}.`,
    "",
    "## Contact",
    `Phone: ${business.phoneDisplay}`,
    business.publicEmail ? `Email: ${business.publicEmail}` : null,
    `ABN: ${business.abn}`,
    `Website: ${business.siteUrl}`,
    "",
    "## Services",
    ...services.map((service) => `- ${service.name}: ${service.shortDescription}`),
    "",
    "## Pricing",
    `Hourly rate: $${(settings.hourlyRateCents / 100).toFixed(0)}/hour${settings.gstInclusive ? " (GST inclusive)" : ""}`,
    `Minimum charge: ${settings.minimumHours} hours`,
    `Call-out fee: ${settings.calloutMinutes} minutes, charged at the hourly rate, included in every estimate`,
    "Full pricing and worked examples: " + `${business.siteUrl}/pricing`,
    "",
    "## Service area",
    `Suburbs covered include: ${suburbs.map((suburb) => suburb.name).join(", ")}.`,
    "",
    "## Getting a quote",
    `Instant online estimate: ${business.siteUrl}/quote`,
  ].filter((line): line is string => line !== null);

  return new NextResponse(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
