import { describe, it, expect } from "vitest";
import {
  categorizeAqi,
  calculateUsAqiFromPm25,
  detectInversionRisk,
  computeCleanestAndPeakWindows,
  HourlyReading,
} from "../analyzer";

describe("AQI Categorization (WCAG 2.1 AA Compliant)", () => {
  it("categorizes Level 1: Good (0-50) with accessible guidance and CheckCircle2 icon", () => {
    const result = categorizeAqi(35);
    expect(result.label).toBe("Good");
    expect(result.iconKey).toBe("CheckCircle2");
    expect(result.levelNumber).toBe(1);
    expect(result.accessibleGuidance).toContain("Safe for all outdoor activities");
  });

  it("categorizes Level 2: Moderate (51-100) with AlertCircle icon", () => {
    const result = categorizeAqi(75);
    expect(result.label).toBe("Moderate");
    expect(result.iconKey).toBe("AlertCircle");
    expect(result.levelNumber).toBe(2);
    expect(result.accessibleGuidance).toContain("unusually sensitive individuals");
  });

  it("categorizes Level 3: Unhealthy for Sensitive Groups (101-150)", () => {
    const result = categorizeAqi(135);
    expect(result.label).toBe("Unhealthy for Sensitive Groups");
    expect(result.iconKey).toBe("AlertTriangle");
    expect(result.levelNumber).toBe(3);
    expect(result.accessibleGuidance).toContain("sensitive groups");
  });

  it("categorizes Level 4: Unhealthy (151-200)", () => {
    const result = categorizeAqi(180);
    expect(result.label).toBe("Unhealthy");
    expect(result.iconKey).toBe("AlertTriangle");
    expect(result.levelNumber).toBe(4);
  });

  it("categorizes Level 5: Very Unhealthy (201-300)", () => {
    const result = categorizeAqi(260);
    expect(result.label).toBe("Very Unhealthy");
    expect(result.iconKey).toBe("ShieldAlert");
    expect(result.levelNumber).toBe(5);
  });

  it("categorizes Level 6: Hazardous (301+)", () => {
    const result = categorizeAqi(350);
    expect(result.label).toBe("Hazardous");
    expect(result.iconKey).toBe("ShieldAlert");
    expect(result.levelNumber).toBe(6);
    expect(result.accessibleGuidance).toContain("Emergency health warning");
  });

  it("handles boundary values and edge cases smoothly", () => {
    expect(categorizeAqi(0).label).toBe("Good");
    expect(categorizeAqi(50).label).toBe("Good");
    expect(categorizeAqi(51).label).toBe("Moderate");
    expect(categorizeAqi(100).label).toBe("Moderate");
    expect(categorizeAqi(101).label).toBe("Unhealthy for Sensitive Groups");
    expect(categorizeAqi(150).label).toBe("Unhealthy for Sensitive Groups");
    expect(categorizeAqi(151).label).toBe("Unhealthy");
    expect(categorizeAqi(200).label).toBe("Unhealthy");
    expect(categorizeAqi(201).label).toBe("Very Unhealthy");
    expect(categorizeAqi(300).label).toBe("Very Unhealthy");
    expect(categorizeAqi(301).label).toBe("Hazardous");
    expect(categorizeAqi(800).label).toBe("Hazardous");
    expect(categorizeAqi(-10).label).toBe("Good"); // bounded to 0
  });

  it("calculates standard EPA PM2.5 breakpoints", () => {
    expect(calculateUsAqiFromPm25(0)).toBe(0);
    expect(calculateUsAqiFromPm25(12.0)).toBe(50);
    expect(calculateUsAqiFromPm25(35.4)).toBe(100);
    expect(calculateUsAqiFromPm25(55.4)).toBe(150);
    expect(calculateUsAqiFromPm25(150.4)).toBe(200);
    expect(calculateUsAqiFromPm25(250.4)).toBe(300);
  });
});

