import { describe, expect, it } from "vitest";

import { CREDIT_PACKS, FREE_SIGNUP_CREDITS, PLANS, getCreditPack, getPlan } from "./pricing";

describe("pricing config", () => {
  it("has exactly one free plan with a zero price", () => {
    const freePlans = PLANS.filter((p) => p.priceMonthlyCents === 0);
    expect(freePlans).toHaveLength(1);
    expect(freePlans[0]?.id).toBe("free");
  });

  it("orders plans by strictly increasing price", () => {
    const prices = PLANS.map((p) => p.priceMonthlyCents);
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  it("gives every paid plan a Stripe price env var and the free plan none", () => {
    for (const plan of PLANS) {
      if (plan.id === "free") {
        expect(plan.stripePriceEnvVar).toBeNull();
      } else {
        expect(plan.stripePriceEnvVar).toMatch(/^STRIPE_PRICE_/);
      }
    }
  });

  it("getPlan resolves a known id and throws on an unknown one", () => {
    expect(getPlan("creator").name).toBe("Creator");
    // @ts-expect-error deliberately invalid id to test the runtime guard
    expect(() => getPlan("nonexistent")).toThrow();
  });

  it("getCreditPack resolves a known id and throws on an unknown one", () => {
    expect(getCreditPack("medium").credits).toBeGreaterThan(0);
    // @ts-expect-error deliberately invalid id to test the runtime guard
    expect(() => getCreditPack("nonexistent")).toThrow();
  });

  it("orders credit packs by increasing credits and price together", () => {
    const credits = CREDIT_PACKS.map((p) => p.credits);
    const prices = CREDIT_PACKS.map((p) => p.priceCents);
    expect(credits).toEqual([...credits].sort((a, b) => a - b));
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it("keeps FREE_SIGNUP_CREDITS in sync with the handle_new_user() migration default", () => {
    // See supabase/migrations/20260101000011_functions_triggers.sql — the
    // trigger hardcodes signup_credits since SQL can't import this file.
    // Update both places together if this ever changes.
    expect(FREE_SIGNUP_CREDITS).toBe(40);
  });
});
