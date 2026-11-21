import React, { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Wind,
  Thermometer,
  CloudFog,
  Clock,
  Search,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { SeverityLabel, VerifiedAqiContext } from "@/lib/aqi/types";

interface AqiDashboardProps {
  data: VerifiedAqiContext;
  onSearchCity: (city: string) => Promise<void>;
  isLoading: boolean;
}

export const AqiDashboard: React.FC<AqiDashboardProps> = ({
  data,
  onSearchCity,
  isLoading,
}) => {
  const [cityInput, setCityInput] = useState(data.location.city);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      onSearchCity(cityInput.trim());
    }
  };

  // Accessible color + icon + text level badge (WCAG 2.1 AA compliant)
  const getSeverityBadge = (severity: SeverityLabel, aqi: number) => {
    switch (severity) {
      case "Good":
        return {
          icon: <CheckCircle2 className="h-6 w-6 text-emerald-700" aria-hidden="true" />,
          bg: "bg-emerald-50 border-emerald-300 text-emerald-900",
          badge: "bg-emerald-700 text-white",
          label: "Level 1: Good (0-50)",
          advice: "Air quality is satisfactory and poses little to no health risk.",
        };
      case "Moderate":
        return {
          icon: <AlertCircle className="h-6 w-6 text-amber-700" aria-hidden="true" />,
          bg: "bg-amber-50 border-amber-300 text-amber-900",
          badge: "bg-amber-700 text-white",
          label: "Level 2: Moderate (51-100)",
          advice: "Acceptable quality; sensitive individuals may notice mild irritation.",
        };
      case "Unhealthy for Sensitive Groups":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-orange-700" aria-hidden="true" />,
          bg: "bg-orange-50 border-orange-300 text-orange-900",
          badge: "bg-orange-700 text-white",
          label: "Level 3: Sensitive Groups (101-150)",
          advice: "Children, seniors, and people with lung/heart conditions should limit long outdoor stays.",
        };
      case "Unhealthy":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-700" aria-hidden="true" />,
          bg: "bg-red-50 border-red-300 text-red-900",
          badge: "bg-red-700 text-white",
          label: "Level 4: Unhealthy (151-200)",
          advice: "Everyone may begin to experience adverse effects; avoid strenuous outdoor exercise.",
        };
      case "Very Unhealthy":
        return {
          icon: <ShieldAlert className="h-6 w-6 text-purple-700" aria-hidden="true" />,
          bg: "bg-purple-50 border-purple-300 text-purple-900",
          badge: "bg-purple-800 text-white",
          label: "Level 5: Very Unhealthy (201-300)",
          advice: "Health alert: significant risk for all household members; keep windows sealed.",
        };
      case "Hazardous":
      default:
        return {
          icon: <ShieldAlert className="h-6 w-6 text-pink-800" aria-hidden="true" />,
          bg: "bg-pink-50 border-pink-300 text-pink-950",
          badge: "bg-pink-900 text-white",
          label: "Level 6: Hazardous (301+)",
          advice: "Emergency conditions: severe ground soot trap. Seal all exterior doors and run air filtration.",
        };
    }
  };

  const badgeInfo = getSeverityBadge(data.airQuality.severityLabel, data.airQuality.usAqi);

  return (
    <section
      aria-label="Local Air Quality and Atmospheric Weather"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      {/* City Search Bar */}
      <form onSubmit={handleSearch} className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label htmlFor="city-search" className="sr-only">
          Search City for Winter Air Quality
        </label>
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-5 w-5" aria-hidden="true" />
          </div>
          <input
            id="city-search"
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Enter city (e.g. Delhi, Salt Lake City, London, Krakow)..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Checking Sensors...
            </>
          ) : (
            "Update Readings"
          )}
        </button>
      </form>

      {/* Main AQI Status Banner (WCAG non-color reliant: Icon + Text Badge + Contrast Colors) */}
      <div
        role="region"
        aria-live="polite"
        className={`rounded-2xl border p-5 sm:p-6 ${badgeInfo.bg}`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start space-x-3.5">
            <div className="rounded-xl bg-white/90 p-2.5 shadow-sm">
              {badgeInfo.icon}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold tracking-wide uppercase text-slate-700">
                  {data.location.city}, {data.location.country}
                </span>
                <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${badgeInfo.badge}`}>
                  {badgeInfo.label}
                </span>
              </div>
              <div className="mt-1 flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                  {data.airQuality.usAqi}
                </span>
                <span className="text-sm font-medium text-slate-600">US AQI</span>
              </div>
              <p className="mt-2 text-xs font-medium sm:text-sm">{badgeInfo.advice}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-slate-200/60 pt-3 sm:border-t-0 sm:pt-0 sm:text-right">
            <div className="rounded-lg bg-white/80 p-2 shadow-xs">
              <span className="block text-xs font-semibold text-slate-500">PM2.5</span>
              <span className="text-base font-bold text-slate-900">
                {data.airQuality.pm25} <span className="text-xs font-normal text-slate-500">µg/m³</span>
              </span>
            </div>
            <div className="rounded-lg bg-white/80 p-2 shadow-xs">
              <span className="block text-xs font-semibold text-slate-500">PM10</span>
              <span className="text-base font-bold text-slate-900">
                {data.airQuality.pm10} <span className="text-xs font-normal text-slate-500">µg/m³</span>
              </span>
            </div>
            <div className="rounded-lg bg-white/80 p-2 shadow-xs">
              <span className="block text-xs font-semibold text-slate-500">NO2</span>
              <span className="text-base font-bold text-slate-900">
                {data.airQuality.no2} <span className="text-xs font-normal text-slate-500">ppb</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric Winter Inversion & Window Detection Cards */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Inversion Risk Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CloudFog className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              <h2 className="text-sm font-bold text-slate-900">Atmospheric Inversion Risk</h2>
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                data.airQuality.inversionRisk === "Severe" || data.airQuality.inversionRisk === "High"
                  ? "bg-red-100 text-red-800"
                  : data.airQuality.inversionRisk === "Moderate"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {data.airQuality.inversionRisk} Risk
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            {data.airQuality.explanation}
          </p>
          <div className="mt-3 flex items-center space-x-4 text-xs font-medium text-slate-700">
            <span className="flex items-center space-x-1">
              <Thermometer className="h-4 w-4 text-blue-600" aria-hidden="true" />
              <span>Ground Temp: {data.weather.tempC}°C</span>
            </span>
            <span className="flex items-center space-x-1">
              <Wind className="h-4 w-4 text-teal-600" aria-hidden="true" />
              <span>Wind Speed: {data.weather.windKmh} km/h</span>
            </span>
          </div>
        </div>

        {/* Timed Clean Air & Peak Smog Windows */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            <h2 className="text-sm font-bold text-slate-900">Diurnal Smog Timing</h2>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-start justify-between rounded-lg bg-emerald-50/70 p-2.5 border border-emerald-200">
              <div>
                <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Cleanest Outdoor Window:</span>
                </span>
                <p className="text-xs font-medium text-emerald-950">
                  {data.airQuality.cleanestWindow}
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700">Safest Window</span>
            </div>

            <div className="flex items-start justify-between rounded-lg bg-rose-50/70 p-2.5 border border-rose-200">
              <div>
                <span className="inline-flex items-center space-x-1 text-xs font-bold text-rose-800">
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Peak Smog Trapping:</span>
                </span>
                <p className="text-xs font-medium text-rose-950">
                  {data.airQuality.peakSmogWindow}
                </p>
              </div>
              <span className="text-xs font-semibold text-rose-700">Highest Risk</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

