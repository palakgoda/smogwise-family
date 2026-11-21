import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  AssistantRequestSchema,
  AssistantResponseSchema,
  sanitizeCustomNotes,
  AssistantRequest,
} from "../schema";
import { buildFallbackGuidance } from "../fallback";
import { checkRateLimit, resetRateLimits } from "../rate-limiter";
import { calculateWinterSwapImpact } from "../../impact/calculator";
import { generateSmogWisePlan } from "../gemini";

// Mock @google/genai module
vi.mock("@google/genai", () => {
  const mockGenerateContent = vi.fn();
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent,
      },
    })),
    ThinkingLevel: {
      LOW: "LOW",
      MEDIUM: "MEDIUM",
      HIGH: "HIGH",
    },
  };
});

describe("AI Schema & Sanitization", () => {
  it("sanitizes customNotes: strips HTML tags, control chars, and caps at 200 chars", () => {
    const maliciousInput =
      "<script>alert('test')</script>Hello \x00\x1FWorld! " + "A".repeat(300);
    const sanitized = sanitizeCustomNotes(maliciousInput);

    expect(sanitized).not.toContain("<script>");
    expect(sanitized).not.toContain("</script>");
    expect(sanitized).not.toContain("\x00");
    expect(sanitized).not.toContain("\x1F");
    expect(sanitized.length).toBeLessThanOrEqual(200);
    expect(sanitized.startsWith("alert('test')Hello World!")).toBe(true);
  });

  it("AssistantRequestSchema validates and transforms request data", () => {
    const rawRequest = {
      location: { city: "New Delhi", country: "India" },
      airQuality: {
        usAqi: 312,
        pm25: 262.0,
        pm10: 380.0,
        no2: 78.0,
        severityLabel: "Hazardous",
        inversionRisk: "High",
        cleanestWindow: "12:30 PM – 2:30 PM",
        peakSmogWindow: "7:00 PM – 9:00 PM",
      },
      weather: { tempC: 13.0, windKmh: 4.0 },
      familyProfile: {
        householdGroup: "Family with Toddler",
        homeType: "Apartment",
        heatingSource: "Electric",
        primaryCommute: "Metro",
        customNotes: "<b>North facing balcony</b> with drafts.",
      },
      selectedSwapIds: ["skip-fireplace", "lower-thermostat-1c"],
    };

    const parsed = AssistantRequestSchema.parse(rawRequest);
    expect(parsed.location.city).toBe("New Delhi");
    // HTML stripped in transform
    expect(parsed.familyProfile.customNotes).toBe("North facing balcony with drafts.");
    expect(parsed.selectedSwapIds).toHaveLength(2);
  });

  it("AssistantRequestSchema rejects empty city name", () => {
    const invalid = {
      location: { city: "" },
      airQuality: { usAqi: 100, pm25: 35, pm10: 50, no2: 20, severityLabel: "Moderate", inversionRisk: "Low", cleanestWindow: "12-2", peakSmogWindow: "6-8" },
      weather: { tempC: 10, windKmh: 10 },
      familyProfile: {},
    };
    const res = AssistantRequestSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });
});

describe("In-Memory Sliding-Window Rate Limiter", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("allows requests up to the limit (15 requests per 10 minutes)", () => {
    const ip = "192.168.1.50";
    for (let i = 0; i < 15; i++) {
      const res = checkRateLimit(ip, 15, 600000);
      expect(res.allowed).toBe(true);
      expect(res.remaining).toBe(15 - (i + 1));
    }

    // 16th request should be blocked
    const blocked = checkRateLimit(ip, 15, 600000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetTimeSeconds).toBeGreaterThan(0);
  });

  it("maintains isolated rate limits across different IPs", () => {
    const ip1 = "10.0.0.1";
    const ip2 = "10.0.0.2";

    for (let i = 0; i < 15; i++) {
      checkRateLimit(ip1, 15, 600000);
    }
    // ip1 is now exhausted
    expect(checkRateLimit(ip1, 15, 600000).allowed).toBe(false);

    // ip2 should still be allowed
    const resIp2 = checkRateLimit(ip2, 15, 600000);
    expect(resIp2.allowed).toBe(true);
    expect(resIp2.remaining).toBe(14);
  });
});

describe("Deterministic Fallback Guidance", () => {
  it("buildFallbackGuidance generates a strictly schema-compliant plan using sensor metrics", () => {
    const req: AssistantRequest = {
      location: { city: "Krakow", country: "Poland" },
      airQuality: {
        usAqi: 220,
        pm25: 170.0,
        pm10: 240.0,
        no2: 60.0,
        severityLabel: "Very Unhealthy",
        inversionRisk: "High",
        cleanestWindow: "1:00 PM – 3:00 PM",
        peakSmogWindow: "6:00 PM – 8:00 PM",
      },
      weather: { tempC: -2.0, windKmh: 3.5 },
      familyProfile: {
        householdGroup: "Senior with asthma",
        homeType: "Apartment",
        heatingSource: "District Heating",
        primaryCommute: "Bus",
        customNotes: "Leaky balcony door",
      },
      selectedSwapIds: ["skip-fireplace", "transit-school-runs"],
    };

    const impact = calculateWinterSwapImpact(req.selectedSwapIds);
    const plan = buildFallbackGuidance(req, impact);

    // Schema validation
    const parsed = AssistantResponseSchema.parse(plan);
    expect(parsed.headlineSummary).toContain("Krakow");
    expect(parsed.headlineSummary).toContain("Very Unhealthy");
    expect(parsed.inversionExplanation).toContain("-2°C");
    expect(parsed.inversionExplanation).toContain("3.5 km/h");
    expect(parsed.dailyRoutine.length).toBeGreaterThanOrEqual(3);
    expect(parsed.indoorAirHacks.length).toBeGreaterThanOrEqual(3);
    expect(parsed.sustainableAlternatives.length).toBeGreaterThanOrEqual(2);
    expect(parsed.communityShareMessage).toContain("Krakow");
  });
});

