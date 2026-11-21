import React from "react";
import {
  Users,
  Home,
  Flame,
  Car,
  Leaf,
  Sparkles,
  Loader2,
  Info,
  CheckCircle,
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

export const LifestyleControls: React.FC<LifestyleControlsProps> = ({
  profile,
  onProfileChange,
  selectedSwapIds,
  onSwapsChange,
  onGeneratePlan,
  isGenerating,
}) => {
  const impact = calculateWinterSwapImpact(selectedSwapIds);

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
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 gap-2">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-blue-600" aria-hidden="true" />
          <h2 id="lifestyle-controls-heading" className="text-base font-bold text-slate-900">
            Family Profile & Winter Impact Simulator
          </h2>
        </div>
        <span className="text-xs text-slate-500">
          Tailors daily IAQ hacks & measures neighborhood emission reductions
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
            className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
            className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
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
            className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="Electric/Heat Pump">Electric / Heat Pump</option>
            <option value="Gas Boiler">Gas Boiler</option>
            <option value="Wood/Solid Fuel">Wood / Solid Fuel</option>
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
            className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="Car">Car</option>
            <option value="Transit">Transit</option>
            <option value="Walk/Bike">Walk / Bike</option>
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
          <span className="text-[11px] text-slate-500">Max 200 chars • Untrusted context</span>
        </div>
        <input
          id="lifestyle-notes"
          type="text"
          value={profile.customNotes}
          onChange={(e) => handleProfileField("customNotes", e.target.value)}
          maxLength={200}
          placeholder="e.g., Drafty balcony slider, newborn crib in bedroom, no kitchen exhaust hood..."
          className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* 2. Sustainable Winter Swaps with Live Dynamic Scorecards */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-emerald-200/80 pb-3">
          <div className="flex items-center space-x-2">
            <Leaf className="h-5 w-5 text-emerald-700" aria-hidden="true" />
            <h3 className="text-sm font-bold text-emerald-950">
              Sustainable Winter Swaps & Live Emission Badges
            </h3>
          </div>

          {/* Real-time live scorecards */}
          <div className="flex items-center gap-2.5" role="region" aria-live="polite">
            <div className="rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-center shadow-xs">
              <span className="block text-[10px] font-extrabold uppercase text-slate-500">
                Monthly PM2.5 Avoided
              </span>
              <span className="text-base font-extrabold text-emerald-700">
                {impact.monthlyPm25AvoidedGrams} <span className="text-xs font-semibold">g</span>
              </span>
            </div>
            <div className="rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-center shadow-xs">
              <span className="block text-[10px] font-extrabold uppercase text-slate-500">
                Monthly CO₂ Saved
              </span>
              <span className="text-base font-extrabold text-emerald-700">
                {impact.monthlyCo2SavedKg} <span className="text-xs font-semibold">kg</span>
              </span>
            </div>
          </div>
        </div>

        {/* Checkbox grid */}
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {REALISTIC_WINTER_SWAPS.map((swap) => {
            const isChecked = selectedSwapIds.includes(swap.id);
            return (
              <label
                key={swap.id}
                className={`flex cursor-pointer items-start space-x-3 rounded-xl border p-3 transition-all ${
                  isChecked
                    ? "border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-600"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleSwap(swap.id)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                />
                <div className="flex-1 text-xs">
                  <span className="font-bold text-slate-900 block leading-tight">{swap.name}</span>
                  <p className="mt-1 text-[11px] text-slate-600 leading-snug line-clamp-2">
                    {swap.shortDescription}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] font-bold text-emerald-800">
                    <span>+{swap.pm25AvoidedGramsPerMonth}g PM2.5</span>
                    <span>•</span>
                    <span>+{swap.co2SavedKgPerMonth}kg CO₂</span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Accessible "Generate Tailored Plan" Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-xs text-slate-600">
          Combines live sensor readings, diurnal windows, and your profile into grounded daily actions.
        </p>

        <button
          type="button"
          onClick={onGeneratePlan}
          disabled={isGenerating}
          aria-live="polite"
          className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Synthesizing SmogWise Plan...</span>
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Generate Tailored Plan</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};

