"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { ChipGroup, ChipToggle } from "@/components/quote/chip-group";
import {
  FieldMessage,
  QuoteField,
  StepBlock,
  fieldId,
  useFieldError,
  type QuoteFieldName,
} from "@/components/quote/quote-fields";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { business } from "@/config/business";
import { floorToFlights } from "@/lib/quote-pricing";
import type { QuoteSubmissionInput } from "@/lib/validation/quote";

type Values = QuoteSubmissionInput;
type PropertyType = Values["propertyType"];
type PropertySize = Values["propertySize"];

/** Sets a value from a custom control and clears any error left on it by an earlier attempt. */
function useSetField() {
  const { setValue, clearErrors } = useFormContext<Values>();
  return <N extends QuoteFieldName>(name: N, value: Parameters<typeof setValue<N>>[1]) => {
    setValue(name, value, { shouldDirty: true });
    clearErrors(name);
  };
}

/** register() plus clearing the field's error as soon as it's edited. */
function useRegister() {
  const { register, clearErrors } = useFormContext<Values>();
  return (name: QuoteFieldName) => register(name, { onChange: () => clearErrors(name) });
}

function localToday(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

/* ------------------------------------------------------------------------------------------ */
/* Step 1: your move                                                                          */
/* ------------------------------------------------------------------------------------------ */

const FLEXIBILITY: { value: Values["dateFlexibility"]; label: string }[] = [
  { value: "exact", label: "This date only" },
  { value: "within_week", label: "Within a week" },
  { value: "any_weekday", label: "Any weekday" },
];

const START_TIMES: { value: Values["preferredTime"]; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "midday", label: "Midday" },
  { value: "afternoon", label: "Afternoon" },
];

