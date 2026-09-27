import { cn } from "cn";

import { MeasureRule } from "@/components/brand/signage";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Container } from "@/components/site/layout-primitives";
import type { BreadcrumbItem } from "@/lib/structured-data";

/**
 * The top of every inner page: breadcrumbs, a small label, the stencil page title, a lede, and an
 * optional visual on the right (photo, graphic or tool). One component, so every inner page opens
 * the same way and headings stay in order (this renders the page's only h1).
 */
export function PageHeader({
  breadcrumbs,
  label,
  title,
  lede,
  actions,
  aside,
  className,
}: {
  breadcrumbs: BreadcrumbItem[];
  label?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-navy-900 relative border-b-2", className)}>
      <Container className="pt-4 pb-10 sm:pb-14">
        <Breadcrumbs items={breadcrumbs} />
        <div className={cn("grid gap-8", aside && "lg:grid-cols-12 lg:items-end lg:gap-12")}>
          <div className={cn(aside && "lg:col-span-7")}>
            {label && (
              <p className="manifest-index text-terracotta-600 mb-4 flex items-center gap-3">
                <span aria-hidden="true" className="h-0.5 w-8 bg-current" />
                {label}
              </p>
            )}
            <h1 className="font-headline text-navy-900 display-lg max-w-[18ch]">{title}</h1>
            {lede && (
              <div className="text-ink-900 mt-5 max-w-[60ch] text-lg leading-relaxed">{lede}</div>
            )}
            {actions && <div className="mt-7 flex flex-col gap-3 sm:flex-row">{actions}</div>}
          </div>
          {aside && <div className="lg:col-span-5">{aside}</div>}
        </div>
      </Container>
      <MeasureRule ticks={96} className="text-navy-900/30 absolute bottom-0 h-2" />
    </section>
  );
}
