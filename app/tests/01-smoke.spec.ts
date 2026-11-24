import { test, expect } from '@playwright/test';
import { asOrganizer } from './helpers';

test.describe('sign-in', () => {
  // These two start signed out.
  test.use({ storageState: { cookies: [], origins: [] } });

  test('a wrong password is rejected', async ({ page }) => {
    await page.goto('/');
    await page.locator('input[type="password"]').fill('not-the-password');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await expect(page.getByText('Incorrect password')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toHaveCount(0);
  });

  test('every page is behind the password', async ({ page }) => {
    await page.goto('/races');
    await expect(page.getByRole('heading', { name: 'Login Required' })).toBeVisible();
  });
});

test.describe('dashboard and navigation', () => {
  test('dashboard shows registered cars and racers', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByTestId('dashboard-count-cars')).toHaveText('18');
    await expect(page.getByTestId('dashboard-count-racers')).toHaveText('19');
    await expect(page.getByTestId('leaderboard-10-cub')).toContainText('No results available.');
  });

  test('participants can browse cars, racers and races', async ({ page }) => {
    await page.goto('/cars');
    await expect(page.getByText('Cub Car Alpha').first()).toBeVisible();
    await page.goto('/racers');
    await expect(page.getByText('Scout Alpha').first()).toBeVisible();
    await page.goto('/races');
    await expect(page.getByRole('heading', { name: 'Race Rounds' })).toBeVisible();
  });

  test('organizer tools are hidden from participants', async ({ page }) => {
    await page.goto('/races');
    await expect(page.getByRole('link', { name: '+ Create Race' })).toHaveCount(0);
    await page.goto('/races/create');
    await expect(page.getByText('You are not authorized to create races.')).toBeVisible();
  });

  test('organizer view offers race creation', async ({ page }) => {
    await page.goto(asOrganizer('/races'));
    await expect(page.getByRole('link', { name: '+ Create Race' })).toBeVisible();
  });
});
