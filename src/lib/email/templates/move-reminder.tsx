import { Button, Text } from "@react-email/components";

import { business } from "@/config/business";

import { EmailLayout, emailColors } from "./layout";

export interface MoveReminderEmailProps {
  customerName: string;
  referenceNumber: string;
  moveDateLabel: string;
  preferredTime?: string | null;
  /** "in 7 days" or "tomorrow", used in the subject/preview and heading. */
  whenLabel: string;
}

export function MoveReminderEmail({
  customerName,
  referenceNumber,
  moveDateLabel,
  preferredTime,
  whenLabel,
}: MoveReminderEmailProps) {
  return (
    <EmailLayout
      previewText={`Your move is ${whenLabel}`}
      heading={`Your move is ${whenLabel}, ${customerName}`}
    >
      <Text style={{ color: emailColors.text, fontSize: 14 }}>
        Just a reminder, reference <strong>{referenceNumber}</strong>, your crew is booked for{" "}
        <strong>
          {moveDateLabel}
          {preferredTime ? `, ${preferredTime}` : ""}
        </strong>
        .
      </Text>

      <Text style={{ color: emailColors.text, fontSize: 14 }}>
        Have everything ready to go by the time our crew arrives. Call us if anything&apos;s
        changed.
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

export default MoveReminderEmail;
