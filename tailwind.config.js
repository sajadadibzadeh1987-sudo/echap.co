/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
const lineClamp = require('@tailwindcss/line-clamp')

module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/data/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        yekan: ["IRANYekan", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(-10px)" },
          "100%": { opacity: 25, transform: "translateY(0)" },
        },
        shine: {
          "0%": { left: "-75%" },
          "100%": { left: "125%" },
        },
      },
      animation: {
        fadeIn: "fadeIn 200ms ease-out",
        // loop 4 ثانیه‌ای تا وقتی موس روش هست
        shine: "shine 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [
    lineClamp,
  ],
}
