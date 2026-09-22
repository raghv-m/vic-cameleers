"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { PricingSettings } from "@prisma/client";

import { updatePricingSettings } from "@/app/admin/(protected)/settings/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function PricingSettingsForm({ settings }: { settings: PricingSettings }) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    hourlyRateCents: settings.hourlyRateCents.toString(),
    extraMoverHourlyRateCents: settings.extraMoverHourlyRateCents.toString(),
    minimumHours: settings.minimumHours.toString(),
    calloutMinutes: settings.calloutMinutes.toString(),
    gstInclusive: settings.gstInclusive,
    baseHoursBySizeJson: JSON.stringify(settings.baseHoursBySize, null, 2),
    accessPenaltyPerFlightHours: settings.accessPenaltyPerFlightHours.toString(),
    accessPenaltyLongCarryHours: settings.accessPenaltyLongCarryHours.toString(),
    packingHourPerBedroom: settings.packingHourPerBedroom.toString(),
    unpackingHourPerBedroom: settings.unpackingHourPerBedroom.toString(),
    disassemblyHourPerItem: settings.disassemblyHourPerItem.toString(),
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit() {
    startTransition(async () => {
      const result = await updatePricingSettings(form);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Pricing settings saved");
    });
  }

  return (
    <FieldGroup className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="hourlyRateCents">Hourly rate (cents)</FieldLabel>
          <Input
            id="hourlyRateCents"
            type="number"
            value={form.hourlyRateCents}
            onChange={(e) => set("hourlyRateCents", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="extraMoverHourlyRateCents">Extra mover rate (cents)</FieldLabel>
          <Input
            id="extraMoverHourlyRateCents"
            type="number"
            value={form.extraMoverHourlyRateCents}
            onChange={(e) => set("extraMoverHourlyRateCents", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="minimumHours">Minimum hours</FieldLabel>
          <Input
            id="minimumHours"
            type="number"
            step="0.5"
            value={form.minimumHours}
            onChange={(e) => set("minimumHours", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="calloutMinutes">Call-out minutes</FieldLabel>
          <Input
            id="calloutMinutes"
            type="number"
            value={form.calloutMinutes}
            onChange={(e) => set("calloutMinutes", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="accessPenaltyPerFlightHours">Hours per flight of stairs</FieldLabel>
          <Input
            id="accessPenaltyPerFlightHours"
            type="number"
            step="0.05"
            value={form.accessPenaltyPerFlightHours}
            onChange={(e) => set("accessPenaltyPerFlightHours", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="accessPenaltyLongCarryHours">Hours for long carry</FieldLabel>
          <Input
            id="accessPenaltyLongCarryHours"
            type="number"
            step="0.05"
            value={form.accessPenaltyLongCarryHours}
            onChange={(e) => set("accessPenaltyLongCarryHours", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="packingHourPerBedroom">Packing hours / bedroom</FieldLabel>
          <Input
            id="packingHourPerBedroom"
            type="number"
            step="0.05"
            value={form.packingHourPerBedroom}
            onChange={(e) => set("packingHourPerBedroom", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="unpackingHourPerBedroom">Unpacking hours / bedroom</FieldLabel>
          <Input
            id="unpackingHourPerBedroom"
            type="number"
            step="0.05"
            value={form.unpackingHourPerBedroom}
            onChange={(e) => set("unpackingHourPerBedroom", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="disassemblyHourPerItem">Disassembly hours / item</FieldLabel>
          <Input
            id="disassemblyHourPerItem"
            type="number"
            step="0.05"
            value={form.disassemblyHourPerItem}
            onChange={(e) => set("disassemblyHourPerItem", e.target.value)}
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <Checkbox
          checked={form.gstInclusive}
          onCheckedChange={(c) => set("gstInclusive", c === true)}
        />
        Hourly rate is GST inclusive
      </label>

      <Field>
        <FieldLabel htmlFor="baseHoursBySizeJson">
          Base hours by property size (JSON: size -&gt; [low, high])
        </FieldLabel>
        <Textarea
          id="baseHoursBySizeJson"
          value={form.baseHoursBySizeJson}
          onChange={(e) => set("baseHoursBySizeJson", e.target.value)}
          rows={9}
          className="font-mono text-xs"
        />
      </Field>

      <Button size="sm" disabled={pending} onClick={submit}>
        {pending ? "Saving..." : "Save pricing settings"}
      </Button>
    </FieldGroup>
  );
}
