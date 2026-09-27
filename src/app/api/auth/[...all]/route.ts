import { toNextJsHandler } from "better-auth/next-js";

import { getAuth } from "@/lib/auth";

// Runtime only: every call reads cookies and hits the database.
export const dynamic = "force-dynamic";

// Built per request from the lazily created auth instance, so importing this route during
// `next build` doesn't need AUTH_SECRET or a database (see getAuth in src/lib/auth.ts).
export function GET(request: Request) {
  return toNextJsHandler(getAuth()).GET(request);
}

export function POST(request: Request) {
  return toNextJsHandler(getAuth()).POST(request);
}
