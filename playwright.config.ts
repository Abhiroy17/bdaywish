import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: ['**/birthday.spec.ts', '**/react.spec.ts', '**/local-song.spec.ts'],
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
  },
  projects: [
    { name: 'phone-chromium', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: 'small-phone-webkit', use: { browserName: 'webkit', viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true } },
    { name: 'tablet-webkit', use: { browserName: 'webkit', viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true } },
    { name: 'tablet-landscape', use: { browserName: 'chromium', viewport: { width: 1024, height: 768 }, hasTouch: true } },
    // Representative CSS viewports, not claimed hardware specifications.
    { name: 'android-phone', testMatch: '**/*.spec.ts', use: { browserName: 'chromium', viewport: { width: 412, height: 915 }, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true } },
    { name: 'android-tablet', testMatch: '**/*.spec.ts', use: { browserName: 'chromium', viewport: { width: 800, height: 1280 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
  ],
});