import { describe, expect, it } from "vitest";

import { leadStatusUpdateSchema } from "@/lib/validation/lead";

describe("leadStatusUpdateSchema", () => {
  it("accepts a non-LOST status with no reason", () => {
    const result = leadStatusUpdateSchema.safeParse({ leadId: "lead_1", status: "CONTACTED" });
    expect(result.success).toBe(true);
  });

  it("rejects LOST with no reason", () => {
    const result = leadStatusUpdateSchema.safeParse({ leadId: "lead_1", status: "LOST" });
    expect(result.success).toBe(false);
  });

  it("rejects LOST with a blank reason", () => {
    const result = leadStatusUpdateSchema.safeParse({
      leadId: "lead_1",
      status: "LOST",
      lostReason: "   ",
    });
    expect(result.success).toBe(false);
  });

  it("accepts LOST with a reason", () => {
    const result = leadStatusUpdateSchema.safeParse({
      leadId: "lead_1",
      status: "LOST",
      lostReason: "Went with another mover",
    });
    expect(result.success).toBe(true);
  });
});
