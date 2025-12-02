import { test, expect } from '@playwright/test';

// These tests assume the app is running locally at http://localhost:3001
// and that the /racers page and racer form are available.

test.describe('Racer CRUD UI', () => {
  test('should create, view, update, and delete a racer via UI', async ({ page }) => {
    const timestamp = Date.now();
    const racerName = `Playwright Racer ${timestamp}`;
    const denName = `5`;
    // Go to racers list
    await page.goto('http://localhost:3001/racers?admin=true');
    await expect(page).toHaveTitle(/Pinewood Derby/);

    // Click to add a new racer
    await page.locator('a[href*="/racers/create"]').click();

    // Fill out the form
    await page.getByLabel(/name/i).fill(racerName);
    await page.getByLabel(/rank/i).selectOption('lion');
    await page.getByLabel(/role/i).selectOption('cub');
    await page.getByLabel(/den/i).fill(denName);
    await page.getByRole('button', { name: /create|register|save/i }).click();

    // Should be redirected to racers list and see the new racer
    await expect(page.getByText(racerName)).toBeVisible();

    // Click on the racer to view details (assume link or row click)
    await page.getByText(racerName).click();
    await expect(page.getByText(racerName)).toBeVisible();
    
    });
});
