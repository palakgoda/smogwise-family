import React from "react";
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
} from "lucide-react";
import { VerifiedAqiContext, SeverityLabel } from "@/lib/aqi/types";

interface SmogDashboardProps {
  data: VerifiedAqiContext;
}

export const SmogDashboard: React.FC<SmogDashboardProps> = ({ data }) => {
  const { location, airQuality, weather } = data;

  const getAqiBadgeDetails = (label: SeverityLabel, aqi: number) => {
    switch (label) {
      case "Good":
        return {
          icon: <CheckCircle2 className="h-6 w-6 text-emerald-700" aria-hidden="true" />,
          bgClass: "bg-emerald-50 border-emerald-300 text-emerald-950",
          pillClass: "bg-emerald-700 text-white",
          tag: "Level 1: Good (0-50)",
          summary: "Air quality is satisfactory with minimal to no health risk. Ideal for outdoor exercise and regular window ventilation.",
        };
      case "Moderate":
        return {
          icon: <AlertCircle className="h-6 w-6 text-amber-700" aria-hidden="true" />,
          bgClass: "bg-amber-50 border-amber-300 text-amber-950",
          pillClass: "bg-amber-700 text-white",
          tag: "Level 2: Moderate (51-100)",
          summary: "Acceptable quality; unusually sensitive individuals should consider taking it easy during intense outdoor activity.",
        };
      case "Unhealthy for Sensitive Groups":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-orange-700" aria-hidden="true" />,
          bgClass: "bg-orange-50 border-orange-300 text-orange-950",
          pillClass: "bg-orange-700 text-white",
          tag: "Level 3: Sensitive Groups (101-150)",
          summary: "Children, seniors, and anyone with asthma or respiratory conditions should limit prolonged outdoor exertion.",
        };
      case "Unhealthy":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-700" aria-hidden="true" />,
          bgClass: "bg-red-50 border-red-300 text-red-950",
          pillClass: "bg-red-700 text-white",
          tag: "Level 4: Unhealthy (151-200)",
          summary: "Everyone may begin to experience health effects; avoid intense outdoor workouts and keep residential windows shut.",
        };
      case "Very Unhealthy":
        return {
          icon: <ShieldAlert className="h-6 w-6 text-purple-700" aria-hidden="true" />,
          bgClass: "bg-purple-50 border-purple-300 text-purple-950",
          pillClass: "bg-purple-800 text-white",
          tag: "Level 5: Very Unhealthy (201-300)",
          summary: "Health alert: serious risk for all household members. Seal exterior drafts and run indoor air purifiers or DIY box-fan filters.",
        };
      case "Hazardous":
      default:
        return {
          icon: <ShieldAlert className="h-6 w-6 text-pink-800" aria-hidden="true" />,
          bgClass: "bg-pink-50 border-pink-300 text-pink-950",
          pillClass: "bg-pink-900 text-white",
          tag: "Level 6: Hazardous (301+)",
          summary: "Emergency conditions: extreme surface soot trap. All household members should avoid outdoor exertion and seal doorway gaps tight.",
        };
    }
  };

  const badge = getAqiBadgeDetails(airQuality.severityLabel, airQuality.usAqi);

  const getInversionBadge = (risk: string) => {
    switch (risk) {
      case "Severe":
      case "High":
        return {
          icon: <CloudFog className="h-4 w-4 text-rose-700" aria-hidden="true" />,
          label: `${risk} Inversion Risk`,
          badgeClass: "bg-rose-100 text-rose-900 border-rose-300",
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

  return (
    <section
      aria-labelledby="live-smog-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h2 id="live-smog-heading" className="text-base font-bold text-slate-900">
              Live Air Quality & Inversion Banner
            </h2>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-800">
              {location.city}, {location.country}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified local pollution readings and ground-level winter thermal conditions
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

      {/* Main Status Hero Card */}
      <div
        role="region"
        aria-live="polite"
        className={`mt-4 rounded-2xl border p-5 sm:p-6 transition-colors ${badge.bgClass}`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className="rounded-2xl bg-white/90 p-3 shadow-xs">
              {badge.icon}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Current Status
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${badge.pillClass}`}>
                  {badge.tag}
                </span>
              </div>
              <div className="mt-1 flex items-baseline space-x-2.5">
                <span className="text-4xl font-extrabold sm:text-5xl">{airQuality.usAqi}</span>
                <span className="text-sm font-semibold text-slate-600">US AQI</span>
              </div>
              <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
                {badge.summary}
              </p>
            </div>
          </div>

          {/* Metric Grid: PM2.5, PM10, NO2, Temperature, Wind */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="rounded-xl border border-slate-200/70 bg-white/90 p-2.5 text-center shadow-xs">
              <span className="block text-[11px] font-bold uppercase text-slate-500">PM2.5</span>
              <span className="text-base font-extrabold text-slate-900">
                {airQuality.pm25} <span className="text-[10px] font-semibold text-slate-500">µg/m³</span>
              </span>
            </div>
            <div className="rounded-xl border border-slate-200/70 bg-white/90 p-2.5 text-center shadow-xs">
              <span className="block text-[11px] font-bold uppercase text-slate-500">PM10</span>
              <span className="text-base font-extrabold text-slate-900">
                {airQuality.pm10} <span className="text-[10px] font-semibold text-slate-500">µg/m³</span>
              </span>
            </div>
            <div className="rounded-xl border border-slate-200/70 bg-white/90 p-2.5 text-center shadow-xs">
              <span className="block text-[11px] font-bold uppercase text-slate-500">NO₂</span>
              <span className="text-base font-extrabold text-slate-900">
                {airQuality.no2} <span className="text-[10px] font-semibold text-slate-500">ppb</span>
              </span>
            </div>
            <div className="rounded-xl border border-slate-200/70 bg-white/90 p-2.5 text-center shadow-xs">
              <span className="block text-[11px] font-bold uppercase text-slate-500 flex items-center justify-center gap-1">
                <Thermometer className="h-3 w-3 text-blue-600" aria-hidden="true" />
                Temp
              </span>
              <span className="text-base font-extrabold text-slate-900">{weather.tempC}°C</span>
            </div>
            <div className="rounded-xl border border-slate-200/70 bg-white/90 p-2.5 text-center shadow-xs col-span-2 sm:col-span-1">
              <span className="block text-[11px] font-bold uppercase text-slate-500 flex items-center justify-center gap-1">
                <Wind className="h-3 w-3 text-teal-600" aria-hidden="true" />
                Wind
              </span>
              <span className="text-base font-extrabold text-slate-900">{weather.windKmh} km/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric Thermal Inversion & Cleanest Window Diagnostics */}
      <div className="mt-4 grid grid-cols-1 gap-3.5 md:grid-cols-2">
        {/* Inversion Physics Explanation */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center space-x-2 text-slate-900">
            <CloudFog className="h-4 w-4 text-indigo-600" aria-hidden="true" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Atmospheric Inversion Mechanism
            </h3>
          </div>
          <p className="mt-2 text-xs text-slate-700 leading-relaxed">
            {airQuality.explanation}
          </p>
        </div>

        {/* Diurnal Smog Timing: Cleanest vs Peak Window */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
          <div className="flex items-start justify-between rounded-lg border border-emerald-300 bg-emerald-50/80 p-2.5">
            <div>
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-900">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                <span>Cleanest Outdoor Window:</span>
              </span>
              <p className="text-xs font-semibold text-emerald-950 mt-0.5">
                {airQuality.cleanestWindow}
              </p>
            </div>
            <span className="rounded bg-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
              Safest Air
            </span>
          </div>

          <div className="flex items-start justify-between rounded-lg border border-rose-300 bg-rose-50/80 p-2.5">
            <div>
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-rose-900">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-700" aria-hidden="true" />
                <span>Peak Smog Trapping Window:</span>
              </span>
              <p className="text-xs font-semibold text-rose-950 mt-0.5">
                {airQuality.peakSmogWindow}
              </p>
            </div>
            <span className="rounded bg-rose-200/80 px-2 py-0.5 text-[10px] font-bold text-rose-900">
              Highest Risk
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

