import { Text } from "@react-email/components";

import { EmailLayout, emailColors } from "./layout";

export interface ContactReceivedEmailProps {
  customerName: string;
}

export function ContactReceivedEmail({ customerName }: ContactReceivedEmailProps) {
  return (
    <EmailLayout previewText="We've got your message" heading={`Thanks, ${customerName}`}>
      <Text style={{ color: emailColors.text, fontSize: 14 }}>
        We&apos;ve received your message and will get back to you soon, usually within a business
        day.
      </Text>
      <Text style={{ color: emailColors.text, fontSize: 14 }}>
        If it&apos;s urgent, give us a call instead.
      </Text>
    </EmailLayout>
  );
}

export default ContactReceivedEmail;
