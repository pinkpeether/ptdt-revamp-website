import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      // ── Brand colors (from mockup CSS vars) ───────────────────────────────
      colors: {
        white:    "#ffffff",
        paper:    "#fbfafc",
        mist:     "#f6f4f8",
        soft:     "#f1eef5",
        ink:      "#101018",
        "ink-2":  "#1b1723",
        "ink-3":  "#2d2840",
        muted:    "#706a7d",
        "muted-2":"#958da4",
        // ── PTDT Pink ──
        pink: {
          DEFAULT: "#fb0b8c",
          2:       "#e0087d",
          soft:    "#fff0f8",
          line:    "rgba(251,11,140,0.22)",
        },
        // ── PTDT Green ──
        green: {
          DEFAULT: "#00a747",
          2:       "#0e8f43",
          soft:    "#edfff5",
          line:    "rgba(0,167,71,0.22)",
          light:   "#2ae97b",
        },
        // ── PTDT Purple ──
        purple: {
          DEFAULT: "#8057d7",
          2:       "#b993ff",
          soft:    "#f4efff",
        },
        gold: "#f0b90b",
        "gray-900": "#0f0f1a",
      },
      // ── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        body: ["Plus Jakarta Sans", "system-ui", "-apple-system", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      // ── Border radius ─────────────────────────────────────────────────────
      borderRadius: {
        sm:   "0.375rem",
        md:   "0.5rem",
        lg:   "0.75rem",
        xl:   "1rem",
        "2xl":"1.5rem",
        full: "9999px",
      },
      // ── Box shadow ────────────────────────────────────────────────────────
      boxShadow: {
        sm:   "0 1px 2px rgba(16,16,24,0.06)",
        md:   "0 4px 16px rgba(16,16,24,0.08)",
        lg:   "0 12px 40px rgba(16,16,24,0.10)",
        xl:   "0 24px 80px rgba(16,16,24,0.12)",
        pink: "0 12px 26px rgba(251,11,140,0.25)",
        "pink-lg": "0 18px 38px rgba(251,11,140,0.34)",
        green:"0 10px 25px rgba(0,167,71,0.18)",
      },
      // ── Spacing (mirrors --space-* tokens) ────────────────────────────────
      spacing: {
        "4.5": "1.125rem",
        18:    "4.5rem",
        22:    "5.5rem",
        26:    "6.5rem",
      },
      // ── Layout ────────────────────────────────────────────────────────────
      maxWidth: {
        protocol: "1240px",
      },
      // ── Custom easing ─────────────────────────────────────────────────────
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      // ── Keyframes ─────────────────────────────────────────────────────────
      keyframes: {
        "pulse-dot": {
          "0%,100%": { opacity:"1", transform:"scale(1)" },
          "50%":     { opacity:"0.5", transform:"scale(1.3)" },
        },
        "marquee-scroll": {
          to: { transform:"translateX(-50%)" },
        },
        "feed-spin": {
          to: { transform:"rotate(360deg)" },
        },
        "spark-draw": {
          "0%":       { strokeDashoffset:"420", opacity:"0.2" },
          "50%,78%":  { strokeDashoffset:"0",   opacity:"1"   },
          "100%":     { strokeDashoffset:"-420", opacity:"0.25"},
        },
      },
      animation: {
        "pulse-dot":      "pulse-dot 2s ease-in-out infinite",
        "marquee-scroll": "marquee-scroll 28s linear infinite",
        "feed-spin":      "feed-spin 5s linear infinite",
        "spark-draw":     "spark-draw 4.5s cubic-bezier(0.16,1,0.3,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
