"use client";

import { cn } from "cn";

const chipBase =
  "relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-sm border-2 px-3.5 text-[0.9375rem] font-semibold transition-colors duration-150 select-none has-[:focus-visible]:outline-navy-900 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50";

function chipState(selected: boolean) {
  return selected
    ? "border-navy-900 bg-navy-900 text-sand-50"
    : "border-input bg-card text-navy-900 hover:border-navy-900 active:translate-y-px";
}

/**
 * Native radio buttons styled as chips: keyboard (arrow keys), screen reader and one-thumb
 * friendly. `describedBy` points at an error or hint so it's read with the group.
 */
export function ChipGroup<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
  describedBy,
  invalid,
  hideLegend,
  className,
}: {
  legend: string;
  name: string;
  value: T | undefined;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  describedBy?: string;
  invalid?: boolean;
  hideLegend?: boolean;
  className?: string;
}) {
  return (
    <fieldset
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={className}
    >
      <legend className={cn("text-navy-900 mb-2 text-sm font-semibold", hideLegend && "sr-only")}>
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className={cn(chipBase, chipState(value === option.value))}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              // No browser form-state restore: it can tick a different chip than React's state
              // after Back/reload, and clicking an already-ticked radio never fires onChange.
              autoComplete="off"
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** A single on/off chip backed by a real checkbox. */
export function ChipToggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label htmlFor={id} className={cn(chipBase, chipState(checked))}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "grid size-4 place-items-center rounded-[2px] border-2 text-[0.625rem] leading-none",
          checked ? "border-sand-50" : "border-current",
        )}
      >
        {checked ? "✓" : ""}
      </span>
      {label}
    </label>
  );
}
