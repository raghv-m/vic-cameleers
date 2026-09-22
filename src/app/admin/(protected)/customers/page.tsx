import Link from "next/link";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";

export const metadata: Metadata = {
  title: "Customers",
  robots: { index: false, follow: false },
};

export default async function CustomersPage({ searchParams }: PageProps<"/admin/customers">) {
  await requireRole("SUPPORT");
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";

  const where: Prisma.CustomerWhereInput = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { phone: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const customers = await db.customer.findMany({
    where,
    include: { _count: { select: { leads: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Customers</h1>

      <form className="mt-6" method="GET">
        <Input
          name="q"
          placeholder="Search name, phone, email"
          defaultValue={q}
          className="max-w-xs"
        />
      </form>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="text-muted-foreground border-b text-left">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Phone</th>
              <th className="py-2 pr-4 font-medium">Email</th>
              <th className="py-2 pr-4 font-medium">Leads</th>
              <th className="py-2 pr-4 font-medium">First seen</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-muted/50 border-b last:border-0">
                <td className="py-2 pr-4">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="font-medium hover:underline"
                  >
                    {customer.name}
                  </Link>
                </td>
                <td className="py-2 pr-4">{customer.phone ?? "—"}</td>
                <td className="py-2 pr-4">{customer.email ?? "—"}</td>
                <td className="py-2 pr-4">{customer._count.leads}</td>
                <td className="text-muted-foreground py-2 pr-4">
                  {format(customer.createdAt, "d MMM yyyy")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 && (
          <p className="text-muted-foreground py-10 text-center text-sm">No customers match.</p>
        )}
      </div>
    </div>
  );
}
