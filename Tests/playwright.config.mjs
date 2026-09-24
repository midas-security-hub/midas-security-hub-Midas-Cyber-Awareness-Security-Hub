import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  timeout: 45000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }]
  ],
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: {
    command: 'node server.js',
    url: 'http://localhost:8080/index.html',
    reuseExistingServer: true,
    timeout: 15000
  }
});