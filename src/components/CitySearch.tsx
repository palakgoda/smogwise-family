import React, { useState } from "react";
import { Search, Loader2, MapPin, Sparkles } from "lucide-react";

interface CitySearchProps {
  currentCity: string;
  onSelectCity: (city: string) => Promise<void>;
  isLoading: boolean;
}

const DEMO_CITIES = [
  { name: "Delhi", label: "Delhi 🇮🇳", desc: "Hazardous Smog & Inversion" },
  { name: "Warsaw", label: "Warsaw 🇵🇱", desc: "Winter Coal Heating Smoke" },
  { name: "Milan", label: "Milan 🇮🇹", desc: "Po Valley Basin Inversion" },
  { name: "Utrecht", label: "Utrecht 🇳🇱", desc: "Clean Air Benchmark" },
];

export const CitySearch: React.FC<CitySearchProps> = ({
  currentCity,
  onSelectCity,
  isLoading,
}) => {
  const [searchInput, setSearchInput] = useState(currentCity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSelectCity(searchInput.trim());
    }
  };

  const handleDemoClick = (cityName: string) => {
    setSearchInput(cityName);
    onSelectCity(cityName);
  };

  return (
    <section
      aria-label="Search and select city for air quality readings"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="city-search-input" className="sr-only">
          Search any city globally for winter air quality
        </label>
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-5 w-5" aria-hidden="true" />
          </div>
          <input
            id="city-search-input"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search any city globally (e.g., Delhi, Warsaw, Salt Lake City, London)..."
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-300 bg-slate-50/70 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !searchInput.trim()}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Fetching Readings...
            </>
          ) : (
            "Check Live Air"
          )}
        </button>
      </form>

      {/* Quick-Pick Demo Cities */}
      <div className="mt-4 pt-3.5 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center mr-1">
            <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" aria-hidden="true" />
            Quick Demo Scenarios:
          </span>
          {DEMO_CITIES.map((c) => {
            const isActive =
              currentCity.toLowerCase() === c.name.toLowerCase() ||
              currentCity.toLowerCase().includes(c.name.toLowerCase());
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => handleDemoClick(c.name)}
                disabled={isLoading}
                title={c.desc}
                aria-pressed={isActive}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80"
                }`}
              >
                <span>{c.label}</span>
                <span className="ml-1 text-[10px] opacity-75 hidden md:inline">({c.desc})</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

