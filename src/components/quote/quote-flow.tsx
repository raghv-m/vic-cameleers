"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { FieldPath } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ProgressStepper } from "@/components/quote/progress-stepper";
import { ResultScreen } from "@/components/quote/result-screen";
import type { QuoteResult } from "@/components/quote/result-screen";
import { StepContact } from "@/components/quote/steps/step-contact";
import { StepExtras } from "@/components/quote/steps/step-extras";
import { StepInventory } from "@/components/quote/steps/step-inventory";
import { StepLocationDate } from "@/components/quote/steps/step-location-date";
import { StepProperty } from "@/components/quote/steps/step-property";
import { stepSchemas, quoteSubmissionSchema } from "@/lib/validation/quote";
import type { QuoteSubmission, QuoteSubmissionInput } from "@/lib/validation/quote";

const TOTAL_STEPS = 5;

const defaultValues: Partial<QuoteSubmissionInput> = {
  pickupAddress: "",
  dropoffAddress: "",
  additionalStopAddress: "",
  moveDate: "",
  dateFlexibility: "within_week",
  preferredTime: "morning",
  propertyType: "HOUSE",
  propertySize: "2bed",
  pickupAccess: {
    floorLevel: "ground",
    hasLift: false,
    stairsCount: 0,
    longCarry: false,
    parkingNotes: "",
  },
  dropoffAccess: {
    floorLevel: "ground",
    hasLift: false,
    stairsCount: 0,
    longCarry: false,
    parkingNotes: "",
  },
  specialItems: {
    piano: false,
    safe: false,
    poolTable: false,
    gymEquipment: false,
    fragileArtwork: false,
  },
  extras: {
    packing: false,
    unpacking: false,
    disassembly: false,
    boxesAndMaterials: false,
  },
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  notes: "",
  // Zod types this as the literal `true` (must be checked to submit), but the
  // checkbox obviously starts unchecked.
  consentGiven: false as unknown as true,
  turnstileToken: "",
  website: "",
};

export function QuoteFlow() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<QuoteResult | null>(null);

  const form = useForm<QuoteSubmissionInput, unknown, QuoteSubmission>({
    resolver: zodResolver(quoteSubmissionSchema),
    defaultValues,
    mode: "onSubmit",
  });

  // Validated against each step's own sub-schema rather than RHF's
  // trigger(fieldNames): with a merged Zod object schema, trigger() doesn't
  // reliably scope the resulting errors to just the requested fields, which
  // leaked validation errors for not-yet-visited steps onto the screen the
  // moment the user arrived there.
  function goNext() {
    const schema = stepSchemas[step as keyof typeof stepSchemas];
    const result = schema.safeParse(form.getValues());

    if (!result.success) {
      for (const issue of result.error.issues) {
        form.setError(issue.path.join(".") as FieldPath<QuoteSubmissionInput>, {
          type: "manual",
          message: issue.message,
        });
      }
      return;
    }

    form.clearErrors();
    setStep((current) => Math.min(TOTAL_STEPS, current + 1));
  }

  function goBack() {
    setStep((current) => Math.max(1, current - 1));
  }

  async function onSubmit(data: QuoteSubmission) {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Something went wrong, please try again.");
      }

      const body = (await response.json()) as {
        referenceNumber: string;
        estimate: QuoteResult["estimate"];
      };

      setResult({
        referenceNumber: body.referenceNumber,
        moveDate: data.moveDate,
        estimate: body.estimate,
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return <ResultScreen result={result} />;
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <ProgressStepper currentStep={step} />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {step === 1 && <StepLocationDate />}
          {step === 2 && <StepProperty />}
          {step === 3 && <StepInventory />}
          {step === 4 && <StepExtras />}
          {step === 5 && <StepContact />}

          {submitError && <p className="text-destructive text-sm">{submitError}</p>}

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={step === 1 || submitting}
            >
              Back
            </Button>

            {step < TOTAL_STEPS ? (
              <Button type="button" onClick={goNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={submitting}>
                {submitting ? "Getting your estimate..." : "Get my estimate"}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
