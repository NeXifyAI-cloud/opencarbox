import { test, expect } from '@playwright/test';

test('Frontend Image Verification', async ({ page }) => {
  // 1. Visit Autohandel Page (Vehicle Cards)
  console.log('Visiting /fahrzeuge...');
  await page.goto('http://localhost:3000/fahrzeuge');

  // Wait for images to load
  await page.waitForLoadState('networkidle');

  // Wait for the grid container
  // Note: Tailwind classes might be dynamic, but 'grid' is standard.
  // We can also target the section "Vehicle Listing"
  const section = page.locator('section').filter({ hasText: 'Aktuelle Angebote' });
  await expect(section).toBeVisible();

  // Wait for images to be present in DOM
  const vehicleImages = section.locator('.card-premium img');
  await vehicleImages.first().waitFor({ state: 'attached' });
  const count = await vehicleImages.count();
  console.log(`Found ${count} vehicle images.`);

  // We expect at least one vehicle to be shown
  expect(count).toBeGreaterThan(0);

  if (count > 0) {
      await expect(vehicleImages.first()).toBeVisible();
      // Check for broken image (naturalWidth > 0)
      const isBroken = await vehicleImages.first().evaluate((img: HTMLImageElement) => img.naturalWidth === 0);
      expect(isBroken).toBeFalsy();
  }

  // 2. Visit Shop Page (Product Cards - assuming route exists or we can check a known page)
  // Note: /shop/produkte might be the list
  console.log('Visiting /shop...');
  await page.goto('http://localhost:3000/shop');
  await page.waitForLoadState('networkidle');

  // Check for carvantooo logo or hero images as proxy for general image health
  const shopImages = page.locator('img');
  await expect(shopImages.first()).toBeVisible();
});
