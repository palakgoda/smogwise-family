import React, { useState, useRef } from "react";
import {
  Clock,
  Wrench,
  Leaf,
  Share2,
  Check,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Filter,
} from "lucide-react";
import { AssistantResponse } from "@/lib/ai/schema";

interface GuidanceViewProps {
  plan: AssistantResponse;
}

type TabType = "routine" | "hacks" | "impact" | "alert";

export const GuidanceView: React.FC<GuidanceViewProps> = ({ plan }) => {
  const [activeTab, setActiveTab] = useState<TabType>("routine");
  const [costFilter, setCostFilter] = useState<"All" | "Free" | "Low-Cost" | "Equipment">("All");
  const [copied, setCopied] = useState<boolean>(false);
  const tabRefs = useRef<{ [key in TabType]?: HTMLButtonElement | null }>({});

  const handleKeyDown = (e: React.KeyboardEvent, currentTab: TabType) => {
    const tabs: TabType[] = ["routine", "hacks", "impact", "alert"];
    const currentIndex = tabs.indexOf(currentTab);

    let nextIndex = currentIndex;
    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab);
    tabRefs.current[nextTab]?.focus();
  };

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(plan.communityShareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getTimeIcon = (timeBlock: string) => {
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

  const filteredHacks =
    costFilter === "All"
      ? plan.indoorAirHacks
      : plan.indoorAirHacks.filter((h) => h.costTier === costFilter);

  return (
    <section
      aria-labelledby="tailored-guidance-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 space-y-5"
    >
      {/* Plan Header & Inversion Summary Banner */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/90 to-indigo-50/60 p-4 sm:p-5">
        <div className="flex items-center space-x-2 text-blue-900">
          <Sparkles className="h-5 w-5 text-blue-600" aria-hidden="true" />
          <h2 id="tailored-guidance-heading" className="text-base font-bold sm:text-lg">
            AI-Tailored Daily Smog Action Plan
          </h2>
        </div>
        <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
          {plan.headlineSummary}
        </p>
        <div className="mt-3 rounded-xl border border-blue-200/80 bg-white/90 p-3 text-xs text-slate-700 leading-relaxed">
          <strong className="text-blue-950 font-bold uppercase tracking-wider text-[11px] block mb-0.5">
            Why It&apos;s Trapping Today (Atmospheric Science)
          </strong>
          {plan.inversionExplanation}
        </div>
      </div>

      {/* Accessible Tab Navigation (WCAG 2.1 AA keyboard & screen-reader compliant) */}
      <div
        role="tablist"
        aria-label="SmogWise Guidance Panels"
        className="flex flex-wrap gap-2 border-b border-slate-200 pb-3"
      >
        <button
          ref={(el) => { tabRefs.current.routine = el; }}
          role="tab"
          id="tab-routine"
          aria-selected={activeTab === "routine"}
          aria-controls="panel-routine"
          tabIndex={activeTab === "routine" ? 0 : -1}
          onClick={() => setActiveTab("routine")}
          onKeyDown={(e) => handleKeyDown(e, "routine")}
          className={`inline-flex items-center space-x-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
            activeTab === "routine"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span>Daily Routine</span>
        </button>

        <button
          ref={(el) => { tabRefs.current.hacks = el; }}
          role="tab"
          id="tab-hacks"
          aria-selected={activeTab === "hacks"}
          aria-controls="panel-hacks"
          tabIndex={activeTab === "hacks" ? 0 : -1}
          onClick={() => setActiveTab("hacks")}
          onKeyDown={(e) => handleKeyDown(e, "hacks")}
          className={`inline-flex items-center space-x-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
            activeTab === "hacks"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Wrench className="h-4 w-4" aria-hidden="true" />
          <span>Indoor Air Hacks</span>
        </button>

        <button
          ref={(el) => { tabRefs.current.impact = el; }}
          role="tab"
          id="tab-impact"
          aria-selected={activeTab === "impact"}
          aria-controls="panel-impact"
          tabIndex={activeTab === "impact" ? 0 : -1}
          onClick={() => setActiveTab("impact")}
          onKeyDown={(e) => handleKeyDown(e, "impact")}
          className={`inline-flex items-center space-x-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
            activeTab === "impact"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Leaf className="h-4 w-4" aria-hidden="true" />
          <span>Impact Explained</span>
        </button>

        <button
          ref={(el) => { tabRefs.current.alert = el; }}
          role="tab"
          id="tab-alert"
          aria-selected={activeTab === "alert"}
          aria-controls="panel-alert"
          tabIndex={activeTab === "alert" ? 0 : -1}
          onClick={() => setActiveTab("alert")}
          onKeyDown={(e) => handleKeyDown(e, "alert")}
          className={`inline-flex items-center space-x-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
            activeTab === "alert"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
          <span>Community Alert</span>
        </button>
      </div>

      {/* Tab Panel 1: Daily Routine */}
      <div
        id="panel-routine"
        role="tabpanel"
        aria-labelledby="tab-routine"
        hidden={activeTab !== "routine"}
        className="space-y-3"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {plan.dailyRoutine.map((step, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-4 shadow-xs transition-shadow ${
                step.timeBlock === "Midday Clean Window"
                  ? "border-emerald-300 bg-emerald-50/50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTimeIcon(step.timeBlock)}
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {step.timeBlock}
                  </span>
                </div>
                {step.timeBlock === "Midday Clean Window" && (
                  <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-extrabold text-emerald-950">
                    Clean Window
                  </span>
                )}
              </div>

              <h3 className="mt-2 text-sm font-bold text-slate-900">{step.actionTitle}</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">{step.guidance}</p>

              {/* Direct Impact Callout */}
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/90 p-2.5">
                <span className="block text-[10px] font-extrabold uppercase text-slate-500">
                  Direct Impact
                </span>
                <p className="mt-0.5 text-xs font-semibold text-blue-900">
                  {step.directImpact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Panel 2: Indoor Air Hacks */}
      <div
        id="panel-hacks"
        role="tabpanel"
        aria-labelledby="tab-hacks"
        hidden={activeTab !== "hacks"}
        className="space-y-4"
      >
        {/* Cost Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center mr-1">
            <Filter className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
            Filter by Budget Tier:
          </span>
          {(["All", "Free", "Low-Cost", "Equipment"] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setCostFilter(tier)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                costFilter === tier
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {filteredHacks.map((hack, idx) => {
            const badgeColor =
              hack.costTier === "Free"
                ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                : hack.costTier === "Low-Cost"
                ? "bg-blue-100 text-blue-900 border-blue-300"
                : "bg-purple-100 text-purple-900 border-purple-300";

            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{hack.title}</h3>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badgeColor}`}>
                      {hack.costTier}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">How to do it: </strong>
                    {hack.steps}
                  </p>
                </div>

                <div className="mt-3 rounded-xl bg-blue-50/70 p-2.5 border border-blue-100 text-xs text-blue-950">
                  <strong className="font-bold text-blue-900">Why it works: </strong>
                  {hack.whyItWorks}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tab Panel 3: Impact Explained */}
      <div
        id="panel-impact"
        role="tabpanel"
        aria-labelledby="tab-impact"
        hidden={activeTab !== "impact"}
        className="space-y-4"
      >
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 text-xs text-emerald-950 leading-relaxed">
          <strong className="font-bold text-emerald-900">Cause-and-Effect Winter Science: </strong>
          During winter thermal inversions, smoke does not escape upward into the sky. Every single fireplace skipped, cold vehicle start avoided, and thermostat degree reduced directly removes soot from the 10-meter ground breathing layer where children walk and sleep.
        </div>

        <div className="space-y-3">
          {plan.sustainableAlternatives.map((alt, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-xs"
            >
              <h3 className="text-sm font-bold text-emerald-950">{alt.habitSwap}</h3>
              <p className="mt-1 text-xs text-slate-700">
                <strong className="text-slate-900">Execution Tip: </strong>
                {alt.practicalTip}
              </p>
              <div className="mt-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs font-semibold text-emerald-950">
                {alt.directCommunityImpact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Panel 4: Community Alert (WhatsApp Share Card) */}
      <div
        id="panel-alert"
        role="tabpanel"
        aria-labelledby="tab-alert"
        hidden={activeTab !== "alert"}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              WhatsApp & Neighborhood Group Alert Card
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Share today&apos;s cleanest air window and one collective action with your apartment or street group.
            </p>
          </div>

          <button
            type="button"
            onClick={copyToClipboard}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-4 w-4" aria-hidden="true" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
                <span>Copy Message</span>
              </>
            )}
          </button>
        </div>

        {/* Screen-reader announcement region */}
        <div className="sr-only" aria-live="polite">
          {copied ? "Community alert message copied to clipboard." : ""}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 leading-relaxed select-all">
          {plan.communityShareMessage}
        </div>
      </div>
    </section>
  );
};

