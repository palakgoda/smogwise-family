import { HouseholdSwap } from "./types";

export const REALISTIC_WINTER_SWAPS: HouseholdSwap[] = [
  {
    id: "skip-fireplace",
    name: "Skip Wood/Coal Fireplace Nights",
    category: "Heating",
    co2SavedKgPerMonth: 36.0,
    pm25AvoidedGramsPerMonth: 450.0,
    shortDescription: "Avoid decorative or supplemental wood and coal stove burning during stagnant inversion evenings.",
    practicalTip: "A single open fireplace emits up to 40 grams of toxic soot per hour straight into neighborhood street air.",
  },
  {
    id: "transit-school-runs",
    name: "Transit/Walking for School Runs",
    category: "Transport",
    co2SavedKgPerMonth: 24.5,
    pm25AvoidedGramsPerMonth: 160.0,
    shortDescription: "Replace twice-daily short cold-engine car school runs with public transit, walking, or neighborhood walking-buses.",
    practicalTip: "Cold engines emit up to 5x more unburnt particulate matter during the first 5 minutes of driving.",
  },
  {
    id: "lower-thermostat-1c",
    name: "Lower Thermostat 1°C",
    category: "Heating",
    co2SavedKgPerMonth: 18.0,
    pm25AvoidedGramsPerMonth: 28.0,
    shortDescription: "Dial back the home heating thermostat by 1°C and layer with cozy wool blankets and thermal clothing.",
    practicalTip: "Every 1°C reduction cuts home heating fuel consumption by roughly 6–8% throughout the winter season.",
  },
  {
    id: "shift-errands-off-rush-hour",
    name: "Shift Errands Off Rush Hour",
    category: "Transport",
    co2SavedKgPerMonth: 9.5,
    pm25AvoidedGramsPerMonth: 75.0,
    shortDescription: "Combine grocery trips and errands into a single midday journey (12:30–3:00 PM) when traffic flows freely and solar mixing clears the air.",
    practicalTip: "Avoiding congested rush-hour idling dramatically cuts stop-and-go tailpipe soot in neighborhood valleys.",
  },
  {
    id: "electric-induction-kettle",
    name: "Electric Induction / Kettle Swap",
    category: "Indoor IAQ",
    co2SavedKgPerMonth: 11.0,
    pm25AvoidedGramsPerMonth: 42.0,
    shortDescription: "Use an electric kettle and induction plate for long simmering soups, teas, and boiling rather than unvented open gas burners.",
    practicalTip: "Unvented gas flames produce high indoor spikes of nitrogen dioxide (NO2) and ultrafine combustion particles.",
  },
];

// Combine all swaps with backward compatible aliases
export const WINTER_HOUSEHOLD_SWAPS: HouseholdSwap[] = [
  ...REALISTIC_WINTER_SWAPS,
  {
    id: "transit-coldstart",
    name: "Electric Metro / Carpool Swap",
    category: "Transport",
    co2SavedKgPerMonth: 18.4,
    pm25AvoidedGramsPerMonth: 142.0,
    shortDescription: "Swap 3 solo morning cold-engine car trips each week for electric metro, bus, or shared carpool.",
    practicalTip: "Bundle commute legs during the midday cleaner-air window when possible.",
  },
  {
    id: "zero-leaf-burning",
    name: "Compost Leaves (Zero Open Burn)",
    category: "Waste & Outdoor",
    co2SavedKgPerMonth: 12.0,
    pm25AvoidedGramsPerMonth: 280.0,
    shortDescription: "Compost or bag garden leaves and twigs instead of igniting roadside or backyard warmth fires.",
    practicalTip: "A single smoldering leaf pile releases as much PM2.5 into breathing height as 20 diesel trucks.",
  },
];
