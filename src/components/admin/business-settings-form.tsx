"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { BusinessSettings, EstimateMode } from "@prisma/client";

import { updateBusinessSettings } from "@/app/admin/(protected)/settings/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const estimateModeLabel: Record<EstimateMode, string> = {
  SHOW_PRICE: "Show price range",
  CALLBACK_ONLY: '"We\'ll call you" (no price shown)',
};

export function BusinessSettingsForm({ settings }: { settings: BusinessSettings }) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    legalName: settings.legalName ?? "",
    abn: settings.abn,
    acn: settings.acn,
    baseSuburb: settings.baseSuburb,
    serviceAreaDescription: settings.serviceAreaDescription,
    phoneE164: settings.phoneE164,
    publicEmail: settings.publicEmail ?? "",
    domain: settings.domain ?? "",
    fleetDescription: settings.fleetDescription,
    crewSize: settings.crewSize?.toString() ?? "",
    isFullyInsured: settings.isFullyInsured,
    insuranceDetail: settings.insuranceDetail ?? "",
    isLicensed: settings.isLicensed,
    licenseDetail: settings.licenseDetail ?? "",
    googleReviewUrl: settings.googleReviewUrl ?? "",
    estimateMode: settings.estimateMode,
    cancellationPolicySummary: settings.cancellationPolicySummary ?? "",
    paymentMethodsDescription: settings.paymentMethodsDescription ?? "",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit() {
    startTransition(async () => {
      const result = await updateBusinessSettings({
        ...form,
        crewSize: form.crewSize || undefined,
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Business settings saved");
    });
  }

  return (
    <FieldGroup className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="legalName">Legal entity name</FieldLabel>
          <Input
            id="legalName"
            value={form.legalName}
            onChange={(e) => set("legalName", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="abn">ABN</FieldLabel>
          <Input id="abn" value={form.abn} onChange={(e) => set("abn", e.target.value)} />
        </Field>
        <Field>
          <FieldLabel htmlFor="acn">ACN</FieldLabel>
          <Input id="acn" value={form.acn} onChange={(e) => set("acn", e.target.value)} />
        </Field>
        <Field>
          <FieldLabel htmlFor="baseSuburb">Base suburb</FieldLabel>
          <Input
            id="baseSuburb"
            value={form.baseSuburb}
            onChange={(e) => set("baseSuburb", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="phoneE164">Phone</FieldLabel>
          <Input
            id="phoneE164"
            value={form.phoneE164}
            onChange={(e) => set("phoneE164", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="publicEmail">Public email</FieldLabel>
          <Input
            id="publicEmail"
            value={form.publicEmail}
            onChange={(e) => set("publicEmail", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="domain">Domain</FieldLabel>
          <Input id="domain" value={form.domain} onChange={(e) => set("domain", e.target.value)} />
        </Field>
        <Field>
          <FieldLabel htmlFor="crewSize">Crew size</FieldLabel>
          <Input
            id="crewSize"
            type="number"
            value={form.crewSize}
            onChange={(e) => set("crewSize", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="googleReviewUrl">Google review URL</FieldLabel>
          <Input
            id="googleReviewUrl"
            value={form.googleReviewUrl}
            onChange={(e) => set("googleReviewUrl", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="estimateMode">Quote result mode</FieldLabel>
          <Select
            value={form.estimateMode}
            onValueChange={(v) => v && set("estimateMode", v as EstimateMode)}
          >
            <SelectTrigger id="estimateMode">
              <SelectValue placeholder="Mode">
                {(value: string) => estimateModeLabel[value as EstimateMode]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SHOW_PRICE">{estimateModeLabel.SHOW_PRICE}</SelectItem>
              <SelectItem value="CALLBACK_ONLY">{estimateModeLabel.CALLBACK_ONLY}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="serviceAreaDescription">Service area description</FieldLabel>
        <Input
          id="serviceAreaDescription"
          value={form.serviceAreaDescription}
          onChange={(e) => set("serviceAreaDescription", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="fleetDescription">Fleet description</FieldLabel>
        <Input
          id="fleetDescription"
          value={form.fleetDescription}
          onChange={(e) => set("fleetDescription", e.target.value)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 rounded-md border p-3">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox
              checked={form.isFullyInsured}
              onCheckedChange={(c) => set("isFullyInsured", c === true)}
            />
            Fully insured
          </label>
          <Textarea
            placeholder="Policy detail shown alongside the claim"
            value={form.insuranceDetail}
            onChange={(e) => set("insuranceDetail", e.target.value)}
            rows={2}
          />
        </div>
        <div className="space-y-2 rounded-md border p-3">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox
              checked={form.isLicensed}
              onCheckedChange={(c) => set("isLicensed", c === true)}
            />
            Licensed / accredited
          </label>
          <Textarea
            placeholder="Licence detail shown alongside the claim"
            value={form.licenseDetail}
            onChange={(e) => set("licenseDetail", e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <Field>
        <FieldLabel htmlFor="cancellationPolicySummary">Cancellation policy summary</FieldLabel>
        <Textarea
          id="cancellationPolicySummary"
          value={form.cancellationPolicySummary}
          onChange={(e) => set("cancellationPolicySummary", e.target.value)}
          rows={3}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="paymentMethodsDescription">Accepted payment methods</FieldLabel>
        <Input
          id="paymentMethodsDescription"
          value={form.paymentMethodsDescription}
          onChange={(e) => set("paymentMethodsDescription", e.target.value)}
        />
      </Field>

      <Button size="sm" disabled={pending} onClick={submit}>
        {pending ? "Saving..." : "Save business settings"}
      </Button>
    </FieldGroup>
  );
}
