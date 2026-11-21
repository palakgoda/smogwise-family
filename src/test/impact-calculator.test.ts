import { describe, it, expect } from "vitest";
import { calculateSwapImpact } from "../lib/impact/calculator";
import { WINTER_HOUSEHOLD_SWAPS } from "../lib/impact/swaps-data";

describe("Winter Household Impact Calculator", () => {
  it("returns zero impact when no swaps are selected", () => {
    const result = calculateSwapImpact([]);
    expect(result.monthlyCo2SavedKg).toBe(0);
    expect(result.monthlyPm25AvoidedGrams).toBe(0);
    expect(result.activeSwaps).toHaveLength(0);
    expect(result.neighborhoodEmissionsStory).toContain("No sustainable household swaps");
  });

  it("calculates exact single swap metrics", () => {
    const result = calculateSwapImpact(["transit-coldstart"]);
    expect(result.monthlyCo2SavedKg).toBe(18.4);
    expect(result.monthlyPm25AvoidedGrams).toBe(142.0);
    expect(result.activeSwaps).toHaveLength(1);
    expect(result.neighborhoodEmissionsStory).toContain("18.4 kg of CO2");
  });

  it("aggregates multiple swaps and formats community story", () => {
    const result = calculateSwapImpact(["transit-coldstart", "zero-leaf-burning"]);
    expect(result.monthlyCo2SavedKg).toBe(18.4 + 12.0);
    expect(result.monthlyPm25AvoidedGrams).toBe(142.0 + 280.0);
    expect(result.activeSwaps).toHaveLength(2);
    expect(result.neighborhoodEmissionsStory).toContain("2 sustainable winter habits");
  });
});

