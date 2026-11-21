import { describe, it, expect } from "vitest";
import { AssistantResponseSchema } from "../lib/ai/schema";
import { generateDeterministicFallback } from "../lib/ai/fallback";
import { calculateSwapImpact } from "../lib/impact/calculator";

describe("AssistantResponseSchema & Fallback Verification", () => {
  const validMock = {
    headlineSummary: "Severe inversion trapping smoke today.",
    inversionExplanation: "Cold surface air cannot rise.",
    dailyRoutine: [
      {
        timeBlock: "Morning" as const,
        actionTitle: "Seal windows",
        guidance: "Keep windows closed during morning rush.",
        directImpact: "Reduces peak PM2.5 inhalation by 70%.",
      },
      {
        timeBlock: "Midday Clean Window" as const,
        actionTitle: "Flush indoor air",
        guidance: "Open windows for 15 minutes.",
        directImpact: "Brings in 40% cleaner air.",
      },
      {
        timeBlock: "Evening" as const,
        actionTitle: "Kitchen exhaust",
        guidance: "Run exhaust fan on high while cooking.",
        directImpact: "Prevents indoor NO2 spike.",
      },
      {
        timeBlock: "Night" as const,
        actionTitle: "Bedroom clean zone",
        guidance: "Run air purifier on low.",
        directImpact: "Keeps sleeping PM2.5 under 20 µg/m³.",
      },
    ],
    indoorAirHacks: [
      {
        title: "Damp dusting",
        costTier: "Free" as const,
        steps: "Wipe surfaces with damp microfiber.",
        whyItWorks: "Captures soot without resuspending dust.",
      },
      {
        title: "Rolled towel draft stopper",
        costTier: "Free" as const,
        steps: "Place rolled towel under front door.",
        whyItWorks: "Blocks cold dirty outdoor air drafts.",
      },
      {
        title: "DIY Box-Fan Filter",
        costTier: "Low-Cost" as const,
        steps: "Attach MERV-13 filter to box fan.",
        whyItWorks: "Delivers high CADR for low cost.",
      },
    ],
    sustainableAlternatives: [
      {
        habitSwap: "Electric Metro",
        practicalTip: "Take metro instead of solo driving.",
        directCommunityImpact: "Prevents 142g of soot from entering street canyon.",
      },
      {
        habitSwap: "Compost Leaves",
        practicalTip: "Bag leaves instead of open burning.",
        directCommunityImpact: "Eliminates direct acrid smoke at breathing level.",
      },
    ],
    communityShareMessage: "Hey neighbors, cleanly vent between 12-2pm today! 🌿",
  };

  it("successfully validates compliant schema", () => {
    const parsed = AssistantResponseSchema.safeParse(validMock);
    expect(parsed.success).toBe(true);
  });

  it("fails validation if dailyRoutine has fewer than 3 items", () => {
    const invalid = {
      ...validMock,
      dailyRoutine: validMock.dailyRoutine.slice(0, 2),
    };
    const parsed = AssistantResponseSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it("fails validation if costTier is not one of Free, Low-Cost, Equipment", () => {
    const invalid = {
      ...validMock,
      indoorAirHacks: [
        {
          ...validMock.indoorAirHacks[0],
          costTier: "Expensive", // Invalid enum
        },
        ...validMock.indoorAirHacks.slice(1),
      ],
    };
    const parsed = AssistantResponseSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it("deterministic fallback always generates a 100% schema-compliant output", () => {
    const mockReq = {
      location: { city: "New Delhi", country: "India" },
      airQuality: {
        usAqi: 312,
        pm25: 262,
        pm10: 380,
        no2: 78,
        severityLabel: "Hazardous",
        inversionRisk: "High",
        cleanestWindow: "12:30 PM – 3:30 PM",
        peakSmogWindow: "6:30 PM – 9:00 AM",
      },
      weather: { tempC: 13, windKmh: 4 },
      familyProfile: {
        householdGroup: "Family with Toddler & Grandparent",
        homeType: "Apartment",
        heatingSource: "Electric Heater",
        primaryCommute: "Metro",
        customNotes: "Grandparent has mild asthma",
      },
      selectedSwapIds: ["transit-coldstart", "zero-leaf-burning"],
    };

    const impact = calculateSwapImpact(mockReq.selectedSwapIds);
    const fallbackPlan = generateDeterministicFallback(mockReq, impact);

    const parsed = AssistantResponseSchema.safeParse(fallbackPlan);
    expect(parsed.success).toBe(true);
    expect(fallbackPlan.headlineSummary).toContain("New Delhi");
    expect(fallbackPlan.dailyRoutine.length).toBeGreaterThanOrEqual(3);
    expect(fallbackPlan.indoorAirHacks.length).toBeGreaterThanOrEqual(3);
    expect(fallbackPlan.sustainableAlternatives.length).toBeGreaterThanOrEqual(2);
  });
});

