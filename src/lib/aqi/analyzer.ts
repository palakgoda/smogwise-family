import {
  AirQualityMetrics,
  InversionAnalysis,
  InversionRiskLevel,
  SeverityLabel,
  WeatherMetrics,
  WindowAnalysis,
} from "./types";

export interface AqiCategorization {
  label: SeverityLabel;
  iconKey: "CheckCircle2" | "AlertCircle" | "AlertTriangle" | "ShieldAlert";
  accessibleGuidance: string;
  levelNumber: number;
  colorClass: string;
}

/**
 * Standard EPA US AQI breakpoints for PM2.5 (µg/m³)
 */
export function calculateUsAqiFromPm25(pm25: number): number {
  if (pm25 < 0) return 0;
  const c = Math.round(pm25 * 10) / 10;

  if (c <= 12.0) {
    return Math.round(((50 - 0) / (12.0 - 0.0)) * (c - 0.0) + 0);
  } else if (c <= 35.4) {
    return Math.round(((100 - 51) / (35.4 - 12.1)) * (c - 12.1) + 51);
  } else if (c <= 55.4) {
    return Math.round(((150 - 101) / (55.4 - 35.5)) * (c - 35.5) + 101);
  } else if (c <= 150.4) {
    return Math.round(((200 - 151) / (150.4 - 55.5)) * (c - 55.5) + 151);
  } else if (c <= 250.4) {
    return Math.round(((300 - 201) / (250.4 - 150.5)) * (c - 150.5) + 201);
  } else if (c <= 350.4) {
    return Math.round(((400 - 301) / (350.4 - 250.5)) * (c - 250.5) + 301);
  } else if (c <= 500.4) {
    return Math.round(((500 - 401) / (500.4 - 350.5)) * (c - 350.5) + 401);
  } else {
    return 500;
  }
}

/**
 * Categorizes AQI severity returning label, accessible icon key, and guidance.
 * Meets WCAG 2.1 AA requirement by never relying on color alone.
 */
export function categorizeAqi(aqi: number): AqiCategorization {
  const boundedAqi = Math.max(0, Math.round(aqi));

  if (boundedAqi <= 50) {
    return {
      label: "Good",
      iconKey: "CheckCircle2",
      accessibleGuidance: "Air quality is satisfactory and poses little to no health risk. Safe for all outdoor activities.",
      levelNumber: 1,
      colorClass: "text-emerald-700 bg-emerald-50 border-emerald-300",
    };
  } else if (boundedAqi <= 100) {
    return {
      label: "Moderate",
      iconKey: "AlertCircle",
      accessibleGuidance: "Air quality is acceptable; unusually sensitive individuals should consider reducing prolonged outdoor exertion.",
      levelNumber: 2,
      colorClass: "text-amber-800 bg-amber-50 border-amber-300",
    };
  } else if (boundedAqi <= 150) {
    return {
      label: "Unhealthy for Sensitive Groups",
      iconKey: "AlertTriangle",
      accessibleGuidance: "Members of sensitive groups (children, seniors, respiratory sufferers) may experience health effects. Limit prolonged outdoor exertion.",
      levelNumber: 3,
      colorClass: "text-orange-800 bg-orange-50 border-orange-300",
    };
  } else if (boundedAqi <= 200) {
    return {
      label: "Unhealthy",
      iconKey: "AlertTriangle",
      accessibleGuidance: "Everyone may begin to experience adverse health effects. Avoid prolonged outdoor exertion and keep residential windows closed.",
      levelNumber: 4,
      colorClass: "text-red-800 bg-red-50 border-red-300",
    };
  } else if (boundedAqi <= 300) {
    return {
      label: "Very Unhealthy",
      iconKey: "ShieldAlert",
      accessibleGuidance: "Health alert: serious risk for all household members. Avoid all strenuous outdoor activities and run indoor air filtration.",
      levelNumber: 5,
      colorClass: "text-purple-900 bg-purple-50 border-purple-300",
    };
  } else {
    return {
      label: "Hazardous",
      iconKey: "ShieldAlert",
      accessibleGuidance: "Emergency health warning: extreme ground-level soot accumulation. Avoid all physical outdoor activities, seal doorway drafts, and run HEPA filtration.",
      levelNumber: 6,
      colorClass: "text-pink-950 bg-pink-50 border-pink-300",
    };
  }
}

export function getSeverityLabel(aqi: number): SeverityLabel {
  return categorizeAqi(aqi).label;
}

export interface InversionRiskResult {
  inversionRisk: "Low" | "Moderate" | "High";
  explanation: string;
  isCold: boolean;
  isStagnant: boolean;
  isElevatedPm: boolean;
}

/**
 * Detects Thermal Inversion Risk (Low / Moderate / High)
 * Based on cold temperature (<= 5°C), low wind (< 10 km/h), and elevated PM2.5 (>= 35 µg/m³).
 */
