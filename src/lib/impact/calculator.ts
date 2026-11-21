import { HouseholdSwap, SwapImpactSummary } from "./types";
import { REALISTIC_WINTER_SWAPS, WINTER_HOUSEHOLD_SWAPS } from "./swaps-data";

export interface WinterSwapImpactResult {
  monthlyCo2SavedKg: number;
  monthlyPm25AvoidedGrams: number;
  co2SavedKg: number;              // Alias for direct impact access
  pm25AvoidedGrams: number;        // Alias for direct impact access
  activeSwaps: HouseholdSwap[];
  neighborhoodEmissionsStory: string;
}

/**
 * Pure function computing monthly CO2 and PM2.5 savings for realistic winter swaps.
 *
 * Supported realistic winter swaps:
 * - "skip-fireplace": Skipping wood/coal fireplace nights
 * - "transit-school-runs": Replacing car school-runs with transit/walking
 * - "lower-thermostat-1c": Lowering thermostat 1°C
 * - "shift-errands-off-rush-hour": Shifting errands off rush hour
 * - "electric-induction-kettle": Using electric induction/kettle instead of open gas simmering
 */
export function calculateWinterSwapImpact(
  swaps: string[] | HouseholdSwap[]
): WinterSwapImpactResult {
  if (!swaps || swaps.length === 0) {
    return {
      monthlyCo2SavedKg: 0,
      monthlyPm25AvoidedGrams: 0,
      co2SavedKg: 0,
      pm25AvoidedGrams: 0,
      activeSwaps: [],
      neighborhoodEmissionsStory:
        "No sustainable household swaps selected yet. Choosing just one swap can prevent tens to hundreds of grams of toxic soot from lingering on your street.",
    };
  }

  const activeSwaps: HouseholdSwap[] = [];
  let totalCo2 = 0;
  let totalPm25 = 0;

  for (const item of swaps) {
    if (typeof item === "string") {
      const match = WINTER_HOUSEHOLD_SWAPS.find((s) => s.id === item);
      if (match) {
        activeSwaps.push(match);
        totalCo2 += match.co2SavedKgPerMonth;
        totalPm25 += match.pm25AvoidedGramsPerMonth;
      }
    } else if (item && typeof item === "object") {
      activeSwaps.push(item);
      totalCo2 += item.co2SavedKgPerMonth || 0;
      totalPm25 += item.pm25AvoidedGramsPerMonth || 0;
    }
  }

  const roundedCo2 = Math.round(totalCo2 * 10) / 10;
  const roundedPm25 = Math.round(totalPm25 * 10) / 10;

  let neighborhoodEmissionsStory = "";
  if (activeSwaps.length === 0) {
    neighborhoodEmissionsStory =
      "No recognized winter swaps selected. Choose from our verified winter catalog to measure neighborhood benefits.";
  } else {
    neighborhoodEmissionsStory = `By adopting ${activeSwaps.length} sustainable winter habit${
      activeSwaps.length > 1 ? "s" : ""
    }, your household prevents ${roundedPm25} grams of toxic PM2.5 soot and cuts ${roundedCo2} kg of CO2 monthly. During winter inversions, this directly prevents concentrated smoke from settling into ground-level breathing air where children and elderly neighbors walk.`;
  }

  return {
    monthlyCo2SavedKg: roundedCo2,
    monthlyPm25AvoidedGrams: roundedPm25,
    co2SavedKg: roundedCo2,
    pm25AvoidedGrams: roundedPm25,
    activeSwaps,
    neighborhoodEmissionsStory,
  };
}

// Backward compatibility alias
export const calculateSwapImpact = calculateWinterSwapImpact;
