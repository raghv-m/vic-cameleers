import { describe, expect, it } from "vitest";

import { FAQ_CATEGORIES, faqs } from "@/config/faq";

describe("faq content", () => {
  it("has unique, URL-safe ids", () => {
    const ids = faqs.map((faq) => faq.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("only relates to questions that exist, never to itself", () => {
    const ids = new Set(faqs.map((faq) => faq.id));
    for (const faq of faqs) {
      for (const rel of faq.related ?? []) {
        expect(ids.has(rel), `${faq.id} -> ${rel}`).toBe(true);
        expect(rel).not.toBe(faq.id);
      }
    }
  });

  it("puts every question in a known category, and every category has questions", () => {
    for (const faq of faqs) expect(FAQ_CATEGORIES).toContain(faq.category);
    for (const category of FAQ_CATEGORIES) {
      expect(faqs.some((faq) => faq.category === category)).toBe(true);
    }
  });

  it("keeps the questions suburb pages reuse by exact text", () => {
    const questions = faqs.map((faq) => faq.question);
    expect(questions).toContain("What's your minimum charge?");
    expect(questions).toContain("Do you charge more for stairs or a lift?");
  });

  it("never claims things the business hasn't confirmed", () => {
    const text = faqs
      .map((faq) => `${faq.question} ${faq.answer}`)
      .join(" ")
      .toLowerCase();
    for (const banned of [
      "fully insured",
      "licensed",
      "accredited",
      "police check",
      "subcontract",
      "—",
    ]) {
      expect(text).not.toContain(banned);
    }
  });
});
