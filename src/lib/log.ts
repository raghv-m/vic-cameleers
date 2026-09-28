import "server-only";

import { headers } from "next/headers";

/**
 * Structured logs: one JSON object per line, picked up by Vercel's log pipeline (and Sentry, once
 * configured). Every entry has a named `event` rather than free text, so it can be searched and
 * alerted on.
 *
 * PII rule: never pass names, phone numbers, emails, addresses or free-text notes in `fields`.
 * Use ids and reference numbers (lead id, quote reference, staff user id) instead. Errors are
 * reduced to name, code and a short message.
 */

type Level = "info" | "warn" | "error";
type Fields = Record<string, string | number | boolean | null | undefined>;

/** The id the proxy stamped on this request (src/proxy.ts), or null outside a request. */
export async function currentRequestId(): Promise<string | null> {
  try {
    return (await headers()).get("x-request-id");
  } catch {
    return null; // not in a request scope (build, scripts)
  }
}

export function errorFields(error: unknown): Fields {
  if (error instanceof Error) {
    const code = (error as { code?: unknown }).code;
    return {
      errorName: error.name,
      errorCode: typeof code === "string" || typeof code === "number" ? code : undefined,
      errorMessage: error.message.slice(0, 200),
    };
  }
  return { errorMessage: String(error).slice(0, 200) };
}

function write(level: Level, event: string, fields: Fields = {}) {
  const entry = JSON.stringify({ level, event, time: new Date().toISOString(), ...fields });
  if (level === "error") console.error(entry);
  else if (level === "warn") console.warn(entry);
  else console.log(entry);
}

export const log = {
  info: (event: string, fields?: Fields) => write("info", event, fields),
  warn: (event: string, fields?: Fields) => write("warn", event, fields),
  error: (event: string, error: unknown, fields?: Fields) =>
    write("error", event, { ...fields, ...errorFields(error) }),
};
