/**

 * TASK 5 — Step Definitions for Bug Hunt: Detect Defects

 * Website: https://www.saucedemo.com

 *

 * TODO:

 *   1. Write Gherkin scenarios in features/task5-bug-hunt.feature

 *   2. Implement matching step definitions below

 *

 * Approach:

 *   - Login as standard_user → establish expected behavior (baseline)

 *   - Login as problem_user → run the same flow

 *   - Assert the SPECIFIC defect with a clear failure message

 *   - Document bugs with clear descriptions (console.log or annotations)

 *

 * Requirements:

 *   - Compare standard_user (baseline) vs problem_user (buggy)

 *   - Detect broken product images and wrong cart items

 *   - Use data-test attributes for robust locators

 */

 
import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page, expect } from '@playwright/test';

setDefaultTimeout(30_000);

let browser: Browser;
let page: Page;
let baselineImages: Map<string, string> = new Map();
let addedProducts: string[] = [];
let cartItems: string[] = [];

Before(async function () {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  page = await context.newPage();
});

After(async function () {
  await browser.close();
});

// ────── LOGIN ──────
Given('I login as {string} with password {string} and collect baseline product images', async function (username: string, password: string) {
  await page.goto('https://www.saucedemo.com');
  const usernameField = page.getByPlaceholder("Username");
  const passwordField = page.getByPlaceholder("Password");
  await usernameField.isVisible();
  await passwordField.isVisible();
  await usernameField.fill(username)
  await passwordField.fill(password);
  await page.click('#login-button');
  await page.waitForURL("https://www.saucedemo.com/inventory.html");

  // Collect baseline images
  const productImages = page.locator('div[data-test="inventory-item"]');
  const count = await productImages.count();
  for (let i = 0; i < count; i++) {
    const name = await productImages.nth(i).locator('div[data-test="inventory-item-name"]').innerText();
    const src = await productImages.nth(i).locator(".inventory_item_img img").getAttribute("src");
    baselineImages.set(name, src || "");
  }
});

When('I logout from SauceDemo', async function () {
  await page.locator('button:has-text("Open Menu")').click();
  const logout = page.locator('a:has-text("Logout")')
  await logout.isVisible();
  await logout.click();
});

When('I login as {string} with password {string}', async function (username: string, password: string) {
  await page.goto('https://www.saucedemo.com');
  const usernameField = page.getByPlaceholder("Username");
  const passwordField = page.getByPlaceholder("Password");
  await usernameField.isVisible();
  await passwordField.isVisible();
  await usernameField.fill(username)
  await passwordField.fill(password);
  await page.click('#login-button');
});

When('I navigate to the inventory page', async function () {
  await page.goto('https://www.saucedemo.com/inventory.html');
});

Then('I should detect broken product images compared to baseline', async function () {
  const productImages = page.locator('div[data-test="inventory-item"]');
  const count = await productImages.count();
  let brokenCount = 0;

  for (let i = 0; i < count; i++) {
    const name = await productImages.nth(i).locator('div[data-test="inventory-item-name"]').innerText();
    
    if(!(name in baselineImages)) {
      brokenCount++;
    }
  }

  expect(brokenCount).toBeGreaterThan(0);
});

Then('at least one product should have a broken image', async function () {
  const productImages = page.locator('div[data-test="inventory-item"]');
  const count = await productImages.count();
  
  for (let i = 0; i < count; i++) {
    const src = await productImages.nth(i).locator(".inventory_item_img img").getAttribute("src");
    if (src && (src.includes('404') || src.includes('placeholder'))) {
      expect(true).toBe(true);
      return;
    }
  }
  
  // Also check if any image src is different from baseline
  for (let i = 0; i < count; i++) {
    const src = await productImages.nth(i).locator(".inventory_item_img img").getAttribute("src");
    const name = await productImages.nth(i).locator('div[data-test="inventory-item-name"]').innerText();
    if (src !== baselineImages.get(name)) {
      expect(true).toBe(true);
      return;
    }
  }
  
  throw new Error('No broken images detected');
});

// ────── CART MANAGEMENT BUG HUNT ──────
When('I add at least {int} products to cart and note their displayed names', async function (count: number) {
  const products = page.locator('div[data-test="inventory-item"]');
  const productCount = await products.count();
  addedProducts = [];

  for (let i = 0; i < Math.min(count, productCount); i++) {
    const product = products.nth(i);
    const productName = await product.locator('div[data-test="inventory-item-name"]').innerText();
    const reformedName = productName.toLowerCase().replaceAll(" ", "-");
    const addToCart = page.locator(`button[data-test="add-to-cart-${reformedName}"]`);
    addedProducts.push(productName);
    await addToCart.click();
  }
});

When('I go to the cart page', async function () {
  await page.click('[data-test="shopping-cart-link"]');
  await page.waitForLoadState('networkidle');
});

Then('I should detect mismatches between clicked product names and cart item names', async function () {
  const cartItemElements = page.locator('.cart_item_label');
  const cartCount = await cartItemElements.count();
  
  for (let i = 0; i < cartCount; i++) {
    const cartItemName = await cartItemElements.nth(i).locator('div[data-test="inventory-item-name"]').innerText();
    cartItems.push(cartItemName);
  }

  // Check for mismatches
  let hasMismatch = false;
  if(addedProducts.length !== cartItems.length) {
    hasMismatch = true;
  }
  else {
    for (let i = 0; i < Math.min(addedProducts.length, cartItems.length); i++) {
      if (addedProducts[i] !== cartItems[i]) {
        hasMismatch = true;
        break;
      }
    }
  }
  expect(hasMismatch).toBe(true);
});

Then('the cart should contain different items than what was clicked', async function () {
  expect(addedProducts.length).toBeGreaterThan(0);
  expect(cartItems.length).toBeGreaterThan(0);
  
  // At least one item should be different
  let isDifferent = false;
  for (const product of addedProducts) {
    if (!cartItems.includes(product)) {
      isDifferent = true;
      break;
    }
  }
  
  expect(isDifferent).toBe(true);
});