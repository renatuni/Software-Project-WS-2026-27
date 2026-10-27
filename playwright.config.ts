import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: false, retries: 0,
  use: { baseURL: 'http://127.0.0.1:3010', trace: 'retain-on-failure' },
  projects: [ { name: 'desktop', use: { ...devices['Desktop Chrome'] } }, { name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true } } ],
  webServer: { command: 'npm run dev -- --port 3010', url: 'http://127.0.0.1:3010', reuseExistingServer: !process.env.CI, timeout: 120000 },
});
