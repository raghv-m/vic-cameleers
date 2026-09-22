import { Button, Section, Text } from "@react-email/components";

import { business } from "@/config/business";

import { EmailLayout, emailColors } from "./layout";

export interface BookingConfirmedEmailProps {
  customerName: string;
  referenceNumber: string;
  moveDateLabel: string;
  preferredTime?: string | null;
}

export function BookingConfirmedEmail({
  customerName,
  referenceNumber,
  moveDateLabel,
  preferredTime,
}: BookingConfirmedEmailProps) {
  return (
    <EmailLayout
      previewText={`Your move is booked for ${moveDateLabel}`}
      heading={`You're booked, ${customerName}`}
    >
      <Text style={{ color: emailColors.text, fontSize: 14 }}>
        Your move, reference <strong>{referenceNumber}</strong>, is confirmed.
      </Text>

      <Section
        style={{
          backgroundColor: emailColors.background,
          borderRadius: 8,
          padding: "16px",
          margin: "16px 0",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 700, color: emailColors.text, margin: 0 }}>
          {moveDateLabel}
          {preferredTime ? `, ${preferredTime}` : ""}
        </Text>
      </Section>

      <Text style={{ color: emailColors.text, fontSize: 14 }}>
        We&apos;ll send a reminder closer to the day. If anything about your move changes, call us
        and we&apos;ll sort it out.
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

export default BookingConfirmedEmail;
