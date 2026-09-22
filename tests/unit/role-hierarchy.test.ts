import { describe, expect, it } from "vitest";

import { ROLE_HIERARCHY, roleSatisfies } from "@/lib/role-hierarchy";

describe("roleSatisfies", () => {
  it("lets a role satisfy its own rank", () => {
    for (const role of ROLE_HIERARCHY) {
      expect(roleSatisfies(role, role)).toBe(true);
    }
  });

  it("lets a higher-privilege role satisfy a lower minimum", () => {
    expect(roleSatisfies("SUPER_ADMIN", "CREW")).toBe(true);
    expect(roleSatisfies("SUPER_ADMIN", "DISPATCHER")).toBe(true);
    expect(roleSatisfies("OPERATIONS_MANAGER", "SALES")).toBe(true);
  });

  it("refuses a lower-privilege role against a higher minimum", () => {
    expect(roleSatisfies("CREW", "SUPER_ADMIN")).toBe(false);
    expect(roleSatisfies("SUPPORT", "OPERATIONS_MANAGER")).toBe(false);
    expect(roleSatisfies("SALES", "DISPATCHER")).toBe(false);
  });

  it("orders the hierarchy exactly as CLAUDE.md section 10 lists it", () => {
    expect(ROLE_HIERARCHY).toEqual([
      "SUPER_ADMIN",
      "OPERATIONS_MANAGER",
      "DISPATCHER",
      "SALES",
      "FINANCE",
      "SUPPORT",
      "CREW",
    ]);
  });
});
