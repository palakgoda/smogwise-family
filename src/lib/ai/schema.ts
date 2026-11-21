import { z } from "zod";

/**
 * Sanitizes untrusted user customNotes:
 * - Limits length to max 200 characters
 * - Strips HTML tags (<...>)
 * - Strips ASCII control characters (0-31 except space/newline, and 127)
 */
export function sanitizeCustomNotes(input: unknown): string {
  if (typeof input !== "string") return "";
  const stripped = input
    .replace(/<[^>]*>/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
  return stripped.slice(0, 200);
}

export const AssistantResponseSchema = z.object({
  headlineSummary: z
    .string()
    .describe("1-2 sentence plain-language summary of today's winter smog risk and why it is happening."),
  inversionExplanation: z
    .string()
    .describe("Clear explanation of how today's temperature and wind affect winter smog trapping."),
  dailyRoutine: z
    .array(
      z.object({
        timeBlock: z.enum(["Morning", "Midday Clean Window", "Evening", "Night"]),
        actionTitle: z.string(),
        guidance: z.string(),
        directImpact: z
          .string()
          .describe("Exact exposure or emission impact of following this step."),
      })
    )
    .min(3)
    .max(4),
  indoorAirHacks: z
    .array(
      z.object({
        title: z.string(),
        costTier: z.enum(["Free", "Low-Cost", "Equipment"]),
        steps: z.string(),
        whyItWorks: z.string(),
      })
    )
    .min(3)
    .max(4),
  sustainableAlternatives: z
    .array(
      z.object({
        habitSwap: z.string(),
        practicalTip: z.string(),
        directCommunityImpact: z
          .string()
          .describe(
            "Plain-language explanation linking the pre-calculated PM2.5/CO2 savings to neighborhood air."
          ),
      })
    )
    .min(2)
    .max(3),
  communityShareMessage: z
    .string()
    .describe(
      "Short, friendly WhatsApp/neighborhood alert summarizing today's cleanest outdoor window and one collective action."
    ),
});

export type AssistantResponse = z.infer<typeof AssistantResponseSchema>;

export const AssistantRequestSchema = z.object({
  location: z.object({
    city: z.string().min(1, "City name is required"),
    country: z.string().default(""),
  }),
  airQuality: z.object({
    usAqi: z.number(),
    pm25: z.number(),
    pm10: z.number(),
    no2: z.number(),
    severityLabel: z.string(),
    inversionRisk: z.string(),
    cleanestWindow: z.string(),
    peakSmogWindow: z.string(),
  }),
  weather: z.object({
    tempC: z.number(),
    windKmh: z.number(),
  }),
  familyProfile: z.object({
    householdGroup: z.string().default("General Household"),
    homeType: z.string().default("Apartment"),
    heatingSource: z.string().default("Electric / Radiator"),
    primaryCommute: z.string().default("Public Transit"),
    customNotes: z
      .string()
      .optional()
      .transform((val) => sanitizeCustomNotes(val ?? "")),
  }),
  selectedSwapIds: z.array(z.string()).default([]),
});

export type AssistantRequest = z.infer<typeof AssistantRequestSchema>;
