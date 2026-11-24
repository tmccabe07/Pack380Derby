import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * End-to-end tests run against a real API, app and Postgres database.
 *
 * Playwright starts both services itself on ports that do not clash with the
 * usual dev servers (API 3000, app 3001). The API command migrates and then
 * RESETS the test database before starting, so never point E2E_DATABASE_URL at
 * a database you care about; the seed script refuses names without "e2e" or "test".
 */
const API_PORT = Number(process.env.E2E_API_PORT ?? 3100);
const APP_PORT = Number(process.env.E2E_APP_PORT ?? 3101);
const DATABASE_URL =
  process.env.E2E_DATABASE_URL ??
  `postgresql://${process.env.USER ?? 'postgres'}@localhost:5432/pinewood_derby_e2e`;

// Shared password for the throwaway test stack only.
export const E2E_PASSWORD = process.env.E2E_PASSWORD ?? 'e2e-derby-password';
export const STORAGE_STATE = path.join(__dirname, 'tests/.auth/participant.json');

export default defineConfig({
  testDir: './tests',
  // The specs share one database and build on each other's state, so they run
  // in file order on a single worker.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${APP_PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
  ],
  webServer: [
    {
      name: 'api',
      cwd: path.join(__dirname, '../server'),
      command:
        'npx prisma migrate deploy && npx ts-node scripts/seed-e2e.ts && npm run build && node dist/src/main.js',
      url: `http://localhost:${API_PORT}/api/docs`,
      reuseExistingServer: false,
      timeout: 180_000,
      env: {
        DATABASE_URL,
        API_BEARER_TOKEN: E2E_PASSWORD,
        PORT: String(API_PORT),
        USE_SSL: 'false',
        NODE_ENV: 'e2e',
      },
    },
    {
      name: 'app',
      cwd: __dirname,
      command: `npm run build && npx next start -p ${APP_PORT}`,
      url: `http://localhost:${APP_PORT}`,
      reuseExistingServer: false,
      timeout: 240_000,
      env: {
        NEXT_PUBLIC_DERBY_API_URL: `http://localhost:${API_PORT}`,
        NEXT_PUBLIC_DERBY_API_TOKEN: '',
      },
    },
  ],
});
