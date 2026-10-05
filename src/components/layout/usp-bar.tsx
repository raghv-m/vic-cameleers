import { cn } from "cn";

import { business } from "@/config/business";

/**
 * One-line strip above the header with the facts people compare removalists on. Every item comes
 * from config and is verified: no "licensed" or "insured" until business.claims says so (CLAUDE.md
 * section 3). Scrolls away with the page; the sticky header keeps the phone and quote button.
 */
export function UspBar() {
  const items = [
    business.fleet.map((truck) => truck.label.replace(" truck", "")).join(" & ") + " trucks",
    `${business.hourlyRateShort}, ${business.minimumHours} hr minimum`,
    business.claims.isLicensed && business.claims.isFullyInsured ? "Licensed & insured" : null,
    business.responsePromise,
    `Melbourne-wide from ${business.baseSuburb.replace(" VIC", "")}`,
  ].filter((item): item is string => Boolean(item));

  return (
    <div className="bg-navy-900 text-sand-50">
      <ul
        aria-label="Why Vic Cameleers"
        className="mx-auto flex max-w-7xl items-center justify-center gap-x-5 overflow-hidden px-4 py-2 text-[0.8125rem] font-semibold whitespace-nowrap sm:px-6 lg:px-8"
      >
        {items.map((item, index) => (
          <li
            key={item}
            className={cn(
              "before:text-terracotta-400 items-center before:mr-5 before:content-['•'] first:before:hidden",
              // Phones get the first two; the rest join as the screen widens.
              index < 2 ? "flex" : index < 3 ? "hidden sm:flex" : "hidden lg:flex",
            )}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
