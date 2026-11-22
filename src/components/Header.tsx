import React from "react";
import { Wind, ShieldCheck, HeartHandshake, Sparkles } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xs" role="banner">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <div className="flex items-center space-x-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 text-white shadow-sm ring-1 ring-black/5">
            <Wind className="h-5 w-5 text-sky-300" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                SmogWise <span className="text-blue-600 font-medium text-base">Family</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                <Sparkles className="h-3 w-3 text-amber-500" aria-hidden="true" />
                Winter Smog Guard
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              Daily clean-air routines, low-cost indoor hacks &amp; neighborhood emission tracking
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-3 text-xs font-semibold text-slate-600">
          <div className="flex items-center space-x-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            <span>Open-Meteo Grounded</span>
          </div>
          <div className="flex items-center space-x-1.5 rounded-full bg-blue-50 border border-blue-200/80 px-3 py-1 text-blue-800">
            <HeartHandshake className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
            <span>For Indian Families</span>
          </div>
        </div>
      </div>
    </header>
  );
};
