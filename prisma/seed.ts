import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { business } from "../src/config/business.ts";
import { services } from "../src/config/services.ts";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
});
const db = new PrismaClient({ adapter });

const BUSINESS_SETTINGS_ID = "business_settings_singleton";
const PRICING_SETTINGS_ID = "pricing_settings_singleton";

/**
 * Base hour ranges by property size, keyed to match QuoteDraft's size picker
 * values. See CLAUDE.md section 6 and the pricing plan worked examples.
 */
const baseHoursBySize = {
  studio: [1.5, 2],
  "1bed": [2, 3],
  "2bed": [3, 4.5],
  "3bed": [4, 6],
  "4plus": [5.5, 8],
  office: [2, 3],
  singleItem: [0.5, 1.5],
};

async function seedBusinessSettings() {
  await db.businessSettings.upsert({
    where: { id: BUSINESS_SETTINGS_ID },
    update: {},
    create: {
      id: BUSINESS_SETTINGS_ID,
      tradingName: business.tradingName,
      legalName: business.legalName,
      abn: business.abn,
      acn: business.acn,
      baseSuburb: business.baseSuburb,
      serviceAreaDescription: business.serviceAreaDescription,
      phoneE164: business.phoneE164,
      publicEmail: business.publicEmail,
      domain: null,
      fleetDescription: business.fleet.map((truck) => truck.label).join(", "),
      crewSize: business.crewSize,
      isFullyInsured: business.claims.isFullyInsured,
      insuranceDetail: business.claims.insuranceDetail,
      isLicensed: business.claims.isLicensed,
      licenseDetail: business.claims.licenseDetail,
      googleReviewUrl: business.googleReviewUrl,
      estimateMode: "SHOW_PRICE",
      cancellationPolicySummary: null,
      paymentMethodsDescription: null,
    },
  });
  console.log("Seeded BusinessSettings");
}

async function seedPricingSettings() {
  // TODO(owner): gstInclusive and the exact rate structure are unconfirmed
  // open questions (CLAUDE.md section 1). Seeded conservatively; update via
  // admin settings once confirmed, never guess in copy.
  await db.pricingSettings.upsert({
    where: { id: PRICING_SETTINGS_ID },
    update: {},
    create: {
      id: PRICING_SETTINGS_ID,
      hourlyRateCents: 12000,
      extraMoverHourlyRateCents: 3500,
      minimumHours: 2,
      calloutMinutes: 45,
      gstInclusive: false,
      baseHoursBySize,
      accessPenaltyPerFlightHours: 0.25,
      accessPenaltyLongCarryHours: 0.25,
      packingHourPerBedroom: 1,
      unpackingHourPerBedroom: 0.5,
      disassemblyHourPerItem: 0.5,
    },
  });
  console.log("Seeded PricingSettings");
}

async function seedServices() {
  for (const [index, service] of services.entries()) {
    await db.service.upsert({
      where: { slug: service.slug },
      update: {
        name: service.name,
        shortDescription: service.shortDescription,
        enabled: service.enabled,
        sortOrder: index,
      },
      create: {
        slug: service.slug,
        name: service.name,
        shortDescription: service.shortDescription,
        enabled: service.enabled,
        sortOrder: index,
      },
    });
  }
  console.log(`Seeded ${services.length} services`);
}

async function seedTrucks() {
  for (const truck of business.fleet) {
    const existing = await db.truck.findFirst({ where: { size: truck.size } });
    if (existing) continue;

    await db.truck.create({
      data: {
        name: truck.label,
        size: truck.size,
        // TODO(owner): add real registration plates before launch.
        registration: null,
      },
    });
  }
  console.log(`Seeded ${business.fleet.length} trucks`);
}

async function main() {
  await seedBusinessSettings();
  await seedPricingSettings();
  await seedServices();
  await seedTrucks();
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
