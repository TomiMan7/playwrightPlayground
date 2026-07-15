/// <reference types="node" />
import { resolve } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

import * as dotenv from 'dotenv';

dotenv.config({ path: resolve(__dirname, '..', '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: resolve(__dirname, '..', 'tests'),
  outputDir: resolve(__dirname, '..', 'test-results'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: [
    ['line'],
    [
      'allure-playwright',
      {
        resultsDir: resolve(__dirname, '..', 'allure-results'),
        detail: true,
      },
    ],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'api',
      testDir: resolve(__dirname, '..', 'tests', 'practice1'),
    },
    {
      name: 'ui',
      testDir: resolve(__dirname, '..', 'tests', 'practice2'),
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
