import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  test: {
    // See the list of config options in the Config Reference:
    // https://vitest.dev/config/
    environment: "jsdom",
    globals: true,
    includeSource: ["app/**/*.{ts,tsx}"],
  },
  plugins: [react()],
});
