import { defineConfig, devices } from "@playwright/test";

const devServerURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  workers: 1,

  use: {
    baseURL: devServerURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        headless: false,
        viewport: { width: 1280, height: 720 },
        launchOptions: { slowMo: 20 },
      },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: devServerURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
