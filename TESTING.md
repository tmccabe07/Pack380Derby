# Testing Guide

This project uses Playwright for end-to-end (E2E) testing and Vitest for unit testing.

## Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- All dependencies installed: `npm install` (run in root, app, and server folders if needed)

## Playwright E2E Tests

### Setup
1. Install Playwright browsers:
   ```sh
   npx playwright install
   ```
2. Ensure both the frontend (app) and backend (server) can start locally.
   - The Playwright config will start both automatically using:
     ```sh
     npm run start:all
     ```
   - This runs both `start:server` and `start:app` in parallel.

### Running Tests
- From the project root, run:
  ```sh
  npm run test:playwright
  ```
- This will:
  - Start both the server and app
  - Run all Playwright tests in `/app/tests`
  - Generate a report in `/app/playwright-report`

### Troubleshooting
- If you see a timeout error, make sure both services start and listen on the expected ports (default: 3000).
- You can increase the timeout in `playwright.config.ts` if your servers are slow to start.
- Make sure you have `npm-run-all` installed:
  ```sh
  npm install --save-dev npm-run-all
  ```

## Unit Tests (Vitest)

- Run unit tests from the app folder:
  ```sh
  cd app
  npm run test
  ```
- Unit tests are located in `app/__tests__`.

## Environment Variables
- Ensure `.env.local` or `.env` files are set up for both app and server as needed.
- Example variables:
  ```env
  NEXT_PUBLIC_DERBY_API_URL=http://localhost:3000
  NEXT_PUBLIC_DERBY_API_TOKEN=your_token_here
  ```

## Summary
- E2E: `npm run test:playwright` (root)
- Unit: `npm run test` (in app folder)
- Both services must be able to start locally for E2E tests.
- See `playwright.config.ts` for more details and customization.
