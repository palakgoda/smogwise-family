import React, { useEffect, useState, useRef } from "react";
import {
  Users,
  Home,
  Flame,
  Car,
  Leaf,
  Sparkles,
  Loader2,
  TrendingDown,
  ShieldCheck,
  Baby,
  HeartPulse,
  Building,
  Check,
} from "lucide-react";
import { REALISTIC_WINTER_SWAPS } from "@/lib/impact/swaps-data";
import { calculateWinterSwapImpact } from "@/lib/impact/calculator";

export interface LifestyleProfile {
  householdGroup: string;
  homeType: string;
  heatingSource: string;
  primaryCommute: string;
  customNotes: string;
}

interface LifestyleControlsProps {
  profile: LifestyleProfile;
  onProfileChange: (updated: LifestyleProfile) => void;
  selectedSwapIds: string[];
  onSwapsChange: (updatedIds: string[]) => void;
  onGeneratePlan: () => Promise<void>;
  isGenerating: boolean;
}

/**
 * Animated number hook for smooth counting transitions without React hook warnings
 */
function useAnimatedNumber(target: number, duration = 400) {
  const [displayValue, setDisplayValue] = useState(target);
  const currentValRef = useRef(target);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startVal = currentValRef.current;
    const diff = target - startVal;

    if (diff === 0) return;

    let animId: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const nextVal = Math.round(startVal + diff * progress);
      currentValRef.current = nextVal;
      setDisplayValue(nextVal);
      if (progress < 1) {
        animId = window.requestAnimationFrame(step);
      }
    };

    animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [target, duration]);

  return displayValue;
}