describe("Thermal Inversion Risk Detection Edge Cases", () => {
  it("detects High risk when temp <= 5°C, wind < 10 km/h, and PM2.5 >= 35 µg/m³", () => {
    const res = detectInversionRisk(4.0, 6.0, 85.0);
    expect(res.inversionRisk).toBe("High");
    expect(res.isCold).toBe(true);
    expect(res.isStagnant).toBe(true);
    expect(res.isElevatedPm).toBe(true);
    expect(res.explanation).toContain("High thermal inversion risk");
  });

  it("detects High risk exactly on threshold boundaries (5°C, 9.9 km/h, 35 µg/m³)", () => {
    const res = detectInversionRisk(5.0, 9.9, 35.0);
    expect(res.inversionRisk).toBe("High");
    expect(res.isCold).toBe(true);
    expect(res.isStagnant).toBe(true);
    expect(res.isElevatedPm).toBe(true);
  });

  it("detects Moderate risk when cold and stagnant, but PM2.5 is low (< 35)", () => {
    const res = detectInversionRisk(3.0, 7.0, 18.0);
    expect(res.inversionRisk).toBe("Moderate");
    expect(res.isCold).toBe(true);
    expect(res.isStagnant).toBe(true);
    expect(res.isElevatedPm).toBe(false);
  });

  it("detects Moderate risk when winds are calm and PM2.5 is elevated even if mild temp", () => {
    const res = detectInversionRisk(12.0, 5.0, 75.0);
    expect(res.inversionRisk).toBe("Moderate");
  });

  it("detects Low risk when strong winds disperse pollutants", () => {
    const res = detectInversionRisk(2.0, 24.0, 45.0);
    expect(res.inversionRisk).toBe("Low");
    expect(res.explanation).toContain("Low inversion risk");
  });

  it("detects Low risk on warm windy days", () => {
    const res = detectInversionRisk(22.0, 16.0, 15.0);
    expect(res.inversionRisk).toBe("Low");
    expect(res.isCold).toBe(false);
    expect(res.isStagnant).toBe(false);
  });
});

describe("Cleanest 2-Hour and Peak Smog Window Computation", () => {
  it("identifies the lowest 2-hour average PM2.5 window from 24 hourly readings", () => {
    // 24 hours of data starting at midnight
    const hourly: HourlyReading[] = [
      { time: "2026-11-21T00:00:00Z", pm25: 180 },
      { time: "2026-11-21T01:00:00Z", pm25: 195 },
      { time: "2026-11-21T02:00:00Z", pm25: 210 },
      { time: "2026-11-21T03:00:00Z", pm25: 230 },
      { time: "2026-11-21T04:00:00Z", pm25: 250 },
      { time: "2026-11-21T05:00:00Z", pm25: 280 },
      { time: "2026-11-21T06:00:00Z", pm25: 310 },
      { time: "2026-11-21T07:00:00Z", pm25: 340 }, // Peak starts here
      { time: "2026-11-21T08:00:00Z", pm25: 350 }, // (340 + 350) / 2 = 345 avg peak
      { time: "2026-11-21T09:00:00Z", pm25: 290 },
      { time: "2026-11-21T10:00:00Z", pm25: 210 },
      { time: "2026-11-21T11:00:00Z", pm25: 140 },
      { time: "2026-11-21T12:00:00Z", pm25: 80 },
      { time: "2026-11-21T13:00:00Z", pm25: 50 },  // Cleanest window starts: (50 + 45)/2 = 47.5
      { time: "2026-11-21T14:00:00Z", pm25: 45 },
      { time: "2026-11-21T15:00:00Z", pm25: 75 },
      { time: "2026-11-21T16:00:00Z", pm25: 120 },
      { time: "2026-11-21T17:00:00Z", pm25: 170 },
      { time: "2026-11-21T18:00:00Z", pm25: 220 },
      { time: "2026-11-21T19:00:00Z", pm25: 240 },
      { time: "2026-11-21T20:00:00Z", pm25: 230 },
      { time: "2026-11-21T21:00:00Z", pm25: 210 },
      { time: "2026-11-21T22:00:00Z", pm25: 190 },
      { time: "2026-11-21T23:00:00Z", pm25: 185 },
    ];

    const result = computeCleanestAndPeakWindows(hourly);

    // Cleanest window should be index 13 (13:00 - 15:00) with avg 47.5
    expect(result.cleanestWindow.startIndex).toBe(13);
    expect(result.cleanestWindow.avgPm25).toBe(47.5);

    // Peak window should be index 7 (07:00 - 09:00) with avg 345
    expect(result.peakSmogWindow.startIndex).toBe(7);
    expect(result.peakSmogWindow.avgPm25).toBe(345);
  });

  it("handles fallback gracefully when empty or insufficient readings are given", () => {
    const result = computeCleanestAndPeakWindows([]);
    expect(result.cleanestWindow.label).toBeDefined();
    expect(result.peakSmogWindow.label).toBeDefined();
  });
});

