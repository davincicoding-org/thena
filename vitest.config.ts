import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    include: ["lib/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    coverage: {
      reporter: ["text", "json", "html"],
      include: ["lib/**/*.{js,ts,jsx,tsx}"],
      exclude: ["lib/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    },
  },
});
