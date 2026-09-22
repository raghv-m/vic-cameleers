import type { Metadata } from "next";

import { BusinessSettingsForm } from "@/components/admin/business-settings-form";
import { PricingSettingsForm } from "@/components/admin/pricing-settings-form";
import { ServiceToggleList } from "@/components/admin/service-toggle-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { business } from "@/config/business";
import { defaultPricingSettings } from "@/config/pricing-defaults";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { BUSINESS_SETTINGS_ID, PRICING_SETTINGS_ID } from "@/lib/settings-ids";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  await requireRole("OPERATIONS_MANAGER");

  const [businessSettings, pricingSettings, services] = await Promise.all([
    db.businessSettings.findFirst(),
    db.pricingSettings.findFirst(),
    db.service.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Business details</CardTitle>
        </CardHeader>
        <CardContent>
          <BusinessSettingsForm
            settings={
              businessSettings ?? {
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
                updatedAt: new Date(),
              }
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <PricingSettingsForm
            settings={
              pricingSettings ?? {
                id: PRICING_SETTINGS_ID,
                ...defaultPricingSettings,
                updatedByUserId: null,
                updatedAt: new Date(),
              }
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceToggleList services={services} />
        </CardContent>
      </Card>
    </div>
  );
}
