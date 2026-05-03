import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || "https://ptdt.taxi",
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  vite: {
    resolve: {
      alias: {
        "@layouts":    fileURLToPath(new URL("./src/layouts",    import.meta.url)),
        "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
        "@styles":     fileURLToPath(new URL("./src/styles",     import.meta.url)),
        "@lib":        fileURLToPath(new URL("./src/lib",        import.meta.url)),
        "@types":      fileURLToPath(new URL("./src/types",      import.meta.url)),
      },
    },
  },
});
