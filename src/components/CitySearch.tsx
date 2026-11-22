import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, MapPin, Building2, ChevronRight, Compass } from "lucide-react";
import { INDIAN_DEMO_HUBS, searchIndianCities, IndianCity } from "@/lib/aqi/indian-cities";

interface CitySearchProps {
  currentCity: string;
  onSelectCity: (city: string) => Promise<void>;
  isLoading: boolean;
}

export const CitySearch: React.FC<CitySearchProps> = ({
  currentCity,
  onSelectCity,
  isLoading,
}) => {
  const [searchInput, setSearchInput] = useState(currentCity);
  const [suggestions, setSuggestions] = useState<IndianCity[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync internal state when currentCity prop updates
  useEffect(() => {
    setSearchInput(currentCity);
  }, [currentCity]);

  // Update suggestions dynamically
  useEffect(() => {
    if (searchInput.trim().length >= 1) {
      const matches = searchIndianCities(searchInput, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  }, [searchInput]);

  // Close on outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setIsDropdownOpen(false);
      onSelectCity(searchInput.trim());
    }
  };

  const handleSelectSuggestion = (city: IndianCity) => {
    setSearchInput(city.name);
    setIsDropdownOpen(false);
    onSelectCity(city.name);
  };

  const handleDemoClick = (cityName: string) => {
    setSearchInput(cityName);
    setIsDropdownOpen(false);
    onSelectCity(cityName);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[highlightedIndex]);
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  return (
    <section
      aria-label="Search and select city"
      className="relative rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all hover:shadow-md"
      ref={wrapperRef}
    >
      {/* Human Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            Live Urban Smog Monitor
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5 tracking-tight">
            Checking air quality for <span className="underline decoration-blue-500 decoration-2 underline-offset-4">{currentCity}</span>
          </h2>
        </div>
        <p className="text-xs font-medium text-slate-500 max-w-xs sm:text-right">
          Switch to any Indian city or district to tailor today&apos;s exposure plan.
        </p>
      </div>

      {/* Modern Search Bar with autocomplete */}
      <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-2.5">
        <label htmlFor="city-search-input" className="sr-only">
          Search any city or district across India
        </label>
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Search className="h-5 w-5" aria-hidden="true" />
          </div>
          <input
            id="city-search-input"
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isDropdownOpen}
            aria-controls="city-suggestions-list"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setIsDropdownOpen(true);
              setHighlightedIndex(-1);
            }}
            onFocus={() => {
              if (suggestions.length > 0) setIsDropdownOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type any Indian city or district (e.g. Patna, Lucknow, Mumbai, Noida, Jaipur)..."
            disabled={isLoading}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-900 placeholder-slate-400 shadow-2xs transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
          />

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && suggestions.length > 0 && (
            <ul
              id="city-suggestions-list"
              role="listbox"
              className="absolute z-30 mt-1.5 max-h-64 w-full overflow-auto rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl ring-1 ring-black/5"
            >
              {suggestions.map((item, index) => {
                const isSelected = index === highlightedIndex;
                return (
                  <li
                    key={`${item.name}-${item.state}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectSuggestion(item)}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                      isSelected ? "bg-blue-50 text-blue-900 font-bold" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">{item.name}</span>
                        <span className="ml-1.5 text-xs text-slate-500 font-medium">{item.state}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !searchInput.trim()}
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-600 active:scale-95 disabled:opacity-50 shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Fetching Air...
            </>
          ) : (
            "Check Live Air"
          )}
        </button>
      </form>

      {/* Quick-Pick Indian Winter Smog Hubs */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-600 flex items-center mr-1">
          <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" aria-hidden="true" />
          Winter Smog Hubs:
        </span>
        {INDIAN_DEMO_HUBS.map((c) => {
          const isActive =
            currentCity.toLowerCase() === c.name.toLowerCase() ||
            currentCity.toLowerCase().includes(c.name.toLowerCase());
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => handleDemoClick(c.name)}
              disabled={isLoading}
              title={`${c.name}: ${c.badge}`}
              aria-pressed={isActive}
              className={`inline-flex items-center rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs scale-105 ring-2 ring-blue-300"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80 hover:scale-102"
              }`}
            >
              <span>{c.label}</span>
              <span className="ml-1 text-[10px] opacity-75 hidden md:inline">({c.badge})</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
