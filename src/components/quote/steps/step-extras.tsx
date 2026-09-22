"use client";

import { useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { QuoteSubmissionInput } from "@/lib/validation/quote";

export function StepExtras() {
  const { register, watch, setValue } = useFormContext<QuoteSubmissionInput>();
  const extras = watch("extras");

  return (
    <FieldGroup>
      <Field orientation="horizontal">
        <Checkbox
          id="extras.packing"
          checked={extras.packing}
          onCheckedChange={(checked) => setValue("extras.packing", checked === true)}
        />
        <FieldLabel htmlFor="extras.packing">I&apos;d like packing help</FieldLabel>
      </Field>
      {extras.packing && (
        <Field>
          <FieldLabel htmlFor="extras.packingBedrooms">How many bedrooms need packing?</FieldLabel>
          <Input
            id="extras.packingBedrooms"
            type="number"
            min={0}
            max={10}
            {...register("extras.packingBedrooms")}
          />
        </Field>
      )}

      <Field orientation="horizontal">
        <Checkbox
          id="extras.unpacking"
          checked={extras.unpacking}
          onCheckedChange={(checked) => setValue("extras.unpacking", checked === true)}
        />
        <FieldLabel htmlFor="extras.unpacking">
          I&apos;d like unpacking help at the other end
        </FieldLabel>
      </Field>
      {extras.unpacking && (
        <Field>
          <FieldLabel htmlFor="extras.unpackingBedrooms">
            How many bedrooms need unpacking?
          </FieldLabel>
          <Input
            id="extras.unpackingBedrooms"
            type="number"
            min={0}
            max={10}
            {...register("extras.unpackingBedrooms")}
          />
        </Field>
      )}

      <Field orientation="horizontal">
        <Checkbox
          id="extras.disassembly"
          checked={extras.disassembly}
          onCheckedChange={(checked) => setValue("extras.disassembly", checked === true)}
        />
        <FieldLabel htmlFor="extras.disassembly">
          I need furniture disassembled and reassembled
        </FieldLabel>
      </Field>
      {extras.disassembly && (
        <Field>
          <FieldLabel htmlFor="extras.disassemblyItems">How many items?</FieldLabel>
          <Input
            id="extras.disassemblyItems"
            type="number"
            min={0}
            max={20}
            {...register("extras.disassemblyItems")}
          />
        </Field>
      )}

      <Field orientation="horizontal">
        <Checkbox
          id="extras.boxesAndMaterials"
          checked={extras.boxesAndMaterials}
          onCheckedChange={(checked) => setValue("extras.boxesAndMaterials", checked === true)}
        />
        <FieldLabel htmlFor="extras.boxesAndMaterials">
          I&apos;ll need boxes and packing materials supplied
        </FieldLabel>
      </Field>
    </FieldGroup>
  );
}
