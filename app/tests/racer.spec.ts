import { test, expect } from '@playwright/test';

test('test register new racer', async ({ page }) => {
  await page.goto('http://localhost:3001/');
  await page.getByRole('button', { name: 'Register New Racer' }).click();
  await page.getByRole('textbox', { name: 'Racer Name' }).click();
  await page.getByRole('textbox', { name: 'Racer Name' }).fill('Cally');
  await page.getByRole('textbox', { name: 'Den' }).click();
  await page.getByRole('textbox', { name: 'Den' }).fill('5');
  await page.getByLabel('Rank').selectOption('tiger');
  await page.getByRole('button', { name: 'Save Racer' }).click();
  await expect(page.getByText('Cally').nth(3)).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^CallyRole: cubRank: tigerDen: 5View \|Edit$/ }).locator('div').nth(1)).toBeVisible();
  await expect(page.getByText('Rank: tiger').nth(3)).toBeVisible();
});