import { defineConfig, devices } from "@playwright/test";
import { loadEnv } from "./tests/e2e/helpers/load-env";

// Load test environment variables
loadEnv(".env.test");

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: "html",
  use: {
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      OPENAI_API_KEY: "sk-dummy-test-key-for-playwright",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000"
    }
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "webkit",
      use: { ...devices["Mobile Safari"] },
    },
  ],
});
