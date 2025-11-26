import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Autumn Aesthetic Palette
        background: "#FAF0E6", // Linen
        surface: "#FFF8DC", // Cornsilk
        primary: {
          DEFAULT: "#9A3B3B", // Deep Rust
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#C08261", // Warm Earth
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#E2C799", // Wheat/Gold
          foreground: "#2D1B0E",
        },
        text: {
          DEFAULT: "#2D1B0E", // Dark Coffee
          muted: "#5C4033", // Dark Brown
        },
        success: "#556B2F", // Dark Olive Green
        warning: "#DAA520", // Goldenrod
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      boxShadow: {
        'book': '5px 5px 15px rgba(0,0,0,0.15), 2px 2px 5px rgba(0,0,0,0.1)',
        'book-hover': '8px 8px 20px rgba(0,0,0,0.2), 3px 3px 8px rgba(0,0,0,0.15)',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
