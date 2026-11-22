import React from "react";
import { MapPin, Sliders, Sparkles, Check } from "lucide-react";

interface WorkflowStepperProps {
  currentCity: string;
  hasGeneratedPlan: boolean;
  onStepClick?: (step: number) => void;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  currentCity,
  hasGeneratedPlan,
}) => {
  const steps = [
    {
      id: 1,
      title: "1. Select Indian City",
      subtitle: `${currentCity} Live Air & Inversion`,
      icon: MapPin,
      status: "complete", // Always has a city selected
    },
    {
      id: 2,
      title: "2. Family Profile & Swaps",
      subtitle: "Tailor constraints & avoided emissions",
      icon: Sliders,
      status: "current",
    },
    {
      id: 3,
      title: "3. Generate AI Smog Plan",
      subtitle: hasGeneratedPlan ? "Personalized Daily Routine Ready" : "Click Generate Tailored Plan",
      icon: Sparkles,
      status: hasGeneratedPlan ? "complete" : "upcoming",
    },
  ];

  return (
    <nav
      aria-label="Workflow progress"
      className="rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-sm p-4 shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {steps.map((step) => {
          const Icon = step.icon;
          const isComplete = step.status === "complete";
          return (
            <div
              key={step.id}
              className={`flex items-center space-x-3 rounded-xl p-2.5 transition-all ${
                isComplete
                  ? "bg-blue-50/70 border border-blue-200/60 text-blue-900"
                  : "bg-slate-50 border border-slate-200/60 text-slate-700"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold text-xs shadow-xs transition-transform hover:scale-105 ${
                  isComplete
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-300 text-slate-700"
                }`}
                aria-hidden="true"
              >
                {isComplete ? <Check className="h-4 w-4 stroke-[3]" /> : <Icon className="h-4 w-4 text-slate-600" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  {step.title}
                  {isComplete && (
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" aria-label="Completed" />
                  )}
                </p>
                <p className="text-[11px] font-medium text-slate-500 truncate">{step.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
