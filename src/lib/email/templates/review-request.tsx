import { Button, Text } from "@react-email/components";

import { EmailLayout, emailColors } from "./layout";

export interface ReviewRequestEmailProps {
  customerName: string;
  googleReviewUrl: string;
}

export function ReviewRequestEmail({ customerName, googleReviewUrl }: ReviewRequestEmailProps) {
  return (
    <EmailLayout
      previewText="How did we do?"
      heading={`Thanks for moving with us, ${customerName}`}
    >
      <Text style={{ color: emailColors.text, fontSize: 14 }}>
        We hope the move went smoothly. If you&apos;ve got a minute, a quick review helps other
        people find us and tells us how we&apos;re doing.
      </Text>

      <Button
        href={googleReviewUrl}
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
        Leave a review
      </Button>
    </EmailLayout>
  );
}

export default ReviewRequestEmail;
