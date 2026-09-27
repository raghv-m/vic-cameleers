"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { track } from "@vercel/analytics";
import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { LoadingConvoy } from "@/components/brand/status";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { business } from "@/config/business";
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

type FieldName = "name" | "email" | "phone" | "message" | "consentGiven" | "turnstileToken";

function ErrorLine({ name, message }: { name: FieldName; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${name}-error`} className="text-danger-700 mt-1.5 flex gap-1.5 text-sm font-semibold">
      <span aria-hidden="true">!</span>
      {message}
    </p>
  );
}

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const inFlight = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<ContactSubmission>({
    resolver: zodResolver(contactSubmissionSchema),
    defaultValues,
  });

  const consentGiven = watch("consentGiven");

  /** aria-invalid and aria-describedby for a control, pointing at its error line when there is one. */
  function aria(name: FieldName) {
    const invalid = Boolean(errors[name]);
    return {
      "aria-invalid": invalid || undefined,
      "aria-describedby": invalid ? `${name}-error` : undefined,
    };
  }

  async function onSubmit(data: ContactSubmission) {
    if (inFlight.current) return;
    inFlight.current = true;
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
        throw new Error(
          response.status === 429
            ? "That's a lot of messages in a short time. Wait a minute and try again."
            : (body?.error ?? "We couldn't send your message."),
        );
      }

      track("contact_submitted", { path: window.location.pathname });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof TypeError
          ? "We couldn't reach our server. Check your connection and try again."
          : error instanceof Error
            ? error.message
            : "We couldn't send your message.",
      );
      // Turnstile tokens are single use, so get a fresh one for the retry.
      setValue("turnstileToken", "");
      setTurnstileKey((key) => key + 1);
    } finally {
      setSubmitting(false);
      inFlight.current = false;
    }
  }

  if (submitted) {
    return (
      <div role="status" className="border-navy-900 bg-sand-50 rounded-sm border-2 p-6">
        <p className="manifest-index text-success-700">Message sent</p>
        <h2 className="font-headline text-navy-900 mt-1 text-3xl">Thanks. We&apos;ve got it.</h2>
        <p className="text-ink-900 mt-2">
          We&apos;ll get back to you soon. If it&apos;s urgent, call{" "}
          <a
            href={`tel:${business.phoneE164}`}
            className="tabular font-bold underline underline-offset-4"
          >
            {business.phoneDisplay}
          </a>
          .
        </p>
      </div>
    );
  }

  const inputProps = (name: "name" | "email" | "phone" | "message") => ({
    ...register(name, { onChange: () => clearErrors(name) }),
    ...aria(name),
    id: name,
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      aria-busy={submitting}
      className="border-navy-900 bg-sand-50 shadow-crate space-y-5 rounded-sm border-2 p-5 sm:p-6"
    >
      {/* Honeypot, hidden from real users via CSS, not display:none (some bots skip those). */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Leave this field blank</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-navy-900 mb-1.5 block text-sm font-semibold">
            Name
          </label>
          <Input {...inputProps("name")} autoComplete="name" />
          <ErrorLine name="name" message={errors.name?.message} />
        </div>
        <div>
          <label htmlFor="phone" className="text-navy-900 mb-1.5 block text-sm font-semibold">
            Mobile <span className="text-muted-600 font-normal">(optional)</span>
          </label>
          <Input
            {...inputProps("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="04XX XXX XXX"
          />
          <ErrorLine name="phone" message={errors.phone?.message} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="text-navy-900 mb-1.5 block text-sm font-semibold">
          Email
        </label>
        <Input {...inputProps("email")} type="email" inputMode="email" autoComplete="email" />
        <ErrorLine name="email" message={errors.email?.message} />
      </div>

      <div>
        <label htmlFor="message" className="text-navy-900 mb-1.5 block text-sm font-semibold">
          Message
        </label>
        <Textarea {...inputProps("message")} rows={5} />
        <ErrorLine name="message" message={errors.message?.message} />
      </div>

      <div>
        <label
          htmlFor="consentGiven"
          className="text-ink-900 flex min-h-11 cursor-pointer items-start gap-3 text-[0.9375rem]"
        >
          <input
            id="consentGiven"
            type="checkbox"
            checked={Boolean(consentGiven)}
            onChange={(event) => {
              setValue("consentGiven", event.target.checked as true);
              clearErrors("consentGiven");
            }}
            {...aria("consentGiven")}
            className="accent-navy-900 mt-0.5 size-5 shrink-0"
          />
          <span>
            I agree to Vic Cameleers using these details to reply to me, as set out in the{" "}
            <Link
              href="/privacy"
              target="_blank"
              className="text-navy-900 font-semibold underline underline-offset-4"
            >
              privacy policy
            </Link>
            .
          </span>
        </label>
        <ErrorLine name="consentGiven" message={errors.consentGiven?.message} />
      </div>

      <div>
        <TurnstileWidget
          key={turnstileKey}
          onVerify={(token) => {
            setValue("turnstileToken", token);
            clearErrors("turnstileToken");
          }}
        />
        <ErrorLine name="turnstileToken" message={errors.turnstileToken?.message} />
      </div>

      {submitError && (
        <div role="alert" className="border-danger-700 bg-card rounded-sm border-2 border-l-8 p-4">
          <p className="text-danger-700 font-bold">Your message didn&apos;t go through.</p>
          <p className="text-ink-900 mt-1">{submitError}</p>
          <p className="text-ink-900 mt-1 text-sm">
            What you wrote is still here. Or call{" "}
            <a
              href={`tel:${business.phoneE164}`}
              className="tabular font-bold underline underline-offset-4"
            >
              {business.phoneDisplay}
            </a>
            .
          </p>
        </div>
      )}

      {submitting ? (
        <LoadingConvoy label="Sending your message" className="items-start" />
      ) : (
        <Button type="submit" size="lg" className="w-full tracking-[0.08em] uppercase sm:w-auto">
          {submitError ? "Try again" : "Send message"}
          <ArrowRight data-icon="inline-end" />
        </Button>
      )}
    </form>
  );
}
