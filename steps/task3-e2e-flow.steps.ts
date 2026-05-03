/**

 * TASK 3 — Step Definitions for End-to-End Shopping Flow

 * Website: https://www.saucedemo.com

 *

 * TODO:

 *   1. Write Gherkin scenarios in features/task3-e2e-flow.feature

 *   2. Implement matching step definitions below

 *

 * Requirements:

 *   - Use SauceDemo's data-test attributes for robust locators

 *   - Verify prices, totals, and tax calculations

 *   - Every Then step must have at least one assertion

 *   - Do NOT use hardcoded waits

 */


import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page, expect } from '@playwright/test';

setDefaultTimeout(30_000);

let browser: Browser;
let page: Page;
let selectedProducts: Map<string, string> = new Map();

Before(async function () {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  page = await context.newPage();
});

After(async function () {
  await browser.close();
});

// ────── LOGIN ──────
Given('I login to SauceDemo with username {string} and password {string}', async function (username: string, password: string) {
  await page.goto('https://www.saucedemo.com');
  const usernameField = page.getByPlaceholder("Username");
  const passwordField = page.getByPlaceholder("Password");
  await usernameField.isVisible();
  await passwordField.isVisible();
  await usernameField.fill(username)
  await passwordField.fill(password);
  await page.click('#login-button');
  await page.waitForURL("https://www.saucedemo.com/inventory.html");
});

Then('I should be on the inventory page with products visible', async function () {
  const products = page.locator('[data-test="inventory-item"]');
  await expect(products.first()).toBeVisible();
});

// ────── SORTING ──────
Then('the default sort order should be {string}', async function (sortOrder: string) {
  const activeSort = page.locator('select[data-test="product-sort-container"]');
  const text = await activeSort.innerText();
  expect(text).toContain(sortOrder);
});

When('I change the sort order to {string}', async function (sortOrder: string) {
  await page.locator('select[data-test="product-sort-container"]').selectOption({label: sortOrder});
  await page.waitForLoadState('networkidle');
});

Then('all product prices should be in ascending order', async function () {
  const priceElements = page.locator('div[data-test="inventory-item-price"]');
  const count = await priceElements.count();
  const prices: number[] = [];
  for (let i = 0; i < count; i++) {
    const priceText = await priceElements.nth(i).innerText();
    const price = parseFloat(priceText.replace('$', ''));
    prices.push(price);
  }
  for (let i = 1; i < prices.length; i++) {
    expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
  }
});

Then('all product prices should be in descending order', async function () {
  const priceElements = page.locator('div[data-test="inventory-item-price"]');
  const count = await priceElements.count();
  const prices: number[] = [];
  for (let i = 0; i < count; i++) {
    const priceText = await priceElements.nth(i).innerText();
    const price = parseFloat(priceText.replace('$', ''));
    prices.push(price);
  }
  for (let i = 1; i < prices.length; i++) {
    expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
  }
});

Then('the total number of products should be {int}', async function (count: number) {
  const products = page.locator('div[data-test="inventory-item"]');
  await expect(products).toHaveCount(count);
});

// ────── CART MANAGEMENT ──────
When('I add {string} to the cart', async function (productName: string) {
  const reformedName = productName.toLowerCase().replaceAll(" ", "-");
  const product = page.locator(`button[data-test="add-to-cart-${reformedName}"]`);
  await product.click();
  selectedProducts.set(productName, productName);
});

Then('the cart badge should show {string}', async function (count: string) {
  const badge = page.locator('span[data-test="shopping-cart-badge"]');
  await expect(badge).toContainText(count);
});

When('I navigate to the cart page', async function () {
  await page.click('a[data-test="shopping-cart-link"]');
  await page.waitForLoadState('networkidle');
});

Then('both items should be listed with correct names and prices', async function () {
  for (const productName of selectedProducts.keys()) {
    const item = page.locator(`text="${productName}"`);
    await expect(item).toBeVisible();
  }
});

When('I remove {string} from the cart', async function (productName: string) {
  const reformedName = productName.toLowerCase().replaceAll(" ", "-");
  const removeButton = page.locator(`button[data-test="remove-${reformedName}"]`);
  await removeButton.click();
  selectedProducts.delete(productName);
});

Then('only {string} should remain in the cart', async function (productName: string) {
  const item = page.locator(`text="${productName}"`);
  await expect(item).toBeVisible();
});

Then('I should be back on the inventory page', async function () {
  const inventory = page.locator('[data-test="inventory-container"]');
  await expect(inventory).toBeVisible();
});

Then('the {string} button should say {string}', async function (productName: string, buttonText: string) {
  const reformedName = productName.toLowerCase().replaceAll(" ", "-");
  const button = page.locator(`button[data-test="add-to-cart-${reformedName}"], [data-test="remove-${reformedName}"]`);
  await expect(button).toContainText(buttonText);
});

// ────── CHECKOUT ──────
When('I add {string} and {string} to the cart', async function (product1: string, product2: string) {
  const reformedName1 = product1.toLowerCase().replaceAll(" ", "-");
  const reformedName2 = product2.toLowerCase().replaceAll(" ", "-");
  await page.locator(`button[data-test="add-to-cart-${reformedName1}"]`).click();
  await page.locator(`button[data-test="add-to-cart-${reformedName2}"]`).click();
});

When("I click {string}", async function (buttonText: string) {
  const button = page.locator(`#${buttonText.toLowerCase().replaceAll(" ", "-")} , button:has-text("${buttonText}")`);
  await button.click();
});

When('I fill in checkout form with firstName {string}, lastName {string}, zip {string}', async function (firstName: string, lastName: string, zip: string) {
  await page.fill('input[data-test="firstName"]', firstName);
  await page.fill('input[data-test="lastName"]', lastName);
  await page.fill('input[data-test="postalCode"]', zip);
});

Then('the item total should be {string}', async function (expectedTotal: string) {
  const itemTotal = page.locator('[data-test="subtotal-label"]');
  await expect(itemTotal).toContainText(expectedTotal);
});

Then('tax should be calculated and greater than {string}', async function (minTax: string) {
  const taxElement = page.locator('[data-test="tax-label"]');
  const taxText = await taxElement.innerText();
  const taxValue = parseFloat(taxText.replace(/[^\d.]/g, ''));
  const minValue = parseFloat(minTax.replace('$', ''));
  expect(taxValue).toBeGreaterThan(minValue);
});

Then('the total should equal item total plus tax', async function () {
  const subtotalText = await page.locator('[data-test="subtotal-label"]').innerText();
  const taxText = await page.locator('[data-test="tax-label"]').innerText();
  const totalText = await page.locator('[data-test="total-label"]').innerText();
  const subtotal = parseFloat(subtotalText.replace(/[^\d.]/g, ''));
  const tax = parseFloat(taxText.replace(/[^\d.]/g, ''));
  const total = parseFloat(totalText.replace(/[^\d.]/g, ''));
  expect(total).toBeCloseTo(subtotal + tax, 2);
});

Then('I should see {string}', async function (text: string) {
  const element = page.locator(`text="${text}"`);
  await expect(element).toBeVisible();
});

Then('the order dispatch message should be visible', async function () {
  const message = page.locator('text=/dispatch/i');
  await expect(message).toBeVisible();
});

Then('I should be on inventory page with empty cart', async function () {
  const inventory = page.locator('[data-test="inventory-container"]');
  await expect(inventory).toBeVisible();
  const badge = page.locator('[data-test="shopping-cart-badge"]');
  await expect(badge).not.toBeVisible();
});