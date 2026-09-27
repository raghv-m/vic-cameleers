import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

/**
 * Vic Cameleers buttons. 4px radius, Barlow semibold, no generic scale-on-hover: the primary CTA
 * gets a hazard-stripe sheen, trailing arrows (data-icon="inline-end") nudge forward, and every
 * button presses down 1px. Focus uses the global brand ring (globals.css).
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm border-2 border-transparent font-semibold tracking-[0.01em] whitespace-nowrap transition-[background-color,border-color,color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none select-none active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-progress aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg[data-icon=inline-end]]:transition-transform [&_svg[data-icon=inline-end]]:duration-150 hover:[&_svg[data-icon=inline-end]]:translate-x-1",
  {
    variants: {
      variant: {
        default: "vc-hazard bg-terracotta-600 text-sand-50 hover:bg-terracotta-700",
        navy: "bg-navy-900 text-sand-50 hover:bg-navy-700",
        secondary:
          "border-navy-900 bg-transparent text-navy-900 hover:bg-navy-900 hover:text-sand-50",
        onNavy: "border-sand-200 bg-transparent text-sand-50 hover:bg-sand-50 hover:text-navy-900",
        outline: "border-input bg-card text-foreground hover:bg-muted aria-expanded:bg-muted",
        ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted",
        destructive: "bg-destructive text-sand-50 hover:bg-destructive/90",
        link: "border-0 px-0 text-terracotta-600 underline decoration-2 underline-offset-4 hover:text-terracotta-700",
      },
      size: {
        default: "h-10 px-4 text-sm",
        xs: "h-7 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 text-[0.8125rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 px-5 text-base",
        xl: "h-14 px-6 text-[1.0625rem]",
        icon: "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
