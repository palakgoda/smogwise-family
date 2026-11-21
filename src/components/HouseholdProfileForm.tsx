import React from "react";
import { Users, Home, Flame, Car, Info } from "lucide-react";

export interface FamilyProfileState {
  householdGroup: string;
  homeType: string;
  heatingSource: string;
  primaryCommute: string;
  customNotes: string;
}

interface HouseholdProfileFormProps {
  profile: FamilyProfileState;
  onChange: (updated: FamilyProfileState) => void;
}

export const HouseholdProfileForm: React.FC<HouseholdProfileFormProps> = ({
  profile,
  onChange,
}) => {
  const handleChange = (
    field: keyof FamilyProfileState,
    value: string
  ) => {
    onChange({
      ...profile,
      [field]: value,
    });
  };

  return (
    <section
      aria-labelledby="household-profile-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        <Users className="h-5 w-5 text-blue-600" aria-hidden="true" />
        <h2 id="household-profile-heading" className="text-base font-bold text-slate-900">
          Household & Living Context
        </h2>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Household Group */}
        <div>
          <label
            htmlFor="householdGroup"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            Household Vulnerability
          </label>
          <select
            id="householdGroup"
            value={profile.householdGroup}
            onChange={(e) => handleChange("householdGroup", e.target.value)}
            className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Families with infants or toddlers">Families with infants or toddlers</option>
            <option value="Multi-generational with seniors or asthma">Multi-generational with seniors or asthma</option>
            <option value="General adult working household">General adult working household</option>
            <option value="Athletes or outdoor active residents">Athletes or outdoor active residents</option>
          </select>
        </div>

        {/* Home Type */}
        <div>
          <label
            htmlFor="homeType"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            Housing Structure
          </label>
          <select
            id="homeType"
            value={profile.homeType}
            onChange={(e) => handleChange("homeType", e.target.value)}
            className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Apartment / Multi-story Flat">Apartment / Multi-story Flat</option>
            <option value="Old masonry building (drafty gaps)">Old masonry building (drafty gaps)</option>
            <option value="Detached single-family house">Detached single-family house</option>
            <option value="Townhouse / Row house">Townhouse / Row house</option>
          </select>
        </div>

        {/* Heating Source */}
        <div>
          <label
            htmlFor="heatingSource"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            Primary Heating Source
          </label>
          <select
            id="heatingSource"
            value={profile.heatingSource}
            onChange={(e) => handleChange("heatingSource", e.target.value)}
            className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Electric heat pump / Radiators">Electric heat pump / Radiators</option>
            <option value="Wood stove / Fireplace (biomass)">Wood stove / Fireplace (biomass)</option>
            <option value="Natural gas central heating">Natural gas central heating</option>
            <option value="Kerosene / Portable gas heater">Kerosene / Portable gas heater</option>
          </select>
        </div>

        {/* Primary Commute */}
        <div>
          <label
            htmlFor="primaryCommute"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            Daily Commute Style
          </label>
          <select
            id="primaryCommute"
            value={profile.primaryCommute}
            onChange={(e) => handleChange("primaryCommute", e.target.value)}
            className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Public transit / Metro / Bus">Public transit / Metro / Bus</option>
            <option value="Solo vehicle (gasoline/diesel)">Solo vehicle (gasoline/diesel)</option>
            <option value="Carpool or rideshare">Carpool or rideshare</option>
            <option value="Walking or bicycle">Walking or bicycle</option>
            <option value="Work from home (no commute)">Work from home (no commute)</option>
          </select>
        </div>
      </div>

      {/* Untrusted Custom Notes Field */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="customNotes"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            Specific Constraints & Housing Notes
          </label>
          <span className="text-[11px] text-slate-500">Untrusted descriptive context</span>
        </div>
        <textarea
          id="customNotes"
          rows={2}
          value={profile.customNotes}
          onChange={(e) => handleChange("customNotes", e.target.value)}
          maxLength={300}
          placeholder="e.g., North-facing leaky balcony window, newborn sleep room, no kitchen range hood..."
          aria-describedby="customNotes-help"
          className="mt-1 block w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p id="customNotes-help" className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
          <Info className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          Used strictly to calibrate practical IAQ hacks. Prompt commands are automatically filtered.
        </p>
      </div>
    </section>
  );
};

