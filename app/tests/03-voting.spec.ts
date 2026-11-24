import { test, expect } from '@playwright/test';
import { chooseRacer } from './helpers';

test.describe.configure({ mode: 'serial' });

test('voting asks for a racer first', async ({ page }) => {
  await page.goto('/voting');
  await expect(page.getByText('Voting is only open to Cub Scout racers.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Choose Racer' })).toBeVisible();
});

test('siblings and adults cannot vote', async ({ page }) => {
  await page.goto('/voting');
  await chooseRacer(page, 'Sibling Alpha');
  await expect(page.getByText('Voting is only open to Cub Scout racers.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit Vote' })).toHaveCount(0);
});

test('a cub votes once in each category', async ({ page }) => {
  await page.goto('/voting');
  await chooseRacer(page, 'Scout Alpha');
  await expect(page.getByRole('heading', { name: 'Vote for...' })).toBeVisible();

  // Only cub cars are candidates: 12 seeded cub cars, no sibling or adult cars.
  await expect(page.getByRole('button', { name: /^Car #\d+$/ })).toHaveCount(12);

  const submit = page.getByRole('button', { name: 'Submit Vote' });
  await expect(submit).toBeDisabled();

  await page.getByRole('button', { name: 'Car #3', exact: true }).click();
  await expect(submit).toBeDisabled(); // one category still open
  await page.getByRole('button', { name: /^Best Paint Job/ }).click();
  await page.getByRole('button', { name: 'Car #5', exact: true }).click();
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(page.getByText('Thank you for voting!')).toBeVisible();
});

test('tallies show one vote for each chosen car', async ({ page }) => {
  await page.goto('/voting/results');
  await expect(page.getByRole('heading', { name: 'Voting Results' })).toBeVisible();
  const creative = page.locator('div.mb-10', { has: page.getByRole('heading', { name: 'Most Creative' }) });
  await expect(creative.getByText('Car #3')).toBeVisible();
  await expect(creative.getByText('Votes: 1')).toHaveCount(1);
  const paint = page.locator('div.mb-10', { has: page.getByRole('heading', { name: 'Best Paint Job' }) });
  await expect(paint.getByText('Car #5')).toBeVisible();
});

test('voting again replaces the earlier vote', async ({ page }) => {
  await page.goto('/voting');
  await chooseRacer(page, 'Scout Alpha');
  // Earlier choices are shown as selected.
  await expect(page.getByRole('button', { name: /^Most Creative.*Selected/ })).toBeVisible();

  await page.getByRole('button', { name: 'Car #7', exact: true }).click();
  await page.getByRole('button', { name: 'Submit Vote' }).click();
  await expect(page.getByText('Thank you for voting!')).toBeVisible();

  await page.goto('/voting/results');
  const creative = page.locator('div.mb-10', { has: page.getByRole('heading', { name: 'Most Creative' }) });
  await expect(creative.getByText('Car #7')).toBeVisible();
  await expect(creative.getByText('Car #3')).toHaveCount(0);
  await expect(creative.getByText('Votes: 1')).toHaveCount(1);
});

test('a second voter adds to the tally', async ({ page }) => {
  await page.goto('/voting');
  await chooseRacer(page, 'Scout Bravo');
  await page.getByRole('button', { name: 'Car #7', exact: true }).click();
  await page.getByRole('button', { name: /^Best Paint Job/ }).click();
  await page.getByRole('button', { name: 'Car #5', exact: true }).click();
  await page.getByRole('button', { name: 'Submit Vote' }).click();
  await expect(page.getByText('Thank you for voting!')).toBeVisible();

  await page.goto('/voting/results');
  const creative = page.locator('div.mb-10', { has: page.getByRole('heading', { name: 'Most Creative' }) });
  await expect(creative.getByText('Votes: 2')).toBeVisible();
});
