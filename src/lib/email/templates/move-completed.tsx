import { Text } from "@react-email/components";

import { business } from "@/config/business";

import { EmailLayout, emailColors } from "./layout";

export interface MoveCompletedEmailProps {
  customerName: string;
  referenceNumber: string;
  unsubscribeUrl: string;
}

/** Sent when staff mark a job Completed. The review request follows a day later (its own cron). */
export function MoveCompletedEmail({
  customerName,
  referenceNumber,
  unsubscribeUrl,
}: MoveCompletedEmailProps) {
  return (
    <EmailLayout
      previewText="Thanks for moving with us."
      heading={`Thanks for moving with us, ${customerName}`}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={{ color: emailColors.text, fontSize: 14 }}>
        Your move (reference <strong>{referenceNumber}</strong>) is done. We hope you&apos;re
        settling in.
      </Text>
      <Text style={{ color: emailColors.text, fontSize: 14 }}>
        If anything isn&apos;t right, a scratch you&apos;ve spotted or something in the wrong room,
        call {business.phoneDisplay} or reply to this email and we&apos;ll sort it out.
      </Text>
    </EmailLayout>
  );
}

export default MoveCompletedEmail;
