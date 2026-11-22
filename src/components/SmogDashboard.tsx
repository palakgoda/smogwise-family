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
  ShieldCheck,
  Flame,
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

  const getAqiBadgeDetails = (label: SeverityLabel, aqi: number) => {
    switch (label) {
      case "Good":
        return {
          icon: <CheckCircle2 className="h-6 w-6 text-emerald-700" aria-hidden="true" />,
          bgClass: "bg-emerald-50/90 border-emerald-300 text-emerald-950",
          pillClass: "bg-emerald-700 text-white",
          accentColor: "#15803d",
          tag: "Level 1: Good (0-50)",
          summary: "Air quality is satisfactory with minimal health risk. Ideal for outdoor exercise and regular window ventilation.",
        };
      case "Moderate":
        return {
          icon: <AlertCircle className="h-6 w-6 text-amber-700" aria-hidden="true" />,
          bgClass: "bg-amber-50/90 border-amber-300 text-amber-950",
          pillClass: "bg-amber-700 text-white",
          accentColor: "#a16207",
          tag: "Level 2: Moderate (51-100)",
          summary: "Acceptable quality; sensitive individuals should consider taking it easy during intense outdoor activity.",
        };
      case "Unhealthy for Sensitive Groups":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-orange-700" aria-hidden="true" />,
          bgClass: "bg-orange-50/90 border-orange-300 text-orange-950",
          pillClass: "bg-orange-700 text-white",
          accentColor: "#c2410c",
          tag: "Level 3: Sensitive Groups (101-150)",
          summary: "Children, seniors, and anyone with asthma should limit prolonged outdoor exertion.",
        };
      case "Unhealthy":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-700" aria-hidden="true" />,
          bgClass: "bg-red-50/90 border-red-300 text-red-950",
          pillClass: "bg-red-700 text-white",
          accentColor: "#b91c1c",
          tag: "Level 4: Unhealthy (151-200)",
          summary: "Everyone may begin to experience health effects; avoid outdoor workouts and keep residential windows shut.",
        };
      case "Very Unhealthy":
        return {
          icon: <ShieldAlert className="h-6 w-6 text-purple-700" aria-hidden="true" />,
          bgClass: "bg-purple-50/90 border-purple-300 text-purple-950",
          pillClass: "bg-purple-800 text-white",
          accentColor: "#7e22ce",
          tag: "Level 5: Very Unhealthy (201-300)",
          summary: "Health alert: serious risk for all household members. Seal exterior drafts and run indoor air purifiers or DIY box-fan filters.",
        };
      case "Hazardous":
      default:
        return {
          icon: <ShieldAlert className="h-6 w-6 text-pink-800" aria-hidden="true" />,
          bgClass: "bg-pink-50/90 border-pink-300 text-pink-950",
          pillClass: "bg-pink-900 text-white",
          accentColor: "#701a75",
          tag: "Level 6: Hazardous (301+)",
          summary: "Emergency conditions: extreme ground soot trapping. All household members should avoid outdoor exertion and seal doorway drafts.",
        };
    }
  };

  const badge = getAqiBadgeDetails(airQuality.severityLabel, airQuality.usAqi);

  const getInversionBadge = (risk: string) => {
    switch (risk) {
      case "Severe":
      case "High":
        return {
          icon: <CloudFog className="h-4 w-4 text-rose-700 animate-pulse" aria-hidden="true" />,
          label: `${risk} Inversion Risk`,
          badgeClass: "bg-rose-100 text-rose-900 border-rose-300 shadow-xs",
        };
      case "Moderate":
        return {
          icon: <CloudFog className="h-4 w-4 text-amber-700" aria-hidden="true" />,
          label: "Moderate Inversion Risk",
          badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
        };
      case "Low":
      default:
        return {
          icon: <Wind className="h-4 w-4 text-emerald-700" aria-hidden="true" />,
          label: "Low Inversion Risk",
          badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300",
        };
    }
  };

  const inversionBadge = getInversionBadge(airQuality.inversionRisk);

  // SVG Gauge calculations (semi-circle arc)
  const aqiClamped = Math.min(500, Math.max(0, airQuality.usAqi));
  const gaugePercent = (aqiClamped / 500) * 100;
  // Arc length = PI * R = 3.14159 * 42 ~= 132
  const arcTotal = 132;
  const strokeOffset = arcTotal - (arcTotal * (gaugePercent / 100));

  return (
    <section
      aria-labelledby="live-smog-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h2 id="live-smog-heading" className="text-base font-bold text-slate-900">
              Live Air Quality & Inversion Banner
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-ping" />
              {location.city}, {location.country}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified local pollution readings &bull; Winter ground-level thermal conditions
          </p>
        </div>

        {/* Thermal Inversion Badge (Never relying on color alone: Icon + Label + Contrast pill) */}
        <div
          className={`inline-flex items-center space-x-1.5 rounded-full border px-3 py-1 text-xs font-bold ${inversionBadge.badgeClass}`}
        >
          {inversionBadge.icon}
          <span>{inversionBadge.label}</span>
        </div>
      </div>

      {/* Main Status Hero Card with Animated Gauge */}
      <div
        role="region"
        aria-live="polite"
        className={`mt-4 rounded-2xl border p-5 sm:p-6 transition-all shadow-xs ${badge.bgClass}`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Gauge + AQI Numbers */}
          <div className="flex items-center gap-5">
            {/* Visual Circular Gauge */}
            <div className="relative flex flex-col items-center justify-center shrink-0 w-28 h-24">
              <svg className="w-28 h-20 overflow-visible" viewBox="0 0 100 60">
                {/* Background track */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Animated colored progress arc */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke={badge.accentColor}
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

            {/* Severity Details */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold ${badge.pillClass}`}>
                  {badge.tag}
                </span>
                <span className="text-xs text-slate-600 font-semibold hidden sm:inline">
                  {airQuality.usAqi > 200 ? "Severe Health Alert" : "Live Monitored"}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-800 max-w-xl">
                {badge.summary}
              </p>
            </div>
          </div>

          {/* Right: Key Sensor Metrics Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center shrink-0">
            <div className="rounded-xl border border-slate-200/90 bg-white/90 p-2.5 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-500 uppercase">PM2.5</p>
              <p className="text-sm sm:text-base font-extrabold text-slate-900">
                {airQuality.pm25} <span className="text-[10px] font-normal text-slate-500">µg/m³</span>
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white/90 p-2.5 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-500 uppercase">PM10</p>
              <p className="text-sm sm:text-base font-extrabold text-slate-900">
                {airQuality.pm10} <span className="text-[10px] font-normal text-slate-500">µg/m³</span>
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white/90 p-2.5 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-500 uppercase">NO₂</p>
              <p className="text-sm sm:text-base font-extrabold text-slate-900">
                {airQuality.no2} <span className="text-[10px] font-normal text-slate-500">ppb</span>
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white/90 p-2.5 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center justify-center gap-0.5">
                <Thermometer className="h-3 w-3 text-sky-600" aria-hidden="true" /> Temp
              </p>
              <p className="text-sm sm:text-base font-extrabold text-slate-900">{weather.tempC}°C</p>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white/90 p-2.5 shadow-2xs col-span-2 sm:col-span-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center justify-center gap-0.5">
                <Wind className="h-3 w-3 text-teal-600" aria-hidden="true" /> Wind
              </p>
              <p className="text-sm sm:text-base font-extrabold text-slate-900">{weather.windKmh} <span className="text-[10px] font-normal text-slate-500">km/h</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric Inversion & Diurnal Windows Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Inversion Mechanism Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CloudFog className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Atmospheric Inversion Mechanism
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowInversionExplainer(!showInversionExplainer)}
              className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
              aria-expanded={showInversionExplainer}
            >
              <Info className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{showInversionExplainer ? "Hide Explainer" : "Why it traps"}</span>
              {showInversionExplainer ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-700 leading-relaxed font-medium">
            {airQuality.explanation}
          </p>

          {/* Interactive Inversion Diagram / Explainer */}
          {showInversionExplainer && (
            <div className="mt-3 rounded-lg border border-indigo-200 bg-indigo-50/80 p-3 text-xs text-indigo-950 animate-fade-in-up">
              <p className="font-bold mb-1.5 flex items-center gap-1">
                🔬 The Winter Thermal Trap Explained:
              </p>
              <div className="space-y-1.5 text-[11px] leading-relaxed">
                <p>
                  <strong>1. Warm Air Lid:</strong> A layer of warm air forms high above the cold ground, reversing the normal atmosphere.
                </p>
                <p>
                  <strong>2. Stagnant Air:</strong> Winds under 10 km/h fail to blow the stagnant air away.
                </p>
                <p>
                  <strong>3. Trapped Surface Smog:</strong> Vehicular smoke, crop residue, and residential heating have nowhere to rise, pooling at head-level where children and elders breathe.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Diurnal Cleanest vs Peak Smog Windows */}
        <div className="flex flex-col gap-2.5 justify-between">
          {/* Cleanest Window */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 flex items-start justify-between gap-2 shadow-2xs">
            <div className="flex items-start space-x-2.5">
              <Clock className="h-4 w-4 text-emerald-700 mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[11px] font-bold text-emerald-900 uppercase">
                  Cleanest Outdoor Window
                </p>
                <p className="text-xs font-semibold text-emerald-950 mt-0.5">
                  {airQuality.cleanestWindow}
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-md bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-white">
              Safest Air
            </span>
          </div>

          {/* Peak Smog Window */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 flex items-start justify-between gap-2 shadow-2xs">
            <div className="flex items-start space-x-2.5">
              <ShieldAlert className="h-4 w-4 text-rose-700 mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[11px] font-bold text-rose-900 uppercase">
                  Peak Smog Trapping Window
                </p>
                <p className="text-xs font-semibold text-rose-950 mt-0.5">
                  {airQuality.peakSmogWindow}
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-md bg-rose-700 px-2 py-0.5 text-[10px] font-bold text-white">
              Highest Risk
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
