"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { Role } from "@prisma/client";

import { createStaffUser } from "@/app/admin/(protected)/staff/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE_LABEL, ROLE_ORDER } from "@/lib/role-hierarchy";

export function CreateStaffForm() {
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("SUPPORT");
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);

  function submit() {
    startTransition(async () => {
      const result = await createStaffUser({ name, email, role });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setTemporaryPassword(result.temporaryPassword);
      setName("");
      setEmail("");
    });
  }

  return (
    <>
      <FieldGroup className="flex flex-wrap items-end gap-3">
        <Field className="w-48">
          <FieldLabel htmlFor="staff-name">Name</FieldLabel>
          <Input id="staff-name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field className="w-56">
          <FieldLabel htmlFor="staff-email">Email</FieldLabel>
          <Input
            id="staff-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field className="w-44">
          <FieldLabel htmlFor="staff-role">Role</FieldLabel>
          <Select value={role} onValueChange={(v) => v && setRole(v as Role)}>
            <SelectTrigger id="staff-role">
              <SelectValue placeholder="Role">
                {(value: string) => ROLE_LABEL[value as Role]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ROLE_ORDER.map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_LABEL[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Button size="sm" disabled={pending || !name.trim() || !email.trim()} onClick={submit}>
          {pending ? "Creating..." : "Add staff member"}
        </Button>
      </FieldGroup>

      <Dialog
        open={temporaryPassword !== null}
        onOpenChange={(open) => !open && setTemporaryPassword(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Staff account created</DialogTitle>
            <DialogDescription>
              This one-time password is shown only once and isn&apos;t stored anywhere. Share it
              with the new staff member securely, they&apos;ll set up mandatory 2FA on first login.
            </DialogDescription>
          </DialogHeader>
          <p className="bg-muted rounded-md border p-3 text-center font-mono text-sm break-all">
            {temporaryPassword}
          </p>
          <DialogFooter>
            <Button onClick={() => setTemporaryPassword(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
