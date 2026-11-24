import { test, expect, type Page } from '@playwright/test';
import { asOrganizer, createRace, readHeat, scoreHeatInLaneOrder, type LaneEntry } from './helpers';

/**
 * One cub division run from preliminary to final on a six-lane track.
 *
 * The seed has exactly 12 cub cars, so the preliminary is two full heats.
 * Every heat is scored in lane order (lowest lane wins). With the current
 * rules that means: the top three of each preliminary heat reach the
 * semifinal, all six semifinalists reach the final, and no dead heat is needed.
 */
test.describe.configure({ mode: 'serial' });

let page: Page;
let prelimId: string;
let semifinalId: string;
let finalId: string;
let prelimHeats: LaneEntry[][] = [];
let finalHeat: LaneEntry[] = [];

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});
test.afterAll(async () => {
  await page.close();
});

test('organizer creates the preliminary round', async () => {
  prelimId = await createRace(page, 'preliminary', 'cub');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('cub Preliminary');

  const heats = [await readHeat(page, 0), await readHeat(page, 1)];
  expect(heats[0]).toHaveLength(6);
  expect(heats[1]).toHaveLength(6);
  expect(heats[0].map(e => e.lane)).toEqual([1, 2, 3, 4, 5, 6]);

  // Every cub car is drawn exactly once.
  const names = heats.flat().map(e => e.carName);
  expect(new Set(names).size).toBe(12);
  expect(names.every(n => n.startsWith('Cub Car '))).toBe(true);
});

test('scorer cannot save duplicate places', async () => {
  for (const lane of [1, 2, 3, 4, 5, 6]) {
    await page.getByTestId(`place-heat-0-lane-${lane}`).fill('1');
  }
  await page.getByTestId('place-heat-0-lane-6').blur();
  await expect(page.getByText('Duplicate place').first()).toBeVisible();
  await expect(page.getByTestId('save-heat-0')).toBeDisabled();
  await expect(page.getByTestId('heat-status-0')).toHaveText('Upcoming');
});

test('scorer cannot enter a place outside the heat', async () => {
  await page.getByTestId('place-heat-0-lane-1').fill('7');
  await page.getByTestId('place-heat-0-lane-1').blur();
  await expect(page.getByText('Place must be 1-6').first()).toBeVisible();
});

test('scorer records both preliminary heats', async () => {
  await page.goto(asOrganizer(`/races/${prelimId}`));
  prelimHeats = [await scoreHeatInLaneOrder(page, 0), await scoreHeatInLaneOrder(page, 1)];

  // Results survive a reload.
  await page.reload();
  await expect(page.getByTestId('heat-status-0')).toHaveText('Completed');
  await expect(page.getByTestId('heat-status-1')).toHaveText('Completed');
  await expect(page.getByTestId('place-heat-1-lane-3')).toHaveValue('3');
});

test('preliminary leaderboard ranks all twelve cars by place', async () => {
  await page.goto('/');
  const board = page.getByTestId('leaderboard-10-cub');
  await expect(board.locator('tbody tr')).toHaveCount(12);
  // Two heat winners share the best score, shown as place x 100.
  await expect(board.locator('tbody tr').nth(0)).toContainText('100');
  await expect(board.locator('tbody tr').nth(1)).toContainText('100');
  await expect(board.locator('tbody tr').nth(11)).toContainText('600');
});

test('top three of each heat advance to the semifinal', async () => {
  semifinalId = await createRace(page, 'semifinal', 'cub');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('cub Semifinal');

  const semifinal = await readHeat(page, 0);
  const expected = prelimHeats.flatMap(heat => heat.slice(0, 3).map(e => e.carName)).sort();
  expect(semifinal.map(e => e.carName).sort()).toEqual(expected);

  await scoreHeatInLaneOrder(page, 0);
});

test('all six semifinalists race the final', async () => {
  finalId = await createRace(page, 'final', 'cub');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('cub Final');
  expect(Number(finalId)).toBeGreaterThan(Number(semifinalId));

  const final = await readHeat(page, 0);
  expect(final).toHaveLength(6);
  finalHeat = await scoreHeatInLaneOrder(page, 0);
});

test('results page shows the final standings in finishing order', async () => {
  await page.goto('/results');
  const board = page.getByTestId('leaderboard-30-cub');
  const rows = board.locator('tbody tr');
  await expect(rows).toHaveCount(6);
  for (const [index, entry] of finalHeat.entries()) {
    await expect(rows.nth(index)).toContainText(entry.carName);
    await expect(rows.nth(index)).toContainText(String((index + 1) * 100));
  }
  await expect(page.getByRole('heading', { name: 'Best of the rest...' })).toBeVisible();
});

test('races page lists each round as completed', async () => {
  await page.goto('/races');
  await expect(page.getByRole('heading', { name: 'Preliminary (1)', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Semifinal (1)', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Final (1)', exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Completed', exact: true })).toHaveCount(4);
});

test('print sheet is available for a race', async () => {
  await page.goto(`/races/${prelimId}`);
  await page.getByRole('link', { name: 'Print Heat Sheets' }).click();
  await page.waitForURL(new RegExp(`/races/${prelimId}/print`));
  await expect(page.getByText('Cub Car').first()).toBeVisible();
});

test('a racer who picks themselves sees their car and heats on the dashboard', async () => {
  const winner = finalHeat[0].carName; // e.g. "Cub Car Delta" belongs to "Scout Delta"
  const scout = winner.replace('Cub Car', 'Scout');
  await page.goto('/');
  await page.getByPlaceholder('Type 2+ characters...').fill(scout);
  await page.getByRole('listitem').filter({ hasText: scout }).first().click();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Racer Details' })).toBeVisible();
  await expect(page.getByText(winner).first()).toBeVisible();
  await page.getByRole('button', { name: 'Change Racer' }).click();
});
