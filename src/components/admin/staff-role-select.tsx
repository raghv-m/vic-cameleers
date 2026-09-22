"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { Role } from "@prisma/client";

import { updateStaffRole } from "@/app/admin/(protected)/staff/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE_LABEL, ROLE_ORDER } from "@/lib/role-hierarchy";

export function StaffRoleSelect({ userId, role }: { userId: string; role: Role }) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={role}
      disabled={pending}
      onValueChange={(value) => {
        if (!value) return;
        startTransition(async () => {
          const result = await updateStaffRole({ userId, role: value });
          if (!result.success) toast.error(result.error);
        });
      }}
    >
      <SelectTrigger className="w-44">
        <SelectValue placeholder="Role">{(value: string) => ROLE_LABEL[value as Role]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {ROLE_ORDER.map((r) => (
          <SelectItem key={r} value={r}>
            {ROLE_LABEL[r]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
