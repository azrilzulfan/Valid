import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ command }) => ({
  optimizeDeps: {
    exclude: [
      "@tanstack/start-server-core",
      "@tanstack/start-client-core",
      "@tanstack/react-start",
    ],
  },
  plugins: [
    tsconfigPaths(),
    command === "build" ? cloudflare({ viteEnvironment: { name: "ssr" } }) : undefined,
    tanstackStart({
      server: { entry: "server" },
    }),
    react(),
    tailwindcss(),
  ],
}));
