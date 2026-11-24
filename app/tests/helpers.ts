import { expect, type Page } from '@playwright/test';

/** Organizer screens are unlocked by this query flag in the current app. */
export const asOrganizer = (path: string) => `${path}${path.includes('?') ? '&' : '?'}admin=true`;

export const RACE_TYPE = { preliminary: '10', semifinal: '20', final: '30' } as const;

/** Creates a race through the organizer form and returns its id from the URL. */
export async function createRace(
  page: Page,
  raceType: keyof typeof RACE_TYPE,
  racerType: 'cub' | 'sibling' | 'adult' = 'cub',
): Promise<string> {
  await page.goto(asOrganizer('/races/create'));
  await page.getByTestId('race-type-select').selectOption(RACE_TYPE[raceType]);
  await page.getByTestId('racer-type-select').selectOption(racerType);
  await page.getByRole('button', { name: 'Create Race' }).click();
  await page.waitForURL(/\/races\/\d+\?admin=true$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(`Race #`);
  return new URL(page.url()).pathname.split('/').pop()!;
}

export interface LaneEntry { lane: number; carName: string }

/** Reads the cars of one heat from the race page, in lane order. */
export async function readHeat(page: Page, heatId: number): Promise<LaneEntry[]> {
  const rows = page.locator(`[data-testid^="heat-${heatId}-lane-"]`);
  await expect(rows.first()).toBeVisible();
  const entries: LaneEntry[] = [];
  for (const row of await rows.all()) {
    const lane = Number((await row.getAttribute('data-testid'))!.split('-').pop());
    const carName = (await row.locator('a[href^="/cars/"]').nth(1).innerText()).trim();
    entries.push({ lane, carName });
  }
  return entries.sort((a, b) => a.lane - b.lane);
}

/**
 * Scores a heat so that the car in the lowest lane wins, the next lane is
 * second, and so on. Heats are drawn at random, so tests score by rule and
 * then assert on whichever cars landed in each lane.
 */
export async function scoreHeatInLaneOrder(page: Page, heatId: number): Promise<LaneEntry[]> {
  const entries = await readHeat(page, heatId);
  for (const [index, entry] of entries.entries()) {
    await page.getByTestId(`place-heat-${heatId}-lane-${entry.lane}`).fill(String(index + 1));
  }
  // Known quirk (issue #88): validation lags one keystroke behind, so the last
  // field keeps a stale error until focus leaves it. Scorers tab out; so do we.
  await page.getByTestId(`place-heat-${heatId}-lane-${entries[entries.length - 1].lane}`).press('Tab');
  await page.getByTestId(`save-heat-${heatId}`).click();
  await expect(page.getByTestId(`save-heat-${heatId}`)).toHaveText('Saved');
  await expect(page.getByTestId(`heat-status-${heatId}`)).toHaveText('Completed');
  return entries;
}

/** Picks "who am I" from the racer search box shown on the dashboard and voting pages. */
export async function chooseRacer(page: Page, name: string) {
  await page.getByPlaceholder('Type 2+ characters...').fill(name);
  await page.getByRole('listitem').filter({ hasText: name }).first().click();
  await expect(page.getByText(new RegExp(`Logged in as:\\s*${name}`))).toBeVisible();
}
