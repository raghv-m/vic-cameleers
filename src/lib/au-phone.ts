/**
 * Validates and normalises Australian mobile numbers. Accepts common input
 * formats (spaces, +61 prefix, leading 0) and normalises to E.164.
 */

const AU_MOBILE_LOCAL = /^04\d{8}$/;
const AU_MOBILE_INTERNATIONAL = /^61?4\d{8}$/;

function stripFormatting(value: string): string {
  return value.replace(/[\s()-]/g, "");
}

export function isValidAuMobile(value: string): boolean {
  const stripped = stripFormatting(value).replace(/^\+/, "");

  if (AU_MOBILE_LOCAL.test(stripped)) return true;
  if (stripped.startsWith("61") && AU_MOBILE_INTERNATIONAL.test(stripped)) return true;

  return false;
}

/** Normalises a validated AU mobile number to E.164 (+614XXXXXXXX). Throws if invalid. */
export function toE164AuMobile(value: string): string {
  if (!isValidAuMobile(value)) {
    throw new Error(`Not a valid Australian mobile number: ${value}`);
  }

  const stripped = stripFormatting(value).replace(/^\+/, "");

  if (stripped.startsWith("61")) return `+${stripped}`;
  return `+61${stripped.slice(1)}`;
}
