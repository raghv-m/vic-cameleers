import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "cn";

import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbListJsonLd, type BreadcrumbItem } from "@/lib/structured-data";

/**
 * Visible breadcrumb trail plus its matching BreadcrumbList JSON-LD, so the two can never
 * disagree. Home is prepended automatically; the last item is the current page.
 */
export function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  const trail = [{ name: "Home", path: "/" }, ...items];

  return (
    <>
      <JsonLd data={breadcrumbListJsonLd(items)} />
      <nav aria-label="Breadcrumb" className={cn("text-muted-foreground mb-6 text-sm", className)}>
        <ol className="flex flex-wrap items-center gap-1">
          {trail.map((item, index) => {
            const isCurrent = index === trail.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                {isCurrent ? (
                  <span aria-current="page" className="text-foreground">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className="hover:text-foreground hover:underline">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
