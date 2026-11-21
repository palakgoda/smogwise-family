import React from "react";
import { Sparkles, Leaf, Shield, Check, Info } from "lucide-react";
import { WINTER_HOUSEHOLD_SWAPS } from "@/lib/impact/swaps-data";
import { calculateSwapImpact } from "@/lib/impact/calculator";

interface SustainableSwapsSelectorProps {
  selectedSwapIds: string[];
  onChange: (ids: string[]) => void;
}

export const SustainableSwapsSelector: React.FC<SustainableSwapsSelectorProps> = ({
  selectedSwapIds,
  onChange,
}) => {
  const impact = calculateSwapImpact(selectedSwapIds);

  const toggleSwap = (id: string) => {
    if (selectedSwapIds.includes(id)) {
      onChange(selectedSwapIds.filter((item) => item !== id));
    } else {
      onChange([...selectedSwapIds, id]);
    }
  };

  return (
    <section
      aria-labelledby="sustainable-swaps-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 gap-2">
        <div className="flex items-center space-x-2">
          <Leaf className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          <h2 id="sustainable-swaps-heading" className="text-base font-bold text-slate-900">
            Household Winter Emission Swaps
          </h2>
        </div>
        <span className="text-xs font-medium text-slate-500">
          Select habits your family can commit to this winter
        </span>
      </div>

      {/* Real-time Dynamic Impact Scoreboard */}
      <div
        role="region"
        aria-live="polite"
        className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Verified Monthly Household Impact
              </span>
            </div>
            <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
              {impact.neighborhoodEmissionsStory}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white px-3 py-2 border border-emerald-200 text-center shadow-xs">
              <span className="block text-[11px] font-bold uppercase text-slate-500">CO2 Reduced</span>
              <span className="text-lg font-extrabold text-emerald-700">
                {impact.monthlyCo2SavedKg} <span className="text-xs font-semibold">kg/mo</span>
              </span>
            </div>
            <div className="rounded-lg bg-white px-3 py-2 border border-emerald-200 text-center shadow-xs">
              <span className="block text-[11px] font-bold uppercase text-slate-500">PM2.5 Avoided</span>
              <span className="text-lg font-extrabold text-emerald-700">
                {impact.monthlyPm25AvoidedGrams} <span className="text-xs font-semibold">g/mo</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Swaps Checklist */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {WINTER_HOUSEHOLD_SWAPS.map((swap) => {
          const isSelected = selectedSwapIds.includes(swap.id);
          return (
            <label
              key={swap.id}
              className={`relative flex cursor-pointer items-start space-x-3 rounded-xl border p-3.5 transition-colors ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500"
                  : "border-slate-200 bg-white hover:bg-slate-50/80"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSwap(swap.id)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{swap.name}</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                    {swap.category}
                  </span>
                </div>
                <p className="mt-1 text-slate-600">{swap.shortDescription}</p>
                <div className="mt-2 flex items-center space-x-3 text-[11px] font-medium text-emerald-700">
                  <span>+{swap.co2SavedKgPerMonth} kg CO2</span>
                  <span>+{swap.pm25AvoidedGramsPerMonth} g soot avoided</span>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </section>
  );
};

