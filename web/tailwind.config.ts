import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        "paper-2": "var(--paper-2)",
        panel: "var(--panel)",
        "panel-2": "var(--panel-2)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        "line-soft": "var(--line-soft)",
        olive: {
          DEFAULT: "var(--olive)",
          700: "var(--olive-700)",
          300: "var(--olive-300)",
          wash: "var(--olive-wash)",
        },
        clay: {
          DEFAULT: "var(--clay)",
          700: "var(--clay-700)",
          wash: "var(--clay-wash)",
        },
        sun: "var(--sun)",
        ok: "var(--ok)",
        warn: "var(--warn)",
        bad: "var(--bad)",
      },
      fontFamily: {
        sans: ["var(--f-sans)", "system-ui", "sans-serif"],
        head: ["var(--f-head)", "Georgia", "serif"],
        script: ["var(--f-script)", "cursive"],
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      maxWidth: { content: "1280px" },
    },
  },
  plugins: [],
};

export default config;
