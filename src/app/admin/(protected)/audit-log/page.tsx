import type { Metadata } from "next";
import { format } from "date-fns";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";

export const metadata: Metadata = {
  title: "Audit log",
  robots: { index: false, follow: false },
};

export default async function AuditLogPage() {
  await requireRole("OPERATIONS_MANAGER");
  const entries = await db.auditLog.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Audit log</h1>
      <p className="text-muted-foreground mt-1 text-sm">Most recent 300 admin actions.</p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="text-muted-foreground border-b text-left">
              <th className="py-2 pr-4 font-medium">When</th>
              <th className="py-2 pr-4 font-medium">Who</th>
              <th className="py-2 pr-4 font-medium">Action</th>
              <th className="py-2 pr-4 font-medium">Entity</th>
              <th className="py-2 pr-4 font-medium">IP</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-muted/50 border-b align-top last:border-0">
                <td className="text-muted-foreground py-2 pr-4 whitespace-nowrap">
                  {format(entry.createdAt, "d MMM yyyy, h:mma")}
                </td>
                <td className="py-2 pr-4">{entry.user?.name ?? "System"}</td>
                <td className="py-2 pr-4">{entry.action.replace(/[._]/g, " ")}</td>
                <td className="py-2 pr-4">
                  {entry.entityType}
                  {entry.entityId ? ` #${entry.entityId.slice(-6)}` : ""}
                  {(entry.before || entry.after) && (
                    <details className="mt-1">
                      <summary className="text-muted-foreground cursor-pointer text-xs">
                        Details
                      </summary>
                      <pre className="bg-muted mt-1 max-w-md overflow-x-auto rounded p-2 text-xs">
                        {JSON.stringify({ before: entry.before, after: entry.after }, null, 2)}
                      </pre>
                    </details>
                  )}
                </td>
                <td className="text-muted-foreground py-2 pr-4">{entry.ipAddress ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {entries.length === 0 && (
          <p className="text-muted-foreground py-10 text-center text-sm">
            No audit log entries yet.
          </p>
        )}
      </div>
    </div>
  );
}
