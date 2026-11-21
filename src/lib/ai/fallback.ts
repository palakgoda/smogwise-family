import { AssistantRequest, AssistantResponse } from "./schema";
import { SwapImpactSummary } from "../impact/types";

/**
 * Deterministic fallback generator.
 * Produces accurate, safe, and grounded winter smog advice adhering strictly to AssistantResponseSchema
 * when the Gemini API key is missing, network is unavailable, or quota is rate-limited.
 */
export function buildFallbackGuidance(
  req: AssistantRequest,
  impact: SwapImpactSummary
): AssistantResponse {
  const { city } = req.location;
  const { usAqi, pm25, severityLabel, inversionRisk, cleanestWindow, peakSmogWindow } =
    req.airQuality;
  const { tempC, windKmh } = req.weather;
  const { householdGroup } = req.familyProfile;

  const co2Str = impact.monthlyCo2SavedKg.toString();
  const pm25Str = impact.monthlyPm25AvoidedGrams.toString();

  const swap1 = impact.activeSwaps[0]?.name || "Shift 3 Solo Drives to Electric Metro / Carpooling";
  const swap1Tip =
    impact.activeSwaps[0]?.practicalTip ||
    "Bundle errands into a single midday journey during the cleanest air window.";

  const swap2 =
    impact.activeSwaps[1]?.name || "Compost Leaves (Zero Open Burn)";
  const swap2Tip =
    impact.activeSwaps[1]?.practicalTip ||
    "Compost garden leaves or dispose with municipal green waste; avoid yard fires.";

  return {
    headlineSummary: `Air quality in ${city} is currently ${severityLabel} (AQI ${usAqi}, PM2.5 ${pm25} µg/m³) due to cold, stagnant winter conditions. The safest time for outdoor errands is during the midday clean-air window.`,
    inversionExplanation: `At ${tempC}°C with calm winds of ${windKmh} km/h, ${inversionRisk.toLowerCase()} thermal inversion conditions are trapping chimney smoke, vehicular exhaust, and fine particles near the ground where families breathe.`,
    dailyRoutine: [
      {
        timeBlock: "Morning",
        actionTitle: "Seal Home & Delay Heavy Outdoor Commutes",
        guidance: `Keep windows tightly latched during the morning rush. If ${householdGroup} members must go outdoors, wear a well-fitted N95/FFP2 mask and prioritize enclosed transit.`,
        directImpact: `Prevents inhaling concentrated morning soot when ground-level PM2.5 is at peak levels during the morning rush.`,
      },
      {
        timeBlock: "Midday Clean Window",
        actionTitle: `Timed Window Flush & Chores (${cleanestWindow})`,
        guidance: `Open opposite windows for 10–15 minutes to vent indoor carbon dioxide, then close them tightly before the afternoon cools down. Complete outdoor chores during this period.`,
        directImpact: `Refreshes stale indoor air with ambient air that is 30–45% cleaner than early morning or evening levels.`,
      },
      {
        timeBlock: "Evening",
        actionTitle: `Front Door Draft Stopper & Back-Burner Cooking (${peakSmogWindow})`,
        guidance: `Slide a rolled towel or draft snake along exterior door thresholds before sunset. Use the kitchen exhaust hood on high while preparing dinner.`,
        directImpact: `Blocks outdoor soot seepage and prevents indoor cooking emissions from doubling household PM2.5 levels.`,
      },
      {
        timeBlock: "Night",
        actionTitle: "Bedroom Clean-Air Zone Setup",
        guidance: `Keep bedroom doors closed to isolate sleeping areas. Run a DIY box-fan filter or air purifier on low near the head of the bed away from exterior drafts.`,
        directImpact: `Keeps overnight sleeping PM2.5 exposure consistently low, protecting lung recovery over 8 hours of sleep.`,
      },
    ],
    indoorAirHacks: [
      {
        title: "Damp-Cloth Dusting & Wet Mopping",
        costTier: "Free",
        steps: "Wipe hard floors and surfaces with a damp microfiber cloth instead of dry sweeping or dusting with a feather duster.",
        whyItWorks: "Dry sweeping flings settled toxic soot back into breathing air; damp wiping captures particles instantly on contact.",
      },
      {
        title: "Under-Door Rolled Towel Draft Stopper",
        costTier: "Free",
        steps: "Roll an old bath towel lengthwise and press it firmly against the bottom crack of your front door and balcony sliders.",
        whyItWorks: "Prevents cold, particulate-heavy outdoor air from drafting under door seals, lowering indoor infiltration by up to 25%.",
      },
      {
        title: "DIY Box-Fan Filter (Corsi-Rosenthal Minimal)",
        costTier: "Low-Cost",
        steps: "Tape a 20x20-inch MERV-13 HVAC filter onto the back intake of an ordinary box fan using painter's tape or duct tape.",
        whyItWorks: "Delivers clean air delivery rates comparable to high-end purifiers for a fraction of the cost, removing up to 80% of fine soot in minutes.",
      },
      {
        title: "Back-Burner Stove Exhaust Protocol",
        costTier: "Free",
        steps: "Cook dinner on back stove burners with the range hood fan turned on 1 minute before igniting and running for 5 minutes after finishing.",
        whyItWorks: "Vents unburnt fuel, nitrogen dioxide, and ultrafine oil droplets outdoors before they can diffuse into living spaces.",
      },
    ],
    sustainableAlternatives: [
      {
        habitSwap: swap1,
        practicalTip: swap1Tip,
        directCommunityImpact: `Cuts ${co2Str} kg of CO2 and prevents ${pm25Str} g of PM2.5 from pooling in neighborhood street canyons where neighbors walk.`,
      },
      {
        habitSwap: swap2,
        practicalTip: swap2Tip,
        directCommunityImpact:
          "Prevents concentrated acrid smoke plumes from settling into neighboring windows under low nighttime inversion heights.",
      },
    ],
    communityShareMessage: `Hey neighbors in ${city}! 🌫️ High winter smog today (AQI ${usAqi}) due to thermal inversion trapping smoke. Cleanest air window is ${cleanestWindow}. Let's keep our street cleaner by avoiding vehicle idling and open burning! 🌿`,
  };
}

// Backward compatibility alias
export const generateDeterministicFallback = buildFallbackGuidance;
