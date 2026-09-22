import { describe, expect, it } from "vitest";

import { LEAD_STATUS_LABEL, LEAD_STATUS_ORDER, requiresLostReason } from "@/lib/lead-status";

describe("requiresLostReason", () => {
  it("requires a reason only for LOST", () => {
    for (const status of LEAD_STATUS_ORDER) {
      expect(requiresLostReason(status)).toBe(status === "LOST");
    }
  });
});

describe("LEAD_STATUS_LABEL", () => {
  it("has a label for every status in the pipeline order", () => {
    for (const status of LEAD_STATUS_ORDER) {
      expect(LEAD_STATUS_LABEL[status]).toBeTruthy();
    }
  });
});
