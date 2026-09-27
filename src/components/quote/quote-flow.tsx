"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { track } from "@vercel/analytics";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FieldPath } from "react-hook-form";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { LoadingConvoy } from "@/components/brand/status";
import { Odometer } from "@/components/quote/odometer";
import { QUOTE_STEPS, QuoteProgress } from "@/components/quote/quote-progress";
import { StepDetails, StepLoad, StepMove } from "@/components/quote/quote-steps";
import { ResultScreen } from "@/components/quote/result-screen";
import type { QuoteResult } from "@/components/quote/result-screen";
import { Button } from "@/components/ui/button";
import { business } from "@/config/business";
import { calculateQuote } from "@/lib/pricing";
import { FALLBACK_TRAVEL_MINUTES, toPricingInput } from "@/lib/quote-pricing";
import { quoteSubmissionSchema, stepSchemas } from "@/lib/validation/quote";
import type { QuoteSubmission, QuoteSubmissionInput } from "@/lib/validation/quote";
import type { PricingSettings } from "@/types/pricing";

const TOTAL_STEPS = QUOTE_STEPS.length;

const access = {
  floorLevel: "ground",
  hasLift: false,
  stairsCount: 0,
  longCarry: false,
  parkingNotes: "",
};

export const quoteDefaultValues: QuoteSubmissionInput = {
  pickupAddress: "",
  dropoffAddress: "",
  additionalStopAddress: "",
  moveDate: "",
  dateFlexibility: "within_week",
  preferredTime: "morning",
  propertyType: "HOUSE",
  propertySize: "2bed",
  pickupAccess: { ...access },
  dropoffAccess: { ...access },
  specialItems: {
    piano: false,
    safe: false,
    poolTable: false,
    gymEquipment: false,
    fragileArtwork: false,
  },
  extras: { packing: false, unpacking: false, disassembly: false, boxesAndMaterials: false },
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  howHeardAboutUs: "",
  notes: "",
  // Zod types this as the literal `true` (it must be ticked to submit), but it starts unticked.
  consentGiven: false as unknown as true,
  turnstileToken: "",
  website: "",
};

type SubmitState =
  { kind: "idle" } | { kind: "sending" } | { kind: "error"; message: string; retryable: boolean };

const sizeLabel: Record<QuoteSubmissionInput["propertySize"], string> = {
  studio: "Studio",
  "1bed": "1 bedroom",
  "2bed": "2 bedroom",
  "3bed": "3 bedroom",
  "4plus": "4+ bedroom",
  office: "Small office",
  singleItem: "A few items",
};

function dollars(cents: number): string {
  return `$${Math.round(cents / 100).toLocaleString("en-AU")}`;
}

