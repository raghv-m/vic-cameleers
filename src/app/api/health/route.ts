import { NextResponse } from "next/server";

import { db } from "@/lib/db";

// Always live: a cached health check would say "ok" while the database is down.
export const dynamic = "force-dynamic";

const DB_TIMEOUT_MS = 3000;

/**
 * GET /api/health: 200 when the app can reach the database, 503 when it can't (including when
 * DATABASE_URL isn't set yet). Safe to expose publicly: it reveals nothing but up/down and the
 * query time. Point an uptime monitor at it.
 */
export async function GET() {
  const started = Date.now();
  try {
    await Promise.race([
      db.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), DB_TIMEOUT_MS)),
    ]);
    return NextResponse.json(
      {
        status: "ok",
        database: "ok",
        latencyMs: Date.now() - started,
        time: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { status: "error", database: "unreachable", time: new Date().toISOString() },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
