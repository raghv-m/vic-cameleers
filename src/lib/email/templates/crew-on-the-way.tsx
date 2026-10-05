import { Button, Text } from "@react-email/components";

import { business } from "@/config/business";

import { emailButtonStyle } from "./button-style";
import { EmailLayout, emailColors } from "./layout";

export interface CrewOnTheWayEmailProps {
  customerName: string;
  referenceNumber: string;
}

/** Sent automatically when a dispatcher sets today's job to En route. */
export function CrewOnTheWayEmail({ customerName, referenceNumber }: CrewOnTheWayEmailProps) {
  return (
    <EmailLayout
      previewText="Your crew has left and is heading to you now."
      heading={`Your crew is on the way, ${customerName}`}
    >
      <Text style={{ color: emailColors.text, fontSize: 14 }}>
        The {business.tradingName} crew for move <strong>{referenceNumber}</strong> has just left
        and is heading to your pickup address.
      </Text>
      <Text style={{ color: emailColors.text, fontSize: 14 }}>
        A few things that help on the day: keep a parking spot clear near the door, have lift
        bookings and access codes handy, and set aside anything that isn&apos;t coming with you.
      </Text>
      <Button href={`tel:${business.phoneE164}`} style={emailButtonStyle}>
        Call the crew: {business.phoneDisplay}
      </Button>
    </EmailLayout>
  );
}

export default CrewOnTheWayEmail;
