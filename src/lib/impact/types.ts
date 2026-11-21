export interface HouseholdSwap {
  id: string;
  name: string;
  category: "Transport" | "Heating" | "Waste & Outdoor" | "Indoor IAQ";
  co2SavedKgPerMonth: number;
  pm25AvoidedGramsPerMonth: number;
  shortDescription: string;
  practicalTip: string;
}

export interface SwapImpactSummary {
  monthlyCo2SavedKg: number;
  monthlyPm25AvoidedGrams: number;
  activeSwaps: HouseholdSwap[];
  neighborhoodEmissionsStory: string;
}

