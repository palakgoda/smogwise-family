import React, { useState } from "react";
import {
  Sparkles,
  Sun,
  Moon,
  CloudSun,
  Sunset,
  Wrench,
  Share2,
  Check,
  Flame,
  ShieldAlert,
  Compass,
  ArrowRight,
} from "lucide-react";
import { AssistantResponse } from "@/lib/ai/schema";

interface DailyPlanViewProps {
  plan: AssistantResponse;
}

export const DailyPlanView: React.FC<DailyPlanViewProps> = ({ plan }) => {
  const [copied, setCopied] = useState(false);

  const copyShareMessage = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(plan.communityShareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getTimeBlockIcon = (timeBlock: string) => {
    switch (timeBlock) {
      case "Morning":
        return <Sun className="h-5 w-5 text-amber-500" aria-hidden="true" />;
      case "Midday Clean Window":
        return <CloudSun className="h-5 w-5 text-emerald-600" aria-hidden="true" />;
      case "Evening":
        return <Sunset className="h-5 w-5 text-orange-500" aria-hidden="true" />;
      case "Night":
      default:
        return <Moon className="h-5 w-5 text-indigo-500" aria-hidden="true" />;
    }
  };

  const getCostTierBadge = (tier: "Free" | "Low-Cost" | "Equipment") => {
    switch (tier) {
      case "Free":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Low-Cost":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Equipment":
      default:
        return "bg-purple-100 text-purple-800 border-purple-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Headline Summary & Inversion Physics */}
      <section
        aria-labelledby="plan-summary-heading"
        className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 p-5 shadow-sm sm:p-6"
      >
        <div className="flex items-center space-x-2 text-blue-900">
          <Sparkles className="h-5 w-5 text-blue-600" aria-hidden="true" />
          <h2 id="plan-summary-heading" className="text-base font-bold sm:text-lg">
            Today&apos;s SmogWise Action Plan
          </h2>
        </div>
        <p className="mt-2 text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
          {plan.headlineSummary}
        </p>

        <div className="mt-4 rounded-xl border border-blue-200/70 bg-white/80 p-3.5">
          <span className="block text-xs font-bold uppercase tracking-wider text-blue-900">
            Why It&apos;s Happening (Winter Inversion Physics)
          </span>
          <p className="mt-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {plan.inversionExplanation}
          </p>
        </div>
      </section>

      {/* 2. 4-Phase Daily Routine */}
      <section aria-labelledby="routine-heading" className="space-y-3">
        <div className="flex items-center space-x-2">
          <Compass className="h-5 w-5 text-blue-600" aria-hidden="true" />
          <h2 id="routine-heading" className="text-base font-bold text-slate-900">
            Tailored 4-Phase Daily Routine
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {plan.dailyRoutine.map((step, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-4 shadow-xs transition-shadow ${
                step.timeBlock === "Midday Clean Window"
                  ? "border-emerald-300 bg-emerald-50/50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTimeBlockIcon(step.timeBlock)}
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {step.timeBlock}
                  </span>
                </div>
                {step.timeBlock === "Midday Clean Window" && (
                  <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                    Clean Window
                  </span>
                )}
              </div>

              <h3 className="mt-2 text-sm font-bold text-slate-900">{step.actionTitle}</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">{step.guidance}</p>

              <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50/80 p-2.5">
                <span className="block text-[10px] font-bold uppercase text-slate-500">
                  Direct Exposure Impact
                </span>
                <p className="mt-0.5 text-xs font-medium text-blue-900">
                  {step.directImpact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Budget-Conscious Indoor Air Quality Hacks */}
      <section aria-labelledby="iaq-hacks-heading" className="space-y-3">
        <div className="flex items-center space-x-2">
          <Wrench className="h-5 w-5 text-blue-600" aria-hidden="true" />
          <h2 id="iaq-hacks-heading" className="text-base font-bold text-slate-900">
            Budget-Conscious Indoor Air Hacks
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {plan.indoorAirHacks.map((hack, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{hack.title}</h3>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${getCostTierBadge(
                      hack.costTier
                    )}`}
                  >
                    {hack.costTier}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">How to do it: </strong>
                  {hack.steps}
                </p>
              </div>

              <div className="mt-3 rounded-lg bg-blue-50/60 p-2 border border-blue-100 text-xs text-blue-950">
                <strong className="font-semibold text-blue-900">Why it works: </strong>
                {hack.whyItWorks}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Sustainable Swaps & Neighborhood Impact */}
      <section
        aria-labelledby="sustainable-impact-heading"
        className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-sm"
      >
        <div className="flex items-center space-x-2 text-emerald-900">
          <Flame className="h-5 w-5 text-emerald-700" aria-hidden="true" />
          <h2 id="sustainable-impact-heading" className="text-base font-bold text-slate-900">
            Neighborhood Emissions & Collective Swaps
          </h2>
        </div>

        <div className="mt-3 space-y-2.5">
          {plan.sustainableAlternatives.map((alt, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-emerald-200 bg-white p-3.5 shadow-xs"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {alt.habitSwap}
                </h3>
              </div>
              <p className="mt-1 text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Practical execution: </span>
                {alt.practicalTip}
              </p>
              <p className="mt-1 text-xs font-medium text-emerald-900 bg-emerald-50/70 p-2 rounded-md border border-emerald-100">
                {alt.directCommunityImpact}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Community Share Message (WhatsApp / Telegram / Neighborhood Alert) */}
      <section
        aria-labelledby="community-share-heading"
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Share2 className="h-5 w-5 text-blue-600" aria-hidden="true" />
              <h2 id="community-share-heading" className="text-sm font-bold text-slate-900">
                WhatsApp / Neighborhood Community Alert
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Copy this friendly alert to share today&apos;s cleanest air window with your apartment or street group.
            </p>
          </div>

          <button
            type="button"
            onClick={copyShareMessage}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
            aria-live="polite"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Share2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Copy Alert Message
              </>
            )}
          </button>
        </div>

        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-800 font-mono leading-relaxed select-all">
          {plan.communityShareMessage}
        </div>
      </section>
    </div>
  );
};

