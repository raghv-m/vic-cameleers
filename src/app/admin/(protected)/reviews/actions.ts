"use server";

import { revalidatePath } from "next/cache";

import { recordAuditLog } from "@/lib/audit-log";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import {
  manualReviewSchema,
  reviewFeatureSchema,
  reviewStatusSchema,
} from "@/lib/validation/review";

type ActionResult = { success: true } | { success: false; error: string };

export async function updateReviewStatus(input: unknown): Promise<ActionResult> {
  const session = await requireRole("SUPPORT");

  const parsed = reviewStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const review = await db.review.update({
    where: { id: parsed.data.id },
    data: {
      status: parsed.data.status,
      moderatedByUserId: session.user.id,
      moderatedAt: new Date(),
    },
  });

  await recordAuditLog({
    userId: session.user.id,
    action: "review.status_change",
    entityType: "Review",
    entityId: review.id,
    after: { status: review.status },
  });

  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function toggleReviewFeatured(input: unknown): Promise<ActionResult> {
  const session = await requireRole("SUPPORT");

  const parsed = reviewFeatureSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const review = await db.review.update({
    where: { id: parsed.data.id },
    data: { isFeatured: parsed.data.isFeatured },
  });

  await recordAuditLog({
    userId: session.user.id,
    action: parsed.data.isFeatured ? "review.featured" : "review.unfeatured",
    entityType: "Review",
    entityId: review.id,
  });

  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function addManualReview(input: unknown): Promise<ActionResult> {
  const session = await requireRole("SUPPORT");

  const parsed = manualReviewSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const review = await db.review.create({
    data: {
      authorName: parsed.data.authorName,
      rating: parsed.data.rating,
      body: parsed.data.body,
      source: "MANUAL",
      status: "APPROVED",
      moderatedByUserId: session.user.id,
      moderatedAt: new Date(),
    },
  });

  await recordAuditLog({
    userId: session.user.id,
    action: "review.added_manually",
    entityType: "Review",
    entityId: review.id,
  });

  revalidatePath("/admin/reviews");
  return { success: true };
}
