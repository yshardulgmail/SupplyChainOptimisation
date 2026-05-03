/**

 * TASK 6 — Step Definitions for API + Browser (API UI) Testing

 *

 * Reference Task 4 for API shapes and assertions:

 *   API: https://dummyjson.com

 *   Feature: tests/features/task4-api.feature

 *   Steps: tests/steps/task4-api.steps.ts

 *

 * TODO:

 *   1. Write Gherkin scenarios in features/task6-api-ui.feature

 *   2. Implement matching step definitions below

 *

 * Requirements:

 *   - Use APIRequestContext for all programmatic HTTP calls (same as Task 4)

 *   - Use Playwright Page for browser navigation and visible text assertions

 *   - Do NOT use external HTTP libraries (axios, node-fetch, etc.)

 *   - Do NOT use hardcoded waits (page.waitForTimeout)

 */

 
import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page, expect } from '@playwright/test';

setDefaultTimeout(30_000);

let browser: Browser;
let page: Page;
let lastApiResponse: any;
let lastApiStatus: number;
let firstUserEmail: string = '';

Before(async function () {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  page = await context.newPage();
});

After(async function () {
  await browser.close();
});

// ────── API CALLS ──────
When('I send a GET request to {string} via API', async function (endpoint: string) {
  const response = await page.request.get(`https://dummyjson.com${endpoint}`);
  lastApiStatus = response.status();
  lastApiResponse = await response.json();
});

Then('the API response status should be {int}', async function (expectedStatus: number) {
  expect(lastApiStatus).toBe(expectedStatus);
});

Then('the API response email should be {string}', async function (expectedEmail: string) {
  expect(lastApiResponse.email).toBe(expectedEmail);
});

Then('the users array should have exactly {int} users', async function (count: number) {
  expect(lastApiResponse.users).toHaveLength(count);
});

When('I note the first user\'s email from the API response', async function () {
  firstUserEmail = lastApiResponse.users[0].email;
});

// ────── BROWSER NAVIGATION AND ASSERTIONS ──────
When('I navigate to {string} in the browser', async function (url: string) {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
});

Then('the page should display the email {string}', async function (expectedEmail: string) {
  const pageText = await page.textContent('body');
  expect(pageText).toContain(expectedEmail);
});

Then('the page should display the firstName {string}', async function (firstName: string) {
  const pageText = await page.textContent('body');
  expect(pageText).toContain(firstName);
});

Then('the page should contain the noted email address', async function () {
  const pageText = await page.textContent('body');
  expect(pageText).toContain(firstUserEmail);
});

Then('the page should contain {string}', async function (text: string) {
  const pageText = await page.textContent('body');
  expect(pageText).toContain(text);
});

Then('the page should display a {string} message', async function (messageText: string) {
  const pageText = await page.textContent('body');
  expect(pageText?.toLowerCase()).toContain(messageText.toLowerCase());
});