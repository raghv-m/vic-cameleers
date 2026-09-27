import { describe, expect, it } from "vitest";

import { resolveSiteUrl, siteUrlProblem } from "@/config/site-url";

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

describe("resolveSiteUrl", () => {
  it("fails a Vercel production build with an empty or local URL", () => {
    expect(() => resolveSiteUrl({ VERCEL_ENV: "production" })).toThrow(/empty/);
    expect(() =>
      resolveSiteUrl({ VERCEL_ENV: "production", NEXT_PUBLIC_SITE_URL: "http://localhost:3000" }),
    ).toThrow();
  });

  it("uses the configured URL on production, trailing slash removed", () => {
    expect(
      resolveSiteUrl({
        VERCEL_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://vic-cameleers.vercel.app/",
      }),
    ).toBe("https://vic-cameleers.vercel.app");
  });

  it("falls back to the branch URL on a preview build without a usable URL", () => {
    expect(
      resolveSiteUrl({
        VERCEL_ENV: "preview",
        NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
        VERCEL_BRANCH_URL: "vic-cameleers-git-site-rebuild.vercel.app",
        VERCEL_URL: "vic-cameleers-abc123.vercel.app",
      }),
    ).toBe("https://vic-cameleers-git-site-rebuild.vercel.app");
    expect(
      resolveSiteUrl({ VERCEL_ENV: "preview", VERCEL_URL: "vic-cameleers-abc123.vercel.app" }),
    ).toBe("https://vic-cameleers-abc123.vercel.app");
  });

  it("keeps a usable configured URL on preview", () => {
    expect(
      resolveSiteUrl({
        VERCEL_ENV: "preview",
        NEXT_PUBLIC_SITE_URL: "https://vic-cameleers.vercel.app",
        VERCEL_BRANCH_URL: "vic-cameleers-git-site-rebuild.vercel.app",
      }),
    ).toBe("https://vic-cameleers.vercel.app");
  });

  it("leaves local and CI builds on localhost", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000" })).toBe(
      "http://localhost:3000",
    );
    expect(resolveSiteUrl({})).toBe("http://localhost:3000");
  });
});
