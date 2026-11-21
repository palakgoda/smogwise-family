import { describe, it, expect } from "vitest";
import { calculateWinterSwapImpact } from "../calculator";
import { REALISTIC_WINTER_SWAPS } from "../swaps-data";

describe("calculateWinterSwapImpact Pure Function & Impact Math", () => {
  it("returns zero impact when no swaps are selected", () => {
    const result = calculateWinterSwapImpact([]);
    expect(result.monthlyCo2SavedKg).toBe(0);
    expect(result.monthlyPm25AvoidedGrams).toBe(0);
    expect(result.co2SavedKg).toBe(0);
    expect(result.pm25AvoidedGrams).toBe(0);
    expect(result.activeSwaps).toHaveLength(0);
    expect(result.neighborhoodEmissionsStory).toContain("No sustainable household swaps");
  });

  it("calculates exact impact for skipping wood/coal fireplace nights", () => {
    const result = calculateWinterSwapImpact(["skip-fireplace"]);
    expect(result.monthlyCo2SavedKg).toBe(36.0);
    expect(result.monthlyPm25AvoidedGrams).toBe(450.0);
    expect(result.co2SavedKg).toBe(36.0);
    expect(result.pm25AvoidedGrams).toBe(450.0);
    expect(result.activeSwaps[0].name).toContain("Skip Wood/Coal Fireplace");
  });

  it("calculates exact impact for replacing car school-runs with transit/walking", () => {
    const result = calculateWinterSwapImpact(["transit-school-runs"]);
    expect(result.monthlyCo2SavedKg).toBe(24.5);
    expect(result.monthlyPm25AvoidedGrams).toBe(160.0);
  });

  it("calculates exact impact for lowering thermostat 1°C", () => {
    const result = calculateWinterSwapImpact(["lower-thermostat-1c"]);
    expect(result.monthlyCo2SavedKg).toBe(18.0);
    expect(result.monthlyPm25AvoidedGrams).toBe(28.0);
  });

  it("calculates exact impact for shifting errands off rush hour", () => {
    const result = calculateWinterSwapImpact(["shift-errands-off-rush-hour"]);
    expect(result.monthlyCo2SavedKg).toBe(9.5);
    expect(result.monthlyPm25AvoidedGrams).toBe(75.0);
  });

  it("calculates exact impact for using electric induction/kettle", () => {
    const result = calculateWinterSwapImpact(["electric-induction-kettle"]);
    expect(result.monthlyCo2SavedKg).toBe(11.0);
    expect(result.monthlyPm25AvoidedGrams).toBe(42.0);
  });

  it("accurately sums all 5 realistic winter swaps together", () => {
    const allSwaps = [
      "skip-fireplace",
      "transit-school-runs",
      "lower-thermostat-1c",
      "shift-errands-off-rush-hour",
      "electric-induction-kettle",
    ];

    const result = calculateWinterSwapImpact(allSwaps);

    const expectedCo2 = 36.0 + 24.5 + 18.0 + 9.5 + 11.0; // 99.0 kg
    const expectedPm25 = 450.0 + 160.0 + 28.0 + 75.0 + 42.0; // 755.0 g

    expect(result.monthlyCo2SavedKg).toBe(expectedCo2);
    expect(result.monthlyPm25AvoidedGrams).toBe(expectedPm25);
    expect(result.activeSwaps).toHaveLength(5);
    expect(result.neighborhoodEmissionsStory).toContain("5 sustainable winter habits");
    expect(result.neighborhoodEmissionsStory).toContain("755 grams of toxic PM2.5");
  });

  it("handles custom HouseholdSwap objects passed directly", () => {
    const customSwap = {
      id: "custom-insulation",
      name: "Balcony Weatherstripping",
      category: "Indoor IAQ" as const,
      co2SavedKgPerMonth: 15.2,
      pm25AvoidedGramsPerMonth: 60.5,
      shortDescription: "Seal exterior balcony leaks",
      practicalTip: "Stops chimney draft effect",
    };

    const result = calculateWinterSwapImpact([customSwap]);
    expect(result.monthlyCo2SavedKg).toBe(15.2);
    expect(result.monthlyPm25AvoidedGrams).toBe(60.5);
    expect(result.activeSwaps).toHaveLength(1);
  });

  it("ignores unrecognized IDs without throwing an error", () => {
    const result = calculateWinterSwapImpact(["unknown-swap-id"]);
    expect(result.monthlyCo2SavedKg).toBe(0);
    expect(result.monthlyPm25AvoidedGrams).toBe(0);
    expect(result.activeSwaps).toHaveLength(0);
  });
});

