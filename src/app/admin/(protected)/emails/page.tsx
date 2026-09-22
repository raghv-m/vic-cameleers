import type { Metadata } from "next";
import { format } from "date-fns";

import { ResendEmailButton } from "@/components/admin/resend-email-button";
import type { Role } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { roleSatisfies } from "@/lib/role-hierarchy";

export const metadata: Metadata = {
  title: "Email log",
  robots: { index: false, follow: false },
};

export default async function EmailLogPage() {
  const session = await requireRole("SUPPORT");
  const canResend = roleSatisfies(session.user.role as Role, "DISPATCHER");
  const emails = await db.emailLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Email log</h1>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-muted-foreground border-b text-left">
              <th className="py-2 pr-4 font-medium">Type</th>
              <th className="py-2 pr-4 font-medium">To</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Sent</th>
              <th className="py-2 pr-4 font-medium" />
            </tr>
          </thead>
          <tbody>
            {emails.map((email) => (
              <tr key={email.id} className="hover:bg-muted/50 border-b last:border-0">
                <td className="py-2 pr-4">{email.type.replace(/_/g, " ")}</td>
                <td className="py-2 pr-4">{email.toAddress}</td>
                <td className="py-2 pr-4">
                  <Badge variant={email.status === "FAILED" ? "destructive" : "secondary"}>
                    {email.status}
                  </Badge>
                  {email.errorMessage && (
                    <p className="text-muted-foreground mt-1 text-xs">{email.errorMessage}</p>
                  )}
                </td>
                <td className="text-muted-foreground py-2 pr-4">
                  {format(email.createdAt, "d MMM yyyy, h:mma")}
                </td>
                <td className="py-2 pr-4">
                  {email.status === "FAILED" && canResend && (
                    <ResendEmailButton emailLogId={email.id} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {emails.length === 0 && (
          <p className="text-muted-foreground py-10 text-center text-sm">No emails sent yet.</p>
        )}
      </div>
    </div>
  );
}
