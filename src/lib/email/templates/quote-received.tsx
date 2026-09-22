import { Button, Section, Text } from "@react-email/components";

import { business } from "@/config/business";

import { EmailLayout, emailColors } from "./layout";

export interface QuoteReceivedEmailProps {
  customerName: string;
  referenceNumber: string;
  priceLowCents: number;
  priceHighCents: number;
  lowHours: number;
  highHours: number;
  recommendedCrewCount: number;
  recommendedTruckLabel: string;
}

export function QuoteReceivedEmail({
  customerName,
  referenceNumber,
  priceLowCents,
  priceHighCents,
  lowHours,
  highHours,
  recommendedCrewCount,
  recommendedTruckLabel,
}: QuoteReceivedEmailProps) {
  return (
    <EmailLayout
      previewText={`Your estimate: $${priceLowCents / 100} to $${priceHighCents / 100}`}
      heading={`Thanks, ${customerName}`}
    >
      <Text style={{ color: emailColors.text, fontSize: 14 }}>
        We&apos;ve got your move details. Here&apos;s your estimate, reference{" "}
        <strong>{referenceNumber}</strong>.
      </Text>

      <Section
        style={{
          backgroundColor: emailColors.background,
          borderRadius: 8,
          padding: "16px",
          margin: "16px 0",
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: 700, color: emailColors.text, margin: 0 }}>
          ${priceLowCents / 100} to ${priceHighCents / 100}
        </Text>
        <Text style={{ fontSize: 13, color: emailColors.muted, margin: "8px 0 0" }}>
          Estimated {lowHours.toFixed(1)} to {highHours.toFixed(1)} hours with{" "}
          {recommendedCrewCount} movers and a {recommendedTruckLabel}, including the{" "}
          {business.calloutMinutes} minute call-out.
        </Text>
      </Section>

      <Text style={{ color: emailColors.text, fontSize: 14 }}>
        This is a real range based on what you told us. The final price is based on actual time on
        the day. We&apos;ll confirm everything by phone or SMS before your move.
      </Text>

      <Button
        href={`tel:${business.phoneE164}`}
        style={{
          backgroundColor: emailColors.primary,
          color: "#ffffff",
          padding: "12px 20px",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
          display: "inline-block",
          marginTop: 16,
        }}
      >
        Call {business.phoneDisplay}
      </Button>
    </EmailLayout>
  );
}

export default QuoteReceivedEmail;
