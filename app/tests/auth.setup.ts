import { test as setup, expect } from '@playwright/test';
import { E2E_PASSWORD, STORAGE_STATE } from '../playwright.config';

// Signs in once with the shared event password and saves the browser state,
// so every spec in the "chromium" project starts already past the login screen.
setup('sign in with the shared password', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Login Required' })).toBeVisible();
  await page.locator('input[type="password"]').fill(E2E_PASSWORD);
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await page.context().storageState({ path: STORAGE_STATE });
});
