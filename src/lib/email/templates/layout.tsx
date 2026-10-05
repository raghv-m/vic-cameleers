import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import { business } from "@/config/business";

const colors = {
  background: "#faf7f0",
  card: "#ffffff",
  text: "#232323",
  muted: "#6b6459",
  primary: "#c1502e",
  border: "#e4dcc9",
};

export function EmailLayout({
  previewText,
  heading,
  children,
  unsubscribeUrl,
}: {
  previewText: string;
  heading: string;
  children: React.ReactNode;
  /** Set on non-essential emails only; transactional ones don't carry it. */
  unsubscribeUrl?: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body
        style={{
          backgroundColor: colors.background,
          fontFamily: "Arial, sans-serif",
          padding: "24px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            padding: "32px",
            maxWidth: 480,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: 700, color: colors.primary, margin: 0 }}>
            {business.tradingName}
          </Text>
          <Heading style={{ fontSize: 20, color: colors.text, margin: "16px 0" }}>
            {heading}
          </Heading>

          {children}

          <Hr style={{ borderColor: colors.border, margin: "24px 0" }} />

          <Section>
            <Text style={{ fontSize: 12, color: colors.muted, margin: 0 }}>
              {business.tradingName} &middot; {business.baseSuburb} &middot; ABN {business.abn}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, margin: "4px 0 0" }}>
              Call {business.phoneDisplay} if you have any questions.
            </Text>
            {unsubscribeUrl && (
              <Text style={{ fontSize: 12, color: colors.muted, margin: "8px 0 0" }}>
                Don&apos;t want emails like this?{" "}
                <Link href={unsubscribeUrl} style={{ color: colors.muted }}>
                  Unsubscribe
                </Link>
                . We&apos;ll still send anything about a booking you&apos;ve made.
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const emailColors = colors;
