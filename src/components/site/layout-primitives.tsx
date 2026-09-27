import { cn } from "cn";

/**
 * Layout primitives shared by every public section, so spacing, width and heading hierarchy are
 * decided once. Sections compose these instead of restating max-widths and paddings.
 */

export function Container({
  className,
  children,
  width = "wide",
}: {
  className?: string;
  children: React.ReactNode;
  /** wide = page grid, text = long-form reading width. */
  width?: "wide" | "text";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        width === "wide" ? "max-w-7xl" : "max-w-3xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Section heading block: an optional manifest index ("02 / What we move"), a stencil headline at
 * one of two sizes, and an optional lede capped at reading width. Only the homepage stops use the
 * index, so numbering always means "stop on the route".
 */
export function SectionHeader({
  index,
  title,
  lede,
  as: Heading = "h2",
  size = "lg",
  tone = "light",
  className,
  id,
}: {
  index?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  as?: "h1" | "h2";
  size?: "xl" | "lg" | "md";
  tone?: "light" | "dark";
  className?: string;
  id?: string;
}) {
  return (
    <header className={cn("max-w-3xl", className)}>
      {index && (
        <p
          className={cn(
            "manifest-index mb-4 flex items-center gap-3",
            tone === "dark" ? "text-kraft-400" : "text-terracotta-600",
          )}
        >
          <span aria-hidden="true" className="h-0.5 w-8 bg-current" />
          {index}
        </p>
      )}
      <Heading
        id={id}
        className={cn(
          "font-headline",
          size === "xl" && "display-xl",
          size === "lg" && "display-lg",
          size === "md" && "display-md",
          tone === "dark" ? "text-sand-50" : "text-navy-900",
        )}
      >
        {title}
      </Heading>
      {lede && (
        <p
          className={cn(
            "mt-5 max-w-[60ch] text-lg leading-relaxed",
            tone === "dark" ? "text-sand-200" : "text-muted-600",
          )}
        >
          {lede}
        </p>
      )}
    </header>
  );
}