export const LifestyleControls: React.FC<LifestyleControlsProps> = ({
  profile,
  onProfileChange,
  selectedSwapIds,
  onSwapsChange,
  onGeneratePlan,
  isGenerating,
}) => {
  const impact = calculateWinterSwapImpact(selectedSwapIds);
  const animatedPm25 = useAnimatedNumber(impact.monthlyPm25AvoidedGrams);
  const animatedCo2 = useAnimatedNumber(impact.monthlyCo2SavedKg);

  const handleProfileField = (field: keyof LifestyleProfile, value: string) => {
    onProfileChange({
      ...profile,
      [field]: value,
    });
  };

  const toggleSwap = (id: string) => {
    if (selectedSwapIds.includes(id)) {
      onSwapsChange(selectedSwapIds.filter((item) => item !== id));
    } else {
      onSwapsChange([...selectedSwapIds, id]);
    }
  };

  return (
    <section
      aria-labelledby="lifestyle-controls-heading"
      className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-6 transition-all hover:shadow-md"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            Step 2: Household Profile &amp; Clean-Air Habits
          </span>
          <h2 id="lifestyle-controls-heading" className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
            Tell us about your home setup
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Personalizes indoor air hacks to your vulnerability &amp; heating type
        </span>
      </div>

      {/* 1. Tactile Segmented Chips (Replacing boring <select> dropdowns) */}
      <div className="space-y-4">
        {/* Household Sensitivity Chips */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Who is at home? (Vulnerability)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: "General Family", label: "General Family", desc: "Healthy adults & teens", icon: Users },
              { id: "Young Kids", label: "Young Kids", desc: "Toddlers & school-goers", icon: Baby },
              { id: "Elderly / Asthma", label: "Elderly / Asthma", desc: "Seniors & respiratory conditions", icon: HeartPulse },
            ].map((item) => {
              const isSelected = profile.householdGroup === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleProfileField("householdGroup", item.id)}
                  className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/70"
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl shrink-0 ${
                    isSelected ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"
                  }`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900">{item.label}</p>
                    <p className="text-[11px] text-slate-500 font-medium truncate">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Home Type & Commute Chips in 2 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Home Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Home Structure
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "Apartment", label: "Apartment / Flat", icon: Building },
                { id: "House", label: "Independent House", icon: Home },
              ].map((item) => {
                const isSelected = profile.homeType === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleProfileField("homeType", item.id)}
                    className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20"
                        : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100/70"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-slate-500" aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Commute */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Primary Daily Commute
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "Transit", label: "Metro / Bus" },
                { id: "Car", label: "Car / Cab" },
                { id: "Walk/Bike", label: "Two-Wheeler" },
              ].map((item) => {
                const isSelected = profile.primaryCommute === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleProfileField("primaryCommute", item.id)}
                    className={`rounded-xl border p-2.5 text-center text-xs font-bold transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20"
                        : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100/70"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Heating Source */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Winter Heating &amp; Cooking Source
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: "Electric/Heat Pump", label: "⚡ Electric Room Heater / AC", desc: "No indoor combustion" },
              { id: "Gas Boiler", label: "♨️ Piped Gas (PNG) / LPG", desc: "Kitchen stove & geyser" },
              { id: "Wood/Solid Fuel", label: "🪵 Angithi / Biomass / Coal", desc: "Smoke & high soot trap" },
            ].map((item) => {
              const isSelected = profile.heatingSource === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleProfileField("heatingSource", item.id)}
                  className={`rounded-xl border p-2.5 text-left text-xs transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 font-bold"
                      : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100/70 font-semibold"
                  }`}
                >
                  <p>{item.label}</p>
                  <p className="text-[10px] text-slate-500 font-normal">{item.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Optional Short Notes with Friendly Placeholder */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="lifestyle-notes"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            Any specific home challenges? (Optional)
          </label>
          <span className="text-[11px] text-slate-400 font-medium">Max 200 chars</span>
        </div>
        <input
          id="lifestyle-notes"
          type="text"
          value={profile.customNotes}
          onChange={(e) => handleProfileField("customNotes", e.target.value)}
          maxLength={200}
          placeholder="e.g. Drafty bedroom balcony, no chimney in kitchen, elder with morning coughing..."
          className="block w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-2xs focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium"
        />
      </div>

      {/* 2. Sustainable Winter Swaps with Tactile Scorecards */}
      <div className="rounded-3xl border border-emerald-200/90 bg-emerald-50/40 p-5 sm:p-6 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-emerald-200/80 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Leaf className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-emerald-950">
                Small Household Habits &bull; Clean Neighborhood Air
              </h3>
              <p className="text-[11px] text-emerald-800/80 font-medium">
                Toggle your active winter choices to measure avoided soot and smoke
              </p>
            </div>
          </div>

          {/* Real-time scorecards with smooth counter animations */}
          <div className="flex items-center gap-2.5" role="region" aria-live="polite">
            <div className="rounded-2xl border border-emerald-300 bg-white px-3.5 py-2 text-center shadow-xs transition-transform hover:scale-105">
              <span className="block text-[10px] font-extrabold uppercase text-slate-500 flex items-center justify-center gap-1">
                <TrendingDown className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                Monthly PM2.5 Kept Away
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-700 tabular-nums">
                {animatedPm25} <span className="text-xs font-semibold">g</span>
              </span>
            </div>
            <div className="rounded-2xl border border-emerald-300 bg-white px-3.5 py-2 text-center shadow-xs transition-transform hover:scale-105">
              <span className="block text-[10px] font-extrabold uppercase text-slate-500 flex items-center justify-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                Monthly CO₂ Prevented
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-700 tabular-nums">
                {animatedCo2} <span className="text-xs font-semibold">kg</span>
              </span>
            </div>
          </div>
        </div>

        {/* Checkbox grid with tactile card toggles */}
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {REALISTIC_WINTER_SWAPS.map((swap) => {
            const isChecked = selectedSwapIds.includes(swap.id);
            return (
              <label
                key={swap.id}
                className={`flex cursor-pointer items-start space-x-3 rounded-2xl border p-4 transition-all select-none ${
                  isChecked
                    ? "border-emerald-600 bg-white shadow-xs ring-2 ring-emerald-500/20 scale-[1.01]"
                    : "border-emerald-100 bg-white/70 hover:bg-white hover:border-emerald-300"
                }`}
              >
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border mt-0.5 transition-colors ${
                  isChecked ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"
                }`}>
                  {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleSwap(swap.id)}
                  className="sr-only"
                />
                <div className="flex-1 text-xs">
                  <span className="font-bold text-slate-900 block leading-tight">{swap.name}</span>
                  <p className="mt-1 text-[11px] text-slate-600 leading-snug line-clamp-2 font-medium">
                    {swap.shortDescription}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] font-extrabold text-emerald-800">
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5">+{swap.pm25AvoidedGramsPerMonth}g PM2.5</span>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5">+{swap.co2SavedKgPerMonth}kg CO₂</span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. High-Contrast, Designer "Generate Tailored Plan" Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-xs text-slate-600 font-medium">
          Step 3: Grounded in your city&apos;s real-time inversion ceiling and daily clean air windows.
        </p>

        <button
          type="button"
          onClick={onGeneratePlan}
          disabled={isGenerating}
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-7 py-4 text-sm font-extrabold text-white shadow-md transition-all hover:opacity-95 hover:shadow-lg active:scale-95 disabled:opacity-50 shrink-0 w-full sm:w-auto"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Crafting Your Day Plan...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4 text-amber-300" aria-hidden="true" />
              Generate Your Family&apos;s Day Plan
            </>
          )}
        </button>
      </div>
    </section>
  );
};
