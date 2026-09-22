"use client";

import { useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import type { QuoteSubmissionInput } from "@/lib/validation/quote";

const specialItemOptions: {
  key: keyof QuoteSubmissionInput["specialItems"];
  label: string;
}[] = [
  { key: "piano", label: "Piano" },
  { key: "safe", label: "Safe" },
  { key: "poolTable", label: "Pool table" },
  { key: "gymEquipment", label: "Gym equipment" },
  { key: "fragileArtwork", label: "Fragile artwork" },
];

export function StepInventory() {
  const { watch, setValue } = useFormContext<QuoteSubmissionInput>();
  const specialItems = watch("specialItems");

  return (
    <FieldSet>
      <FieldLegend>Anything special moving?</FieldLegend>
      <FieldDescription>
        Tick anything that applies. Pianos, safes, and pool tables need the bigger truck and an
        extra pair of hands.
      </FieldDescription>

      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {specialItemOptions.map((option) => (
          <Field key={option.key} orientation="horizontal">
            <Checkbox
              id={option.key}
              checked={specialItems[option.key]}
              onCheckedChange={(checked) =>
                setValue(`specialItems.${option.key}`, checked === true)
              }
            />
            <FieldLabel htmlFor={option.key}>{option.label}</FieldLabel>
          </Field>
        ))}
      </div>
    </FieldSet>
  );
}
