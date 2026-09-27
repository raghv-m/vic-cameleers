import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// These modules guard themselves with `server-only`, which throws outside a React server build.
vi.mock("server-only", () => ({}));

/**
 * Regression tests for the Vercel build failure ("Failed to collect page data for
 * /api/admin/export/bookings"): `next build` imports every route module, so nothing may validate
 * env vars, connect to the database or build auth at import time. The checks must still happen,
 * just on first use.
 */

const saved = { ...process.env };

function setEnv(values: Record<string, string | undefined>) {
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  process.env = { ...saved };
});

describe("serverEnv", () => {
  it("imports without validating, then validates on first read", async () => {
    setEnv({ DATABASE_URL: undefined, DIRECT_URL: undefined });
    const { serverEnv } = await import("@/env.server");
    expect(() => serverEnv.NODE_ENV).toThrow(/DATABASE_URL/);
  });

  it("treats an empty string as unset rather than invalid", async () => {
    setEnv({
      DATABASE_URL: "postgresql://x",
      DIRECT_URL: "postgresql://x",
      AUTH_SECRET: "",
      ADMIN_PATH: "",
    });
    const { serverEnv } = await import("@/env.server");
    expect(serverEnv.AUTH_SECRET).toBeUndefined();
    expect(serverEnv.ADMIN_PATH).toBeUndefined();
  });
});

describe("db", () => {
  it("imports without a database config, and queries reject with the config error", async () => {
    setEnv({ DATABASE_URL: undefined, DIRECT_URL: undefined });
    const { db } = await import("@/lib/db");
    // No synchronous throw at property access, so .catch() and try/await both handle it.
    const query = db.review.findMany({ where: { status: "APPROVED" } });
    await expect(query).rejects.toThrow(/DATABASE_URL/);
    await expect(db.review.count().catch(() => 0)).resolves.toBe(0);
  });
});

describe("auth", () => {
  it("imports without AUTH_SECRET, and still refuses to run without it", async () => {
    setEnv({
      DATABASE_URL: "postgresql://x",
      DIRECT_URL: "postgresql://x",
      AUTH_SECRET: undefined,
    });
    const { getAuth } = await import("@/lib/auth");
    expect(() => getAuth()).toThrow(/AUTH_SECRET is not set/);
  });
});

describe("middleware", () => {
  it("serves pages when the database isn't configured", async () => {
    setEnv({ DATABASE_URL: undefined, DIRECT_URL: undefined, ADMIN_PATH: undefined });
    const { NextRequest } = await import("next/server");
    const { middleware } = await import("@/middleware");
    const response = await middleware(new NextRequest("https://example.com/pricing"));
    expect(response.status).not.toBe(500);
    expect(response.headers.get("x-frame-options")).toBe("DENY");
  });
});
