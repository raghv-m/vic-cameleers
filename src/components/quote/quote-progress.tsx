"use client";

import { cn } from "cn";

export const QUOTE_STEPS = ["Your move", "What's moving", "Your details"] as const;

/**
 * Progress as a short route: three stops joined by a line that fills in solid behind you.
 * Finished stops are buttons, so you can go back to them; the current stop is aria-current.
 */
export function QuoteProgress({
  step,
  onJump,
  disabled,
}: {
  step: number;
  onJump: (step: number) => void;
  disabled?: boolean;
}) {
  return (
    <nav aria-label="Quote progress">
      <ol className="relative grid grid-cols-3">
        {/* The route: dashed ahead, solid behind. Sits behind the stop markers. */}
        <span
          aria-hidden="true"
          className="border-kraft-400 absolute top-5 right-[16.66%] left-[16.66%] border-t-2 border-dashed"
        />
        <span
          aria-hidden="true"
          className="bg-navy-900 absolute top-[19px] left-[16.66%] h-0.5 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ width: `${((step - 1) / (QUOTE_STEPS.length - 1)) * 66.66}%` }}
        />
        {QUOTE_STEPS.map((label, index) => {
          const number = index + 1;
          const done = number < step;
          const current = number === step;
          const marker = (
            <>
              <span
                className={cn(
                  "font-stencil relative grid size-10 place-items-center rounded-sm border-2 text-xl leading-none transition-colors",
                  current && "border-terracotta-600 bg-terracotta-600 text-sand-50",
                  done && "border-navy-900 bg-navy-900 text-sand-50",
                  !current && !done && "border-kraft-400 bg-sand-50 text-muted-600",
                )}
              >
                {done ? <span aria-hidden="true">✓</span> : `0${number}`}
              </span>
              <span
                className={cn(
                  "mt-2 text-center text-[0.8125rem] leading-tight font-semibold sm:text-sm",
                  current || done ? "text-navy-900" : "text-muted-600",
                )}
              >
                {label}
                {done && <span className="sr-only"> (done, go back)</span>}
              </span>
            </>
          );
          return (
            <li
              key={label}
              className="relative flex flex-col items-center"
              aria-current={current ? "step" : undefined}
            >
              {done ? (
                <button
                  type="button"
                  onClick={() => onJump(number)}
                  disabled={disabled}
                  className="group hover:[&>span:first-child]:bg-navy-700 flex min-h-11 flex-col items-center rounded-sm"
                >
                  {marker}
                </button>
              ) : (
                <div className="flex flex-col items-center">{marker}</div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
