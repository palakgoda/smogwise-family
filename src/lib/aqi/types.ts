export interface GeoLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export type SeverityLabel =
  | "Good"
  | "Moderate"
  | "Unhealthy for Sensitive Groups"
  | "Unhealthy"
  | "Very Unhealthy"
  | "Hazardous";

export interface AirQualityMetrics {
  usAqi: number;
  pm25: number;      // µg/m³
  pm10: number;      // µg/m³
  no2: number;       // µg/m³ or ppb
  severityLabel: SeverityLabel;
}

export interface WeatherMetrics {
  tempC: number;
  windKmh: number;
  relativeHumidity?: number;
  surfacePressure?: number;
}

export type InversionRiskLevel = "Low" | "Moderate" | "High" | "Severe";

export interface InversionAnalysis {
  inversionRisk: InversionRiskLevel;
  explanation: string;
}

export interface WindowAnalysis {
  cleanestWindow: string;
  peakSmogWindow: string;
}

export interface VerifiedAqiContext {
  location: {
    city: string;
    country: string;
  };
  airQuality: AirQualityMetrics & InversionAnalysis & WindowAnalysis;
  weather: WeatherMetrics;
  familyProfile?: {
    householdGroup: string;
    homeType: string;
    heatingSource: string;
    primaryCommute: string;
    customNotes?: string;
  };
  selectedSwapsImpact?: {
    monthlyCo2SavedKg: number;
    monthlyPm25AvoidedGrams: number;
    activeSwaps: string[];
  };
}

