import React from "react";
import { Wind, ShieldCheck, HeartHandshake } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm" role="banner">
      {/* Skip to content link for keyboard & screen reader accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
            <Wind className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                SmogWise Family
              </h1>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                Winter Smog Assistant
              </span>
            </div>
            <p className="text-xs text-slate-600 sm:text-sm">
              Empathetic, science-grounded air quality guidance & low-cost household hacks
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-4 text-xs font-medium text-slate-600">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <span>Sensor Grounded</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <HeartHandshake className="h-4 w-4 text-blue-600" aria-hidden="true" />
            <span>Community Focused</span>
          </div>
        </div>
      </div>
    </header>
  );
};

