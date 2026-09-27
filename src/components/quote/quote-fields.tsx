"use client";

import { cn } from "cn";
import type { ReactNode } from "react";
import type { FieldPath } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import type { QuoteSubmissionInput } from "@/lib/validation/quote";

export type QuoteFieldName = FieldPath<QuoteSubmissionInput>;

/** Stable DOM id for a form path: "pickupAccess.floorLevel" becomes "pickupAccess-floorLevel". */
export function fieldId(name: string): string {
  return name.replaceAll(".", "-");
}

/** The current error message for a field, or undefined. */
export function useFieldError(name: QuoteFieldName): string | undefined {
  const { getFieldState, formState } = useFormContext<QuoteSubmissionInput>();
  return getFieldState(name, formState).error?.message;
}

/** The error line under a field. Its id is what the control's aria-describedby points at. */
export function FieldMessage({ name, message }: { name: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={`${fieldId(name)}-error`}
      className="text-danger-700 mt-1.5 flex gap-1.5 text-sm font-semibold"
    >
      <span aria-hidden="true">!</span>
      {message}
    </p>
  );
}

/**
 * Label, control, hint and error for one field, with the ARIA wiring done once: the control gets
 * aria-invalid and an aria-describedby that names the hint and the error, so a screen reader
 * reads the problem when the field is focused.
 */
export function QuoteField({
  name,
  label,
  hint,
  optional,
  className,
  children,
}: {
  name: QuoteFieldName;
  label: string;
  hint?: ReactNode;
  optional?: boolean;
  className?: string;
  children: (control: {
    id: string;
    "aria-invalid": boolean | undefined;
    "aria-describedby": string | undefined;
  }) => ReactNode;
}) {
  const error = useFieldError(name);
  const id = fieldId(name);
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={id} className="text-navy-900 mb-1.5 text-sm font-semibold">
        {label}
        {optional && <span className="text-muted-600 font-normal"> (optional)</span>}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy || undefined,
      })}
      {hint && (
        <p id={`${id}-hint`} className="text-muted-600 mt-1.5 text-sm">
          {hint}
        </p>
      )}
      <FieldMessage name={name} message={error} />
    </div>
  );
}

/** A numbered block inside a step, e.g. "A. Pickup". Keeps long steps scannable. */
export function StepBlock({
  index,
  title,
  description,
  children,
  className,
}: {
  index: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-navy-900/20 border-t pt-6", className)}>
      <h3 className="text-navy-900 flex items-baseline gap-3 text-lg font-bold">
        <span className="manifest-index text-terracotta-600">{index}</span>
        {title}
      </h3>
      {description && <div className="text-muted-600 mt-1 text-sm">{description}</div>}
      <div className="mt-4 space-y-5">{children}</div>
    </section>
  );
}
