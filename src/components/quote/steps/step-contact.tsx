"use client";

import Link from "next/link";
import { useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import type { QuoteSubmissionInput } from "@/lib/validation/quote";

const howHeardOptions = [
  { value: "google", label: "Google search" },
  { value: "google_business", label: "Google Business Profile" },
  { value: "social", label: "Social media" },
  { value: "referral", label: "Friend or family referral" },
  { value: "other", label: "Other" },
];

export function StepContact() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<QuoteSubmissionInput>();

  const consentGiven = watch("consentGiven");
  const howHeardAboutUs = watch("howHeardAboutUs");

  return (
    <FieldGroup>
      {/* Honeypot, hidden from real users via CSS, not display:none (some bots skip those). */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Leave this field blank</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <Field>
        <FieldLabel htmlFor="contactName">Name</FieldLabel>
        <Input id="contactName" {...register("contactName")} />
        <FieldError errors={[errors.contactName]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="contactPhone">Mobile number</FieldLabel>
        <Input
          id="contactPhone"
          type="tel"
          placeholder="04XX XXX XXX"
          {...register("contactPhone")}
        />
        <FieldError errors={[errors.contactPhone]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="contactEmail">Email</FieldLabel>
        <Input id="contactEmail" type="email" {...register("contactEmail")} />
        <FieldError errors={[errors.contactEmail]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="howHeardAboutUs">How did you hear about us? (optional)</FieldLabel>
        <Select
          value={howHeardAboutUs}
          onValueChange={(value) => {
            if (value) setValue("howHeardAboutUs", value);
          }}
        >
          <SelectTrigger id="howHeardAboutUs">
            <SelectValue placeholder="Select an option">
              {(value: string) => howHeardOptions.find((option) => option.value === value)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {howHeardOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="notes">Anything else we should know? (optional)</FieldLabel>
        <Textarea id="notes" rows={3} {...register("notes")} />
      </Field>

      <Field orientation="horizontal">
        <Checkbox
          id="consentGiven"
          checked={consentGiven}
          onCheckedChange={(checked) => setValue("consentGiven", (checked === true) as true)}
        />
        <FieldLabel htmlFor="consentGiven">
          I agree to the{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            privacy policy
          </Link>
        </FieldLabel>
      </Field>
      <FieldError errors={[errors.consentGiven]} />

      <Field>
        <TurnstileWidget onVerify={(token) => setValue("turnstileToken", token)} />
        <FieldError errors={[errors.turnstileToken]} />
      </Field>
    </FieldGroup>
  );
}