/** The live estimate beside the form: the same engine and rates the server will use. */
function LiveEstimate({ settings, compact }: { settings: PricingSettings; compact?: boolean }) {
  const values = useWatch<QuoteSubmissionInput>();
  const estimate = useMemo(
    () => calculateQuote(toPricingInput(values as QuoteSubmissionInput), settings),
    [values, settings],
  );
  const price =
    estimate.priceLowCents === estimate.priceHighCents
      ? dollars(estimate.priceLowCents)
      : `${dollars(estimate.priceLowCents)} to ${dollars(estimate.priceHighCents)}`;
  const truck = estimate.recommendedTruck === "TEN_TONNE" ? "10 tonne truck" : "6 tonne truck";
  const size = values.propertySize ? sizeLabel[values.propertySize] : sizeLabel["2bed"];

  if (compact) {
    return (
      <div className="flex items-baseline justify-between gap-3">
        <span className="manifest-index text-muted-600">Estimate</span>
        <span className="font-headline text-terracotta-600 text-2xl leading-none">
          <Odometer value={price} />
        </span>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="live-estimate-title"
      className="border-navy-900 bg-sand-50 shadow-crate rounded-sm border-2"
    >
      <div className="bg-navy-900 text-sand-50 px-4 py-2.5">
        <h2
          id="live-estimate-title"
          className="text-[0.8125rem] font-bold tracking-[0.14em] uppercase"
        >
          Estimated price
        </h2>
      </div>
      <div className="space-y-4 p-4">
        <p className="font-headline text-terracotta-600 text-4xl leading-none" aria-live="polite">
          <Odometer value={price} />
        </p>
        <dl className="text-ink-900 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
          <dt className="text-muted-600">Based on</dt>
          <dd className="font-semibold">{size}</dd>
          <dt className="text-muted-600">Time</dt>
          <dd className="tabular font-semibold">
            {estimate.lowHours.toFixed(1)} to {estimate.highHours.toFixed(1)} hrs
          </dd>
          <dt className="text-muted-600">Crew</dt>
          <dd className="font-semibold">
            {estimate.recommendedCrewCount} movers, {truck}
          </dd>
        </dl>
        <p className="text-muted-600 border-navy-900/20 border-t pt-3 text-[0.8125rem] leading-relaxed">
          Assumes a {FALLBACK_TRAVEL_MINUTES} minute drive between addresses and includes the{" "}
          {business.calloutMinutes} minute call-out. You pay for actual time on the day at{" "}
          {business.hourlyRateShort}, {business.minimumHours} hour minimum.
        </p>
      </div>
    </section>
  );
}

/**
 * The quote request: three steps (your move, what's moving, your details), each validated on its
 * own before moving on, with a live estimate beside it. Submission is guarded against double
 * sends on the client and matched against recent duplicates on the server.
 */
export function QuoteFlow({
  settings,
  initialValues,
  suburbOptions,
}: {
  settings: PricingSettings;
  initialValues?: Partial<QuoteSubmissionInput>;
  suburbOptions: string[];
}) {
  const [step, setStep] = useState(1);
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const inFlight = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const form = useForm<QuoteSubmissionInput, unknown, QuoteSubmission>({
    resolver: zodResolver(quoteSubmissionSchema),
    defaultValues: { ...quoteDefaultValues, ...initialValues },
    mode: "onSubmit",
    shouldFocusError: true,
  });

  // On each step change: record it, bring the top of the form into view, and move focus to the
  // step heading so screen readers announce where they are. Skipped on first load.
  useEffect(() => {
    track(`quote_step_${step}`, { path: window.location.pathname });
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    topRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    stepHeadingRef.current?.focus({ preventScroll: true });
  }, [step]);

  /** Validates the current step against its own schema, shows errors and focuses the first one. */
  function validateStep(): boolean {
    const schema = stepSchemas[step as keyof typeof stepSchemas];
    const parsed = schema.safeParse(form.getValues());
    form.clearErrors();
    if (parsed.success) return true;

    for (const issue of parsed.error.issues) {
      form.setError(issue.path.join(".") as FieldPath<QuoteSubmissionInput>, {
        type: "manual",
        message: issue.message,
      });
    }
    const first = parsed.error.issues[0]?.path.join(".");
    if (first) {
      const el = document.getElementById(first.replaceAll(".", "-"));
      if (el) el.focus();
      else stepHeadingRef.current?.focus();
    }
    return false;
  }

  function goNext() {
    if (validateStep()) setStep((current) => Math.min(TOTAL_STEPS, current + 1));
  }

  function goTo(target: number) {
    form.clearErrors();
    setSubmit({ kind: "idle" });
    setStep(target);
  }

  async function onSubmit(data: QuoteSubmission) {
    // A second tap while the first request is in flight does nothing.
    if (inFlight.current) return;
    inFlight.current = true;
    setSubmit({ kind: "sending" });

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await response.json().catch(() => null)) as {
        referenceNumber?: string;
        estimate?: QuoteResult["estimate"];
        duplicate?: boolean;
        error?: string;
      } | null;

      if (!response.ok || !body?.referenceNumber || !body.estimate) {
        const message =
          response.status === 429
            ? "That's a lot of requests in a short time. Wait a minute and try again, or call us."
            : (body?.error ?? "We couldn't send your request.");
        // Turnstile tokens are single use, so get a fresh one for the retry.
        form.setValue("turnstileToken", "");
        setTurnstileKey((key) => key + 1);
        setSubmit({ kind: "error", message, retryable: response.status !== 400 });
        return;
      }

      track("quote_submitted", {
        path: window.location.pathname,
        fromSuburb: new URLSearchParams(window.location.search).get("suburb"),
        propertySize: data.propertySize,
        duplicate: Boolean(body.duplicate),
      });
      setResult({
        referenceNumber: body.referenceNumber,
        moveDate: data.moveDate,
        estimate: body.estimate,
        duplicate: body.duplicate,
      });
      topRef.current?.scrollIntoView({ block: "start" });
    } catch {
      form.setValue("turnstileToken", "");
      setTurnstileKey((key) => key + 1);
      setSubmit({
        kind: "error",
        message: "We couldn't reach our server. Check your connection and try again.",
        retryable: true,
      });
    } finally {
      inFlight.current = false;
    }
  }

  const sending = submit.kind === "sending";

  return (
    <div ref={topRef} className="scroll-mt-24">
      {result ? (
        <ResultScreen result={result} />
      ) : (
        <FormProvider {...form}>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <form
              noValidate
              onSubmit={(event) => {
                // Enter in a field on an earlier step moves on rather than submitting everything.
                if (step < TOTAL_STEPS) {
                  event.preventDefault();
                  goNext();
                  return;
                }
                void form.handleSubmit(onSubmit)(event);
              }}
              aria-busy={sending}
              className="lg:col-span-8"
            >
              <QuoteProgress step={step} onJump={goTo} disabled={sending} />

              <div className="mt-8">
                <p className="manifest-index text-terracotta-600">
                  Step {step} of {TOTAL_STEPS}
                </p>
                <h2
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  className="font-headline text-navy-900 display-md mt-1 outline-none"
                >
                  {QUOTE_STEPS[step - 1]}
                </h2>
              </div>

              <fieldset disabled={sending} className="mt-4 min-w-0">
                {step === 1 && <StepMove suburbOptions={suburbOptions} />}
                {step === 2 && <StepLoad />}
                {step === 3 && (
                  <StepDetails
                    turnstileKey={turnstileKey}
                    onTurnstileToken={(token) => {
                      form.setValue("turnstileToken", token);
                      form.clearErrors("turnstileToken");
                    }}
                  />
                )}
              </fieldset>

              {submit.kind === "error" && (
                <div
                  role="alert"
                  className="border-danger-700 bg-card mt-8 rounded-sm border-2 border-l-8 p-4"
                >
                  <p className="text-danger-700 font-bold">Your request didn&apos;t go through.</p>
                  <p className="text-ink-900 mt-1">{submit.message}</p>
                  <p className="text-ink-900 mt-2 text-sm">
                    Nothing you entered is lost.{" "}
                    {submit.retryable ? "Try again below, or " : "Check the details above, or "}
                    call{" "}
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

              {/* Mobile: the estimate rides above the buttons, since the side panel is below. */}
              <div className="border-navy-900 bg-sand-50 mt-8 rounded-sm border-2 px-4 py-3 lg:hidden">
                <LiveEstimate settings={settings} compact />
              </div>

              <div className="border-navy-900 mt-4 flex items-center justify-between gap-3 border-t-2 pt-6 lg:mt-10">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={() => goTo(step - 1)}
                    disabled={sending}
                  >
                    <ArrowLeft />
                    Back
                  </Button>
                ) : (
                  <span />
                )}
                {step < TOTAL_STEPS ? (
                  <Button
                    type="button"
                    size="lg"
                    onClick={goNext}
                    className="tracking-[0.08em] uppercase"
                  >
                    Next: {QUOTE_STEPS[step]}
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                ) : sending ? (
                  <LoadingConvoy label="Sending your request" />
                ) : (
                  <Button type="submit" size="lg" className="tracking-[0.08em] uppercase">
                    {submit.kind === "error" ? "Try again" : "Request my quote"}
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                )}
              </div>
            </form>

            <aside className="lg:col-span-4">
              <div className="space-y-4 lg:sticky lg:top-24">
                <div className="hidden lg:block">
                  <LiveEstimate settings={settings} />
                </div>
                <div className="border-navy-900/20 border-t pt-4 lg:border-0 lg:pt-0">
                  <p className="text-navy-900 text-sm font-semibold">Rather talk it through?</p>
                  <a
                    href={`tel:${business.phoneE164}`}
                    className="text-navy-900 hover:text-terracotta-600 tabular mt-1 inline-flex min-h-11 items-center gap-2 text-lg font-bold"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    {business.phoneDisplay}
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </FormProvider>
      )}
    </div>
  );
}
