import { Button, Text } from "@react-email/components";

import { business } from "@/config/business";

import { emailButtonStyle } from "./button-style";
import { EmailLayout, emailColors } from "./layout";

export interface QuoteFollowUpEmailProps {
  customerName: string;
  referenceNumber: string;
  /** e.g. "$480 to $600". Omitted when the lead never got a price (callback-only mode). */
  estimateLabel?: string;
  unsubscribeUrl: string;
}

/** Sent once, a few days after a quote that hasn't turned into a booking (setting in admin). */
export function QuoteFollowUpEmail({
  customerName,
  referenceNumber,
  estimateLabel,
  unsubscribeUrl,
}: QuoteFollowUpEmailProps) {
  return (
    <EmailLayout
      previewText="Still planning your move? We can lock in a date."
      heading={`Still planning your move, ${customerName}?`}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={{ color: emailColors.text, fontSize: 14 }}>
        A few days ago you asked us about a move (reference <strong>{referenceNumber}</strong>)
        {estimateLabel ? (
          <>
            , and we estimated <strong>{estimateLabel}</strong>
          </>
        ) : null}
        . If you&apos;re still deciding, we&apos;re happy to answer questions or talk through the
        details.
      </Text>
      <Text style={{ color: emailColors.text, fontSize: 14 }}>
        Weekends and end-of-month dates go first. Reply to this email or call{" "}
        {business.phoneDisplay} and we&apos;ll pencil one in.
      </Text>
      <Button href={`tel:${business.phoneE164}`} style={emailButtonStyle}>
        Call {business.phoneDisplay}
      </Button>
      <Text style={{ color: emailColors.muted, fontSize: 13, marginTop: 16 }}>
        Already sorted? No worries, you won&apos;t hear from us about this quote again.
      </Text>
    </EmailLayout>
  );
}

export default QuoteFollowUpEmail;
