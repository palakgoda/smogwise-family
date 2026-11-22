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
  MessageSquare,
  Copy,
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
      className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-6 transition-all"
    >
      {/* Editorial Headline Hero Banner */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 p-6 text-white shadow-sm">
        <div className="flex items-center space-x-2 text-sky-400">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          <h2 id="tailored-guidance-heading" className="text-xs font-bold uppercase tracking-widest text-sky-300">
            Your Family&apos;s Tailored Action Plan
          </h2>
        </div>
        <p className="mt-2 text-sm sm:text-base font-bold leading-relaxed text-slate-100 max-w-3xl">
          {plan.headlineSummary}
        </p>
        <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs text-xs text-slate-300 leading-relaxed font-medium">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
            Atmospheric Science Insight
          </span>
          {plan.inversionExplanation}
        </div>
      </div>

      {/* Modern Accessible Tabs (WAI-ARIA Pattern) */}
      <div className="border-b border-slate-200">
        <div
          role="tablist"
          aria-label="Guidance navigation tabs"
          className="flex flex-wrap gap-2 -mb-px"
        >
          {[
            { id: "routine" as TabType, label: "Daily Journey", icon: Clock },
            { id: "hacks" as TabType, label: "Low-Cost Hacks", icon: Wrench },
            { id: "impact" as TabType, label: "Neighborhood Impact", icon: Leaf },
            { id: "alert" as TabType, label: "WhatsApp Alert", icon: Share2 },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, tab.id)}
                className={`inline-flex items-center space-x-2 rounded-t-2xl border-b-2 px-5 py-3 text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "border-blue-600 bg-blue-50/60 text-blue-900 shadow-2xs"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Daily Routine Timeline Panel */}
      {activeTab === "routine" && (
        <div
          role="tabpanel"
          id="panel-routine"
          aria-labelledby="tab-routine"
          className="space-y-4 animate-fade-in-up"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.dailyRoutine.map((block) => (
              <div
                key={block.timeBlock}
                className="rounded-2xl border border-slate-200/90 bg-slate-50/40 p-5 transition-all hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center space-x-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-2xs">
                      {getTimeIcon(block.timeBlock)}
                    </div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      {block.timeBlock}
                    </span>
                  </div>
                  {block.timeBlock === "Midday Clean Window" && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                      Clean Window
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-sm font-extrabold text-slate-900 leading-snug">
                  {block.actionTitle}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-medium">
                  {block.guidance}
                </p>

                {/* Direct Cause-and-Effect Impact Pill */}
                <div className="mt-3.5 rounded-xl border border-blue-100 bg-blue-50/70 p-2.5 text-xs text-blue-950 font-medium">
                  <span className="block font-extrabold uppercase tracking-wider text-[10px] text-blue-800">
                    Direct Exposure Impact:
                  </span>
                  <span className="text-[11px] leading-snug text-blue-900">{block.directImpact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Low-Cost Indoor Air Hacks Panel */}
      {activeTab === "hacks" && (
        <div
          role="tabpanel"
          id="panel-hacks"
          aria-labelledby="tab-hacks"
          className="space-y-4 animate-fade-in-up"
        >
          {/* Cost Filters */}
          <div className="flex items-center space-x-2 pb-1 overflow-x-auto">
            <span className="text-xs font-bold text-slate-500 flex items-center mr-1">
              <Filter className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
              Budget:
            </span>
            {(["All", "Free", "Low-Cost", "Equipment"] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setCostFilter(tier)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                  costFilter === tier
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHacks.map((hack) => (
              <div
                key={hack.title}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 transition-all hover:shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                    {hack.title}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                      hack.costTier === "Free"
                        ? "bg-emerald-100 text-emerald-800"
                        : hack.costTier === "Low-Cost"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {hack.costTier}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed font-medium">
                  <p>
                    <strong className="text-slate-900">How to apply: </strong>
                    {hack.steps}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-2.5 text-xs text-emerald-950 font-medium">
                  <span className="block font-extrabold uppercase tracking-wider text-[10px] text-emerald-800">
                    Why It Works (Science Grounding):
                  </span>
                  <span className="text-[11px] leading-snug">{hack.whyItWorks}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Neighborhood Impact Explained Panel */}
      {activeTab === "impact" && (
        <div
          role="tabpanel"
          id="panel-impact"
          aria-labelledby="tab-impact"
          className="space-y-4 animate-fade-in-up"
        >
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5">
            <h3 className="text-sm font-extrabold text-emerald-950 flex items-center gap-2">
              <Leaf className="h-4 w-4 text-emerald-700" aria-hidden="true" />
              How Your Household Habits Clean the Neighborhood Air
            </h3>
            <p className="mt-1 text-xs text-emerald-900/80 leading-relaxed font-medium">
              Winter inversions act like an airtight bowl. When you reduce heating smoke or cold car runs, you directly lower the concentration of toxic soot where children and seniors walk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.sustainableAlternatives.map((alt) => (
              <div
                key={alt.habitSwap}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-2.5 transition-all hover:shadow-sm"
              >
                <div className="flex items-center space-x-2 text-xs font-extrabold text-slate-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>{alt.habitSwap}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  <strong className="text-slate-800">Practical Routine: </strong>
                  {alt.practicalTip}
                </p>
                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-2.5 text-xs text-blue-950 font-medium">
                  <span className="block font-extrabold uppercase tracking-wider text-[10px] text-blue-800">
                    Community Benefit:
                  </span>
                  <span className="text-[11px] leading-snug">{alt.directCommunityImpact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. WhatsApp / Community Alert Card */}
      {activeTab === "alert" && (
        <div
          role="tabpanel"
          id="panel-alert"
          aria-labelledby="tab-alert"
          className="space-y-4 animate-fade-in-up"
        >
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-sm">
                <MessageSquare className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                <span>Ready-to-Share Society &amp; WhatsApp Alert</span>
              </div>
              <button
                type="button"
                onClick={copyToClipboard}
                className="inline-flex items-center space-x-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-600 active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-white stroke-[3]" aria-hidden="true" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copy Message</span>
                  </>
                )}
              </button>
            </div>

            {/* Chat Bubble Style Preview */}
            <div className="rounded-2xl border border-emerald-200 bg-white p-4 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium shadow-2xs whitespace-pre-line">
              {plan.communityShareMessage}
            </div>

            <p className="text-[11px] text-slate-500 font-medium">
              Share this with your apartment WhatsApp group, colony association, or school parents circle so everyone knows today&apos;s cleanest outdoor window!
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
