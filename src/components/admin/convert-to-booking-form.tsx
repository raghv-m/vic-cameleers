"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { convertToBooking } from "@/app/admin/(protected)/leads/[id]/actions";
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

const truckLabel = { SIX_TONNE: "6 tonne", TEN_TONNE: "10 tonne" } as const;

export function ConvertToBookingForm({
  leadId,
  defaultMoveDate,
  defaultPreferredTime,
  trucks,
  crewMembers,
}: {
  leadId: string;
  defaultMoveDate: string | null;
  defaultPreferredTime: string | null;
  trucks: { id: string; name: string; size: "SIX_TONNE" | "TEN_TONNE" }[];
  crewMembers: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [moveDate, setMoveDate] = useState(defaultMoveDate ?? "");
  const [preferredTime, setPreferredTime] = useState(defaultPreferredTime ?? "");
  const [truckId, setTruckId] = useState<string | undefined>(undefined);
  const [crewMemberIds, setCrewMemberIds] = useState<string[]>([]);

  function toggleCrew(id: string) {
    setCrewMemberIds((current) =>
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id],
    );
  }

  function submit() {
    if (!moveDate) return;
    startTransition(async () => {
      const result = await convertToBooking({
        leadId,
        moveDate,
        preferredTime: preferredTime || undefined,
        truckId,
        crewMemberIds,
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Booking created");
      router.refresh();
    });
  }

  return (
    <FieldGroup className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <Field className="w-40">
          <FieldLabel htmlFor="book-date">Move date</FieldLabel>
          <Input
            id="book-date"
            type="date"
            value={moveDate}
            onChange={(event) => setMoveDate(event.target.value)}
          />
        </Field>
        <Field className="w-40">
          <FieldLabel htmlFor="book-time">Preferred time</FieldLabel>
          <Input
            id="book-time"
            value={preferredTime}
            onChange={(event) => setPreferredTime(event.target.value)}
            placeholder="Morning"
          />
        </Field>
        <Field className="w-40">
          <FieldLabel htmlFor="book-truck">Truck</FieldLabel>
          <Select value={truckId} onValueChange={(value) => setTruckId(value || undefined)}>
            <SelectTrigger id="book-truck">
              <SelectValue placeholder="Unassigned">
                {(value: string) => trucks.find((t) => t.id === value)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {trucks.map((truck) => (
                <SelectItem key={truck.id} value={truck.id}>
                  {truck.name} ({truckLabel[truck.size]})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {crewMembers.length > 0 && (
        <Field>
          <FieldLabel>Crew</FieldLabel>
          <div className="flex flex-wrap gap-3">
            {crewMembers.map((crewMember) => (
              <label key={crewMember.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={crewMemberIds.includes(crewMember.id)}
                  onCheckedChange={() => toggleCrew(crewMember.id)}
                />
                {crewMember.name}
              </label>
            ))}
          </div>
        </Field>
      )}

      <Button size="sm" disabled={pending || !moveDate} onClick={submit}>
        {pending ? "Creating..." : "Convert to booking"}
      </Button>
    </FieldGroup>
  );
}
