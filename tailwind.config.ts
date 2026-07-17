import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
          955: "#0a0f1a",
        },
        cream: {
          DEFAULT: "#FAF9F6",
          soft: "#FFFCF7",
        },
        rose: {
          dusty: "#C9A09A",
        },
        sage: {
          soft: "#9CAF88",
        },
        gold: {
          accent: "#C4A962",
        },
        ink: {
          DEFAULT: "#4A4038",
          muted: "#6F6258",
        },
      },
      fontFamily: {
        serif: ["Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", "serif"],
        "sans-jp": ["Hiragino Sans", "Noto Sans JP", "system-ui", "sans-serif"],
        "sans-ko": ["Malgun Gothic", "Noto Sans KR", "system-ui", "sans-serif"],
        "sans-zh": ["PingFang SC", "Noto Sans SC", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