describe("Gemini AI Client & Fallback Integration", () => {
  const sampleReq: AssistantRequest = {
    location: { city: "Salt Lake City", country: "USA" },
    airQuality: {
      usAqi: 165,
      pm25: 82.0,
      pm10: 110.0,
      no2: 40.0,
      severityLabel: "Unhealthy",
      inversionRisk: "High",
      cleanestWindow: "12:00 PM – 2:00 PM",
      peakSmogWindow: "6:30 PM – 8:30 PM",
    },
    weather: { tempC: 1.0, windKmh: 4.0 },
    familyProfile: {
      householdGroup: "Family with kids",
      homeType: "Single family home",
      heatingSource: "Gas furnace",
      primaryCommute: "Car",
      customNotes: "Attached garage",
    },
    selectedSwapIds: ["skip-fireplace"],
  };

  it("falls back to deterministic guidance when GEMINI_API_KEY is not configured", async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const result = await generateSmogWisePlan(sampleReq);
    expect(result.headlineSummary).toContain("Salt Lake City");
    expect(result.inversionExplanation).toContain("1°C");

    process.env.GEMINI_API_KEY = originalKey;
  });

  it("handles valid JSON returned from Gemini models.generateContent", async () => {
    process.env.GEMINI_API_KEY = "test_gemini_key";

    const mockAiResponse = {
      headlineSummary: "Cold air pool in Salt Lake Valley traps automobile exhaust.",
      inversionExplanation: "Warm air aloft prevents ground pollution from rising above the mountains.",
      dailyRoutine: [
        {
          timeBlock: "Morning",
          actionTitle: "Stay indoors during early commute",
          guidance: "Avoid outdoor running before 9 AM.",
          directImpact: "Reduces peak PM2.5 inhalation by 75%.",
        },
        {
          timeBlock: "Midday Clean Window",
          actionTitle: "Run errands between 12-2 PM",
          guidance: "Venture out during afternoon solar warming.",
          directImpact: "Takes advantage of 40% cleaner outdoor air.",
        },
        {
          timeBlock: "Night",
          actionTitle: "Isolate bedrooms",
          guidance: "Run filtration near head of bed.",
          directImpact: "Keeps overnight breathing zone clear.",
        },
      ],
      indoorAirHacks: [
        {
          title: "Wet mop floors",
          costTier: "Free",
          steps: "Mop floors with warm water and microfiber.",
          whyItWorks: "Traps settled particulate without stirring dust.",
        },
        {
          title: "Under-door draft snake",
          costTier: "Free",
          steps: "Place rolled towel against garage threshold.",
          whyItWorks: "Prevents carbon monoxide and soot from seeping inside.",
        },
        {
          title: "DIY Box-Fan Filter",
          costTier: "Low-Cost",
          steps: "Attach MERV-13 filter to box fan.",
          whyItWorks: "Delivers high CADR at minimal electricity cost.",
        },
      ],
      sustainableAlternatives: [
        {
          habitSwap: "Skip wood burning",
          practicalTip: "Use home central furnace rather than fireplace.",
          directCommunityImpact: "Prevents 450g of soot from settling into the valley bowl.",
        },
        {
          habitSwap: "Combine errands",
          practicalTip: "Group errands into a single midday journey.",
          directCommunityImpact: "Reduces vehicle cold starts by 3 per week.",
        },
      ],
      communityShareMessage: "Hey neighbors in SLC! Clean air window is 12-2 PM today. Let's avoid burning wood tonight! 🌿",
    };

    const { GoogleGenAI } = await import("@google/genai");
    const mockedClient = new GoogleGenAI({ apiKey: "test_gemini_key" });
    (mockedClient.models.generateContent as any).mockResolvedValueOnce({
      text: JSON.stringify(mockAiResponse),
    });

    const result = await generateSmogWisePlan(sampleReq);
    expect(result.headlineSummary).toBe(mockAiResponse.headlineSummary);
    expect(result.dailyRoutine).toHaveLength(3);
  });

  it("gracefully catches Gemini API errors and serves safe fallback guidance", async () => {
    process.env.GEMINI_API_KEY = "test_gemini_key";

    const { GoogleGenAI } = await import("@google/genai");
    const mockedClient = new GoogleGenAI({ apiKey: "test_gemini_key" });
    // Simulate API quota exhaustion (429)
    (mockedClient.models.generateContent as any).mockRejectedValueOnce(
      new Error("QuotaExceeded: 429 Resource has been exhausted")
    );

    const result = await generateSmogWisePlan(sampleReq);
    expect(result).toBeDefined();
    expect(result.headlineSummary).toContain("Salt Lake City");
    expect(result.dailyRoutine.length).toBeGreaterThanOrEqual(3);
  });
});
