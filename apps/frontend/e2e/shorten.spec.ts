import { test, expect } from '@playwright/test';

test('shorten a URL and display the result', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.getByTestId('url-input').fill('https://example.com/some/long/path');
  await page.getByTestId('shorten-btn').click();

  const shortUrlLink = page.getByTestId('short-url');
  await expect(shortUrlLink).toBeVisible();
  const href = await shortUrlLink.getAttribute('href');
  expect(href).toMatch(/^http:\/\/localhost:3001\/[a-zA-Z0-9_-]{7}$/);
});

test('copy button copies short URL to clipboard', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('http://localhost:3000');

  await page.getByTestId('url-input').fill('https://example.com/copy-test');
  await page.getByTestId('shorten-btn').click();
  await page.getByTestId('copy-btn').click();

  const clip = await page.evaluate(() => navigator.clipboard.readText());
  expect(clip).toMatch(/^http:\/\/localhost:3001\//);
});
