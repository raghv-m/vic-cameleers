"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSubmissionSchema } from "@/lib/validation/contact";
import type { ContactSubmission } from "@/lib/validation/contact";

const defaultValues: Partial<ContactSubmission> = {
  name: "",
  email: "",
  phone: "",
  message: "",
  consentGiven: false as unknown as true,
  turnstileToken: "",
  website: "",
};

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactSubmission>({
    resolver: zodResolver(contactSubmissionSchema),
    defaultValues,
  });

  const consentGiven = watch("consentGiven");

  async function onSubmit(data: ContactSubmission) {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Something went wrong, please try again.");
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border-border bg-card rounded-lg border p-6 text-center">
        <h2 className="font-heading text-xl font-medium">Message sent</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Thanks, we&apos;ve got your message and will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Honeypot, hidden from real users via CSS, not display:none (some bots skip those). */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Leave this field blank</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" {...register("name")} />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" {...register("email")} />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Mobile number (optional)</FieldLabel>
          <Input id="phone" type="tel" placeholder="04XX XXX XXX" {...register("phone")} />
          <FieldError errors={[errors.phone]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="message">Message</FieldLabel>
          <Textarea id="message" rows={5} {...register("message")} />
          <FieldError errors={[errors.message]} />
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

        {submitError && <p className="text-destructive text-sm">{submitError}</p>}

        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? "Sending..." : "Send message"}
        </Button>
      </FieldGroup>
    </form>
  );
}
