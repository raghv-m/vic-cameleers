import type { LeadSource, LeadStatus } from "@prisma/client";

/** Pipeline order from CLAUDE.md section 10: New -> Contacted -> Quoted -> Follow-up -> Booked -> Completed -> Lost. */
export const LEAD_STATUS_ORDER: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUOTED",
  "FOLLOW_UP",
  "BOOKED",
  "COMPLETED",
  "LOST",
];

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUOTED: "Quoted",
  FOLLOW_UP: "Follow-up",
  BOOKED: "Booked",
  COMPLETED: "Completed",
  LOST: "Lost",
};

export const LEAD_STATUS_BADGE_VARIANT: Record<
  LeadStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  NEW: "default",
  CONTACTED: "secondary",
  QUOTED: "secondary",
  FOLLOW_UP: "outline",
  BOOKED: "default",
  COMPLETED: "secondary",
  LOST: "destructive",
};

export const LEAD_SOURCE_LABEL: Record<LeadSource, string> = {
  QUOTE_FORM: "Quote form",
  CONTACT_FORM: "Contact form",
  PHONE: "Phone",
  REFERRAL: "Referral",
  GOOGLE_BUSINESS_PROFILE: "Google Business Profile",
  OTHER: "Other",
};

/** Only LOST requires a reason (CLAUDE.md section 10: "with lost reason"). */
export function requiresLostReason(status: LeadStatus): boolean {
  return status === "LOST";
}
