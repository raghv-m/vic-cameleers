import { Button, Section, Text } from "@react-email/components";

import { EmailLayout, emailColors } from "./layout";

export interface NewLeadAlertEmailProps {
  referenceNumber: string;
  source: "Quote" | "Contact form";
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  message?: string;
  estimateSummary?: string;
}

export function NewLeadAlertEmail({
  referenceNumber,
  source,
  customerName,
  customerPhone,
  customerEmail,
  message,
  estimateSummary,
}: NewLeadAlertEmailProps) {
  return (
    <EmailLayout
      previewText={`New ${source.toLowerCase()} lead: ${customerName}`}
      heading={`New lead: ${referenceNumber}`}
    >
      <Section
        style={{
          backgroundColor: emailColors.background,
          borderRadius: 8,
          padding: "16px",
          margin: "16px 0",
        }}
      >
        <Text style={{ fontSize: 13, color: emailColors.muted, margin: 0 }}>Source</Text>
        <Text
          style={{ fontSize: 14, color: emailColors.text, margin: "2px 0 12px", fontWeight: 600 }}
        >
          {source}
        </Text>

        <Text style={{ fontSize: 13, color: emailColors.muted, margin: 0 }}>Name</Text>
        <Text style={{ fontSize: 14, color: emailColors.text, margin: "2px 0 12px" }}>
          {customerName}
        </Text>

        {customerPhone && (
          <>
            <Text style={{ fontSize: 13, color: emailColors.muted, margin: 0 }}>Phone</Text>
            <Text style={{ fontSize: 14, color: emailColors.text, margin: "2px 0 12px" }}>
              {customerPhone}
            </Text>
          </>
        )}

        {customerEmail && (
          <>
            <Text style={{ fontSize: 13, color: emailColors.muted, margin: 0 }}>Email</Text>
            <Text style={{ fontSize: 14, color: emailColors.text, margin: "2px 0 12px" }}>
              {customerEmail}
            </Text>
          </>
        )}

        {estimateSummary && (
          <>
            <Text style={{ fontSize: 13, color: emailColors.muted, margin: 0 }}>Estimate</Text>
            <Text style={{ fontSize: 14, color: emailColors.text, margin: "2px 0 12px" }}>
              {estimateSummary}
            </Text>
          </>
        )}

        {message && (
          <>
            <Text style={{ fontSize: 13, color: emailColors.muted, margin: 0 }}>Message</Text>
            <Text style={{ fontSize: 14, color: emailColors.text, margin: "2px 0 0" }}>
              {message}
            </Text>
          </>
        )}
      </Section>

      {customerPhone && (
        <Button
          href={`tel:${customerPhone}`}
          style={{
            backgroundColor: emailColors.primary,
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Call {customerName} now
        </Button>
      )}
    </EmailLayout>
  );
}

export default NewLeadAlertEmail;
