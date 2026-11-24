# Testing Guide

Three layers run in CI on every pull request (`.github/workflows/ci.yml`):

| Layer | Where | Command |
|---|---|---|
| Server unit tests (Jest) | `server/` | `npm test` |
| App unit tests (Vitest) | `app/` | `npm test` |
| End-to-end tests (Playwright) | `app/` | `npm run test:e2e` |

Run `npm ci` in both `server/` and `app/` first, and `npx prisma generate` in `server/`.

## End-to-end tests

The Playwright suite drives a real browser against a real API, app and Postgres database. Playwright starts everything itself: it migrates and seeds the test database, builds and starts the API on port 3100 and the app on port 3101, signs in once, then runs the specs. The ports are different from the usual dev servers (3000 and 3001), so a dev session can stay open.

### One-time setup

```sh
createdb pinewood_derby_e2e
cd app && npx playwright install chromium
```

### Run

```sh
cd app
npm run test:e2e
```

`npx playwright test --ui` opens the interactive runner. The HTML report is written to `app/playwright-report/`.

### The test database is wiped on every run

`server/scripts/seed-e2e.ts` empties every table and loads a small synthetic event: 12 cub cars, 3 sibling cars, 3 adult cars, one scout without a car, and two voting categories. It refuses to run unless the database name contains `e2e` or `test`.

By default the suite uses `postgresql://$USER@localhost:5432/pinewood_derby_e2e`. Override with `E2E_DATABASE_URL`. Never point it at a database with real event data.

### What the specs cover

Specs share one database and run in file order on a single worker.

- `01-smoke`: shared-password sign-in, dashboard counts, browsing, organizer-only controls.
- `02-derby-journey`: one cub division from preliminary to final: create rounds, score heats, place validation, advancement, leaderboards, results page, print sheet, picking your own racer.
- `03-voting`: who may vote, one vote per category, changing a vote, tallies.
- `04-registration`: registering a car for a rostered scout and for a new adult.

These describe what the app does today, including a few quirks that are noted in comments with their issue numbers. When a tracked issue changes behaviour, update the spec in the same pull request.

### Writing specs

- Heats are drawn at random. Read the cars from the page and score by rule (see `scoreHeatInLaneOrder` in `app/tests/helpers.ts`) rather than expecting a particular car in a particular lane.
- Prefer `data-testid` for scorer inputs and leaderboards; prefer roles and visible text elsewhere.
- Organizer screens are reached with `asOrganizer('/path')`.
- Only use synthetic names. Never copy real event data into fixtures.
