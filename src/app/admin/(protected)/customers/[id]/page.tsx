import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { format } from "date-fns";
import { Mail, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { LEAD_STATUS_BADGE_VARIANT, LEAD_STATUS_LABEL } from "@/lib/lead-status";

export const metadata: Metadata = {
  title: "Customer detail",
  robots: { index: false, follow: false },
};

export default async function CustomerDetailPage({ params }: PageProps<"/admin/customers/[id]">) {
  await requireRole("SUPPORT");
  const { id } = await params;

  const customer = await db.customer.findUnique({
    where: { id },
    include: {
      leads: {
        include: { booking: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/admin/customers" className="text-muted-foreground text-sm hover:underline">
        &larr; All customers
      </Link>

      <h1 className="mt-2 text-2xl font-semibold">{customer.name}</h1>
      <div className="text-muted-foreground mt-1 space-y-1 text-sm">
        {customer.phone && (
          <a href={`tel:${customer.phone}`} className="flex items-center gap-2 hover:underline">
            <Phone className="h-4 w-4" /> {customer.phone}
          </a>
        )}
        {customer.email && (
          <a href={`mailto:${customer.email}`} className="flex items-center gap-2 hover:underline">
            <Mail className="h-4 w-4" /> {customer.email}
          </a>
        )}
      </div>

      <h2 className="mt-8 text-lg font-medium">Leads and bookings</h2>
      <ul className="mt-4 space-y-3">
        {customer.leads.map((lead) => (
          <li key={lead.id} className="rounded-md border p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link href={`/admin/leads/${lead.id}`} className="font-medium hover:underline">
                {lead.referenceNumber}
              </Link>
              <Badge variant={LEAD_STATUS_BADGE_VARIANT[lead.status]}>
                {LEAD_STATUS_LABEL[lead.status]}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {format(lead.createdAt, "d MMM yyyy, h:mma")}
            </p>
            {lead.booking && (
              <p className="text-muted-foreground mt-1">
                Booked for {format(lead.booking.moveDate, "d MMM yyyy")} ({lead.booking.status})
              </p>
            )}
          </li>
        ))}

        {customer.leads.length === 0 && (
          <p className="text-muted-foreground text-sm">No leads yet.</p>
        )}
      </ul>
    </div>
  );
}
