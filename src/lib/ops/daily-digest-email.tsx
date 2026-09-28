import { Button, Section, Text } from "@react-email/components";

import { EmailLayout, emailColors } from "@/lib/email/templates/layout";

export interface DigestMove {
  reference: string;
  window: string;
  truck: string;
  crew: string;
  adminUrl?: string;
}

export interface DigestData {
  dateLabel: string;
  newLeads: { reference: string; adminUrl?: string }[];
  movesToday: DigestMove[];
  reminders7Day: string[];
  reminders1Day: string[];
  followUpsWaiting: number;
  adminHomeUrl?: string;
}

const h = { color: emailColors.text, fontSize: "15px", fontWeight: 700, margin: "20px 0 6px" };
const p = { color: emailColors.text, fontSize: "14px", lineHeight: "22px", margin: "0 0 4px" };
const muted = { ...p, color: emailColors.muted };

/**
 * The 7am ops digest. References and job logistics only: no customer names, phone numbers or
 * addresses, so it's safe in any inbox; details are one click away in the admin console.
 */
export function DailyDigestEmail(data: DigestData) {
  return (
    <EmailLayout
      previewText={`${data.movesToday.length} moves today, ${data.newLeads.length} new leads`}
      heading={`Today, ${data.dateLabel}`}
    >
      <Section>
        <Text style={h}>Moves today ({data.movesToday.length})</Text>
        {data.movesToday.length === 0 && <Text style={muted}>No moves booked today.</Text>}
        {data.movesToday.map((move) => (
          <Text key={move.reference} style={p}>
            <strong>{move.reference}</strong> · {move.window} · {move.truck} · {move.crew}
            {move.adminUrl ? (
              <>
                {" "}
                · <a href={move.adminUrl}>Open</a>
              </>
            ) : null}
          </Text>
        ))}

        <Text style={h}>New leads, last 24 hours ({data.newLeads.length})</Text>
        {data.newLeads.length === 0 && <Text style={muted}>None.</Text>}
        {data.newLeads.map((lead) => (
          <Text key={lead.reference} style={p}>
            {lead.adminUrl ? <a href={lead.adminUrl}>{lead.reference}</a> : lead.reference}
          </Text>
        ))}

        <Text style={h}>Reminders going out</Text>
        <Text style={p}>
          7-day: {data.reminders7Day.length ? data.reminders7Day.join(", ") : "none"}
        </Text>
        <Text style={p}>
          1-day: {data.reminders1Day.length ? data.reminders1Day.join(", ") : "none"}
        </Text>

        <Text style={h}>Follow-ups waiting</Text>
        <Text style={p}>{data.followUpsWaiting} lead(s) in Follow-up.</Text>

        {data.adminHomeUrl && (
          <Button
            href={data.adminHomeUrl}
            style={{
              backgroundColor: emailColors.text,
              color: "#ffffff",
              padding: "10px 16px",
              borderRadius: "4px",
              fontWeight: 600,
              marginTop: "16px",
            }}
          >
            Open the admin console
          </Button>
        )}
      </Section>
    </EmailLayout>
  );
}
