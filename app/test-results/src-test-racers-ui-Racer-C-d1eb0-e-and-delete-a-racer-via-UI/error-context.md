# Test info

- Name: Racer CRUD UI >> should create, view, update, and delete a racer via UI
- Location: /Users/ajturner/Projects/Pack380Derby/app/src/test/racers-ui.spec.ts:7:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByText('Playwright Racer')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByText('Playwright Racer')

    at /Users/ajturner/Projects/Pack380Derby/app/src/test/racers-ui.spec.ts:23:54
```

# Page snapshot

```yaml
- alert
- button "Open Next.js Dev Tools":
  - img
- heading "🏎️ Pinewood Derby" [level=2]
- navigation:
  - link "Dashboard":
    - /url: /
  - link "Cars":
    - /url: /cars
  - link "Racers":
    - /url: /racers
  - link "Heats":
    - /url: /heats
- main:
  - heading "All Cars" [level=1]
  - link "Create Racer":
    - /url: /racers/create
    - text: Register New Racer
  - heading "Planned Racers" [level=2]
  - text: "Andy Turner Role: Adult Rank: Adult Den: Adult"
  - link "Edit":
    - /url: /racers/1/edit
  - text: "Bobby Role: cub Rank: lion Den: 5"
  - link "Edit":
    - /url: /racers/2/edit
  - text: "Sammy Role: sibling Rank: tiger Den: 5"
  - link "Edit":
    - /url: /racers/3/edit
  - text: "Sally Role: adult Rank: aol Den: 3"
  - link "Edit":
    - /url: /racers/4/edit
  - text: "Playwright Racer Role: cub Rank: lion Den: 5"
  - link "Edit":
    - /url: /racers/5/edit
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | // These tests assume the app is running locally at http://localhost:3001
   4 | // and that the /racers page and racer form are available.
   5 |
   6 | test.describe('Racer CRUD UI', () => {
   7 |   test('should create, view, update, and delete a racer via UI', async ({ page }) => {
   8 |     // Go to racers list
   9 |     await page.goto('http://localhost:3001/racers');
  10 |     await expect(page).toHaveTitle(/Pinewood Derby/);
  11 |
  12 |     // Click to add a new racer
  13 |     await page.locator('a[href*="/racers/create"]').click();
  14 |
  15 |     // Fill out the form
  16 |     await page.getByLabel(/name/i).fill('Playwright Racer');
  17 |     await page.getByLabel(/rank/i).selectOption('lion');
  18 |     await page.getByLabel(/role/i).selectOption('cub');
  19 |     await page.getByLabel(/den/i).fill('5');
  20 |     await page.getByRole('button', { name: /create|register|save/i }).click();
  21 |
  22 |     // Should be redirected to racers list and see the new racer
> 23 |     await expect(page.getByText('Playwright Racer')).toBeVisible();
     |                                                      ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  24 |
  25 |     // Click on the racer to view details (assume link or row click)
  26 |     await page.getByText('Playwright Racer').click();
  27 |     await expect(page.getByText('Playwright Racer')).toBeVisible();
  28 |     await expect(page.getByText('Test Den')).toBeVisible();
  29 |     await expect(page.getByText('Test Rank')).toBeVisible();
  30 |
  31 |     // Click edit (if available)
  32 |     if (await page.getByRole('button', { name: /edit/i }).isVisible()) {
  33 |       await page.getByRole('button', { name: /edit/i }).click();
  34 |       await page.getByLabel(/name/i).fill('Playwright Racer Updated');
  35 |       await page.getByRole('button', { name: /save|update/i }).click();
  36 |       await expect(page.getByText('Playwright Racer Updated')).toBeVisible();
  37 |     }
  38 |
  39 |     // Delete the racer
  40 |     await page.getByRole('button', { name: /delete/i }).click();
  41 |     // Confirm dialog
  42 |     await page.getByRole('button', { name: /yes|confirm|ok/i }).click().catch(async () => {
  43 |       // fallback for native dialogs
  44 |       await page.once('dialog', dialog => dialog.accept());
  45 |     });
  46 |     // Should not see the racer anymore
  47 |     await expect(page.getByText(/Playwright Racer/)).not.toBeVisible();
  48 |   });
  49 | });
  50 |
```