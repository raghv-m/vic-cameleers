import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "cn";
import { PlusIcon } from "lucide-react";

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-navy-900/20 border-b", className)}
      {...props}
    />
  );
}

function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger text-navy-900 hover:text-terracotta-600 **:data-[slot=accordion-trigger-icon]:text-terracotta-600 relative flex min-h-14 flex-1 items-center justify-between gap-4 py-4 text-left text-base font-bold outline-none aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-5",
          className,
        )}
        {...props}
      >
        {children}
        <PlusIcon
          data-slot="accordion-trigger-icon"
          aria-hidden="true"
          className="pointer-events-none shrink-0 transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-45 motion-reduce:transition-none"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  hiddenUntilFound = true,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    // hiddenUntilFound keeps closed panels in the server HTML (hidden="until-found"), so FAQ
    // answers are crawlable and findable with in-page search, not only present in JSON-LD.
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      hiddenUntilFound={hiddenUntilFound}
      className="data-open:animate-accordion-down data-closed:animate-accordion-up overflow-hidden text-base motion-reduce:animate-none"
      {...props}
    >
      <div
        className={cn(
          "text-ink-900 [&_a]:hover:text-foreground h-(--accordion-panel-height) max-w-[65ch] pt-0 pb-5 leading-relaxed data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
