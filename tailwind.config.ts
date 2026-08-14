import type { Config } from "tailwindcss";

// Paleta propia del proyecto (tienda "MERIDIAN"): papel cálido + tinta
// casi negra + verde bosque como acento de marca. El rust se reserva
// para estados de rebaja / eliminar, nunca como acento principal.
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#FAF9F6",
        foreground: "#17181A",
        border: "#E2E0D8",
        ring: "#2F5233",
        muted: {
          DEFAULT: "#EEECE6",
          foreground: "#6B6A65",
        },
        accent: {
          DEFAULT: "#2F5233",
          foreground: "#FAF9F6",
        },
        rust: {
          DEFAULT: "#B3401D",
          foreground: "#FAF9F6",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#17181A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "10px",
      },
      keyframes: {
        "underline-in": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
      },
      animation: {
        "underline-in": "underline-in 200ms ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
