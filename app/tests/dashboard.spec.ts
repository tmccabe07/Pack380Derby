import { test, expect } from '@playwright/test';

test('test dashboard', async ({ page }) => {
  await page.goto('http://localhost:3001/');
  await expect(page.getByRole('heading', { name: 'Cars' })).toBeVisible();
  await page.getByRole('heading', { name: 'Racers' }).click();
  await expect(page.getByRole('heading', { name: 'Racers' })).toBeVisible();
});
