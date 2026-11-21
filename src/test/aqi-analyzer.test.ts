import { describe, it, expect } from "vitest";
import {
  calculateUsAqiFromPm25,
  getSeverityLabel,
  analyzeInversionRisk,
  detectCleanAndPeakWindows,
} from "../lib/aqi/analyzer";

describe("AQI and Inversion Analyzer", () => {
  it("calculates standard EPA US AQI breakpoints for PM2.5 accurately", () => {
    expect(calculateUsAqiFromPm25(0)).toBe(0);
    expect(calculateUsAqiFromPm25(12.0)).toBe(50);
    expect(calculateUsAqiFromPm25(35.4)).toBe(100);
    expect(calculateUsAqiFromPm25(55.4)).toBe(150);
    expect(calculateUsAqiFromPm25(150.4)).toBe(200);
    expect(calculateUsAqiFromPm25(250.4)).toBe(300);
  });

  it("assigns correct severity labels according to AQI thresholds", () => {
    expect(getSeverityLabel(35)).toBe("Good");
    expect(getSeverityLabel(75)).toBe("Moderate");
    expect(getSeverityLabel(125)).toBe("Unhealthy for Sensitive Groups");
    expect(getSeverityLabel(175)).toBe("Unhealthy");
    expect(getSeverityLabel(250)).toBe("Very Unhealthy");
    expect(getSeverityLabel(350)).toBe("Hazardous");
  });

  it("detects Severe or High inversion risk during cold, calm winter smog", () => {
    const severeWeather = { tempC: 2.0, windKmh: 2.5 };
    const severeAnalysis = analyzeInversionRisk(severeWeather, 180);
    expect(["High", "Severe"]).toContain(severeAnalysis.inversionRisk);
    expect(severeAnalysis.explanation).toContain("trapping");

    const mildWeather = { tempC: 22.0, windKmh: 18.0 };
    const mildAnalysis = analyzeInversionRisk(mildWeather, 20);
    expect(mildAnalysis.inversionRisk).toBe("Low");
  });

  it("detects cleanest and peak windows using hourly data curve", () => {
    const hourlyData = [
      { time: "2026-11-21T06:00:00Z", value: 240 },
      { time: "2026-11-21T07:00:00Z", value: 260 },
      { time: "2026-11-21T08:00:00Z", value: 280 }, // Peak
      { time: "2026-11-21T09:00:00Z", value: 220 },
      { time: "2026-11-21T10:00:00Z", value: 170 },
      { time: "2026-11-21T11:00:00Z", value: 120 },
      { time: "2026-11-21T12:00:00Z", value: 65 },  // Cleanest
      { time: "2026-11-21T13:00:00Z", value: 60 },
      { time: "2026-11-21T14:00:00Z", value: 70 },
      { time: "2026-11-21T15:00:00Z", value: 110 },
      { time: "2026-11-21T16:00:00Z", value: 180 },
      { time: "2026-11-21T17:00:00Z", value: 230 },
    ];

    const result = detectCleanAndPeakWindows(hourlyData);
    expect(result.cleanestWindow).toBeDefined();
    expect(result.peakSmogWindow).toBeDefined();
  });
});

