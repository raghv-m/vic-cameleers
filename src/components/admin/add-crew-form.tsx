"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { createCrewMember } from "@/app/admin/(protected)/crew/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function AddCrewForm() {
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  function submit() {
    startTransition(async () => {
      const result = await createCrewMember({ name, phone });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setName("");
      setPhone("");
      toast.success("Crew member added");
    });
  }

  return (
    <FieldGroup className="flex flex-wrap items-end gap-3">
      <Field className="w-48">
        <FieldLabel htmlFor="crew-name">Name</FieldLabel>
        <Input id="crew-name" value={name} onChange={(event) => setName(event.target.value)} />
      </Field>
      <Field className="w-48">
        <FieldLabel htmlFor="crew-phone">Mobile</FieldLabel>
        <Input
          id="crew-phone"
          placeholder="04XX XXX XXX"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </Field>
      <Button size="sm" disabled={pending || !name.trim() || !phone.trim()} onClick={submit}>
        {pending ? "Adding..." : "Add crew member"}
      </Button>
    </FieldGroup>
  );
}
