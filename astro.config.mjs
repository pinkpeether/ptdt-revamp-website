import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://ptdt.taxi",
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  output: "static",
  vite: {
    ssr: { noExternal: ["lucide-react"] },
    optimizeDeps: { exclude: ["wagmi", "viem"] },
  },
});
