import type { Metadata } from "next";

import { toggleStaffActive } from "@/app/admin/(protected)/staff/actions";
import { CreateStaffForm } from "@/components/admin/create-staff-form";
import { StaffRoleSelect } from "@/components/admin/staff-role-select";
import { ToggleActiveButton } from "@/components/admin/toggle-active-button";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { ROLE_LABEL } from "@/lib/role-hierarchy";

export const metadata: Metadata = {
  title: "Staff",
  robots: { index: false, follow: false },
};

export default async function StaffPage() {
  await requireRole("SUPER_ADMIN");
  const staff = await db.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Staff</h1>

      <div className="mt-6 rounded-md border p-4">
        <CreateStaffForm />
      </div>

      <ul className="mt-6 divide-y">
        {staff.map((member) => (
          <li
            key={member.id}
            className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
          >
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-muted-foreground text-xs">{member.email}</p>
              <div className="mt-1 flex gap-1">
                <Badge variant={member.isActive ? "default" : "outline"}>
                  {member.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge variant={member.twoFactorEnabled ? "secondary" : "destructive"}>
                  {member.twoFactorEnabled ? "2FA on" : "2FA not set up"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StaffRoleSelect userId={member.id} role={member.role} />
              <ToggleActiveButton
                id={member.id}
                isActive={member.isActive}
                action={(input) =>
                  toggleStaffActive({ userId: input.id, isActive: input.isActive })
                }
              />
            </div>
          </li>
        ))}
      </ul>

      <p className="text-muted-foreground mt-6 text-xs">
        Roles: {Object.values(ROLE_LABEL).join(", ")}.
      </p>
    </div>
  );
}
