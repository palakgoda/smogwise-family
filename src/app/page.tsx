"use client";

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { VerifiedAqiContext } from "@/lib/aqi/types";
import { CitySearch } from "@/components/CitySearch";
import { SmogDashboard } from "@/components/SmogDashboard";
import { LifestyleControls, LifestyleProfile } from "@/components/LifestyleControls";
import { GuidanceView } from "@/components/GuidanceView";
import { AssistantResponse } from "@/lib/ai/schema";
import { buildFallbackGuidance } from "@/lib/ai/fallback";
import { calculateWinterSwapImpact } from "@/lib/impact/calculator";

// Initial realistic winter inversion context (Delhi winter smog) for instant zero-latency view
const INITIAL_CONTEXT: VerifiedAqiContext = {
  location: { city: "Delhi", country: "India" },
  airQuality: {
    usAqi: 312,
    pm25: 262.0,
    pm10: 380.0,
    no2: 78.0,
    severityLabel: "Hazardous",
    inversionRisk: "High",
    explanation:
      "High thermal inversion risk: Cold surface air (13°C) and calm stagnant winds (4 km/h) are creating an atmospheric lid, trapping vehicular exhaust and biomass soot close to ground level.",
    cleanestWindow: "12:30 PM – 2:30 PM (Midday Solar Mixing: 85 µg/m³)",
    peakSmogWindow: "7:00 PM – 9:00 PM (Inversion Smoke Trapping: 310 µg/m³)",
  },
  weather: {
    tempC: 13.0,
    windKmh: 4.0,
  },
};

export default function Home() {
  const [aqiData, setAqiData] = useState<VerifiedAqiContext>(INITIAL_CONTEXT);
  const [profile, setProfile] = useState<LifestyleProfile>({
    householdGroup: "Elderly / Asthma",
    homeType: "Apartment",
    heatingSource: "Electric/Heat Pump",
    primaryCommute: "Transit",
    customNotes: "Grandparent with asthma; drafty balcony window.",
  });
  const [selectedSwapIds, setSelectedSwapIds] = useState<string[]>([
    "skip-fireplace",
    "lower-thermostat-1c",
  ]);

  const [isLoadingCity, setIsLoadingCity] = useState<boolean>(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pre-load initial grounded plan
  const [plan, setPlan] = useState<AssistantResponse>(() => {
    const impact = calculateWinterSwapImpact(["skip-fireplace", "lower-thermostat-1c"]);
    return buildFallbackGuidance(
      {
        location: INITIAL_CONTEXT.location,
        airQuality: INITIAL_CONTEXT.airQuality,
        weather: INITIAL_CONTEXT.weather,
        familyProfile: {
          householdGroup: "Elderly / Asthma",
          homeType: "Apartment",
          heatingSource: "Electric/Heat Pump",
          primaryCommute: "Transit",
          customNotes: "Grandparent with asthma; drafty balcony window.",
        },
        selectedSwapIds: ["skip-fireplace", "lower-thermostat-1c"],
      },
      impact
    );
  });

  // Handle city selection (from search or demo pills)
  const handleSelectCity = async (city: string) => {
    setIsLoadingCity(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/air-quality?city=${encodeURIComponent(city)}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch data for ${city}`);
      }
      const data: VerifiedAqiContext = await res.json();
      setAqiData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error fetching air quality data";
      setErrorMessage(msg);
    } finally {
      setIsLoadingCity(false);
    }
  };

  // Generate tailored AI plan via /api/assistant
  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    setErrorMessage(null);
    try {
      const payload = {
        location: aqiData.location,
        airQuality: {
          usAqi: aqiData.airQuality.usAqi,
          pm25: aqiData.airQuality.pm25,
          pm10: aqiData.airQuality.pm10,
          no2: aqiData.airQuality.no2,
          severityLabel: aqiData.airQuality.severityLabel,
          inversionRisk: aqiData.airQuality.inversionRisk,
          cleanestWindow: aqiData.airQuality.cleanestWindow,
          peakSmogWindow: aqiData.airQuality.peakSmogWindow,
        },
        weather: aqiData.weather,
        familyProfile: profile,
        selectedSwapIds,
      };

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to generate plan (${res.status})`);
      }

      const generated: AssistantResponse = await res.json();
      setPlan(generated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error generating tailored plan";
      setErrorMessage(msg);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-7">
      {/* Accessible error banner */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-900 shadow-sm flex items-start space-x-3"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 text-red-600 flex-shrink-0" aria-hidden="true" />
          <div className="text-xs sm:text-sm">
            <strong className="font-semibold">Notice: </strong>
            {errorMessage}
          </div>
        </div>
      )}

      {/* 1. Header & City Search with Quick Demo Scenarios */}
      <CitySearch
        currentCity={aqiData.location.city}
        onSelectCity={handleSelectCity}
        isLoading={isLoadingCity}
      />

      {/* 2. Live Smog & Inversion Banner */}
      <SmogDashboard data={aqiData} />

      {/* 3. Family Profile & Sustainable Swaps Impact Simulator */}
      <LifestyleControls
        profile={profile}
        onProfileChange={setProfile}
        selectedSwapIds={selectedSwapIds}
        onSwapsChange={setSelectedSwapIds}
        onGeneratePlan={handleGeneratePlan}
        isGenerating={isGeneratingPlan}
      />

      {/* 4. AI Guidance Tabs */}
      {plan && (
        <div role="region" aria-live="polite">
          <GuidanceView plan={plan} />
        </div>
      )}

      {/* 5. Attribution & Medical Disclaimer */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-amber-950 text-xs leading-relaxed space-y-2">
        <div>
          <strong className="font-bold text-amber-900">Medical Notice: </strong>
          SmogWise Family is a lifestyle and indoor air quality assistant based on environmental sensor readings. It does not provide medical diagnosis or replace personalized medical treatment. If anyone in your household experiences severe shortness of breath, continuous coughing, or chest distress, please seek immediate guidance from a licensed medical professional.
        </div>
        <div className="text-[11px] text-amber-800/90 border-t border-amber-200/60 pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <span>Environmental sensor and forecast metrics provided by <strong>Open-Meteo</strong> (CC BY 4.0).</span>
          <span>Designed with WCAG 2.1 AA accessibility & non-color sensory cues.</span>
        </div>
      </div>
    </div>
  );
}
