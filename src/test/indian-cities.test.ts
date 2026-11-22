import { describe, it, expect } from "vitest";
import {
  INDIAN_CITIES,
  INDIAN_DEMO_HUBS,
  searchIndianCities,
  findIndianCity,
} from "@/lib/aqi/indian-cities";
import { fetchGeocoding } from "@/lib/aqi/openMeteo";

describe("Indian Cities Database & Search Engine", () => {
  it("contains more than 50 verified Indian cities with coordinates in valid bounds", () => {
    expect(INDIAN_CITIES.length).toBeGreaterThan(50);

    for (const city of INDIAN_CITIES) {
      expect(city.name).toBeTruthy();
      expect(city.state).toBeTruthy();
      // India latitude range approx 8°N to 37°N
      expect(city.latitude).toBeGreaterThanOrEqual(8);
      expect(city.latitude).toBeLessThanOrEqual(38);
      // India longitude range approx 68°E to 98°E
      expect(city.longitude).toBeGreaterThanOrEqual(68);
      expect(city.longitude).toBeLessThanOrEqual(98);
    }
  });

  it("finds exact Indian cities by name", () => {
    const delhi = findIndianCity("Delhi");
    expect(delhi).toBeDefined();
    expect(delhi?.state).toBe("Delhi");

    const patna = findIndianCity("Patna");
    expect(patna).toBeDefined();
    expect(patna?.state).toBe("Bihar");

    const lucknow = findIndianCity("Lucknow");
    expect(lucknow).toBeDefined();
    expect(lucknow?.state).toBe("Uttar Pradesh");
  });

  it("resolves historic and colloquial aliases for Indian cities", () => {
    const gurgaon = findIndianCity("Gurgaon");
    expect(gurgaon).toBeDefined();
    expect(gurgaon?.name).toBe("Gurugram");

    const bangalore = findIndianCity("Bangalore");
    expect(bangalore).toBeDefined();
    expect(bangalore?.name).toBe("Bengaluru");

    const bombay = findIndianCity("Bombay");
    expect(bombay).toBeDefined();
    expect(bombay?.name).toBe("Mumbai");

    const calcutta = findIndianCity("Calcutta");
    expect(calcutta).toBeDefined();
    expect(calcutta?.name).toBe("Kolkata");

    const banaras = findIndianCity("Banaras");
    expect(banaras).toBeDefined();
    expect(banaras?.name).toBe("Varanasi");
  });

  it("provides fast autocomplete matches for partial search input", () => {
    const results = searchIndianCities("Luc", 5);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe("Lucknow");

    const patnaMatches = searchIndianCities("pat", 5);
    expect(patnaMatches.some((c) => c.name === "Patna" || c.name === "Patiala")).toBe(true);
  });

  it("includes representative winter smog demo hubs", () => {
    expect(INDIAN_DEMO_HUBS.length).toBeGreaterThanOrEqual(5);
    const names = INDIAN_DEMO_HUBS.map((h) => h.name);
    expect(names).toContain("Delhi");
    expect(names).toContain("Patna");
    expect(names).toContain("Lucknow");
    expect(names).toContain("Kolkata");
    expect(names).toContain("Mumbai");
    expect(names).toContain("Bengaluru");
  });

  it("fetchGeocoding resolves Indian cities reliably", async () => {
    const loc = await fetchGeocoding("Patna");
    expect(loc.city).toBe("Patna");
    expect(loc.country).toBe("India");
    expect(loc.latitude).toBeCloseTo(25.59, 1);
    expect(loc.longitude).toBeCloseTo(85.13, 1);
  });

  it("fetchGeocoding resolves alias queries to the standard Indian city", async () => {
    const loc = await fetchGeocoding("Gurgaon");
    expect(loc.city).toBe("Gurugram");
    expect(loc.country).toBe("India");
  });
});