export function detectInversionRisk(
  tempC: number,
  windKmh: number,
  pm25: number
): InversionRiskResult {
  const isCold = tempC <= 5;
  const isStagnant = windKmh < 10;
  const isElevatedPm = pm25 >= 35;

  let inversionRisk: "Low" | "Moderate" | "High" = "Low";
  let explanation = "";

  // Wind speeds >= 12 km/h provide active mechanical turbulence, breaking inversions
  if (windKmh >= 12) {
    inversionRisk = "Low";
    explanation = `Low inversion risk: Active wind movement (${windKmh} km/h) provides strong mechanical turbulence, dispersing surface smoke and ventilating the area.`;
  } else if (isCold && isStagnant && isElevatedPm) {
    inversionRisk = "High";
    explanation = `High thermal inversion risk: Cold surface air (${tempC}°C) and stagnant winds (${windKmh} km/h) are creating an atmospheric lid, trapping elevated PM2.5 (${pm25} µg/m³) close to ground level.`;
  } else if (isCold && isStagnant) {
    inversionRisk = "Moderate";
    explanation = `Moderate inversion potential: Cold surface temperatures (${tempC}°C) and light winds (${windKmh} km/h) create atmospheric stability, though particulate accumulation is currently limited.`;
  } else if (isStagnant && isElevatedPm) {
    inversionRisk = "Moderate";
    explanation = `Moderate inversion potential: Stagnant winds (${windKmh} km/h) and elevated PM2.5 (${pm25} µg/m³) allow ground-level pollution to linger without dispersion.`;
  } else if (tempC <= 8 && windKmh < 10) {
    inversionRisk = "Moderate";
    explanation = `Moderate inversion potential: Cool temperatures and light air movement promote evening thermal pooling.`;
  } else {
    inversionRisk = "Low";
    explanation = `Low inversion risk: Atmospheric ventilation and mild temperatures (${tempC}°C, ${windKmh} km/h) prevent ground smoke trapping.`;
  }

  return {
    inversionRisk,
    explanation,
    isCold,
    isStagnant,
    isElevatedPm,
  };
}

/**
 * Compatibility wrapper for InversionAnalysis
 */
export function analyzeInversionRisk(weather: WeatherMetrics, pm25: number): InversionAnalysis {
  const result = detectInversionRisk(weather.tempC, weather.windKmh, pm25);
  return {
    inversionRisk: result.inversionRisk,
    explanation: result.explanation,
  };
}

export interface HourlyReading {
  time: string;
  pm25: number;
}

export interface WindowResult {
  cleanestWindow: {
    startIndex: number;
    startTime: string;
    endTime: string;
    avgPm25: number;
    label: string;
  };
  peakSmogWindow: {
    startIndex: number;
    startTime: string;
    endTime: string;
    avgPm25: number;
    label: string;
  };
}

function formatTimeString(isoOrTime: string): string {
  try {
    const d = new Date(isoOrTime);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
  } catch {
    // fallback to original string
  }
  return isoOrTime;
}

/**
 * Computes the Cleanest 2-Hour Window and Peak Smog Window from the next 24 hourly readings.
 * Uses a sliding 2-hour window (2 consecutive hours) over the 24-hour forecast.
 */
export function computeCleanestAndPeakWindows(
  hourlyReadings: HourlyReading[]
): WindowResult {
  if (!hourlyReadings || hourlyReadings.length < 2) {
    return {
      cleanestWindow: {
        startIndex: 0,
        startTime: "12:30 PM",
        endTime: "2:30 PM",
        avgPm25: 45,
        label: "12:30 PM – 2:30 PM (Midday Solar Mixing)",
      },
      peakSmogWindow: {
        startIndex: 0,
        startTime: "7:00 PM",
        endTime: "9:00 PM",
        avgPm25: 180,
        label: "7:00 PM – 9:00 PM (Inversion Smoke Trapping)",
      },
    };
  }

  // Evaluate the first 24 hourly readings
  const windowLength = 2;
  const data = hourlyReadings.slice(0, 24);
  const maxSearchIndex = data.length - windowLength;

  let minAvg = Infinity;
  let minIdx = 0;
  let maxAvg = -Infinity;
  let maxIdx = 0;

  for (let i = 0; i <= maxSearchIndex; i++) {
    const avg = (data[i].pm25 + data[i + 1].pm25) / 2;
    if (avg < minAvg) {
      minAvg = avg;
      minIdx = i;
    }
    if (avg > maxAvg) {
      maxAvg = avg;
      maxIdx = i;
    }
  }

  const cleanStart = formatTimeString(data[minIdx].time);
  const cleanEnd = formatTimeString(data[Math.min(minIdx + windowLength, data.length - 1)].time);
  const peakStart = formatTimeString(data[maxIdx].time);
  const peakEnd = formatTimeString(data[Math.min(maxIdx + windowLength, data.length - 1)].time);

  return {
    cleanestWindow: {
      startIndex: minIdx,
      startTime: cleanStart,
      endTime: cleanEnd,
      avgPm25: Math.round(minAvg * 10) / 10,
      label: `${cleanStart} – ${cleanEnd} (Cleanest 2-Hour Window: ${Math.round(minAvg)} µg/m³)`,
    },
    peakSmogWindow: {
      startIndex: maxIdx,
      startTime: peakStart,
      endTime: peakEnd,
      avgPm25: Math.round(maxAvg * 10) / 10,
      label: `${peakStart} – ${peakEnd} (Peak Smog Window: ${Math.round(maxAvg)} µg/m³)`,
    },
  };
}

/**
 * Backward compatibility helper for detectCleanAndPeakWindows
 */
export function detectCleanAndPeakWindows(
  hourlyPm25?: { time: string; value: number }[]
): WindowAnalysis {
  if (hourlyPm25 && hourlyPm25.length >= 2) {
    const formatted = hourlyPm25.map((h) => ({ time: h.time, pm25: h.value }));
    const result = computeCleanestAndPeakWindows(formatted);
    return {
      cleanestWindow: result.cleanestWindow.label,
      peakSmogWindow: result.peakSmogWindow.label,
    };
  }

  return {
    cleanestWindow: "12:30 PM – 2:30 PM (Midday Solar Warming)",
    peakSmogWindow: "6:30 PM – 8:30 PM (Overnight Inversion Trapping)",
  };
}
