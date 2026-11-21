import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchGeocoding, fetchLiveAirQualityAndWeather } from "@/lib/aqi/openMeteo";
import { checkRateLimit } from "@/lib/ai/rate-limiter";

const AirQualityQuerySchema = z.object({
  city: z
    .string()
    .trim()
    .min(1, "City parameter cannot be empty")
    .max(100, "City parameter too long")
    .default("New Delhi"),
});

export async function GET(request: NextRequest) {
  try {
    // 1. Sliding-window IP Rate Limiting (30 requests / 10 minutes)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const { allowed, remaining, resetTimeSeconds } = checkRateLimit(
      `aqi_${ip}`,
      30,
      10 * 60 * 1000
    );
    if (!allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Too many air quality requests. Please wait.",
          retryAfterSeconds: resetTimeSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": resetTimeSeconds.toString(),
            "X-RateLimit-Limit": "30",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // 2. Query validation with Zod
    const { searchParams } = new URL(request.url);
    const rawCity = searchParams.get("city") || "New Delhi";

    const queryValidation = AirQualityQuerySchema.safeParse({ city: rawCity });
    if (!queryValidation.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameter",
          details: queryValidation.error.format(),
        },
        { status: 400 }
      );
    }

    const { city } = queryValidation.data;

    // 3. Geocode and fetch sensor & weather data
    const location = await fetchGeocoding(city);
    const context = await fetchLiveAirQualityAndWeather(location);

    return NextResponse.json(context, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=300",
        "X-RateLimit-Remaining": remaining.toString(),
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch air quality data";
    return NextResponse.json(
      { error: "Failed to fetch air quality data", message },
      { status: 500 }
    );
  }
}
