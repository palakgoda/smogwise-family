import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // High contrast brand & AQI palette adhering to WCAG 2.1 AA
        aqi: {
          good: "#15803d",          // Green (AQI 0-50) - AA contrast on white
          moderate: "#a16207",      // Yellow-amber (AQI 51-100) - AA contrast
          sensitive: "#c2410c",     // Orange (AQI 101-150)
          unhealthy: "#b91c1c",     // Red (AQI 151-200)
          veryUnhealthy: "#7e22ce", // Purple (AQI 201-300)
          hazardous: "#701a75",     // Maroon/Dark Magenta (AQI 301+)
        },
      },
    },
  },
  plugins: [],
};

export default config;

