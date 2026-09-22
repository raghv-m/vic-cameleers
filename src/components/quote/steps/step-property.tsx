"use client";

import { useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { QuoteSubmissionInput } from "@/lib/validation/quote";

const propertyTypeOptions: { value: QuoteSubmissionInput["propertyType"]; label: string }[] = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "UNIT", label: "Unit" },
  { value: "TOWNHOUSE", label: "Townhouse" },
  { value: "HOUSE", label: "House" },
  { value: "OFFICE", label: "Office" },
  { value: "STORAGE_UNIT", label: "Storage unit" },
  { value: "SINGLE_ITEM", label: "Single item" },
];

const residentialSizeOptions: { value: QuoteSubmissionInput["propertySize"]; label: string }[] = [
  { value: "studio", label: "Studio" },
  { value: "1bed", label: "1 bedroom" },
  { value: "2bed", label: "2 bedroom" },
  { value: "3bed", label: "3 bedroom" },
  { value: "4plus", label: "4+ bedroom" },
];

function sizeOptionsFor(
  propertyType: QuoteSubmissionInput["propertyType"] | undefined,
): { value: QuoteSubmissionInput["propertySize"]; label: string }[] {
  if (propertyType === "OFFICE") return [{ value: "office", label: "Small office" }];
  if (propertyType === "SINGLE_ITEM") return [{ value: "singleItem", label: "Single item" }];
  return residentialSizeOptions;
}

const floorLevelOptions = [
  { value: "ground", label: "Ground floor" },
  { value: "1", label: "1st floor" },
  { value: "2", label: "2nd floor" },
  { value: "3", label: "3rd floor" },
  { value: "4plus", label: "4th floor or higher" },
];

function AccessFields({
  prefix,
  legend,
}: {
  prefix: "pickupAccess" | "dropoffAccess";
  legend: string;
}) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<QuoteSubmissionInput>();

  const hasLift = watch(`${prefix}.hasLift`);
  const floorLevel = watch(`${prefix}.floorLevel`);
  const fieldErrors = errors[prefix];

  return (
    <FieldSet>
      <FieldLegend>{legend}</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`${prefix}.floorLevel`}>Floor level</FieldLabel>
          <Select
            value={floorLevel}
            onValueChange={(value) => {
              if (value) setValue(`${prefix}.floorLevel`, value);
            }}
          >
            <SelectTrigger id={`${prefix}.floorLevel`}>
              <SelectValue placeholder="Select a floor">
                {(value: string) =>
                  floorLevelOptions.find((option) => option.value === value)?.label
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {floorLevelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[fieldErrors?.floorLevel]} />
        </Field>

        <Field orientation="horizontal">
          <Checkbox
            id={`${prefix}.hasLift`}
            checked={hasLift}
            onCheckedChange={(checked) => setValue(`${prefix}.hasLift`, checked === true)}
          />
          <FieldLabel htmlFor={`${prefix}.hasLift`}>There&apos;s a lift</FieldLabel>
        </Field>

        {!hasLift && (
          <Field>
            <FieldLabel htmlFor={`${prefix}.stairsCount`}>Flights of stairs</FieldLabel>
            <Input
              id={`${prefix}.stairsCount`}
              type="number"
              min={0}
              max={20}
              {...register(`${prefix}.stairsCount`)}
            />
            <FieldError errors={[fieldErrors?.stairsCount]} />
          </Field>
        )}

        <Field orientation="horizontal">
          <Checkbox
            id={`${prefix}.longCarry`}
            checked={watch(`${prefix}.longCarry`)}
            onCheckedChange={(checked) => setValue(`${prefix}.longCarry`, checked === true)}
          />
          <FieldLabel htmlFor={`${prefix}.longCarry`}>
            Long walk from where the truck can park
          </FieldLabel>
        </Field>

        <Field>
          <FieldLabel htmlFor={`${prefix}.parkingNotes`}>Parking notes (optional)</FieldLabel>
          <Textarea
            id={`${prefix}.parkingNotes`}
            {...register(`${prefix}.parkingNotes`)}
            rows={2}
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}

export function StepProperty() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<QuoteSubmissionInput>();

  const propertyType = watch("propertyType");
  const propertySize = watch("propertySize");
  const sizeOptions = sizeOptionsFor(propertyType);
  const sizeLabel =
    propertyType === "OFFICE" || propertyType === "SINGLE_ITEM" ? "Size" : "Bedrooms";

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="propertyType">Property type</FieldLabel>
        <Select
          value={propertyType}
          onValueChange={(value) => {
            const nextType = value as QuoteSubmissionInput["propertyType"];
            setValue("propertyType", nextType);
            // Reset the size to a valid option for the newly selected type.
            setValue("propertySize", sizeOptionsFor(nextType)[0]?.value ?? "1bed");
          }}
        >
          <SelectTrigger id="propertyType">
            <SelectValue placeholder="Select a property type">
              {(value: QuoteSubmissionInput["propertyType"]) =>
                propertyTypeOptions.find((option) => option.value === value)?.label
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {propertyTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError errors={[errors.propertyType]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="propertySize">{sizeLabel}</FieldLabel>
        <Select
          value={propertySize}
          onValueChange={(value) =>
            setValue("propertySize", value as QuoteSubmissionInput["propertySize"])
          }
        >
          <SelectTrigger id="propertySize">
            <SelectValue placeholder="Select">
              {(value: QuoteSubmissionInput["propertySize"]) =>
                sizeOptions.find((option) => option.value === value)?.label
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {sizeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError errors={[errors.propertySize]} />
      </Field>

      <AccessFields prefix="pickupAccess" legend="Pickup access" />
      <AccessFields prefix="dropoffAccess" legend="Drop-off access" />
    </FieldGroup>
  );
}
