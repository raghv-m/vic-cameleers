import type { QuoteSubmissionInput } from "@/lib/validation/quote";

type Params = Record<string, string | string[] | undefined>;

const SIZES = ["studio", "1bed", "2bed", "3bed", "4plus"] as const;
const BEDROOMS: Record<(typeof SIZES)[number], number> = {
  studio: 1,
  "1bed": 1,
  "2bed": 2,
  "3bed": 3,
  "4plus": 4,
};

function one(params: Params, key: string): string | undefined {
  const value = params[key];
  return typeof value === "string" ? value : undefined;
}

/** Free text from the URL, trimmed, stripped of control characters and capped. */
function text(value: string | undefined, max = 120): string | undefined {
  const cleaned = value
    ?.replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, max);
  return cleaned || undefined;
}

/**
 * Turns the homepage estimator's link (/quote?type=&size=&stairs=&packing=&from=&to=&date=) and
 * a suburb page's link (/quote?suburb=<slug>) into starting values for the quote form. Every
 * value is checked against an allow-list or shape; anything unexpected is ignored, so a crafted
 * URL can only pre-fill what a visitor could type themselves.
 */
export function prefillFromSearchParams(
  params: Params,
  findSuburb: (slug: string) => { name: string; postcode: string } | undefined,
): Partial<QuoteSubmissionInput> {
  const values: Partial<QuoteSubmissionInput> = {};

  const type = one(params, "type");
  const size = one(params, "size");
  if (type === "office") {
    values.propertyType = "OFFICE";
    values.propertySize = "office";
  } else if (type === "item") {
    values.propertyType = "SINGLE_ITEM";
    values.propertySize = "singleItem";
  } else if (type === "home" || SIZES.includes(size as (typeof SIZES)[number])) {
    values.propertyType = "HOUSE";
    if (SIZES.includes(size as (typeof SIZES)[number])) {
      values.propertySize = size as (typeof SIZES)[number];
    }
  }

  const stairs = Number(one(params, "stairs"));
  if (Number.isInteger(stairs) && stairs >= 1 && stairs <= 3) {
    values.pickupAccess = {
      floorLevel: String(stairs),
      hasLift: false,
      stairsCount: stairs,
      longCarry: false,
      parkingNotes: "",
    };
  }

  if (one(params, "packing") === "1") {
    const bedrooms = BEDROOMS[(values.propertySize ?? "2bed") as (typeof SIZES)[number]] ?? 2;
    values.extras = {
      packing: true,
      packingBedrooms: bedrooms,
      unpacking: false,
      disassembly: false,
      boxesAndMaterials: false,
    };
  }

  const suburbSlug = one(params, "suburb");
  const suburb = suburbSlug ? findSuburb(suburbSlug) : undefined;
  const from = text(one(params, "from"));
  const to = text(one(params, "to"));
  if (suburb) values.pickupAddress = `${suburb.name} VIC ${suburb.postcode}`;
  else if (from) values.pickupAddress = from;
  if (to) values.dropoffAddress = to;

  const date = one(params, "date");
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) values.moveDate = date;

  return values;
}
