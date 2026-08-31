import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Tokens vindos de CSS vars (globals.css). O tema escuro é o padrão;
      // `.theme-light` redefine os mesmos tokens para a Vitrine.
      colors: {
        bone: {
          DEFAULT: "rgb(var(--c-bone) / <alpha-value>)",
          dark: "rgb(var(--c-bone-dark) / <alpha-value>)",
          deep: "rgb(var(--c-bone-deep) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--c-ink) / <alpha-value>)",
          soft: "rgb(var(--c-ink-soft) / <alpha-value>)",
          faint: "rgb(var(--c-ink-faint) / <alpha-value>)",
        },
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        oxblood: "rgb(var(--c-oxblood) / <alpha-value>)",
        oxbright: "rgb(var(--c-oxbright) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        mega: ["clamp(4rem, 16vw, 15rem)", { lineHeight: "0.82" }],
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        ticker: "ticker 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
