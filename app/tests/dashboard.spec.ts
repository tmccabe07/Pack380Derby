import { test, expect } from '@playwright/test';

test('test dashboard', async ({ page }) => {
  await page.goto('http://localhost:3001/');
  await expect(page.getByRole('heading', { name: 'Cars' })).toBeVisible();
  await page.getByRole('heading', { name: 'Racers' }).click();
  await expect(page.getByRole('heading', { name: 'Racers' })).toBeVisible();
  await page.getByRole('button', { name: 'Register New Racer' }).click();
  await page.getByRole('textbox', { name: 'Racer Name' }).click();
  await page.getByRole('textbox', { name: 'Racer Name' }).fill('Cally Cub');
  await page.getByRole('textbox', { name: 'Racer Name' }).press('Tab');
  await page.getByLabel('Role').selectOption('sibling');
  await page.getByLabel('Rank').selectOption('tiger');
  await page.getByLabel('Rank').press('Tab');
  await page.getByRole('textbox', { name: 'Den' }).fill('5');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Save Racer' }).click();
});