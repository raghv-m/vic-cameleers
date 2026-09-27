import { describe, expect, it } from "vitest";

import { assertDeploySiteUrl, siteUrlProblem } from "@/config/site-url";

describe("siteUrlProblem", () => {
  it("accepts the vercel.app URL and a real domain", () => {
    expect(siteUrlProblem("https://vic-cameleers.vercel.app")).toBeNull();
    expect(siteUrlProblem("https://www.example.com.au")).toBeNull();
  });

  it("rejects empty, localhost, non-https, and malformed values", () => {
    expect(siteUrlProblem(undefined)).toMatch(/empty/);
    expect(siteUrlProblem("   ")).toMatch(/empty/);
    expect(siteUrlProblem("http://localhost:3000")).toMatch(/https/);
    expect(siteUrlProblem("https://localhost:3000")).toMatch(/localhost/);
    expect(siteUrlProblem("https://127.0.0.1")).toMatch(/127\.0\.0\.1/);
    expect(siteUrlProblem("http://vic-cameleers.vercel.app")).toMatch(/https/);
    expect(siteUrlProblem("not a url")).toMatch(/not a valid URL/);
  });
});

describe("assertDeploySiteUrl", () => {
  it("fails Vercel production and preview builds with a bad URL", () => {
    for (const VERCEL_ENV of ["production", "preview"]) {
      expect(() => assertDeploySiteUrl({ VERCEL_ENV })).toThrow(/empty/);
      expect(() =>
        assertDeploySiteUrl({
          VERCEL_ENV,
          NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
        }),
      ).toThrow();
    }
  });

  it("passes Vercel builds with the vercel.app URL", () => {
    expect(() =>
      assertDeploySiteUrl({
        VERCEL_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://vic-cameleers.vercel.app",
      }),
    ).not.toThrow();
  });

  it("leaves local and CI builds alone", () => {
    expect(() =>
      assertDeploySiteUrl({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000" }),
    ).not.toThrow();
  });
});
