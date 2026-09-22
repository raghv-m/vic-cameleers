"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { createTruck } from "@/app/admin/(protected)/trucks/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sizeLabel = { SIX_TONNE: "6 tonne", TEN_TONNE: "10 tonne" } as const;

export function AddTruckForm() {
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [size, setSize] = useState<"SIX_TONNE" | "TEN_TONNE">("SIX_TONNE");
  const [registration, setRegistration] = useState("");

  function submit() {
    startTransition(async () => {
      const result = await createTruck({ name, size, registration: registration || undefined });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setName("");
      setRegistration("");
      toast.success("Truck added");
    });
  }

  return (
    <FieldGroup className="flex flex-wrap items-end gap-3">
      <Field className="w-48">
        <FieldLabel htmlFor="truck-name">Name</FieldLabel>
        <Input id="truck-name" value={name} onChange={(event) => setName(event.target.value)} />
      </Field>
      <Field className="w-36">
        <FieldLabel htmlFor="truck-size">Size</FieldLabel>
        <Select value={size} onValueChange={(value) => value && setSize(value as typeof size)}>
          <SelectTrigger id="truck-size">
            <SelectValue placeholder="Size">
              {(value: string) => sizeLabel[value as keyof typeof sizeLabel]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SIX_TONNE">6 tonne</SelectItem>
            <SelectItem value="TEN_TONNE">10 tonne</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field className="w-36">
        <FieldLabel htmlFor="truck-rego">Registration</FieldLabel>
        <Input
          id="truck-rego"
          value={registration}
          onChange={(event) => setRegistration(event.target.value)}
        />
      </Field>
      <Button size="sm" disabled={pending || !name.trim()} onClick={submit}>
        {pending ? "Adding..." : "Add truck"}
      </Button>
    </FieldGroup>
  );
}