export function StepMove({ suburbOptions }: { suburbOptions: string[] }) {
  const reg = useRegister();
  const setField = useSetField();
  const { control } = useFormContext<Values>();
  const [dateFlexibility, preferredTime, extraStop] = useWatch({
    control,
    name: ["dateFlexibility", "preferredTime", "additionalStopAddress"],
  });
  const [showStop, setShowStop] = useState(Boolean(extraStop));

  return (
    <div className="space-y-2">
      <datalist id="quote-suburbs">
        {suburbOptions.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>

      <StepBlock
        index="A"
        title="Where from, where to"
        description="Victoria only. A street and suburb is enough."
      >
        <QuoteField name="pickupAddress" label="Pickup address">
          {(control) => (
            <Input
              {...control}
              {...reg("pickupAddress")}
              list="quote-suburbs"
              autoComplete="street-address"
              placeholder="12 Smith St, Cranbourne VIC 3977"
            />
          )}
        </QuoteField>
        <QuoteField name="dropoffAddress" label="Drop-off address">
          {(control) => (
            <Input
              {...control}
              {...reg("dropoffAddress")}
              list="quote-suburbs"
              autoComplete="off"
              placeholder="4 High St, Berwick VIC 3806"
            />
          )}
        </QuoteField>
        {showStop ? (
          <QuoteField name="additionalStopAddress" label="Extra stop" optional>
            {(control) => (
              <Input
                {...control}
                {...reg("additionalStopAddress")}
                list="quote-suburbs"
                autoComplete="off"
              />
            )}
          </QuoteField>
        ) : (
          <button
            type="button"
            onClick={() => setShowStop(true)}
            className="text-navy-900 hover:text-terracotta-600 inline-flex min-h-11 items-center gap-2 text-sm font-bold underline decoration-2 underline-offset-4"
          >
            <span aria-hidden="true" className="text-terracotta-600">
              +
            </span>
            Add a stop on the way
          </button>
        )}
      </StepBlock>

      <StepBlock index="B" title="When">
        <QuoteField
          name="moveDate"
          label="Moving date"
          hint="Not sure yet? Pick your best guess and say so in the notes."
          className="max-w-xs"
        >
          {(control) => (
            <Input
              {...control}
              {...reg("moveDate")}
              type="date"
              // The server doesn't know the visitor's local date, so the picker's minimum is set
              // in the browser when it's used. Past dates are also rejected by validation.
              onFocus={(event) => {
                event.currentTarget.min = localToday();
              }}
            />
          )}
        </QuoteField>
        <ChipGroup
          legend="Is the date flexible?"
          name="dateFlexibility"
          value={dateFlexibility}
          options={FLEXIBILITY}
          onChange={(value) => setField("dateFlexibility", value)}
        />
        <ChipGroup
          legend="Preferred start"
          name="preferredTime"
          value={preferredTime}
          options={START_TIMES}
          onChange={(value) => setField("preferredTime", value)}
        />
      </StepBlock>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* Step 2: what's moving                                                                      */
/* ------------------------------------------------------------------------------------------ */

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "HOUSE", label: "House" },
  { value: "TOWNHOUSE", label: "Townhouse" },
  { value: "UNIT", label: "Unit" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "STORAGE_UNIT", label: "Storage unit" },
  { value: "OFFICE", label: "Office" },
  { value: "SINGLE_ITEM", label: "A few items" },
];

const HOME_SIZES: { value: PropertySize; label: string }[] = [
  { value: "studio", label: "Studio" },
  { value: "1bed", label: "1 bed" },
  { value: "2bed", label: "2 bed" },
  { value: "3bed", label: "3 bed" },
  { value: "4plus", label: "4+ bed" },
];

const FLOORS = [
  { value: "ground", label: "Ground" },
  { value: "1", label: "1st" },
  { value: "2", label: "2nd" },
  { value: "3", label: "3rd" },
  { value: "4plus", label: "4th+" },
];

/** Size follows type: offices and single items have one size each; homes pick bedrooms. */
function sizeForType(type: PropertyType, current: PropertySize): PropertySize {
  if (type === "OFFICE") return "office";
  if (type === "SINGLE_ITEM") return "singleItem";
  return current === "office" || current === "singleItem" ? "2bed" : current;
}

function AccessBlock({ end, index }: { end: "pickupAccess" | "dropoffAccess"; index: string }) {
  const reg = useRegister();
  const setField = useSetField();
  const { control } = useFormContext<Values>();
  const access = useWatch({ control, name: end });
  const floorError = useFieldError(`${end}.floorLevel`);
  const floor = access?.floorLevel ?? "ground";
  const hasLift = Boolean(access?.hasLift);

  // Flights of stairs are worked out from the floor and the lift, not typed in.
  function update(nextFloor: string, nextLift: boolean) {
    setField(`${end}.floorLevel`, nextFloor);
    setField(`${end}.hasLift`, nextFloor === "ground" ? false : nextLift);
    setField(`${end}.stairsCount`, nextLift ? 0 : floorToFlights(nextFloor));
  }

  return (
    <StepBlock
      index={index}
      title={end === "pickupAccess" ? "Access at pickup" : "Access at drop-off"}
    >
      <ChipGroup
        legend="Which floor?"
        name={`${end}-floor`}
        value={floor}
        options={FLOORS}
        onChange={(value) => update(value, hasLift)}
        invalid={Boolean(floorError)}
        describedBy={floorError ? `${fieldId(`${end}.floorLevel`)}-error` : undefined}
      />
      <FieldMessage name={`${end}.floorLevel`} message={floorError} />
      <div className="flex flex-wrap gap-2">
        {floor !== "ground" && (
          <ChipToggle
            id={`${end}-lift`}
            label="There's a lift we can use"
            checked={hasLift}
            onChange={(checked) => update(floor, checked)}
          />
        )}
        <ChipToggle
          id={`${end}-carry`}
          label="Long walk from the truck"
          checked={Boolean(access?.longCarry)}
          onChange={(checked) => setField(`${end}.longCarry`, checked)}
        />
      </div>
      <QuoteField
        name={`${end}.parkingNotes`}
        label="Parking and access notes"
        optional
        hint="Loading bay, narrow driveway, lift booking, clearway times."
      >
        {(control) => <Input {...control} {...reg(`${end}.parkingNotes`)} />}
      </QuoteField>
    </StepBlock>
  );
}

function CountField({ name, label }: { name: QuoteFieldName; label: string }) {
  const reg = useRegister();
  return (
    <QuoteField name={name} label={label} className="max-w-[10rem]">
      {(control) => (
        <Input {...control} {...reg(name)} type="number" inputMode="numeric" min={1} max={20} />
      )}
    </QuoteField>
  );
}

export function StepLoad() {
  const setField = useSetField();
  const { control, getValues } = useFormContext<Values>();
  const [propertyType, propertySize, specialItems, extras] = useWatch({
    control,
    name: ["propertyType", "propertySize", "specialItems", "extras"],
  });
  const isHome = propertyType !== "OFFICE" && propertyType !== "SINGLE_ITEM";

  return (
    <div className="space-y-2">
      <StepBlock index="A" title="The place">
        <ChipGroup
          legend="What are you moving out of?"
          name="propertyType"
          value={propertyType}
          options={PROPERTY_TYPES}
          onChange={(value) => {
            setField("propertyType", value);
            setField("propertySize", sizeForType(value, getValues("propertySize")));
          }}
        />
        {isHome && (
          <ChipGroup
            legend="How many bedrooms' worth?"
            name="propertySize"
            value={propertySize}
            options={HOME_SIZES}
            onChange={(value) => setField("propertySize", value)}
          />
        )}
      </StepBlock>

      <div className="grid gap-x-10 lg:grid-cols-2">
        <AccessBlock end="pickupAccess" index="B" />
        <AccessBlock end="dropoffAccess" index="C" />
      </div>

      <StepBlock
        index="D"
        title="Extras"
        description="Charged at the same hourly rate, so the estimate adjusts as you pick them."
      >
        <div className="flex flex-wrap gap-2">
          <ChipToggle
            id="extras-packing"
            label="Packing"
            checked={Boolean(extras?.packing)}
            onChange={(checked) => setField("extras.packing", checked)}
          />
          <ChipToggle
            id="extras-unpacking"
            label="Unpacking"
            checked={Boolean(extras?.unpacking)}
            onChange={(checked) => setField("extras.unpacking", checked)}
          />
          <ChipToggle
            id="extras-disassembly"
            label="Disassembly and reassembly"
            checked={Boolean(extras?.disassembly)}
            onChange={(checked) => setField("extras.disassembly", checked)}
          />
          <ChipToggle
            id="extras-boxes"
            label="Boxes and materials"
            checked={Boolean(extras?.boxesAndMaterials)}
            onChange={(checked) => setField("extras.boxesAndMaterials", checked)}
          />
        </div>
        {(extras?.packing || extras?.unpacking || extras?.disassembly) && (
          <div className="flex flex-wrap gap-4">
            {extras?.packing && <CountField name="extras.packingBedrooms" label="Rooms to pack" />}
            {extras?.unpacking && (
              <CountField name="extras.unpackingBedrooms" label="Rooms to unpack" />
            )}
            {extras?.disassembly && (
              <CountField name="extras.disassemblyItems" label="Items to take apart" />
            )}
          </div>
        )}
      </StepBlock>

      <StepBlock index="E" title="Anything that needs extra care?">
        <div className="flex flex-wrap gap-2">
          <ChipToggle
            id="special-gym"
            label="Gym equipment"
            checked={Boolean(specialItems?.gymEquipment)}
            onChange={(checked) => setField("specialItems.gymEquipment", checked)}
          />
          <ChipToggle
            id="special-art"
            label="Fragile artwork or mirrors"
            checked={Boolean(specialItems?.fragileArtwork)}
            onChange={(checked) => setField("specialItems.fragileArtwork", checked)}
          />
        </div>
        <p className="text-muted-600 text-sm">
          We don&apos;t currently move pianos, safes or pool tables. If you have one, call{" "}
          <a
            href={`tel:${business.phoneE164}`}
            className="text-navy-900 tabular font-semibold underline underline-offset-4"
          >
            {business.phoneDisplay}
          </a>{" "}
          and we&apos;ll tell you straight.
        </p>
      </StepBlock>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* Step 3: your details                                                                       */
/* ------------------------------------------------------------------------------------------ */

const HOW_HEARD = [
  { value: "google", label: "Google search" },
  { value: "truck", label: "Saw our truck" },
  { value: "social", label: "Social media" },
  { value: "referral", label: "Friend or family" },
  { value: "other", label: "Other" },
];

export function StepDetails({
  turnstileKey,
  onTurnstileToken,
}: {
  turnstileKey: number;
  onTurnstileToken: (token: string) => void;
}) {
  const reg = useRegister();
  const setField = useSetField();
  const { control } = useFormContext<Values>();
  const consentGiven = useWatch({ control, name: "consentGiven" });
  const consentError = useFieldError("consentGiven");
  const turnstileError = useFieldError("turnstileToken");

  return (
    <div className="space-y-2">
      {/* Honeypot: off-screen rather than display:none, since some bots skip hidden fields. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Leave this field blank</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...reg("website")} />
      </div>

      <StepBlock
        index="A"
        title="Who we're talking to"
        description="We use these to send your quote and confirm details. Nothing else."
      >
        <QuoteField name="contactName" label="Your name">
          {(control) => <Input {...control} {...reg("contactName")} autoComplete="name" />}
        </QuoteField>
        <div className="grid gap-5 sm:grid-cols-2">
          <QuoteField name="contactPhone" label="Mobile">
            {(control) => (
              <Input
                {...control}
                {...reg("contactPhone")}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="04XX XXX XXX"
              />
            )}
          </QuoteField>
          <QuoteField name="contactEmail" label="Email">
            {(control) => (
              <Input
                {...control}
                {...reg("contactEmail")}
                type="email"
                autoComplete="email"
                inputMode="email"
              />
            )}
          </QuoteField>
        </div>
      </StepBlock>

      <StepBlock index="B" title="Anything else">
        <QuoteField
          name="notes"
          label="Notes for the crew"
          optional
          hint="Tricky items, tight timing, key collection, anything we should know."
        >
          {(control) => <Textarea {...control} {...reg("notes")} rows={3} />}
        </QuoteField>
        <QuoteField
          name="howHeardAboutUs"
          label="How did you find us?"
          optional
          className="max-w-xs"
        >
          {(control) => (
            <select
              {...control}
              {...reg("howHeardAboutUs")}
              className="border-input bg-card text-navy-900 focus-visible:border-navy-900 h-11 rounded-sm border px-3 text-base"
            >
              <option value="">Choose one</option>
              {HOW_HEARD.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </QuoteField>
      </StepBlock>

      <StepBlock index="C" title="Check and send">
        <div>
          <label
            htmlFor="consentGiven"
            className="text-ink-900 flex min-h-11 cursor-pointer items-start gap-3 text-[0.9375rem]"
          >
            <input
              id="consentGiven"
              type="checkbox"
              checked={Boolean(consentGiven)}
              onChange={(event) => setField("consentGiven", event.target.checked as true)}
              aria-invalid={consentError ? true : undefined}
              aria-describedby={consentError ? "consentGiven-error" : undefined}
              className="accent-navy-900 mt-0.5 size-5 shrink-0"
            />
            <span>
              I agree to Vic Cameleers using these details to quote my move, as set out in the{" "}
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
          <FieldMessage name="consentGiven" message={consentError} />
        </div>
        <div>
          <TurnstileWidget key={turnstileKey} onVerify={onTurnstileToken} />
          <FieldMessage name="turnstileToken" message={turnstileError} />
        </div>
      </StepBlock>
    </div>
  );
}
