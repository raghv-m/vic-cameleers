import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/env.server", () => ({ serverEnv: { AUTH_SECRET: "test-secret-for-unsubscribe" } }));

const { marketingEnvelope, verifyUnsubscribeToken } = await import("@/lib/email/unsubscribe");

function tokenFrom(url: string): { c: string; t: string } {
  const params = new URL(url).searchParams;
  return { c: params.get("c") ?? "", t: params.get("t") ?? "" };
}

describe("unsubscribe links", () => {
  it("signs a link that verifies for that customer only", () => {
    const envelope = marketingEnvelope({ id: "cust_1", emailOptOutAt: null });
    expect(envelope).not.toBeNull();
    const { c, t } = tokenFrom(envelope!.unsubscribeUrl);
    expect(c).toBe("cust_1");
    expect(verifyUnsubscribeToken("cust_1", t)).toBe(true);
    expect(verifyUnsubscribeToken("cust_2", t)).toBe(false);
    expect(verifyUnsubscribeToken("cust_1", `${t}x`)).toBe(false);
    expect(verifyUnsubscribeToken("cust_1", "")).toBe(false);
  });

  it("adds RFC 8058 one-click headers pointing at the API route", () => {
    const envelope = marketingEnvelope({ id: "cust_1", emailOptOutAt: null })!;
    expect(envelope.headers["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
    expect(envelope.headers["List-Unsubscribe"]).toMatch(/^<.+\/api\/unsubscribe\?c=cust_1&t=.+>$/);
  });

  it("returns nothing for a customer who already opted out", () => {
    expect(marketingEnvelope({ id: "cust_1", emailOptOutAt: new Date() })).toBeNull();
  });
});
