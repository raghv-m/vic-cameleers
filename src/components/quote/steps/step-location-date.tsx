"use client";

import { useFormContext } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuoteSubmissionInput } from "@/lib/validation/quote";

const dateFlexibilityOptions: { value: QuoteSubmissionInput["dateFlexibility"]; label: string }[] =
  [
    { value: "exact", label: "No, it needs to be this date" },
    { value: "within_week", label: "Within a week either way" },
    { value: "any_weekday", label: "Any weekday works" },
  ];

const preferredTimeOptions: { value: QuoteSubmissionInput["preferredTime"]; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "midday", label: "Midday" },
  { value: "afternoon", label: "Afternoon" },
];

export function StepLocationDate() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<QuoteSubmissionInput>();

  const dateFlexibility = watch("dateFlexibility");
  const preferredTime = watch("preferredTime");

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="pickupAddress">Pickup address</FieldLabel>
        <Input id="pickupAddress" {...register("pickupAddress")} placeholder="Street, suburb" />
        <FieldError errors={[errors.pickupAddress]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="dropoffAddress">Drop-off address</FieldLabel>
        <Input id="dropoffAddress" {...register("dropoffAddress")} placeholder="Street, suburb" />
        <FieldError errors={[errors.dropoffAddress]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="additionalStopAddress">Additional stop (optional)</FieldLabel>
        <Input id="additionalStopAddress" {...register("additionalStopAddress")} />
        <FieldError errors={[errors.additionalStopAddress]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="moveDate">Moving date</FieldLabel>
        <Input id="moveDate" type="date" {...register("moveDate")} />
        <FieldError errors={[errors.moveDate]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="dateFlexibility">Is your date flexible?</FieldLabel>
        <Select
          value={dateFlexibility}
          onValueChange={(value) =>
            setValue("dateFlexibility", value as QuoteSubmissionInput["dateFlexibility"])
          }
        >
          <SelectTrigger id="dateFlexibility">
            <SelectValue placeholder="Select an option">
              {(value: QuoteSubmissionInput["dateFlexibility"]) =>
                dateFlexibilityOptions.find((option) => option.value === value)?.label
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {dateFlexibilityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError errors={[errors.dateFlexibility]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="preferredTime">Preferred start time</FieldLabel>
        <Select
          value={preferredTime}
          onValueChange={(value) =>
            setValue("preferredTime", value as QuoteSubmissionInput["preferredTime"])
          }
        >
          <SelectTrigger id="preferredTime">
            <SelectValue placeholder="Select an option">
              {(value: QuoteSubmissionInput["preferredTime"]) =>
                preferredTimeOptions.find((option) => option.value === value)?.label
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {preferredTimeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError errors={[errors.preferredTime]} />
        <FieldDescription>We&apos;ll confirm the exact time when we book you in.</FieldDescription>
      </Field>
    </FieldGroup>
  );
}
