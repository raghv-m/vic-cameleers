/**
 * Melbourne local time without a timezone library: Intl knows the Australia/Melbourne rules,
 * including daylight saving (AEST UTC+10, AEDT UTC+11).
 */

export const MELBOURNE_TZ = "Australia/Melbourne";

/** Melbourne's offset from UTC in minutes at a given instant (600 or 660). */
export function melbourneOffsetMinutes(at: Date = new Date()): number {
  const name =
    new Intl.DateTimeFormat("en-AU", { timeZone: MELBOURNE_TZ, timeZoneName: "shortOffset" })
      .formatToParts(at)
      .find((part) => part.type === "timeZoneName")?.value ?? "GMT+10";
  const match = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(name);
  if (!match) return 600;
  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3] ?? 0));
}

/** Calendar parts of `at` as seen in Melbourne. */
export function melbourneParts(at: Date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-AU", {
      timeZone: MELBOURNE_TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(at)
      .map((part) => [part.type, part.value]),
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
  };
}

/**
 * The UTC instants where a Melbourne calendar day starts and ends, `offsetDays` from today
 * (0 = today, 1 = tomorrow). Use as [start, end) in queries.
 */
export function melbourneDayRange(
  offsetDays = 0,
  now: Date = new Date(),
): { start: Date; end: Date } {
  const { year, month, day } = melbourneParts(now);
  const startFor = (d: number) => {
    const guess = new Date(Date.UTC(year, month - 1, d));
    // Midnight Melbourne = midnight UTC minus the offset in force at that moment.
    return new Date(guess.getTime() - melbourneOffsetMinutes(guess) * 60_000);
  };
  return { start: startFor(day + offsetDays), end: startFor(day + offsetDays + 1) };
}
