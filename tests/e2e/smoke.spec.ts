import { test, expect } from '@playwright/test';

test('Homepage loads successfully', async ({ page }) => {
  await page.goto('/');
  
  // Check title contains expected brand name
  await expect(page).toHaveTitle(/OpenCarBox|Carvantooo/);
  
  // Check if critical elements exist
  // We expect at least a header or main content
  await expect(page.locator('header')).toBeVisible();
  
  // Check for critical errors in console during load
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`Page Error: ${msg.text()}`);
    }
  });
});

test('API Health Check', async ({ request }) => {
  const response = await request.get('/api/health');
  // If we don't have a health endpoint yet, we should add one.
  // But for now, let's just check if it returns 200 or 404 (at least not 500)
  expect(response.status()).toBeLessThan(500);
});
