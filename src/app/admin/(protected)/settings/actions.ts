"use server";

import { revalidatePath } from "next/cache";

import { recordAuditLog } from "@/lib/audit-log";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { BUSINESS_SETTINGS_ID, PRICING_SETTINGS_ID } from "@/lib/settings-ids";
import {
  businessSettingsSchema,
  pricingSettingsSchema,
  serviceToggleSchema,
} from "@/lib/validation/settings";
import type { Prisma } from "@prisma/client";

type ActionResult = { success: true } | { success: false; error: string };

export async function updateBusinessSettings(input: unknown): Promise<ActionResult> {
  const session = await requireRole("OPERATIONS_MANAGER");

  const parsed = businessSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const data = {
    ...parsed.data,
    legalName: parsed.data.legalName || null,
    publicEmail: parsed.data.publicEmail || null,
    domain: parsed.data.domain || null,
    crewSize: parsed.data.crewSize ?? null,
    insuranceDetail: parsed.data.insuranceDetail || null,
    licenseDetail: parsed.data.licenseDetail || null,
    googleReviewUrl: parsed.data.googleReviewUrl || null,
    cancellationPolicySummary: parsed.data.cancellationPolicySummary || null,
    paymentMethodsDescription: parsed.data.paymentMethodsDescription || null,
  };

  await db.businessSettings.upsert({
    where: { id: BUSINESS_SETTINGS_ID },
    update: data,
    create: { id: BUSINESS_SETTINGS_ID, tradingName: "Vic Cameleers", ...data },
  });

  await recordAuditLog({
    userId: session.user.id,
    action: "settings.business_updated",
    entityType: "BusinessSettings",
    entityId: BUSINESS_SETTINGS_ID,
  });

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function updatePricingSettings(input: unknown): Promise<ActionResult> {
  const session = await requireRole("OPERATIONS_MANAGER");

  const parsed = pricingSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { baseHoursBySizeJson, ...rest } = parsed.data;

  await db.pricingSettings.upsert({
    where: { id: PRICING_SETTINGS_ID },
    update: {
      ...rest,
      baseHoursBySize: baseHoursBySizeJson as unknown as Prisma.InputJsonValue,
      updatedByUserId: session.user.id,
    },
    create: {
      id: PRICING_SETTINGS_ID,
      ...rest,
      baseHoursBySize: baseHoursBySizeJson as unknown as Prisma.InputJsonValue,
      updatedByUserId: session.user.id,
    },
  });

  await recordAuditLog({
    userId: session.user.id,
    action: "settings.pricing_updated",
    entityType: "PricingSettings",
    entityId: PRICING_SETTINGS_ID,
  });

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function toggleService(input: unknown): Promise<ActionResult> {
  const session = await requireRole("OPERATIONS_MANAGER");

  const parsed = serviceToggleSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const service = await db.service.update({
    where: { id: parsed.data.id },
    data: { enabled: parsed.data.enabled },
  });

  await recordAuditLog({
    userId: session.user.id,
    action: parsed.data.enabled ? "service.enabled" : "service.disabled",
    entityType: "Service",
    entityId: service.id,
  });

  revalidatePath("/admin/settings");
  return { success: true };
}
