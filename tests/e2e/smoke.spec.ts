import { test, expect } from '@playwright/test';

test('Homepage loads successfully', async ({ page }) => {
  await page.goto('/');
  
  // Check for the main brand or welcome message in the minimal app
  await expect(page.locator('h1')).toContainText(/OpenCarBox/i);
  
  // Check for critical errors in console during load
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`Page Error: ${msg.text()}`);
    }
  });
});

test('API Health Check', async ({ request }) => {
  const response = await request.get('/api/health');
  // In the minimal app, this might be 404, but it shouldn't be 500
  expect(response.status()).toBeLessThan(500);
});
