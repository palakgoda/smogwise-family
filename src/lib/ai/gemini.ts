import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { z } from "zod";
import { AssistantRequest, AssistantResponse, AssistantResponseSchema } from "./schema";
import { buildVerifiedContextPrompt, SMOGWISE_SYSTEM_INSTRUCTION } from "./prompts";
import { buildFallbackGuidance } from "./fallback";
import { calculateWinterSwapImpact } from "../impact/calculator";

export async function generateSmogWisePlan(req: AssistantRequest): Promise<AssistantResponse> {
  const impact = calculateWinterSwapImpact(req.selectedSwapIds);
  const apiKey = process.env.GEMINI_API_KEY;

  // If API key is not configured or placeholder, return deterministic grounded fallback
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.warn("[SmogWise AI] GEMINI_API_KEY missing or placeholder. Serving deterministic fallback.");
    return buildFallbackGuidance(req, impact);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = process.env.GEMINI_MODEL || "gemini-4-hydrogen";
    const userPrompt = buildVerifiedContextPrompt(req, impact);

    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      config: {
        systemInstruction: SMOGWISE_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseJsonSchema: z.toJSONSchema(AssistantResponseSchema),
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Received empty response text from Gemini API");
    }

    const rawJson = JSON.parse(text);
    return AssistantResponseSchema.parse(rawJson);
  } catch (error) {
    console.error("[SmogWise AI] Gemini generation error or rate limit, activating fallback guidance:", error);
    return buildFallbackGuidance(req, impact);
  }
}
