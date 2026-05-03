/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ptdt: {
          pink: "#fb0b8c",
          pinkDark: "#e0087d",
          green: "#00a747",
          greenLight: "#2ae97b",
          purple: "#8057d7",
          purpleLight: "#b993ff",
          gold: "#f0b90b",
          ink: "#101018",
          ink2: "#1b1723",
          muted: "#706a7d",
          paper: "#fbfafc",
          mist: "#f6f4f8",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "-apple-system", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        glowPink: "0 18px 44px rgba(251,11,140,0.28)",
        glowGreen: "0 18px 44px rgba(42,233,123,0.18)",
        softCard: "0 18px 60px rgba(16,16,24,0.10)",
      },
    },
  },
  plugins: [],
};
