import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { format } from "date-fns";
import { Mail, Phone } from "lucide-react";

import { AddNoteForm } from "@/components/admin/add-note-form";
import { LeadStatusForm } from "@/components/admin/lead-status-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { LEAD_SOURCE_LABEL } from "@/lib/lead-status";

export const metadata: Metadata = {
  title: "Lead detail",
  robots: { index: false, follow: false },
};

function formatCents(cents: number): string {
  return `$${Math.round(cents / 100)}`;
}

const ACCESS_LABELS: Record<string, string> = {
  hasLift: "Has lift",
  longCarry: "Long carry",
  stairsCount: "Flights of stairs",
};

function AccessSummary({ label, access }: { label: string; access: unknown }) {
  if (!access || typeof access !== "object") return null;
  const entries = Object.entries(access as Record<string, unknown>);
  if (entries.length === 0) return null;

  return (
    <div>
      <p className="text-foreground text-sm font-medium">{label}</p>
      <ul className="text-muted-foreground text-sm">
        {entries.map(([key, value]) => (
          <li key={key}>
            {ACCESS_LABELS[key] ?? key}: {String(value)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function LeadDetailPage({ params }: PageProps<"/admin/leads/[id]">) {
  await requireRole("SUPPORT");
  const { id } = await params;

  const lead = await db.lead.findUnique({
    where: { id },
    include: {
      customer: true,
      quoteDraft: true,
      quotes: { orderBy: { createdAt: "desc" } },
      attachments: true,
      booking: true,
      notes: { include: { author: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!lead) notFound();

  const auditEntries = await db.auditLog.findMany({
    where: { entityType: "Lead", entityId: lead.id },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const timeline = [
    { at: lead.createdAt, label: `Lead created via ${LEAD_SOURCE_LABEL[lead.source]}` },
    ...lead.notes.map((note) => ({
      at: note.createdAt,
      label: `Note by ${note.author.name}: ${note.body}`,
    })),
    ...auditEntries.map((entry) => ({
      at: entry.createdAt,
      label: `${entry.action.replace(/[._]/g, " ")} by ${entry.user?.name ?? "system"}`,
    })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime());

  const latestQuote = lead.quotes[0];
  const draft = lead.quoteDraft;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/admin/leads" className="text-muted-foreground text-sm hover:underline">
        &larr; All leads
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{lead.referenceNumber}</h1>
          <p className="text-muted-foreground text-sm">
            {LEAD_SOURCE_LABEL[lead.source]} &middot; {format(lead.createdAt, "d MMM yyyy, h:mma")}
          </p>
        </div>
        <LeadStatusForm
          leadId={lead.id}
          currentStatus={lead.status}
          currentLostReason={lead.lostReason}
        />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium">{lead.customer?.name ?? "Unknown"}</p>
            {lead.customer?.phone && (
              <a
                href={`tel:${lead.customer.phone}`}
                className="flex items-center gap-2 hover:underline"
              >
                <Phone className="h-4 w-4" /> {lead.customer.phone}
              </a>
            )}
            {lead.customer?.email && (
              <a
                href={`mailto:${lead.customer.email}`}
                className="flex items-center gap-2 hover:underline"
              >
                <Mail className="h-4 w-4" /> {lead.customer.email}
              </a>
            )}
            {lead.customer && (
              <Link
                href={`/admin/customers/${lead.customer.id}`}
                className="text-primary block text-sm hover:underline"
              >
                View customer history
              </Link>
            )}
            {lead.message && (
              <div className="border-t pt-2">
                <p className="text-foreground text-sm font-medium">Message</p>
                <p className="text-muted-foreground text-sm">{lead.message}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {latestQuote && (
          <Card>
            <CardHeader>
              <CardTitle>Estimate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>
                {formatCents(latestQuote.estimateLowCents)}&ndash;
                {formatCents(latestQuote.estimateHighCents)}
              </p>
              <p className="text-muted-foreground">
                {latestQuote.estimatedLowHours}&ndash;{latestQuote.estimatedHighHours} hours,{" "}
                {latestQuote.recommendedCrewCount} movers,{" "}
                {latestQuote.recommendedTruck.replace("_", " ")}
              </p>
            </CardContent>
          </Card>
        )}

        {draft && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Move details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-foreground font-medium">Pickup</p>
                <p className="text-muted-foreground">{draft.pickupAddress ?? "—"}</p>
              </div>
              <div>
                <p className="text-foreground font-medium">Drop-off</p>
                <p className="text-muted-foreground">{draft.dropoffAddress ?? "—"}</p>
              </div>
              <div>
                <p className="text-foreground font-medium">Move date</p>
                <p className="text-muted-foreground">
                  {draft.moveDate ? format(draft.moveDate, "d MMM yyyy") : "—"}
                  {draft.preferredTime ? `, ${draft.preferredTime}` : ""}
                </p>
              </div>
              <div>
                <p className="text-foreground font-medium">Property</p>
                <p className="text-muted-foreground">
                  {draft.propertyType ?? "—"}
                  {draft.bedrooms != null ? `, ${draft.bedrooms} bed` : ""}
                </p>
              </div>
              <AccessSummary label="Pickup access" access={draft.pickupAccess} />
              <AccessSummary label="Drop-off access" access={draft.dropoffAccess} />
              {draft.notes && (
                <div className="sm:col-span-2">
                  <p className="text-foreground font-medium">Customer notes</p>
                  <p className="text-muted-foreground">{draft.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {lead.attachments.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {lead.attachments.map((attachment) => (
                <a key={attachment.id} href={attachment.url} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element -- external Blob URLs, not optimized */}
                  <img
                    src={attachment.url}
                    alt={attachment.filename}
                    className="size-24 rounded-md border object-cover"
                  />
                </a>
              ))}
            </CardContent>
          </Card>
        )}

        {lead.booking && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Booking</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>
                {format(lead.booking.moveDate, "d MMM yyyy")}
                {lead.booking.preferredTime ? `, ${lead.booking.preferredTime}` : ""} &middot;{" "}
                <Badge variant="secondary">{lead.booking.status}</Badge>
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AddNoteForm leadId={lead.id} />
            <ul className="space-y-3">
              {lead.notes.map((note) => (
                <li key={note.id} className="border-t pt-3 text-sm">
                  <p className="text-muted-foreground text-xs">
                    {note.author.name} &middot; {format(note.createdAt, "d MMM yyyy, h:mma")}
                  </p>
                  <p>{note.body}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {timeline.map((entry, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-muted-foreground w-36 shrink-0 text-xs">
                    {format(entry.at, "d MMM, h:mma")}
                  </span>
                  <span>{entry.label}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
