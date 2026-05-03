/**

 * TASK 1 — Step Definitions for Locators & Assertions

 * Website: https://the-internet.herokuapp.com

 *

 * TODO:

 *   1. Write Gherkin scenarios in features/task1-locators.feature

 *   2. Implement matching step definitions below

 *

 * Requirements:

 *   - Use robust locators (role-based, label-based, or semantic selectors)

 *   - Include meaningful assertions in every Then step

 *   - Do NOT use hardcoded waits (page.waitForTimeout)

 */

 
import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page, expect } from '@playwright/test';

setDefaultTimeout(30_000);

let browser: Browser;
let page: Page;
const checkboxStates: boolean[] = [];

Before(async function () {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  page = await context.newPage();
});

After(async function () {
  await browser.close();
});

// async function recordStates(checkboxes) {
//   const count = await checkboxes.count();
//   for (let i = 0; i < count; i++) {
//     const isChecked = await checkboxes.nth(i).isChecked();
//     checkboxStates.push(isChecked);
//   }
// }

// Open Login page

Given('I open the login page', async function () {
  await page.goto('https://the-internet.herokuapp.com/login');
});


// Scenario 1

Then('the page heading contains {string}', async function (expectedHeading) {
  const heading = page.locator('h2');
  await expect(heading).toContainText(expectedHeading);
});

Then('the username and password fields should be visible', async function () {
  const username = page.locator('input[name="username"]');
  await expect(username).toBeVisible();

  const password = page.locator('input[name="password"]');
  await expect(password).toBeVisible();
});
 
Then('the login button is visible and has text {string}', async function (expectedLabel) {
  const login = page.locator('button[type="submit"]');
  await expect(login).toBeVisible();
  await expect(login).toContainText(expectedLabel);
});


// Scenario 2 and 3

When('I enter username {string} and password {string}', async function (username, password) {
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
});

When('I click the login button', async function () {
  const loginButton = page.locator('button[type="submit"]');
  await expect(loginButton).toBeVisible();
  await expect(loginButton).toBeEnabled();
  await loginButton.click({ timeout: 15000 });
});

Then('the URL changes to contain {string}', async function (urlSubstring) {
  await expect(page).toHaveURL(new RegExp(urlSubstring));
});

Then('I should see the success flash message {string}', async function (message) {
  const flashMessage = page.locator('div[id="flash-messages"]');
  await expect(flashMessage).toContainText(message);
});

Then('the logout button should be visible', async function () {
  const logoutButton = page.locator('a[href="/logout"]');
  await expect(logoutButton).toBeVisible();
});

Then('the URL should not contain {string}', async function (urlSubstring) {
  const currentUrl = page.url();
  expect(currentUrl).not.toContain(urlSubstring);
});

Then('I should see the error message {string}', async function (message) {
  const flashMessage = page.locator('div[id="flash-messages"]');
  await expect(flashMessage).toContainText(message);
});


// Scenario - 4

Given('I open the checkboxes page', async function () {
  await page.goto('https://the-internet.herokuapp.com/checkboxes');
});

Then('there must be exactly {int} checkboxes', async function (count) {
  const checkboxes = page.locator('input[type="checkbox"]');
  await expect(checkboxes).toHaveCount(count);
});

Then('I note the initial checked state of each checkbox', async function () {
  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  for (let i = 0; i < count; i++) {
    const isChecked = await checkboxes.nth(i).isChecked();
    checkboxStates.push(isChecked);
  }
});

When('I toggle all checkboxes', async function () {
  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  for (let i = 0; i < count; i++) {
    await checkboxes.nth(i).click();
  }
});

When('I toggle all checkboxes back again', async function () {
  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  for (let i = 0; i < count; i++) {
    await checkboxes.nth(i).click();
  }
});

Then('each checkbox state should be opposite to its initial state', async function () {
  const checkboxes = page.locator('input[type="checkbox"]');
  for (let i = 0; i < checkboxStates.length; i++) {
    const isChecked = await checkboxes.nth(i).isChecked();
    expect(isChecked).toBe(!checkboxStates[i]);
  }
});

Then('each checkbox should return to its original state', async function () {
  const checkboxes = page.locator('input[type="checkbox"]');
  for (let i = 0; i < checkboxStates.length; i++) {
    const isChecked = await checkboxes.nth(i).isChecked();
    expect(isChecked).toBe(checkboxStates[i]);
  }
});