"use client";

import { cn } from "cn";

/**
 * Rolls each digit like a truck odometer when the value changes. Digits sit in columns that
 * translate (transform only), in tabular figures so nothing shifts sideways. Screen readers get
 * the plain value once via the visually hidden copy; the columns are hidden from them. Under
 * reduced motion the transition is removed and digits simply change.
 */
export function Odometer({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn("tabular relative inline-flex overflow-hidden leading-none", className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="inline-flex">
        {value.split("").map((char, index) =>
          /\d/.test(char) ? (
            <span key={index} className="relative inline-block h-[1em] w-[0.62em] overflow-hidden">
              <span
                className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{ transform: `translateY(-${Number(char)}em)` }}
              >
                {"0123456789".split("").map((digit) => (
                  <span key={digit} className="block h-[1em] text-center">
                    {digit}
                  </span>
                ))}
              </span>
            </span>
          ) : (
            <span key={index} className="inline-block">
              {char === " " ? " " : char}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
