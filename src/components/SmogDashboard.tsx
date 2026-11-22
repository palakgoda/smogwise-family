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
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { VerifiedAqiContext, SeverityLabel } from "@/lib/aqi/types";

interface SmogDashboardProps {
  data: VerifiedAqiContext;
}

export const SmogDashboard: React.FC<SmogDashboardProps> = ({ data }) => {
  const { location, airQuality, weather } = data;
  const [showInversionExplainer, setShowInversionExplainer] = useState(false);

  const getAqiTheme = (label: SeverityLabel) => {
    switch (label) {
      case "Good":
        return {
          icon: <CheckCircle2 className="h-6 w-6 text-emerald-700" aria-hidden="true" />,
          cardBg: "bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border-emerald-200",
          pillClass: "bg-emerald-700 text-white",
          accentColor: "#15803d",
          levelTitle: "Clean & Breathable",
          advice: "Air is fresh and safe for all household activities. Great time to open windows and exercise outdoors.",
        };
      case "Moderate":
        return {
          icon: <AlertCircle className="h-6 w-6 text-amber-700" aria-hidden="true" />,
          cardBg: "bg-gradient-to-br from-amber-50 via-yellow-50/40 to-white border-amber-200",
          pillClass: "bg-amber-700 text-white",
          accentColor: "#a16207",
          levelTitle: "Moderate Air Quality",
          advice: "Acceptable for most; unusually sensitive individuals should take it easy during intense outdoor activity.",
        };
      case "Unhealthy for Sensitive Groups":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-orange-700" aria-hidden="true" />,
          cardBg: "bg-gradient-to-br from-orange-50 via-amber-50/40 to-white border-orange-200",
          pillClass: "bg-orange-700 text-white",
          accentColor: "#c2410c",
          levelTitle: "Unhealthy for Sensitive Lungs",
          advice: "Children, seniors, and anyone with asthma should keep outdoor playtime and morning runs light.",
        };
      case "Unhealthy":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-rose-700" aria-hidden="true" />,
          cardBg: "bg-gradient-to-br from-rose-50 via-red-50/40 to-white border-rose-200",
          pillClass: "bg-rose-700 text-white",
          accentColor: "#b91c1c",
          levelTitle: "Unhealthy Smog Levels",
          advice: "Smog will cause coughing or throat irritation. Keep home windows latched shut and wear an N95 outdoors.",
        };
      case "Very Unhealthy":
        return {
          icon: <ShieldAlert className="h-6 w-6 text-purple-700" aria-hidden="true" />,
          cardBg: "bg-gradient-to-br from-purple-50 via-fuchsia-50/40 to-white border-purple-200",
          pillClass: "bg-purple-800 text-white",
          accentColor: "#7e22ce",
          levelTitle: "Very Unhealthy Smoke Alert",
          advice: "High pollution alert for the entire household. Avoid outdoor exertion and seal door drafts with rolled towels.",
        };
      case "Hazardous":
      default:
        return {
          icon: <ShieldAlert className="h-6 w-6 text-pink-900" aria-hidden="true" />,
          cardBg: "bg-gradient-to-br from-pink-50 via-rose-50/40 to-white border-pink-200",
          pillClass: "bg-pink-900 text-white",
          accentColor: "#701a75",
          levelTitle: "Emergency Winter Smog Trap",
          advice: "Severe surface soot trapped near ground level. Keep all family members indoors and run air filters continuously.",
        };
    }
  };

  const theme = getAqiTheme(airQuality.severityLabel);

  const getInversionBadge = (risk: string) => {
    switch (risk) {
      case "Severe":
      case "High":
        return {
          icon: <CloudFog className="h-4 w-4 text-rose-700 animate-pulse" aria-hidden="true" />,
          label: `${risk} Thermal Inversion`,
          badgeClass: "bg-rose-100 text-rose-900 border-rose-300 ring-2 ring-rose-200",
        };
      case "Moderate":
        return {
          icon: <CloudFog className="h-4 w-4 text-amber-700" aria-hidden="true" />,
          label: "Moderate Thermal Inversion",
          badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
        };
      case "Low":
      default:
        return {
          icon: <Wind className="h-4 w-4 text-emerald-700" aria-hidden="true" />,
          label: "Low Inversion (Active Breeze)",
          badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300",
        };
    }
  };

  const inversionBadge = getInversionBadge(airQuality.inversionRisk);

  // SVG Gauge calculations
  const aqiClamped = Math.min(500, Math.max(0, airQuality.usAqi));
  const gaugePercent = (aqiClamped / 500) * 100;
  const arcTotal = 132;
  const strokeOffset = arcTotal - (arcTotal * (gaugePercent / 100));

  return (
    <section
      aria-labelledby="today-air-story"
      className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all"
    >
      {/* Header with City & Real-time Sensor sync */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <h2 id="today-air-story" className="text-base font-extrabold text-slate-900">
            Today&apos;s Air Condition &bull; {location.city}, {location.country}
          </h2>
        </div>

        <div
          className={`inline-flex items-center space-x-1.5 rounded-full border px-3 py-1 text-xs font-bold ${inversionBadge.badgeClass}`}
        >
          {inversionBadge.icon}
          <span>{inversionBadge.label}</span>
        </div>
      </div>

      {/* Hero Visual Card: Semi-circle Gauge + Big numbers + Actionable takeaway */}
      <div
        role="region"
        aria-live="polite"
        className={`mt-5 rounded-2xl border p-6 transition-all shadow-xs ${theme.cardBg}`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Animated Speedometer Gauge & Status */}
          <div className="flex items-center gap-6">
            <div className="relative flex flex-col items-center justify-center shrink-0 w-28 h-24">
              <svg className="w-28 h-20 overflow-visible" viewBox="0 0 100 60">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke={theme.accentColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={arcTotal}
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute top-8 flex flex-col items-center">
                <span className="text-3xl font-black tracking-tight leading-none text-slate-900">
                  {airQuality.usAqi}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
                  US AQI
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-extrabold ${theme.pillClass}`}>
                  {theme.levelTitle}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {airQuality.usAqi > 200 ? "Severe Health Alert" : "Live Monitored"}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 max-w-lg leading-relaxed">
                {theme.advice}
              </p>
            </div>
          </div>

          {/* Right: Key Sensor Metrics in clean white chips */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center shrink-0">
            <div className="rounded-xl border border-slate-200 bg-white/95 p-2.5 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PM2.5</p>
              <p className="text-sm sm:text-base font-extrabold text-slate-900">
                {airQuality.pm25} <span className="text-[10px] font-normal text-slate-500">µg/m³</span>
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white/95 p-2.5 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PM10</p>
              <p className="text-sm sm:text-base font-extrabold text-slate-900">
                {airQuality.pm10} <span className="text-[10px] font-normal text-slate-500">µg/m³</span>
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white/95 p-2.5 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NO₂</p>
              <p className="text-sm sm:text-base font-extrabold text-slate-900">
                {airQuality.no2} <span className="text-[10px] font-normal text-slate-500">ppb</span>
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white/95 p-2.5 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-0.5">
                <Thermometer className="h-3 w-3 text-sky-600" aria-hidden="true" /> Temp
              </p>
              <p className="text-sm sm:text-base font-extrabold text-slate-900">{weather.tempC}°C</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white/95 p-2.5 shadow-2xs col-span-2 sm:col-span-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-0.5">
                <Wind className="h-3 w-3 text-teal-600" aria-hidden="true" /> Wind
              </p>
              <p className="text-sm sm:text-base font-extrabold text-slate-900">{weather.windKmh} <span className="text-[10px] font-normal text-slate-500">km/h</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric Science & Diurnal Windows Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Conversational "Why is pollution trapped?" card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CloudFog className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Why is smog trapped today?
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowInversionExplainer(!showInversionExplainer)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              aria-expanded={showInversionExplainer}
            >
              <Info className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{showInversionExplainer ? "Hide Science" : "How Inversion Works"}</span>
              {showInversionExplainer ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-700 leading-relaxed font-medium">
            {airQuality.explanation}
          </p>

          {showInversionExplainer && (
            <div className="mt-3 rounded-xl border border-indigo-200 bg-indigo-50/90 p-3 text-xs text-indigo-950 animate-fade-in-up">
              <p className="font-bold mb-1.5 flex items-center gap-1">
                🔬 The Winter Thermal Trap Explained:
              </p>
              <div className="space-y-1.5 text-[11px] leading-relaxed">
                <p>
                  <strong>1. The Warm Air Lid:</strong> Normally, ground air cools as it rises. In winter, an overhead layer of warm air forms a &quot;thermal ceiling&quot;.
                </p>
                <p>
                  <strong>2. Stagnant Winds:</strong> Surface wind speeds below 10 km/h fail to push the cold pool away.
                </p>
                <p>
                  <strong>3. Ground-Level Pooling:</strong> Smoke from bonfires, vehicle exhaust, and cooking fumes cannot escape upward, collecting directly at lung-level where families walk and commute.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Diurnal Cleanest Window vs Peak Smog Window */}
        <div className="flex flex-col gap-2.5 justify-between">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-start justify-between gap-2 shadow-2xs">
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0">
                <Clock className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wider">
                  Safest Outdoor Window (Air Out Home)
                </p>
                <p className="text-xs sm:text-sm font-bold text-emerald-950 mt-0.5">
                  {airQuality.cleanestWindow}
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-700 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
              Lowest PM2.5
            </span>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 flex items-start justify-between gap-2 shadow-2xs">
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 text-white shrink-0">
                <ShieldAlert className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-rose-900 uppercase tracking-wider">
                  Peak Smog Trapping Window (Stay Indoors)
                </p>
                <p className="text-xs sm:text-sm font-bold text-rose-950 mt-0.5">
                  {airQuality.peakSmogWindow}
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-rose-700 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
              Highest Risk
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
