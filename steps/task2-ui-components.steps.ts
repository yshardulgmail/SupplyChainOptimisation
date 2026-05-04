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
import { chromium, Browser, Page, expect, BrowserContext } from '@playwright/test';

setDefaultTimeout(30_000); 

let browser: Browser;
let page: Page;
let newPage: Page;
let context: BrowserContext;
let dialogAction: 'accept' | 'dismiss' = 'accept';
let dialogText = '';

Before(async function () {
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext();
  page = await context.newPage();
});

After(async function () {
  await browser.close();
});


// Scenario 1

Given('I open the dropdown page', async function () {
  await page.goto('https://the-internet.herokuapp.com/dropdown');
});

Then('the dropdown should be visible with default unselected state', async function () {
  const dropdown = page.locator('#dropdown');
  await expect(dropdown).toBeVisible();
  const selectedOption = dropdown.locator('option[selected="selected"]');
  expect(await selectedOption.getAttribute("disabled")).toEqual("disabled");
});

When('I select {string} by visible text', async function (optionText) {
  await page.selectOption('#dropdown', { label: optionText });
});

Then('{string} should be selected', async function (optionText) {
  const selectedValue = await page.locator('#dropdown').inputValue();
  const option = page.locator(`#dropdown option:has-text("${optionText}")`);
  const value = await option.getAttribute('value');
  expect(selectedValue).toBe(value);
});

When('I select {string} by value attribute', async function (optionValue: string) {
  // const option = page.locator(`#dropdown option[value="${optionValue}"]`);
  // const text = await option.innerText();
  // await page.selectOption('#dropdown', { label: text });
  await page.selectOption('#dropdown', { value: optionValue.split(" ")[1] });
});

Then('{string} should no longer be selected', async function (optionText) {
  const selectedValue = await page.locator('#dropdown').inputValue();
  const option = page.locator(`#dropdown option:has-text("${optionText}")`);
  const value = await option.getAttribute('value');
  expect(selectedValue).not.toBe(value);
});


// Scenario 2

Given('I navigate to the JS alerts page', async function () {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
});

When('I click {string} button', async function (buttonText) {
  await page.click(`button:has-text("${buttonText}")`);
});

When('I accept the alert', async function () {
  page.once('dialog', async dialog => {
    await dialog.accept();
  });
});

When('I dismiss the alert', async function () {
  page.once('dialog', async dialog => {
    if (dialog.type() === 'confirm') {
    await dialog.dismiss(); // Click "Cancel"
  }
  });
});

When('I click Click for JS Prompt and I enter Playwright Assessment in the prompt and I accept the prompt', async function () {
  page.once('dialog', async dialog => {
    await dialog.accept("Playwright Assessment");
  });

  await page.click('button:has-text("Click for JS Prompt")');
});

When('I accept the prompt', async function () {
  page.once('dialog', async dialog => {
    await dialog.accept();
  });
});

Then('I should see the result {string}', async function (expectedResult) {
  const resultElement = page.locator('#result');
  await expect(resultElement).toContainText(expectedResult);
});

 

// ────── DYNAMIC LOADING ──────

Given('I navigate to the dynamic loading page', async function () {

  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');

});
 

Then('the loading indicator should disappear', async function () {

  const loadingBar = page.locator('#loading');

  await expect(loadingBar).not.toBeVisible({ timeout: 10000 });

});

 

Then('I should see the text {string}', async function (text) {

  const element = page.locator(`text=${text}`);

  await expect(element).toBeVisible();

});

 

Then('the loading bar should not be visible', async function () {

  const loadingBar = page.locator('#loading');

  await expect(loadingBar).not.toBeVisible();

});

 

// ────── IFRAME INTERACTIONS ──────

Given('I navigate to the iframe page', async function () {

  await page.goto('https://the-internet.herokuapp.com/iframe');

});

 

When('I clear the TinyMCE editor', async function () {

  const iframe = page.frameLocator('iframe[title="Rich Text Area"]');

  const body = iframe.locator('body');

  await body.click();

  await body.selectText();

  await page.keyboard.press('Delete');

});

 

When('I type {string} into the editor', async function (text) {

  const iframe = page.frameLocator('iframe[title="Rich Text Area"]');

  const body = iframe.locator('body');

  await body.type(text);

});

 

Then('the editor should contain {string}', async function (expectedText) {

  const iframe = page.frameLocator('iframe[title="Rich Text Area"]');

  const body = iframe.locator('body');

  const content = await body.innerText();

  expect(content).toContain(expectedText);

});


// Scenario 5

Given('I navigate to the widnows page', async function () {
  await page.goto('https://the-internet.herokuapp.com/windows');
});

When('I click {string} link', async function (expectedText) {
  const pagePromise = context.waitForEvent('page');
  await page.locator(`a:has-text("${expectedText}")`).click();
  newPage = await pagePromise;
});

Then('I see new tab is opened with {string} in URL and {string} as heading', async function (url, headingText) {
  expect(newPage).toHaveURL(new RegExp(url));
  const heading = newPage.locator('h3');
  await expect(heading).toContainText(headingText);
});

Then('I close the new tab and confirm original page shows {string}', async function (headingText) {
  await newPage.close();
  const heading = page.locator('h3');
  await expect(heading).toContainText(headingText);
});
