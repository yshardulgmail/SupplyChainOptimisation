/**

 * TASK 4 — Step Definitions for REST API Testing

 * API: https://dummyjson.com

 *

 * TODO:

 *   1. Write Gherkin scenarios in features/task4-api.feature

 *   2. Implement matching step definitions below

 *

 * Requirements:

 *   - Use Playwright's APIRequestContext for all HTTP calls

 *   - Do NOT use external HTTP libraries (axios, node-fetch, etc.)

 *   - Validate status codes, response body, data types, and errors

 */

 
import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page, expect } from '@playwright/test';

setDefaultTimeout(30_000);

let browser: Browser;
let page: Page;
let lastResponse: any;
let lastResponseStatus: number;

Before(async function () {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  page = await context.newPage();
});

After(async function () {
  await browser.close();
});

// ────── GET REQUESTS ──────
When('I send a GET request to {string}', async function (endpoint: string) {
  const apiContext = await page.context().newCDPSession(page);
  const response = await page.request.get(`https://dummyjson.com${endpoint}`);
  lastResponseStatus = response.status();
  lastResponse = await response.json();
});

Then('the response status should be {int}', async function (expectedStatus: number) {
  expect(lastResponseStatus).toBe(expectedStatus);
});

Then('the response {string} field should equal {int}', async function (field: string, value: number) {
  expect(lastResponse[field]).toBe(value);
});

Then('the {string} array should have exactly {int} users', async function (arrayName: string, count: number) {
  expect(lastResponse[arrayName]).toHaveLength(count);
});

Then('each user should have id, email, firstName, lastName, and image fields', async function () {
  for (const user of lastResponse.users) {
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');
    expect(user).toHaveProperty('image');
  }
});

Then('all email addresses should contain {string}', async function (emailDomain: string) {
  for (const user of lastResponse.users) {
    expect(user.email).toContain(emailDomain);
  }
});

Then('the user email should be {string}', async function (expectedEmail: string) {
  expect(lastResponse.email).toBe(expectedEmail);
});

Then('the response should contain a {string} field', async function (field: string) {
  expect(lastResponse).toHaveProperty(field);
});

// ────── POST REQUESTS ──────
When('I send a POST request to {string} with firstName {string}, lastName {string}, age {int}', async function (endpoint: string, firstName: string, lastName: string, age: number) {
  const response = await page.request.post(`https://dummyjson.com${endpoint}`, {
    data: { firstName, lastName, age }
  });
  lastResponseStatus = response.status();
  lastResponse = await response.json();
});

Then('the response firstName should be {string}', async function (expectedFirstName: string) {
  expect(lastResponse.firstName).toBe(expectedFirstName);
});

Then('the response lastName should be {string}', async function (expectedLastName: string) {
  expect(lastResponse.lastName).toBe(expectedLastName);
});

Then('the response should have a numeric {string} field', async function (field: string) {
  expect(lastResponse[field]).toEqual(expect.any(Number));
});

When('I send a POST request to {string} with username {string}, password {string}', async function (endpoint: string, username: string, password: string) {
  const response = await page.request.post(`https://dummyjson.com${endpoint}`, {
    data: { username, password }
  });
  lastResponseStatus = response.status();
  lastResponse = await response.json();
});

Then('the response should contain an {string} field', async function (field: string) {
  expect(lastResponse).toHaveProperty(field);
});

When('I send a POST request to {string} with username {string}', async function (endpoint: string, username: string) {
  const response = await page.request.post(`https://dummyjson.com${endpoint}`, {
    data: { username }
  });
  lastResponseStatus = response.status();
  lastResponse = await response.json();
});

// ────── PUT REQUESTS ──────
When('I send a PUT request to {string} with firstName {string}, lastName {string}', async function (endpoint: string, firstName: string, lastName: string) {
  const response = await page.request.put(`https://dummyjson.com${endpoint}`, {
    data: { firstName, lastName }
  });
  lastResponseStatus = response.status();
  lastResponse = await response.json();
});

// ────── PATCH REQUESTS ──────
When('I send a PATCH request to {string} with lastName {string}', async function (endpoint: string, lastName: string) {
  const response = await page.request.patch(`https://dummyjson.com${endpoint}`, {
    data: { lastName }
  });
  lastResponseStatus = response.status();
  lastResponse = await response.json();
});

// ────── DELETE REQUESTS ──────
When('I send a DELETE request to {string}', async function (endpoint: string) {
  const response = await page.request.delete(`https://dummyjson.com${endpoint}`);
  lastResponseStatus = response.status();
  lastResponse = await response.json();
});

Then('the response {string} should be true', async function (field: string) {
  expect(lastResponse[field]).toBe(true);
});