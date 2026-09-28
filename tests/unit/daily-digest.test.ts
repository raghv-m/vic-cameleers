import { render } from "@react-email/components";
import { describe, expect, it } from "vitest";

import { DailyDigestEmail } from "@/lib/ops/daily-digest-email";

describe("daily digest email", () => {
  it("renders moves, leads and reminders by reference", async () => {
    const raw = await render(
      DailyDigestEmail({
        dateLabel: "Monday 5 October",
        newLeads: [{ reference: "VC-2610-0042" }],
        movesToday: [
          { reference: "VC-2610-0040", window: "morning", truck: "6t", crew: "Sam, Alex" },
        ],
        reminders7Day: ["VC-2610-0031"],
        reminders1Day: [],
        followUpsWaiting: 2,
      }),
    );
    const html = raw.replace(/<!-- -->/g, "");
    for (const text of ["VC-2610-0042", "VC-2610-0040", "morning", "VC-2610-0031", "2 lead(s)"]) {
      expect(html).toContain(text);
    }
    expect(html).toContain("1-day: none");
  });
});
