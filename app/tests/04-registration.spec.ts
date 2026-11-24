import { test, expect } from '@playwright/test';
import { asOrganizer } from './helpers';

// Runs last: registering cars changes the size of the field.
test.describe.configure({ mode: 'serial' });

async function openRegistration(page: import('@playwright/test').Page) {
  await page.goto(asOrganizer('/cars/registration'));
  await page.getByRole('button', { name: 'Register Racer & Car' }).click();
  await expect(page.getByRole('heading', { name: 'Register Racer & Car' })).toBeVisible();
}

test('participants are not offered registration', async ({ page }) => {
  await page.goto('/cars/registration');
  await expect(page.getByTestId('dashboard-count-cars')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Register Racer & Car' })).toHaveCount(0);
});

test('organizer registers a car for a scout on the roster', async ({ page }) => {
  await openRegistration(page);
  const submit = page.getByRole('button', { name: 'Complete Registration' });
  await expect(submit).toBeDisabled();

  await page.getByPlaceholder('Type 2+ characters...').fill('Scout Zu');
  // Known quirk: selecting a scout looks up their existing car and then resets
  // the car fields, wiping anything typed before the lookup returns. Wait for it.
  const carLookup = page.waitForResponse(r => r.url().includes('/api/car') && r.request().method() === 'GET');
  await page.getByRole('listitem').filter({ hasText: 'Scout Zulu' }).click();
  await expect(page.getByText('Selected:')).toBeVisible();
  await carLookup;
  await page.waitForTimeout(250); // let the reset that follows the lookup settle

  await page.getByTestId('car-name-input').fill('Zulu Zoomer');
  await page.getByTestId('car-weight-input').fill('4.9');
  await submit.click();
  // The registration panel closes itself once the car is saved.
  await expect(page.getByRole('heading', { name: 'Register Racer & Car' })).toHaveCount(0);

  await page.goto('/cars');
  await expect(page.getByText('Zulu Zoomer').first()).toBeVisible();
});

test('organizer registers an adult who is not on the roster', async ({ page }) => {
  await openRegistration(page);
  await page.getByRole('radio', { name: 'adult' }).check();
  await page.getByPlaceholder('Enter racer name').fill('Adult Zulu');
  await page.getByTestId('car-name-input').fill('Grown-up Glider');
  await page.getByTestId('car-weight-input').fill('5.0');
  await page.getByRole('button', { name: 'Complete Registration' }).click();
  // The registration panel closes itself once the car is saved.
  await expect(page.getByRole('heading', { name: 'Register Racer & Car' })).toHaveCount(0);

  await page.goto('/racers');
  await expect(page.getByText('Adult Zulu').first()).toBeVisible();
});

test('dashboard counts include the new registrations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('dashboard-count-cars')).toHaveText('20');
  await expect(page.getByTestId('dashboard-count-racers')).toHaveText('20');
});
