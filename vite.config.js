import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import * as process from "process";

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (e.g., development, production)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    build: {
      outDir: "dist",
      sourcemap: true,
    },
    define: {
      "process.env": env,
    },
  };
});
