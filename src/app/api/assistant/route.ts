import { NextRequest, NextResponse } from "next/server";
import { AssistantRequestSchema } from "@/lib/ai/schema";
import { generateSmogWisePlan } from "@/lib/ai/gemini";
import { checkRateLimit } from "@/lib/ai/rate-limiter";

export async function POST(request: NextRequest) {
  try {
    // 1. Sliding-window IP Rate Limiting (15 requests / 10 minutes)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const { allowed, remaining, resetTimeSeconds } = checkRateLimit(ip, 15, 10 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Too many requests. Please wait before generating another plan.",
          retryAfterSeconds: resetTimeSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": resetTimeSeconds.toString(),
            "X-RateLimit-Limit": "15",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // 2. Parse JSON body
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Malformed JSON in request body" },
        { status: 400 }
      );
    }

    // 3. Strict Zod input validation (sanitizes customNotes automatically)
    const validationResult = AssistantRequestSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    // 4. Generate structured SmogWise plan via Gemini (or fallback)
    const plan = await generateSmogWisePlan(validationResult.data);

    return NextResponse.json(plan, {
      status: 200,
      headers: {
        "X-RateLimit-Limit": "15",
        "X-RateLimit-Remaining": remaining.toString(),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error occurred";
    return NextResponse.json(
      { error: "Internal server error", message },
      { status: 500 }
    );
  }
}
