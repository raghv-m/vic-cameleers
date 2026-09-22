/**
 * Generates readable lead reference numbers like VC-2610-0042. The prefix
 * is year+month (YYMM), the suffix is a random 4-digit segment. Prisma's
 * unique constraint on Lead.referenceNumber is the actual collision guard;
 * this just needs to be readable and low-collision, not cryptographically
 * unique on its own.
 */
export function generateReferenceNumber(now: Date = new Date()): string {
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const suffix = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return `VC-${year}${month}-${suffix}`;
}
