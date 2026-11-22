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
 * Animated number hook for smooth counting transitions
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
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 space-y-6 transition-all hover:shadow-md"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 gap-2">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-blue-600" aria-hidden="true" />
          <h2 id="lifestyle-controls-heading" className="text-base font-bold text-slate-900">
            Family Profile & Winter Impact Simulator
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Step 2: Customize family constraints & simulate emission reductions
        </span>
      </div>

      {/* 1. Household Profile Controls */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Household Sensitivity */}
        <div>
          <label
            htmlFor="household-sensitivity"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700"
          >
            Sensitivity
          </label>
          <select
            id="household-sensitivity"
            value={profile.householdGroup}
            onChange={(e) => handleProfileField("householdGroup", e.target.value)}
            className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
          >
            <option value="General Family">General Family</option>
            <option value="Young Kids">Young Kids</option>
            <option value="Elderly / Asthma">Elderly / Asthma</option>
          </select>
        </div>

        {/* Home Type */}
        <div>
          <label
            htmlFor="home-type"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700"
          >
            Home Type
          </label>
          <select
            id="home-type"
            value={profile.homeType}
            onChange={(e) => handleProfileField("homeType", e.target.value)}
            className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
          >
            <option value="Apartment">Apartment / High-rise</option>
            <option value="House">Independent House / Row Home</option>
          </select>
        </div>

        {/* Heating Source */}
        <div>
          <label
            htmlFor="heating-source"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700"
          >
            Heating Source
          </label>
          <select
            id="heating-source"
            value={profile.heatingSource}
            onChange={(e) => handleProfileField("heatingSource", e.target.value)}
            className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
          >
            <option value="Electric/Heat Pump">Electric Room Heater / AC</option>
            <option value="Gas Boiler">Piped Gas (PNG) / LPG Geyser</option>
            <option value="Wood/Solid Fuel">Angithi / Solid Fuel / Chulha</option>
          </select>
        </div>

        {/* Primary Commute */}
        <div>
          <label
            htmlFor="primary-commute"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700"
          >
            Primary Commute
          </label>
          <select
            id="primary-commute"
            value={profile.primaryCommute}
            onChange={(e) => handleProfileField("primaryCommute", e.target.value)}
            className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
          >
            <option value="Car">Car / Auto-rickshaw</option>
            <option value="Transit">Metro / Bus Transit</option>
            <option value="Walk/Bike">Walking / Two-Wheeler</option>
          </select>
        </div>
      </div>

      {/* Optional Short Notes */}
      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="lifestyle-notes"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700"
          >
            Housing Constraints / Notes (Optional)
          </label>
          <span className="text-[11px] text-slate-500 font-medium">Max 200 chars &bull; Untrusted context</span>
        </div>
        <input
          id="lifestyle-notes"
          type="text"
          value={profile.customNotes}
          onChange={(e) => handleProfileField("customNotes", e.target.value)}
          maxLength={200}
          placeholder="e.g., Drafty balcony slider, newborn crib in bedroom, no kitchen exhaust hood..."
          className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
        />
      </div>

      {/* 2. Sustainable Winter Swaps with Animated Scorecards */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 sm:p-5 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-emerald-200/80 pb-3">
          <div className="flex items-center space-x-2">
            <Leaf className="h-5 w-5 text-emerald-700" aria-hidden="true" />
            <h3 className="text-sm font-bold text-emerald-950">
              Sustainable Winter Swaps & Live Emission Badges
            </h3>
          </div>

          {/* Real-time live scorecards with smooth counter animations */}
          <div className="flex items-center gap-2.5" role="region" aria-live="polite">
            <div className="rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-center shadow-xs transition-transform hover:scale-105">
              <span className="block text-[10px] font-extrabold uppercase text-slate-500 flex items-center justify-center gap-1">
                <TrendingDown className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                Monthly PM2.5 Avoided
              </span>
              <span className="text-base font-extrabold text-emerald-700 tabular-nums">
                {animatedPm25} <span className="text-xs font-semibold">g</span>
              </span>
            </div>
            <div className="rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-center shadow-xs transition-transform hover:scale-105">
              <span className="block text-[10px] font-extrabold uppercase text-slate-500 flex items-center justify-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                Monthly CO₂ Saved
              </span>
              <span className="text-base font-extrabold text-emerald-700 tabular-nums">
                {animatedCo2} <span className="text-xs font-semibold">kg</span>
              </span>
            </div>
          </div>
        </div>

        {/* Checkbox grid with smooth hover transitions */}
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {REALISTIC_WINTER_SWAPS.map((swap) => {
            const isChecked = selectedSwapIds.includes(swap.id);
            return (
              <label
                key={swap.id}
                className={`flex cursor-pointer items-start space-x-3 rounded-xl border p-3.5 transition-all select-none ${
                  isChecked
                    ? "border-emerald-600 bg-emerald-50/90 shadow-xs ring-1 ring-emerald-600 scale-[1.01]"
                    : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleSwap(swap.id)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                />
                <div className="flex-1 text-xs">
                  <span className="font-bold text-slate-900 block leading-tight">{swap.name}</span>
                  <p className="mt-1 text-[11px] text-slate-600 leading-snug line-clamp-2">
                    {swap.shortDescription}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] font-bold text-emerald-800">
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5">+{swap.pm25AvoidedGramsPerMonth}g PM2.5</span>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5">+{swap.co2SavedKgPerMonth}kg CO₂</span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Accessible "Generate Tailored Plan" Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-xs text-slate-600 font-medium">
          Step 3: Grounded in your city&apos;s live inversion &amp; diurnal curve with zero medical speculation.
        </p>

        <button
          type="button"
          onClick={onGeneratePlan}
          disabled={isGenerating}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 shrink-0 w-full sm:w-auto"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Generating Tailored Plan...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
              Generate Tailored Plan
            </>
          )}
        </button>
      </div>
    </section>
  );
};
