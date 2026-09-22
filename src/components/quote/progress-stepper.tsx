import { Check } from "lucide-react";

const stepLabels = ["Where & when", "Property", "What's moving", "Extras", "Contact"];

export function ProgressStepper({ currentStep }: { currentStep: number }) {
  return (
    <ol
      className="mb-8 flex items-center justify-between gap-1 sm:gap-2"
      aria-label="Quote progress"
    >
      {stepLabels.map((label, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <li key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <span
              aria-current={isCurrent ? "step" : undefined}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                isComplete
                  ? "bg-primary text-primary-foreground"
                  : isCurrent
                    ? "border-primary text-primary border-2"
                    : "border-border text-muted-foreground border"
              }`}
            >
              {isComplete ? <Check className="h-3.5 w-3.5" /> : stepNumber}
            </span>
            <span
              className={`hidden text-center text-xs sm:block ${
                isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
