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
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
        "radar-ping": {
          "0%": { transform: "scale(0.95)", opacity: "0.8" },
          "50%": { transform: "scale(1.3)", opacity: "0.2" },
          "100%": { transform: "scale(0.95)", opacity: "0.8" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "shimmer": {
          "100%": { transform: "translateX(100%)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(225, 29, 72, 0.25)" },
          "50%": { boxShadow: "0 0 25px rgba(225, 29, 72, 0.45)" },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "radar-ping": "radar-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "float": "float 3s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.4s ease-out forwards",
        "glow": "glow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
