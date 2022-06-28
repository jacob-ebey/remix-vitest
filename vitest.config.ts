import * as path from "path";
import * as VitestConfig from "vitest/config";
import react from "@vitejs/plugin-react";

export default VitestConfig.defineConfig({
  test: {
    // See the list of config options in the Config Reference:
    // https://vitest.dev/config/
    environment: "jsdom",
    globals: true,
    includeSource: ["app/**/*.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
    },
  },
  plugins: [react()],
});
