import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50: "#fdfbf5",
          100: "#f5f2e9",
          200: "#ebe2c7"
        },
        charcoal: "#1c1c1c",
        gold: "#d4af37"
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans JP", "sans-serif"]
      },
      boxShadow: {
        subtle: "0 10px 30px -15px rgba(28, 28, 28, 0.2)"
      }
    }
  },
  plugins: []
};

export default config;
